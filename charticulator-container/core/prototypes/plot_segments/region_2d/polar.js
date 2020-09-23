"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
const Graphics = require("../../../graphics");
const solver_1 = require("../../../solver");
const Specification = require("../../../specification");
const axis_1 = require("../axis");
const base_1 = require("./base");
const plot_segment_1 = require("../plot_segment");
exports.polarTerminology = {
    xAxis: "Angular Axis",
    yAxis: "Radial Axis",
    xMin: "Left",
    xMinIcon: "align/left",
    xMiddle: "Middle",
    xMiddleIcon: "align/x-middle",
    xMax: "Right",
    xMaxIcon: "align/right",
    yMiddle: "Middle",
    yMiddleIcon: "align/y-middle",
    yMin: "Bottom",
    yMinIcon: "align/bottom",
    yMax: "Top",
    yMaxIcon: "align/top",
    dodgeX: "Stack Angular",
    dodgeXIcon: "sublayout/dodge-angular",
    dodgeY: "Stack Radial",
    dodgeYIcon: "sublayout/dodge-radial",
    grid: "Grid",
    gridIcon: "sublayout/polar-grid",
    gridDirectionX: "Angular",
    gridDirectionY: "Radial",
    packing: "Packing",
    packingIcon: "sublayout/packing",
    overlap: "Overlap",
    overlapIcon: "sublayout/overlap"
};
class PolarPlotSegment extends plot_segment_1.PlotSegmentClass {
    constructor() {
        super(...arguments);
        this.attributeNames = [
            "x1",
            "x2",
            "y1",
            "y2",
            "angle1",
            "angle2",
            "radial1",
            "radial2",
            "gapX",
            "gapY",
            "x",
            "y"
        ];
        this.attributes = {
            x1: {
                name: "x1",
                type: Specification.AttributeType.Number
            },
            x2: {
                name: "x2",
                type: Specification.AttributeType.Number
            },
            y1: {
                name: "y1",
                type: Specification.AttributeType.Number
            },
            y2: {
                name: "y2",
                type: Specification.AttributeType.Number
            },
            angle1: {
                name: "angle1",
                type: Specification.AttributeType.Number,
                defaultValue: -90
            },
            angle2: {
                name: "angle2",
                type: Specification.AttributeType.Number,
                defaultValue: 90
            },
            radial1: {
                name: "radial1",
                type: Specification.AttributeType.Number
            },
            radial2: {
                name: "radial2",
                type: Specification.AttributeType.Number
            },
            x: {
                name: "x",
                type: Specification.AttributeType.Number
            },
            y: {
                name: "y",
                type: Specification.AttributeType.Number
            },
            gapX: {
                name: "gapX",
                type: Specification.AttributeType.Number,
                editableInGlyphStage: true
            },
            gapY: {
                name: "gapY",
                type: Specification.AttributeType.Number,
                editableInGlyphStage: true
            }
        };
    }
    initializeState() {
        const attrs = this.state.attributes;
        attrs.angle1 = 0;
        attrs.angle2 = 360;
        attrs.radial1 = 10;
        attrs.radial2 = 100;
        attrs.x1 = -100;
        attrs.x2 = 100;
        attrs.y1 = -100;
        attrs.y2 = 100;
        attrs.x = attrs.x1;
        attrs.y = attrs.y2;
        attrs.gapX = 4;
        attrs.gapY = 4;
    }
    createBuilder(solver, context) {
        const props = this.object.properties;
        const config = {
            terminology: exports.polarTerminology,
            xAxisPrePostGap: (props.endAngle - props.startAngle) % 360 == 0,
            yAxisPrePostGap: false,
            getXYScale: () => {
                const radiusMiddle = (this.state.attributes.radial1 + this.state.attributes.radial2) / 2;
                return { x: 57.29577951308232 / radiusMiddle, y: 1 };
            }
        };
        const builder = new base_1.Region2DConstraintBuilder(this, config, "angle1", "angle2", "radial1", "radial2", solver, context);
        return builder;
    }
    buildConstraints(solver, context) {
        const attrs = this.state.attributes;
        const props = this.object.properties;
        const [x1, y1, x2, y2, innerRadius, outerRadius] = solver.attrs(attrs, [
            "x1",
            "y1",
            "x2",
            "y2",
            "radial1",
            "radial2"
        ]);
        attrs.angle1 = props.startAngle;
        attrs.angle2 = props.endAngle;
        solver.makeConstant(attrs, "angle1");
        solver.makeConstant(attrs, "angle2");
        if (attrs.x2 - attrs.x1 < attrs.y2 - attrs.y1) {
            attrs.radial1 = (props.innerRatio * (attrs.x2 - attrs.x1)) / 2;
            attrs.radial2 = (props.outerRatio * (attrs.x2 - attrs.x1)) / 2;
            solver.addLinear(solver_1.ConstraintStrength.HARD, 0, [[props.innerRatio, x2], [-props.innerRatio, x1]], [[2, innerRadius]]);
            solver.addLinear(solver_1.ConstraintStrength.HARD, 0, [[props.outerRatio, x2], [-props.outerRatio, x1]], [[2, outerRadius]]);
        }
        else {
            attrs.radial1 = (props.innerRatio * (attrs.y2 - attrs.y1)) / 2;
            attrs.radial2 = (props.outerRatio * (attrs.y2 - attrs.y1)) / 2;
            solver.addLinear(solver_1.ConstraintStrength.HARD, 0, [[props.innerRatio, y2], [-props.innerRatio, y1]], [[2, innerRadius]]);
            solver.addLinear(solver_1.ConstraintStrength.HARD, 0, [[props.outerRatio, y2], [-props.outerRatio, y1]], [[2, outerRadius]]);
        }
    }
    buildGlyphConstraints(solver, context) {
        const builder = this.createBuilder(solver, context);
        builder.build();
    }
    getBoundingBox() {
        const attrs = this.state.attributes;
        const { x1, x2, y1, y2 } = attrs;
        return {
            type: "rectangle",
            cx: (x1 + x2) / 2,
            cy: (y1 + y2) / 2,
            width: Math.abs(x2 - x1),
            height: Math.abs(y2 - y1),
            rotation: 0
        };
    }
    getSnappingGuides() {
        const attrs = this.state.attributes;
        const { x1, y1, x2, y2 } = attrs;
        return [
            { type: "x", value: x1, attribute: "x1" },
            { type: "x", value: x2, attribute: "x2" },
            { type: "y", value: y1, attribute: "y1" },
            { type: "y", value: y2, attribute: "y2" }
        ];
    }
    getGraphics() {
        const builder = this.createBuilder();
        const g = Graphics.makeGroup([]);
        const attrs = this.state.attributes;
        const props = this.object.properties;
        const cx = (attrs.x1 + attrs.x2) / 2;
        const cy = (attrs.y1 + attrs.y2) / 2;
        const [angularMode, radialMode] = this.getAxisModes();
        const radialData = props.yData;
        const angularData = props.xData;
        const angleStart = props.startAngle;
        const angleEnd = props.endAngle;
        const innerRadius = attrs.radial1;
        const outerRadius = attrs.radial2;
        if (radialData && radialData.visible) {
            g.elements.push(new axis_1.AxisRenderer()
                .setAxisDataBinding(radialData, innerRadius, outerRadius, false, true)
                .renderLine(cx, cy, 90 - (radialData.side == "opposite" ? angleEnd : angleStart), -1));
        }
        if (angularData && angularData.visible) {
            g.elements.push(new axis_1.AxisRenderer()
                .setAxisDataBinding(angularData, angleStart, angleEnd, builder.config.xAxisPrePostGap, false)
                .renderPolar(cx, cy, angularData.side == "opposite" ? innerRadius : outerRadius, angularData.side == "opposite" ? -1 : 1));
        }
        return g;
    }
    getCoordinateSystem() {
        const attrs = this.state.attributes;
        const { x1, y1, x2, y2 } = attrs;
        return new Graphics.PolarCoordinates({
            x: (x1 + x2) / 2,
            y: (y1 + y2) / 2
        }, attrs.radial1, attrs.radial2, this.object.properties.equalizeArea);
    }
    getDropZones() {
        const attrs = this.state.attributes;
        const { x1, y1, x2, y2, radial1, radial2 } = attrs;
        const cx = (x1 + x2) / 2;
        const cy = (y1 + y2) / 2;
        const zones = [];
        zones.push({
            type: "region",
            accept: { scaffolds: ["polar"] },
            dropAction: { extendPlotSegment: {} },
            p1: { x: x1, y: y1 },
            p2: { x: x2, y: y2 },
            title: "Add Angular Scaffold"
        });
        zones.push({
            type: "region",
            accept: { scaffolds: ["curve"] },
            dropAction: { extendPlotSegment: {} },
            p1: { x: x1, y: y1 },
            p2: { x: x2, y: y2 },
            title: "Convert to Curve Coordinates"
        });
        zones.push({
            type: "region",
            accept: { scaffolds: ["cartesian-x", "cartesian-y"] },
            dropAction: { extendPlotSegment: {} },
            p1: { x: x1, y: y1 },
            p2: { x: x2, y: y2 },
            title: "Convert to Cartesian Coordinates"
        });
        zones.push({
            type: "line",
            p1: { x: cx + radial1, y: cy },
            p2: { x: cx + radial2, y: cy },
            title: "Radial Axis",
            dropAction: {
                axisInference: { property: "yData" }
            }
        });
        zones.push({
            type: "arc",
            center: { x: cx, y: cy },
            radius: radial2,
            angleStart: attrs.angle1,
            angleEnd: attrs.angle2,
            title: "Angular Axis",
            dropAction: {
                axisInference: { property: "xData" }
            }
        });
        return zones;
    }
    getAxisModes() {
        const props = this.object.properties;
        return [
            props.xData ? props.xData.type : "null",
            props.yData ? props.yData.type : "null"
        ];
    }
    getHandles() {
        const attrs = this.state.attributes;
        const props = this.object.properties;
        const rows = this.parent.dataflow.getTable(this.object.table).rows;
        const { x1, x2, y1, y2 } = attrs;
        const radius = Math.min(Math.abs(x2 - x1), Math.abs(y2 - y1)) / 2;
        const cx = (x1 + x2) / 2, cy = (y1 + y2) / 2;
        const builder = this.createBuilder();
        return [
            {
                type: "line",
                axis: "y",
                value: y1,
                span: [x1, x2],
                actions: [{ type: "attribute", attribute: "y1" }]
            },
            {
                type: "line",
                axis: "y",
                value: y2,
                span: [x1, x2],
                actions: [{ type: "attribute", attribute: "y2" }]
            },
            {
                type: "line",
                axis: "x",
                value: x1,
                span: [y1, y2],
                actions: [{ type: "attribute", attribute: "x1" }]
            },
            {
                type: "line",
                axis: "x",
                value: x2,
                span: [y1, y2],
                actions: [{ type: "attribute", attribute: "x2" }]
            },
            {
                type: "point",
                x: x1,
                y: y1,
                actions: [
                    { type: "attribute", source: "x", attribute: "x1" },
                    { type: "attribute", source: "y", attribute: "y1" }
                ]
            },
            {
                type: "point",
                x: x2,
                y: y1,
                actions: [
                    { type: "attribute", source: "x", attribute: "x2" },
                    { type: "attribute", source: "y", attribute: "y1" }
                ]
            },
            {
                type: "point",
                x: x1,
                y: y2,
                actions: [
                    { type: "attribute", source: "x", attribute: "x1" },
                    { type: "attribute", source: "y", attribute: "y2" }
                ]
            },
            {
                type: "point",
                x: x2,
                y: y2,
                actions: [
                    { type: "attribute", source: "x", attribute: "x2" },
                    { type: "attribute", source: "y", attribute: "y2" }
                ]
            },
            ...builder.getHandles().map(handle => {
                return {
                    type: "gap-ratio",
                    axis: handle.gap.axis,
                    reference: handle.gap.reference,
                    value: handle.gap.value,
                    scale: handle.gap.scale,
                    span: handle.gap.span,
                    range: [0, 1],
                    coordinateSystem: this.getCoordinateSystem(),
                    actions: [
                        {
                            type: "property",
                            property: handle.gap.property.property,
                            field: handle.gap.property.field
                        }
                    ]
                };
            }),
            {
                type: "angle",
                actions: [{ type: "property", property: "endAngle" }],
                cx,
                cy,
                radius: radius * Math.max(props.innerRatio, props.outerRatio),
                value: props.endAngle,
                clipAngles: [props.startAngle, null],
                icon: "<"
            },
            {
                type: "angle",
                actions: [{ type: "property", property: "startAngle" }],
                cx,
                cy,
                radius: radius * Math.max(props.innerRatio, props.outerRatio),
                value: props.startAngle,
                clipAngles: [null, props.endAngle],
                icon: ">"
            },
            {
                type: "distance-ratio",
                actions: [{ type: "property", property: "outerRatio" }],
                cx,
                cy,
                value: props.outerRatio,
                startDistance: 0,
                endDistance: radius,
                startAngle: props.startAngle,
                endAngle: props.endAngle,
                clipRange: [props.innerRatio + 0.01, 1]
            },
            {
                type: "distance-ratio",
                actions: [{ type: "property", property: "innerRatio" }],
                cx,
                cy,
                value: props.innerRatio,
                startDistance: 0,
                endDistance: radius,
                startAngle: props.startAngle,
                endAngle: props.endAngle,
                clipRange: [0, props.outerRatio - 0.01]
            }
        ];
    }
    getPopupEditor(manager) {
        const builder = this.createBuilder();
        const widgets = builder.buildPopupWidgets(manager);
        if (widgets.length == 0) {
            return null;
        }
        const attrs = this.state.attributes;
        const props = this.object.properties;
        const anchor = { x: attrs.x1, y: attrs.y2 };
        return {
            anchor,
            widgets: [...widgets]
        };
    }
    getAttributePanelWidgets(manager) {
        const builder = this.createBuilder();
        return [
            ...super.getAttributePanelWidgets(manager),
            manager.sectionHeader("Polar Coordinates"),
            manager.row("Angle", manager.horizontal([1, 0, 1], manager.inputNumber({ property: "startAngle" }), manager.label("-"), manager.inputNumber({ property: "endAngle" }))),
            manager.row("Radius", manager.horizontal([0, 1, 0, 1], manager.label("Inner:"), manager.inputNumber({ property: "innerRatio" }), manager.label("Outer:"), manager.inputNumber({ property: "outerRatio" }))),
            manager.row("", manager.inputBoolean({ property: "equalizeArea" }, { type: "checkbox", label: "Height to Area" })),
            ...builder.buildPanelWidgets(manager)
        ];
    }
    getTemplateParameters() {
        const r = [];
        let p = [];
        if (this.object.properties.xData) {
            r.push(axis_1.buildAxisInference(this.object, "xData"));
            p = p.concat(axis_1.buildAxisProperties(this.object, "xData"));
        }
        if (this.object.properties.yData) {
            r.push(axis_1.buildAxisInference(this.object, "yData"));
            p = p.concat(axis_1.buildAxisProperties(this.object, "xData"));
        }
        if (this.object.properties.sublayout.order &&
            this.object.properties.sublayout.order.expression) {
            r.push({
                objectID: this.object._id,
                dataSource: {
                    table: this.object.table,
                    groupBy: this.object.groupBy
                },
                expression: {
                    expression: this.object.properties.sublayout.order.expression,
                    property: { property: "sublayout", field: ["order", "expression"] }
                }
            });
        }
        return { inferences: r, properties: p };
    }
}
PolarPlotSegment.classID = "plot-segment.polar";
PolarPlotSegment.type = "plot-segment";
PolarPlotSegment.metadata = {
    displayName: "PlotSegment",
    iconPath: "plot-segment/polar",
    creatingInteraction: {
        type: "rectangle",
        mapping: { xMin: "x1", yMin: "y1", xMax: "x2", yMax: "y2" }
    }
};
PolarPlotSegment.defaultProperties = {
    marginX1: 0,
    marginY1: 0,
    marginX2: 0,
    marginY2: 0,
    visible: true,
    sublayout: {
        type: "dodge-x",
        order: null,
        ratioX: 0.1,
        ratioY: 0.1,
        align: {
            x: "start",
            y: "start"
        },
        grid: {
            direction: "x",
            xCount: null,
            yCount: null
        }
    },
    startAngle: 0,
    endAngle: 360,
    innerRatio: 0.5,
    outerRatio: 0.9
};
exports.PolarPlotSegment = PolarPlotSegment;
//# sourceMappingURL=polar.js.map