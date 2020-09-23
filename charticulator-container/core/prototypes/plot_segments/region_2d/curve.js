"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Graphics = require("../../../graphics");
const solver_1 = require("../../../solver");
const Specification = require("../../../specification");
const axis_1 = require("../axis");
const base_1 = require("./base");
const plot_segment_1 = require("../plot_segment");
exports.curveTerminology = {
    xAxis: "Tangent Axis",
    yAxis: "Normal Axis",
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
    dodgeX: "Stack Tangential",
    dodgeXIcon: "sublayout/dodge-x",
    dodgeY: "Stack Normal",
    dodgeYIcon: "sublayout/dodge-y",
    grid: "Grid",
    gridIcon: "sublayout/grid",
    gridDirectionX: "Tangent",
    gridDirectionY: "Normal",
    packing: "Packing",
    packingIcon: "sublayout/packing",
    overlap: "Overlap",
    overlapIcon: "sublayout/overlap"
};
class CurvePlotSegment extends plot_segment_1.PlotSegmentClass {
    constructor() {
        super(...arguments);
        this.attributeNames = [
            "x1",
            "x2",
            "y1",
            "y2",
            "tangent1",
            "tangent2",
            "normal1",
            "normal2",
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
            tangent1: {
                name: "tangent1",
                type: Specification.AttributeType.Number
            },
            tangent2: {
                name: "tangent2",
                type: Specification.AttributeType.Number
            },
            normal1: {
                name: "normal1",
                type: Specification.AttributeType.Number
            },
            normal2: {
                name: "normal2",
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
        attrs.tangent1 = 0;
        attrs.tangent2 = 360;
        attrs.normal1 = 10;
        attrs.normal2 = 100;
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
            terminology: exports.curveTerminology,
            xAxisPrePostGap: false,
            yAxisPrePostGap: false
        };
        const builder = new base_1.Region2DConstraintBuilder(this, config, "tangent1", "tangent2", "normal1", "normal2", solver, context);
        return builder;
    }
    getCurveArcLength() {
        return new Graphics.MultiCurveParametrization(this.object.properties.curve.map(c => new Graphics.BezierCurveParameterization(c[0], c[1], c[2], c[3]))).getLength();
    }
    buildConstraints(solver, context) {
        const attrs = this.state.attributes;
        const props = this.object.properties;
        const [x1, y1, x2, y2, tangent1, tangent2, normal1, normal2] = solver.attrs(attrs, ["x1", "y1", "x2", "y2", "tangent1", "tangent2", "normal1", "normal2"]);
        const arcLength = this.getCurveArcLength();
        attrs.tangent1 = 0;
        solver.makeConstant(attrs, "tangent1");
        // tangent2 = arcLength * (x2 - x1) / 2
        solver.addLinear(solver_1.ConstraintStrength.HARD, 0, [[1, tangent2]], [[arcLength / 2, x2], [-arcLength / 2, x1]]);
        // normal1 = normalStart * (x2 - x1) / 2
        // normal2 = normalEnd * (x2 - x1) / 2
        solver.addLinear(solver_1.ConstraintStrength.HARD, 0, [[1, normal1]], [[props.normalStart / 2, x2], [-props.normalStart / 2, x1]]);
        solver.addLinear(solver_1.ConstraintStrength.HARD, 0, [[1, normal2]], [[props.normalEnd / 2, x2], [-props.normalEnd / 2, x1]]);
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
        const { tangent1, tangent2, normal1, normal2 } = this.state.attributes;
        const g = Graphics.makeGroup([]);
        const props = this.object.properties;
        const cs = this.getCoordinateSystem();
        if (props.xData && props.xData.visible) {
            g.elements.push(new axis_1.AxisRenderer()
                .setAxisDataBinding(props.xData, tangent1, tangent2, false, false)
                .renderCurve(cs, props.xData.side == "opposite" ? normal2 : normal1, props.xData.side == "opposite" ? -1 : 1));
        }
        if (props.yData && props.yData.visible) {
            let tr = cs.getLocalTransform(props.yData.side == "opposite" ? tangent2 : tangent1, 0);
            tr = Graphics.concatTransform(cs.getBaseTransform(), tr);
            g.elements.push(new axis_1.AxisRenderer()
                .setAxisDataBinding(props.yData, normal1, normal2, false, true)
                .renderLine(tr.x, tr.y, tr.angle + 90, props.yData.side == "opposite" ? 1 : -1));
        }
        return g;
    }
    getCoordinateSystem() {
        const attrs = this.state.attributes;
        const { x1, y1, x2, y2 } = attrs;
        const cx = (x1 + x2) / 2, cy = (y1 + y2) / 2;
        const scaler = (x2 - x1) / 2;
        return new Graphics.BezierCurveCoordinates({ x: cx, y: cy }, new Graphics.MultiCurveParametrization(this.object.properties.curve.map(ps => {
            const p = ps.map(p => ({ x: p.x * scaler, y: p.y * scaler }));
            return new Graphics.BezierCurveParameterization(p[0], p[1], p[2], p[3]);
        })));
    }
    getDropZones() {
        const attrs = this.state.attributes;
        const { x1, y1, x2, y2 } = attrs;
        const zones = [];
        zones.push({
            type: "region",
            accept: { scaffolds: ["polar"] },
            dropAction: { extendPlotSegment: {} },
            p1: { x: x1, y: y1 },
            p2: { x: x2, y: y2 },
            title: "Convert to Polar Coordinates"
        });
        zones.push({
            type: "region",
            accept: { scaffolds: ["cartesian-x", "cartesian-y"] },
            dropAction: { extendPlotSegment: {} },
            p1: { x: x1, y: y1 },
            p2: { x: x2, y: y2 },
            title: "Convert to Cartesian Coordinates"
        });
        // zones.push(
        //     <DropZones.Line>{
        //         type: "line",
        //         p1: { x: cx + radial1, y: cy }, p2: { x: cx + radial2, y: cy },
        //         title: "Radial Axis",
        //         dropAction: {
        //             axisInference: { property: "yData" }
        //         }
        //     }
        // );
        // zones.push(
        //     <DropZones.Arc>{
        //         type: "arc",
        //         center: { x: cx, y: cy },
        //         radius: radial2,
        //         angleStart: attrs.angle1, angleEnd: attrs.angle2,
        //         title: "Angular Axis",
        //         dropAction: {
        //             axisInference: { property: "xData" }
        //         }
        //     }
        // );
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
        const h = [
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
            {
                type: "input-curve",
                x1,
                y1,
                x2,
                y2,
                actions: [{ type: "property", property: "curve" }]
            }
        ];
        return h;
    }
    getPopupEditor(manager) {
        const builder = this.createBuilder();
        const widgets = builder.buildPopupWidgets(manager);
        if (widgets.length == 0) {
            return null;
        }
        const attrs = this.state.attributes;
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
            manager.sectionHeader("Curve Coordinates"),
            manager.row("Normal", manager.horizontal([1, 0, 1], manager.inputNumber({ property: "normalStart" }), manager.label("-"), manager.inputNumber({ property: "normalEnd" }))),
            // manager.row("Radius", manager.horizontal([0, 1, 0, 1],
            //     manager.label("Inner:"),
            //     manager.inputNumber({ property: "innerRatio" }),
            //     manager.label("Outer:"),
            //     manager.inputNumber({ property: "outerRatio" })
            // )),
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
            p = p.concat(axis_1.buildAxisProperties(this.object, "yData"));
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
CurvePlotSegment.classID = "plot-segment.curve";
CurvePlotSegment.type = "plot-segment";
CurvePlotSegment.metadata = {
    displayName: "PlotSegment",
    iconPath: "plot-segment/curve",
    creatingInteraction: {
        type: "rectangle",
        mapping: { xMin: "x1", yMin: "y1", xMax: "x2", yMax: "y2" }
    }
};
CurvePlotSegment.defaultProperties = {
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
    curve: [
        [
            { x: -1, y: 0 },
            { x: -0.25, y: -0.5 },
            { x: 0.25, y: 0.5 },
            { x: 1, y: 0 }
        ]
    ],
    normalStart: -0.2,
    normalEnd: 0.2
};
exports.CurvePlotSegment = CurvePlotSegment;
//# sourceMappingURL=curve.js.map