"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
const Hammer = require("hammerjs");
const React = require("react");
const core_1 = require("../../../core");
const actions_1 = require("../../actions");
const renderer_1 = require("../../renderer");
class EditingLink extends React.Component {
    constructor(props) {
        super(props);
        this.markPlaceholders = new WeakMap();
        this.state = {
            stage: "select-source",
            firstAnchor: null,
            secondAnchor: null,
            currentMouseLocation: { x: 0, y: 0 }
        };
    }
    getMarkAtPoint(x, y) {
        let element = document.elementFromPoint(x, y);
        let mark = null;
        while (element) {
            if (element instanceof SVGGElement) {
                if (this.markPlaceholders.has(element)) {
                    mark = this.markPlaceholders.get(element);
                    break;
                }
            }
            element = element.parentElement;
        }
        return mark;
    }
    componentDidMount() {
        this.hammer = new Hammer(this.refs.container);
        this.hammer.add(new Hammer.Pan());
        this.hammer.add(new Hammer.Tap());
        this.hammer.on("tap panend", e => {
            const pageX = e.center.x;
            const pageY = e.center.y;
            const markInfo = this.getMarkAtPoint(pageX, pageY);
            if (markInfo) {
                let anchor;
                anchor = markInfo.anchor.points.map(pt => {
                    return {
                        x: { element: markInfo.anchor.element, attribute: pt.xAttribute },
                        y: { element: markInfo.anchor.element, attribute: pt.yAttribute },
                        direction: pt.direction
                    };
                });
                if (markInfo.mode == "begin") {
                    new actions_1.Actions.SetObjectProperty(this.props.link, "anchor1", null, anchor).dispatch(this.props.store.dispatcher);
                }
                else {
                    new actions_1.Actions.SetObjectProperty(this.props.link, "anchor2", null, anchor).dispatch(this.props.store.dispatcher);
                }
            }
            else {
                new actions_1.Actions.ClearSelection().dispatch(this.props.store.dispatcher);
            }
        });
    }
    componentWillUnmount() {
        this.hammer.destroy();
    }
    renderAnchor(coordinateSystem, dx, dy, anchor) {
        const transformPoint = (point) => {
            const x = point.x + dx;
            const y = point.y + dy;
            let p = coordinateSystem.transformPoint(x, y);
            p = core_1.Graphics.transform(coordinateSystem.getBaseTransform(), p);
            return core_1.Geometry.applyZoom(this.props.zoom, { x: p.x, y: -p.y });
        };
        if (anchor.points.length == 2) {
            const path = core_1.Graphics.makePath();
            core_1.Prototypes.Links.LinksClass.BandPath(path, {
                points: anchor.points.map(p => {
                    return { x: p.x + dx, y: p.y + dy, direction: p.direction };
                }),
                coordinateSystem,
                curveness: this.props.link.properties.curveness
            }, false, true);
            const transform = `translate(${this.props.zoom.centerX},${this.props.zoom.centerY}) scale(${this.props.zoom.scale})`;
            const d = renderer_1.renderSVGPath(path.path.cmds);
            return (React.createElement("g", { transform: transform },
                React.createElement("path", { d: d, className: "element-ghost-stroke", vectorEffect: "non-scaling-stroke" }),
                React.createElement("path", { d: d, className: "element-stroke", vectorEffect: "non-scaling-stroke" })));
            // let p1 = transformPoint(anchor.points[0]);
            // let p2 = transformPoint(anchor.points[1]);
            // return (
            //     <g>
            //         <line className="element-ghost-stroke" x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} />
            //         <line className="element-stroke" x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} />
            //     </g>
            // );
        }
        else {
            const p = transformPoint(anchor.points[0]);
            return (React.createElement("g", null,
                React.createElement("circle", { className: "element-ghost-shape", cx: p.x, cy: p.y, r: 8 }),
                React.createElement("circle", { className: "element-shape", cx: p.x, cy: p.y, r: 3 })));
        }
    }
    renderMarkPlaceholders() {
        const manager = this.props.store.chartManager;
        // Get the two glyphs
        const props = this.props.link
            .properties;
        const lineMode = props.linkType;
        let glyphs = [];
        switch (this.props.link.classID) {
            case "links.through":
                {
                    const plotSegmentClass = manager.getClassById(props.linkThrough.plotSegment);
                    const coordinateSystem = plotSegmentClass.getCoordinateSystem();
                    const facets = core_1.Prototypes.Links.facetRows(manager.dataflow.getTable(plotSegmentClass.object.table), plotSegmentClass.state.dataRowIndices, props.linkThrough.facetExpressions.map(x => manager.dataflow.cache.parse(x)));
                    const glyph = core_1.getById(manager.chart.glyphs, plotSegmentClass.object.glyph);
                    const rowToMarkState = new Map();
                    for (let i = 0; i < plotSegmentClass.state.dataRowIndices.length; i++) {
                        rowToMarkState.set(plotSegmentClass.state.dataRowIndices[i].join(","), plotSegmentClass.state.glyphs[i]);
                    }
                    let firstNonEmptyFacet = 0;
                    for (; firstNonEmptyFacet < facets.length; firstNonEmptyFacet++) {
                        if (facets[firstNonEmptyFacet].length >= 2) {
                            break;
                        }
                    }
                    if (firstNonEmptyFacet < facets.length) {
                        glyphs = [
                            {
                                glyph,
                                glyphState: rowToMarkState.get(facets[firstNonEmptyFacet][0].join(",")),
                                coordinateSystem
                            },
                            {
                                glyph,
                                glyphState: rowToMarkState.get(facets[firstNonEmptyFacet][1].join(",")),
                                coordinateSystem
                            }
                        ];
                    }
                }
                break;
            case "links.between":
                {
                    const plotSegmentClasses = props.linkBetween.plotSegments.map(x => manager.getClassById(x));
                    const glyphObjects = plotSegmentClasses.map(x => core_1.getById(manager.chart.glyphs, x.object.glyph));
                    glyphs = [
                        {
                            glyph: glyphObjects[0],
                            glyphState: plotSegmentClasses[0].state.glyphs[0],
                            coordinateSystem: plotSegmentClasses[0].getCoordinateSystem()
                        },
                        {
                            glyph: glyphObjects[1],
                            glyphState: plotSegmentClasses[1].state.glyphs[0],
                            coordinateSystem: plotSegmentClasses[1].getCoordinateSystem()
                        }
                    ];
                }
                break;
            case "links.table":
                {
                    const plotSegmentClasses = props.linkTable.plotSegments.map(x => manager.getClassById(x));
                    const glyphObjects = plotSegmentClasses.map(x => core_1.getById(manager.chart.glyphs, x.object.glyph));
                    const linkTable = this.props.store.chartManager.dataflow.getTable(props.linkTable.table);
                    const tables = plotSegmentClasses.map(plotSegmentClass => {
                        const table = this.props.store.chartManager.dataflow.getTable(plotSegmentClass.object.table);
                        const id2RowGlyphIndex = new Map();
                        for (let i = 0; i < plotSegmentClass.state.dataRowIndices.length; i++) {
                            const rowIndex = plotSegmentClass.state.dataRowIndices[i];
                            const rowIDs = rowIndex.map(i => table.getRow(i).id).join(",");
                            id2RowGlyphIndex.set(rowIDs, [rowIndex, i]);
                        }
                        return {
                            table,
                            id2RowGlyphIndex
                        };
                    });
                    const rowItem = linkTable.getRow(0);
                    const [iRow0, i0] = tables[0].id2RowGlyphIndex.get(rowItem.source_id.toString());
                    const [iRow1, i1] = tables[1].id2RowGlyphIndex.get(rowItem.target_id.toString());
                    glyphs = [
                        {
                            glyph: glyphObjects[0],
                            glyphState: plotSegmentClasses[0].state.glyphs[i0],
                            coordinateSystem: plotSegmentClasses[0].getCoordinateSystem()
                        },
                        {
                            glyph: glyphObjects[1],
                            glyphState: plotSegmentClasses[1].state.glyphs[i1],
                            coordinateSystem: plotSegmentClasses[1].getCoordinateSystem()
                        }
                    ];
                }
                break;
        }
        // Render mark anchor candidates
        const elements = glyphs.map(({ glyph, glyphState, coordinateSystem }, glyphIndex) => {
            const anchorX = glyphState.marks[0].attributes.x;
            const anchorY = glyphState.marks[0].attributes.y;
            const offsetX = glyphState.attributes.x - anchorX;
            const offsetY = glyphState.attributes.y - anchorY;
            const marks = glyph.marks.map((element, elementIndex) => {
                if (glyph.marks.length > 1 && element.classID == "mark.anchor") {
                    return null;
                }
                const markClass = manager.getMarkClass(glyphState.marks[elementIndex]);
                const mode = glyphIndex == 0 ? "begin" : "end";
                let anchors = markClass.getLinkAnchors(mode);
                anchors = anchors.filter(anchor => {
                    if (lineMode == "line") {
                        return anchor.points.length == 1;
                    }
                    if (lineMode == "band") {
                        return anchor.points.length == 2;
                    }
                });
                return (React.createElement("g", { key: element._id }, anchors.map((anchor, index) => (React.createElement("g", { className: "anchor", key: `m${index}`, ref: g => {
                        if (g != null) {
                            this.markPlaceholders.set(g, {
                                mode,
                                markID: element._id,
                                anchor,
                                offsetX,
                                offsetY,
                                coordinateSystem
                            });
                        }
                    } }, this.renderAnchor(coordinateSystem, offsetX, offsetY, anchor))))));
            });
            return React.createElement("g", { key: glyphIndex }, marks);
        });
        const currentAnchors = glyphs.map(({ glyph, glyphState, coordinateSystem }, glyphIndex) => {
            const anchorX = glyphState.marks[0].attributes.x;
            const anchorY = glyphState.marks[0].attributes.y;
            const offsetX = glyphState.attributes.x - anchorX;
            const offsetY = glyphState.attributes.y - anchorY;
            const anchor = glyphIndex == 0 ? props.anchor1 : props.anchor2;
            const element = anchor[0].x.element;
            const elementState = glyphState.marks[core_1.getIndexById(glyph.marks, element)];
            const anchorDescription = {
                element,
                points: anchor.map(a => {
                    return {
                        x: elementState.attributes[a.x.attribute],
                        xAttribute: a.x.attribute,
                        y: elementState.attributes[a.y.attribute],
                        yAttribute: a.y.attribute,
                        direction: a.direction
                    };
                })
            };
            return {
                coordinateSystem,
                offsetX,
                offsetY,
                anchor: anchorDescription
            };
        });
        let currentLinkElement = null;
        if (currentAnchors.length == 2) {
            const path = core_1.Graphics.makePath();
            const anchor1 = {
                coordinateSystem: currentAnchors[0].coordinateSystem,
                points: currentAnchors[0].anchor.points.map(p => {
                    return {
                        x: p.x + currentAnchors[0].offsetX,
                        y: p.y + currentAnchors[0].offsetY,
                        direction: p.direction
                    };
                }),
                curveness: this.props.link.properties.curveness
            };
            const anchor2 = {
                coordinateSystem: currentAnchors[1].coordinateSystem,
                points: currentAnchors[1].anchor.points.map(p => {
                    return {
                        x: p.x + currentAnchors[1].offsetX,
                        y: p.y + currentAnchors[1].offsetY,
                        direction: p.direction
                    };
                }),
                curveness: this.props.link.properties.curveness
            };
            core_1.Prototypes.Links.LinksClass.LinkPath(path, props.linkType, props.interpolationType, anchor1, anchor2);
            const transform = `translate(${this.props.zoom.centerX},${this.props.zoom.centerY}) scale(${this.props.zoom.scale})`;
            currentLinkElement = (React.createElement("g", { transform: transform },
                React.createElement("path", { d: renderer_1.renderSVGPath(path.path.cmds), className: `link-hint-${props.linkType}` })));
        }
        return (React.createElement("g", null,
            currentLinkElement,
            elements,
            currentAnchors.map(({ coordinateSystem, offsetX, offsetY, anchor }, index) => (React.createElement("g", { className: "anchor active", key: index }, this.renderAnchor(coordinateSystem, offsetX, offsetY, anchor))))));
    }
    getPointFromEvent(point) {
        const r = this.refs.handler.getBoundingClientRect();
        const p = core_1.Geometry.unapplyZoom(this.props.zoom, {
            x: point.x - r.left,
            y: point.y - r.top
        });
        return { x: p.x, y: -p.y };
    }
    render() {
        return (React.createElement("g", { className: "creating-link", ref: "container" }, this.renderMarkPlaceholders()));
    }
}
exports.EditingLink = EditingLink;
//# sourceMappingURL=editing_link.js.map