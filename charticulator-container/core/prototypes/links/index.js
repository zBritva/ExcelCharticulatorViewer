"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
const common_1 = require("../../common");
const Graphics = require("../../graphics");
const Specification = require("../../specification");
const chart_element_1 = require("../chart_element");
const object_1 = require("../object");
exports.linkMarkTypes = ["solid", "dashed", "dotted"];
function facetRows(table, indices, columns) {
    if (columns == null) {
        return [indices];
    }
    else {
        const facets = new common_1.MultistringHashMap();
        for (const g of indices) {
            const row = table.getGroupedContext(g);
            const facetValues = columns.map(c => c.getStringValue(row));
            if (facets.has(facetValues)) {
                facets.get(facetValues).push(g);
            }
            else {
                facets.set(facetValues, [g]);
            }
        }
        return Array.from(facets.values());
    }
}
exports.facetRows = facetRows;
class LinksClass extends chart_element_1.ChartElementClass {
    constructor() {
        super(...arguments);
        this.attributeNames = ["color", "opacity"];
        this.attributes = {
            linkMarkType: {
                name: "linkMarkType",
                type: Specification.AttributeType.Enum,
                solverExclude: true,
                defaultValue: "4 8",
                stateExclude: true,
                defaultRange: exports.linkMarkTypes
            },
            color: {
                name: "color",
                type: Specification.AttributeType.Color,
                solverExclude: true,
                defaultValue: null,
                stateExclude: true
            },
            strokeWidth: {
                name: "strokeWidth",
                type: Specification.AttributeType.Number,
                solverExclude: true,
                defaultValue: null,
                stateExclude: true
            },
            opacity: {
                name: "opacity",
                type: Specification.AttributeType.Number,
                solverExclude: true,
                defaultValue: 1,
                defaultRange: [0, 1],
                stateExclude: true
            }
        };
    }
    resolveLinkAnchorPoints(anchorPoints, glyph) {
        return anchorPoints.map(anchorPoint => {
            const pt = {
                anchorIndex: common_1.indexOf(glyph.marks, x => x.classID == "mark.anchor"),
                x: {
                    element: common_1.indexOf(glyph.marks, e => e._id == anchorPoint.x.element),
                    attribute: anchorPoint.x.attribute
                },
                y: {
                    element: common_1.indexOf(glyph.marks, e => e._id == anchorPoint.y.element),
                    attribute: anchorPoint.y.attribute
                },
                direction: anchorPoint.direction
            };
            return pt;
        });
    }
    getAnchorPoints(renderState, anchorPoints, plotSegmentClass, glyphState, row) {
        let dx = glyphState.attributes.x;
        let dy = glyphState.attributes.y;
        const anchorIndex = anchorPoints[0].anchorIndex;
        dx -= glyphState.marks[anchorIndex].attributes.x;
        dy -= glyphState.marks[anchorIndex].attributes.y;
        const cs = plotSegmentClass.getCoordinateSystem();
        return {
            points: anchorPoints.map(pt => {
                const x = (pt.x.element < 0
                    ? glyphState.attributes[pt.x.attribute]
                    : glyphState.marks[pt.x.element].attributes[pt.x.attribute]);
                const y = (pt.y.element < 0
                    ? glyphState.attributes[pt.y.attribute]
                    : glyphState.marks[pt.y.element].attributes[pt.y.attribute]);
                const px = dx + x;
                const py = dy + y;
                return {
                    x: px,
                    y: py,
                    direction: pt.direction
                };
            }),
            curveness: this.object.properties.curveness != null
                ? this.object.properties.curveness
                : 30,
            coordinateSystem: cs,
            color: renderState.colorFunction(row),
            opacity: renderState.opacityFunction(row),
            strokeWidth: renderState.strokeWidthFunction(row)
        };
    }
    static BandPath(path, anchor, reversed = false, newPath = false) {
        let p0, p1;
        if (reversed) {
            p1 = anchor.points[0];
            p0 = anchor.points[1];
        }
        else {
            p0 = anchor.points[0];
            p1 = anchor.points[1];
        }
        if (newPath) {
            const p = Graphics.transform(anchor.coordinateSystem.getBaseTransform(), anchor.coordinateSystem.transformPoint(p0.x, p0.y));
            path.moveTo(p.x, p.y);
        }
        if (anchor.coordinateSystem instanceof Graphics.PolarCoordinates) {
            // let p = Graphics.transform(anchor.coordinateSystem.getBaseTransform(), anchor.coordinateSystem.transformPoint(p1.x, p1.y));
            path.polarLineTo(anchor.coordinateSystem.origin.x, anchor.coordinateSystem.origin.y, 90 - p0.x, p0.y, 90 - p1.x, p1.y);
        }
        else {
            const p = Graphics.transform(anchor.coordinateSystem.getBaseTransform(), anchor.coordinateSystem.transformPoint(p1.x, p1.y));
            path.lineTo(p.x, p.y);
        }
    }
    static ConnectionPath(path, interpType, p1, d1, curveness1, p2, d2, curveness2, newPath = false) {
        if (newPath) {
            path.moveTo(p1.x, p1.y);
        }
        switch (interpType) {
            case "line":
                {
                    path.lineTo(p2.x, p2.y);
                }
                break;
            case "bezier":
                {
                    const dScaler1 = curveness1;
                    const dScaler2 = curveness2;
                    path.cubicBezierCurveTo(p1.x + d1.x * dScaler1, p1.y + d1.y * dScaler1, p2.x + d2.x * dScaler2, p2.y + d2.y * dScaler2, p2.x, p2.y);
                }
                break;
            case "circle": {
                const cx = (p1.x + p2.x) / 2, cy = (p1.y + p2.y) / 2;
                const dx = p1.y - p2.y, dy = p2.x - p1.x; // it doesn't matter if we normalize d or not
                if (Math.abs(d1.x * dx + d1.y * dy) < 1e-6) {
                    // Degenerate case, just a line from p1 to p2
                    path.lineTo(p2.x, p2.y);
                }
                else {
                    // Origin = c + d t
                    // Solve for t: d1 dot (c + t d - p) = 0
                    const t = (d1.x * (cx - p1.x) + d1.y * (cy - p1.y)) / (d1.x * dx + d1.y * dy);
                    const o = { x: cx - dx * t, y: cy - dy * t }; // the center of the circle
                    const r = common_1.Geometry.pointDistance(o, p1);
                    const scaler = 180 / Math.PI;
                    const angle1 = Math.atan2(p1.y - o.y, p1.x - o.x) * scaler;
                    let angle2 = Math.atan2(p2.y - o.y, p2.x - o.x) * scaler;
                    const sign = (p1.y - o.y) * d1.x - (p1.x - o.x) * d1.y;
                    if (sign > 0) {
                        while (angle2 > angle1) {
                            angle2 -= 360;
                        }
                    }
                    if (sign < 0) {
                        while (angle2 < angle1) {
                            angle2 += 360;
                        }
                    }
                    path.polarLineTo(o.x, o.y, angle1, r, angle2, r, false);
                }
            }
        }
    }
    static LinkPath(path, linkType, interpType, anchor1, anchor2) {
        switch (linkType) {
            case "line":
                {
                    const a1p0 = anchor1.coordinateSystem.transformPointWithBase(anchor1.points[0].x, anchor1.points[0].y);
                    const a2p0 = anchor2.coordinateSystem.transformPointWithBase(anchor2.points[0].x, anchor2.points[0].y);
                    const a1d0 = anchor1.coordinateSystem.transformDirectionAtPointWithBase(anchor1.points[0].x, anchor1.points[0].y, anchor1.points[0].direction.x, anchor1.points[0].direction.y);
                    const a2d0 = anchor2.coordinateSystem.transformDirectionAtPointWithBase(anchor2.points[0].x, anchor2.points[0].y, anchor2.points[0].direction.x, anchor2.points[0].direction.y);
                    LinksClass.ConnectionPath(path, interpType, a1p0, a1d0, anchor1.curveness, a2p0, a2d0, anchor2.curveness, true);
                }
                break;
            case "band":
                {
                    // Determine if we should reverse the band
                    const a1p0 = anchor1.coordinateSystem.transformPointWithBase(anchor1.points[0].x, anchor1.points[0].y);
                    const a1p1 = anchor1.coordinateSystem.transformPointWithBase(anchor1.points[1].x, anchor1.points[1].y);
                    const a2p0 = anchor2.coordinateSystem.transformPointWithBase(anchor2.points[0].x, anchor2.points[0].y);
                    const a2p1 = anchor2.coordinateSystem.transformPointWithBase(anchor2.points[1].x, anchor2.points[1].y);
                    const a1d0 = anchor1.coordinateSystem.transformDirectionAtPointWithBase(anchor1.points[0].x, anchor1.points[0].y, anchor1.points[0].direction.x, anchor1.points[0].direction.y);
                    const a1d1 = anchor1.coordinateSystem.transformDirectionAtPointWithBase(anchor1.points[1].x, anchor1.points[1].y, anchor1.points[1].direction.x, anchor1.points[1].direction.y);
                    const a2d0 = anchor2.coordinateSystem.transformDirectionAtPointWithBase(anchor2.points[0].x, anchor2.points[0].y, anchor2.points[0].direction.x, anchor2.points[0].direction.y);
                    const a2d1 = anchor2.coordinateSystem.transformDirectionAtPointWithBase(anchor2.points[1].x, anchor2.points[1].y, anchor2.points[1].direction.x, anchor2.points[1].direction.y);
                    const cross1 = common_1.Geometry.vectorCross(a1d0, {
                        x: a1p1.x - a1p0.x,
                        y: a1p1.y - a1p0.y
                    });
                    const cross2 = common_1.Geometry.vectorCross(a2d0, {
                        x: a2p1.x - a2p0.x,
                        y: a2p1.y - a2p0.y
                    });
                    const reverseBand = cross1 * cross2 > 0;
                    if (reverseBand) {
                        // anchor1[0] -> anchor1[1]
                        LinksClass.BandPath(path, anchor1, false, true);
                        // anchor1[1] -> anchor2[0]
                        LinksClass.ConnectionPath(path, interpType, a1p1, a1d1, anchor1.curveness, a2p0, a2d0, anchor2.curveness, false);
                        // anchor2[0] -> anchor2[1]
                        LinksClass.BandPath(path, anchor2, false, false);
                        // anchor2[1] -> anchor1[0]
                        LinksClass.ConnectionPath(path, interpType, a2p1, a2d1, anchor2.curveness, a1p0, a1d0, anchor1.curveness, false);
                        path.closePath();
                    }
                    else {
                        // anchor1[0] -> anchor1[1]
                        LinksClass.BandPath(path, anchor1, false, true);
                        // anchor1[1] -> anchor2[1]
                        LinksClass.ConnectionPath(path, interpType, a1p1, a1d1, anchor1.curveness, a2p1, a2d1, anchor2.curveness, false);
                        // anchor2[1] -> anchor2[0]
                        LinksClass.BandPath(path, anchor2, true, false);
                        // anchor2[0] -> anchor1[0]
                        LinksClass.ConnectionPath(path, interpType, a2p0, a2d0, anchor2.curveness, a1p0, a1d0, anchor1.curveness, false);
                        path.closePath();
                    }
                }
                break;
        }
    }
    renderLinks(linkGraphics, lineType, anchorGroups, strokeDashArray) {
        switch (linkGraphics) {
            case "line": {
                return Graphics.makeGroup(anchorGroups.map(anchors => {
                    const lines = [];
                    for (let i = 0; i < anchors.length - 1; i++) {
                        const path = Graphics.makePath({
                            strokeColor: anchors[i][0].color,
                            strokeOpacity: anchors[i][0].opacity,
                            strokeWidth: anchors[i][0].strokeWidth,
                            strokeDasharray: strokeDashArray
                        });
                        LinksClass.LinkPath(path, linkGraphics, lineType, anchors[i][0], anchors[i + 1][1]);
                        lines.push(path.path);
                    }
                    return Graphics.makeGroup(lines);
                }));
            }
            case "band": {
                const splitAnchors = true;
                if (splitAnchors) {
                    const map = new Map();
                    const hashAnchor = (points) => {
                        const dx = points[0].x - points[1].x;
                        const dy = points[0].y - points[1].y;
                        const dirX = points[0].direction.x;
                        const dirY = points[0].direction.y;
                        return [
                            points[0].x,
                            points[0].y,
                            points[1].x,
                            points[1].y,
                            Math.sign(dx * dirY - dy * dirX)
                        ].join(",");
                    };
                    for (const anchors of anchorGroups) {
                        for (let i = 0; i < anchors.length - 1; i++) {
                            const a1 = anchors[i][0];
                            const a2 = anchors[i + 1][1];
                            const hash1 = hashAnchor(a1.points);
                            const hash2 = hashAnchor(a2.points);
                            if (map.has(hash1)) {
                                map.get(hash1).push([a1, a2]);
                            }
                            else {
                                map.set(hash1, [[a1, a2]]);
                            }
                            if (map.has(hash2)) {
                                map.get(hash2).push([a2, a1]);
                            }
                            else {
                                map.set(hash2, [[a2, a1]]);
                            }
                        }
                    }
                    map.forEach((anchors, points) => {
                        const x1 = anchors[0][0].points[0].x;
                        const y1 = anchors[0][0].points[0].y;
                        const x2 = anchors[0][0].points[1].x;
                        const y2 = anchors[0][0].points[1].y;
                        const p1 = anchors[0][0].coordinateSystem.transformPoint(x1, y1);
                        const p2 = anchors[0][0].coordinateSystem.transformPoint(x2, y2);
                        const pd = Math.sqrt((p2.x - p1.x) * (p2.x - p1.x) + (p2.y - p1.y) * (p2.y - p1.y));
                        const cx = (p1.x + p2.x) / 2;
                        const cy = (p1.y + p2.y) / 2;
                        const order = anchors.map(anchor => {
                            const p = anchor[1].coordinateSystem.transformPoint(anchor[1].points[0].x, anchor[1].points[0].y);
                            const proj = (p.x - cx) * (p2.x - p1.x) + (p.y - cy) * (p2.y - p1.y);
                            const distance = Math.sqrt((p.x - cx) * (p.x - cx) + (p.y - cy) * (p.y - cy));
                            const cosTheta = proj / distance / pd;
                            if (cosTheta > 0.999999) {
                                return 1 + distance;
                            }
                            else if (cosTheta < -0.999999) {
                                return -1 - distance;
                            }
                            return cosTheta;
                            // return proj;
                        });
                        const indices = [];
                        let totalWidth = 0;
                        for (let i = 0; i < anchors.length; i++) {
                            indices.push(i);
                            totalWidth += anchors[i][0].strokeWidth;
                        }
                        indices.sort((a, b) => order[a] - order[b]);
                        let cWidth = 0;
                        for (let i = 0; i < anchors.length; i++) {
                            const m = indices[i];
                            const k1 = cWidth / totalWidth;
                            cWidth += anchors[m][0].strokeWidth;
                            const k2 = cWidth / totalWidth;
                            anchors[m][0].points[0].x = x1 + (x2 - x1) * k1;
                            anchors[m][0].points[0].y = y1 + (y2 - y1) * k1;
                            anchors[m][0].points[1].x = x1 + (x2 - x1) * k2;
                            anchors[m][0].points[1].y = y1 + (y2 - y1) * k2;
                        }
                    });
                }
                return Graphics.makeGroup(anchorGroups.map(anchors => {
                    const bands = [];
                    for (let i = 0; i < anchors.length - 1; i++) {
                        const path = Graphics.makePath({
                            fillColor: anchors[i][0].color,
                            fillOpacity: anchors[i][0].opacity
                        });
                        LinksClass.LinkPath(path, linkGraphics, lineType, anchors[i][0], anchors[i + 1][1]);
                        bands.push(path.path);
                    }
                    return Graphics.makeGroup(bands);
                }));
            }
        }
    }
    /** Get the graphics that represent this layout */
    getGraphics(manager) {
        return null;
    }
    getAttributePanelWidgets(manager) {
        const props = this.object.properties;
        const widgets = [
            manager.sectionHeader("Line Type"),
            manager.row("Type", manager.inputSelect({ property: "interpolationType" }, {
                type: "dropdown",
                showLabel: true,
                options: ["line", "bezier", "circle"],
                labels: ["Line", "Bezier", "Arc"]
            })),
            manager.row("Line mark type", manager.inputSelect({ property: "linkMarkType" }, {
                type: "dropdown",
                showLabel: true,
                options: ["", "8", "1 10"],
                labels: ["Solid", "Dashed", "Dotted"]
            }))
        ];
        if (props.interpolationType == "bezier") {
            widgets.push(manager.row("Curveness", manager.inputNumber({ property: "curveness" }, {
                showSlider: true,
                minimum: 0,
                sliderRange: [0, 500]
            })));
        }
        widgets.push(manager.sectionHeader("Style"));
        widgets.push(manager.mappingEditor("Color", "color", {
            table: props.linkTable && props.linkTable.table
        }));
        // if (props.linkType == "line") {
        widgets.push(manager.mappingEditor("Width", "strokeWidth", {
            hints: { rangeNumber: [0, 5] },
            defaultValue: 1,
            numberOptions: { showSlider: true, sliderRange: [0, 5], minimum: 0 },
            table: props.linkTable && props.linkTable.table
        }));
        // }
        widgets.push(manager.mappingEditor("Opacity", "opacity", {
            hints: { rangeNumber: [0, 1] },
            defaultValue: 1,
            numberOptions: { showSlider: true, minimum: 0, maximum: 1 },
            table: props.linkTable && props.linkTable.table
        }));
        return widgets;
    }
    getTemplateParameters() {
        return {
            properties: [
                {
                    objectID: this.object._id,
                    target: {
                        attribute: "color"
                    },
                    type: Specification.AttributeType.Color,
                    default: this.object.mappings.color &&
                        common_1.rgbToHex(this.object.mappings.color
                            .value) // TODO fix it
                },
                {
                    objectID: this.object._id,
                    target: {
                        attribute: "strokeWidth"
                    },
                    type: Specification.AttributeType.Number,
                    default: this.object.mappings.strokeWidth &&
                        this.object.mappings.strokeWidth
                            .value // TODO fix it
                },
                {
                    objectID: this.object._id,
                    target: {
                        attribute: "opacity"
                    },
                    type: Specification.AttributeType.Number,
                    default: this.object.mappings.opacity &&
                        this.object.mappings.opacity
                            .value // TODO fix it
                }
            ]
        };
    }
}
LinksClass.metadata = {
    iconPath: "link/tool"
};
exports.LinksClass = LinksClass;
class SeriesLinksClass extends LinksClass {
    /** Get the graphics that represent this layout */
    getGraphics(manager) {
        const props = this.object.properties;
        const linkGroup = Graphics.makeGroup([]);
        const renderState = {
            colorFunction: this.parent.resolveMapping(this.object.mappings.color, {
                r: 0,
                g: 0,
                b: 0
            }),
            opacityFunction: this.parent.resolveMapping(this.object.mappings.opacity, 1),
            strokeWidthFunction: this.parent.resolveMapping(this.object.mappings.strokeWidth, 1)
        };
        const links = this.object;
        const chart = this.parent.object;
        const chartState = this.parent.state;
        // Resolve the anchors
        const layoutIndex = common_1.indexOf(chart.elements, l => l._id == props.linkThrough.plotSegment);
        const layout = chart.elements[layoutIndex];
        const mark = common_1.getById(chart.glyphs, layout.glyph);
        const layoutState = chartState.elements[layoutIndex];
        const layoutClass = manager.getPlotSegmentClass(layoutState);
        const table = this.parent.dataflow.getTable(layout.table);
        const facets = facetRows(table, layoutState.dataRowIndices, props.linkThrough.facetExpressions.map(x => this.parent.dataflow.cache.parse(x)));
        const rowToMarkState = new Map();
        for (let i = 0; i < layoutState.dataRowIndices.length; i++) {
            rowToMarkState.set(layoutState.dataRowIndices[i].join(","), layoutState.glyphs[i]);
        }
        const anchor1 = this.resolveLinkAnchorPoints(props.anchor1, mark);
        const anchor2 = this.resolveLinkAnchorPoints(props.anchor2, mark);
        const anchors = facets.map(facet => facet.map(index => {
            const markState = rowToMarkState.get(index.join(","));
            const row = table.getGroupedContext(index);
            if (markState) {
                return [
                    this.getAnchorPoints(renderState, anchor1, layoutClass, markState, row),
                    this.getAnchorPoints(renderState, anchor2, layoutClass, markState, row)
                ];
            }
            else {
                return null;
            }
        }));
        linkGroup.elements.push(this.renderLinks(props.linkType, props.interpolationType, anchors, props.linkMarkType));
        return linkGroup;
    }
}
SeriesLinksClass.classID = "links.through";
SeriesLinksClass.type = "links";
SeriesLinksClass.defaultProperties = {
    visible: true
};
exports.SeriesLinksClass = SeriesLinksClass;
class LayoutsLinksClass extends LinksClass {
    /** Get the graphics that represent this layout */
    getGraphics(manager) {
        const props = this.object.properties;
        const linkGroup = Graphics.makeGroup([]);
        const renderState = {
            colorFunction: this.parent.resolveMapping(this.object.mappings.color, {
                r: 0,
                g: 0,
                b: 0
            }),
            opacityFunction: this.parent.resolveMapping(this.object.mappings.opacity, 1),
            strokeWidthFunction: this.parent.resolveMapping(this.object.mappings.strokeWidth, 1)
        };
        const links = this.object;
        const chart = this.parent.object;
        const chartState = this.parent.state;
        const dataset = this.parent.dataflow;
        const layoutIndices = props.linkBetween.plotSegments.map(lid => common_1.indexOf(chart.elements, l => l._id == lid));
        const layouts = layoutIndices.map(i => chart.elements[i]);
        const layoutStates = layoutIndices.map(i => chartState.elements[i]);
        const layoutClasses = layoutStates.map(layoutState => manager.getPlotSegmentClass(layoutState));
        const glyphs = layouts.map(layout => common_1.getById(chart.glyphs, layout.glyph));
        const anchor1 = this.resolveLinkAnchorPoints(props.anchor1, glyphs[0]);
        const anchor2 = this.resolveLinkAnchorPoints(props.anchor2, glyphs[1]);
        for (let shift = 0; shift < layoutStates.length - 1; shift++) {
            const rowIndicesMap = new Map();
            for (let i = 0; i < layoutStates[shift].dataRowIndices.length; i++) {
                rowIndicesMap.set(layoutStates[shift].dataRowIndices[i].join(","), i);
            }
            const table = this.parent.dataflow.getTable(layouts[0].table);
            const anchors = [];
            for (let i1 = 0; i1 < layoutStates[shift + 1].dataRowIndices.length; i1++) {
                const rowIndex = layoutStates[shift + 1].dataRowIndices[i1];
                const rowIndexJoined = rowIndex.join(",");
                if (rowIndicesMap.has(rowIndexJoined)) {
                    const i0 = rowIndicesMap.get(rowIndexJoined);
                    const row = table.getGroupedContext(rowIndex);
                    anchors.push([
                        [
                            this.getAnchorPoints(renderState, anchor1, layoutClasses[shift], layoutStates[shift].glyphs[i0], row),
                            null
                        ],
                        [
                            null,
                            this.getAnchorPoints(renderState, anchor2, layoutClasses[shift + 1], layoutStates[shift + 1].glyphs[i1], row)
                        ]
                    ]);
                }
            }
            linkGroup.elements.push(this.renderLinks(props.linkType, props.interpolationType, anchors, props.linkMarkType));
        }
        return linkGroup;
    }
}
LayoutsLinksClass.classID = "links.between";
LayoutsLinksClass.type = "links";
LayoutsLinksClass.defaultProperties = {
    visible: true
};
exports.LayoutsLinksClass = LayoutsLinksClass;
class TableLinksClass extends LinksClass {
    /** Get the graphics that represent this layout */
    getGraphics(manager) {
        const props = this.object.properties;
        const linkGroup = Graphics.makeGroup([]);
        const renderState = {
            colorFunction: this.parent.resolveMapping(this.object.mappings.color, {
                r: 0,
                g: 0,
                b: 0
            }),
            opacityFunction: this.parent.resolveMapping(this.object.mappings.opacity, 1),
            strokeWidthFunction: this.parent.resolveMapping(this.object.mappings.strokeWidth, 1)
        };
        const links = this.object;
        const chart = this.parent.object;
        const chartState = this.parent.state;
        const dataset = this.parent.dataflow;
        const layoutIndices = props.linkTable.plotSegments.map(lid => common_1.indexOf(chart.elements, l => l._id == lid));
        const layouts = layoutIndices.map(i => chart.elements[i]);
        const layoutStates = layoutIndices.map(i => chartState.elements[i]);
        const layoutClasses = layoutStates.map(layoutState => manager.getPlotSegmentClass(layoutState));
        const glyphs = layouts.map(layout => common_1.getById(chart.glyphs, layout.glyph));
        const anchor1 = this.resolveLinkAnchorPoints(props.anchor1, glyphs[0]);
        const anchor2 = this.resolveLinkAnchorPoints(props.anchor2, glyphs[1]);
        const linkTable = this.parent.dataflow.getTable(props.linkTable.table);
        const tables = layouts.map((layout, layoutIndex) => {
            const table = this.parent.dataflow.getTable(layout.table);
            const id2RowGlyphIndex = new Map();
            for (let i = 0; i < layoutStates[layoutIndex].dataRowIndices.length; i++) {
                const rowIndex = layoutStates[layoutIndex].dataRowIndices[i];
                const rowIDs = rowIndex.map(i => table.getRow(i).id).join(",");
                id2RowGlyphIndex.set(rowIDs, [rowIndex, i]);
            }
            return {
                table,
                id2RowGlyphIndex
            };
        });
        // Prepare data rows
        const rowIndices = [];
        for (let i = 0; i < linkTable.rows.length; i++) {
            rowIndices.push(i);
        }
        const anchors = [];
        for (let i = 0; i < rowIndices.length; i++) {
            const rowIndex = rowIndices[i];
            const row = linkTable.getGroupedContext([rowIndex]);
            const rowItem = linkTable.getRow(rowIndex);
            const r1 = tables[0].id2RowGlyphIndex.get(rowItem.source_id.toString());
            const r2 = tables[1].id2RowGlyphIndex.get(rowItem.target_id.toString());
            if (!r1 || !r2) {
                continue;
            }
            const [iRow0, i0] = r1;
            const [iRow1, i1] = r2;
            anchors.push([
                [
                    this.getAnchorPoints(renderState, anchor1, layoutClasses[0], layoutStates[0].glyphs[i0], row),
                    null
                ],
                [
                    null,
                    this.getAnchorPoints(renderState, anchor2, layoutClasses[1], layoutStates[1].glyphs[i1], row)
                ]
            ]);
        }
        linkGroup.elements.push(this.renderLinks(props.linkType, props.interpolationType, anchors, props.linkMarkType));
        return linkGroup;
    }
}
TableLinksClass.classID = "links.table";
TableLinksClass.type = "links";
TableLinksClass.defaultProperties = {
    visible: true
};
exports.TableLinksClass = TableLinksClass;
function registerClasses() {
    object_1.ObjectClasses.Register(SeriesLinksClass);
    object_1.ObjectClasses.Register(LayoutsLinksClass);
    object_1.ObjectClasses.Register(TableLinksClass);
}
exports.registerClasses = registerClasses;
//# sourceMappingURL=index.js.map