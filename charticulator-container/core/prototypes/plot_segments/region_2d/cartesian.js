"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Graphics = require("../../../graphics");
const Specification = require("../../../specification");
const axis_1 = require("../axis");
const base_1 = require("./base");
const plot_segment_1 = require("../plot_segment");
exports.cartesianTerminology = {
    terminology: {
        xAxis: "X Axis",
        yAxis: "Y Axis",
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
        dodgeX: "Stack X",
        dodgeXIcon: "sublayout/dodge-x",
        dodgeY: "Stack Y",
        dodgeYIcon: "sublayout/dodge-y",
        grid: "Grid",
        gridIcon: "sublayout/grid",
        gridDirectionX: "X",
        gridDirectionY: "Y",
        packing: "Packing",
        packingIcon: "sublayout/packing",
        overlap: "Overlap",
        overlapIcon: "sublayout/overlap"
    },
    xAxisPrePostGap: false,
    yAxisPrePostGap: false
};
class CartesianPlotSegment extends plot_segment_1.PlotSegmentClass {
    constructor() {
        super(...arguments);
        this.attributeNames = [
            "x1",
            "x2",
            "y1",
            "y2",
            "x",
            "y",
            "gapX",
            "gapY"
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
        attrs.x1 = -100;
        attrs.x2 = 100;
        attrs.y1 = -100;
        attrs.y2 = 100;
        attrs.gapX = 4;
        attrs.gapY = 4;
        attrs.x = attrs.x1;
        attrs.y = attrs.y2;
    }
    createBuilder(solver, context) {
        const builder = new base_1.Region2DConstraintBuilder(this, exports.cartesianTerminology, "x1", "x2", "y1", "y2", solver, context);
        return builder;
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
    getAttributePanelWidgets(manager) {
        const builder = this.createBuilder();
        return [
            ...super.getAttributePanelWidgets(manager),
            ...builder.buildPanelWidgets(manager)
        ];
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
    getGraphics(manager) {
        const g = Graphics.makeGroup([]);
        const attrs = this.state.attributes;
        const props = this.object.properties;
        const getTickData = (axis) => {
            const table = manager.getTable(this.object.table);
            const axisExpression = manager.dataflow.cache.parse(axis.expression);
            const tickDataExpression = manager.dataflow.cache.parse(axis.tickDataExpression);
            const result = [];
            for (let i = 0; i < table.rows.length; i++) {
                const c = table.getRowContext(i);
                const axisValue = axisExpression.getValue(c);
                const tickData = tickDataExpression.getValue(c);
                result.push({ value: axisValue, tick: tickData });
            }
            return result;
        };
        if (props.xData && props.xData.visible) {
            const axisRenderer = new axis_1.AxisRenderer().setAxisDataBinding(props.xData, 0, attrs.x2 - attrs.x1, false, false);
            if (props.xData.tickDataExpression) {
                axisRenderer.setTicksByData(getTickData(props.xData));
            }
            g.elements.push(axisRenderer.renderCartesian(attrs.x1, props.xData.side != "default" ? attrs.y2 : attrs.y1, "x"));
        }
        if (props.yData && props.yData.visible) {
            const axisRenderer = new axis_1.AxisRenderer().setAxisDataBinding(props.yData, 0, attrs.y2 - attrs.y1, false, true);
            if (props.yData.tickDataExpression) {
                axisRenderer.setTicksByData(getTickData(props.yData));
            }
            g.elements.push(axisRenderer.renderCartesian(props.yData.side != "default" ? attrs.x2 : attrs.x1, attrs.y1, "y"));
        }
        return g;
    }
    getDropZones() {
        const attrs = this.state.attributes;
        const { x1, y1, x2, y2 } = attrs;
        const zones = [];
        zones.push({
            type: "region",
            accept: { scaffolds: ["cartesian-y"] },
            dropAction: { extendPlotSegment: {} },
            p1: { x: x1, y: y1 },
            p2: { x: x2, y: y2 },
            title: "Add Y Scaffold"
        });
        zones.push({
            type: "region",
            accept: { scaffolds: ["cartesian-x"] },
            dropAction: { extendPlotSegment: {} },
            p1: { x: x1, y: y1 },
            p2: { x: x2, y: y2 },
            title: "Add X Scaffold"
        });
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
            accept: { scaffolds: ["curve"] },
            dropAction: { extendPlotSegment: {} },
            p1: { x: x1, y: y1 },
            p2: { x: x2, y: y2 },
            title: "Convert to Curve Coordinates"
        });
        zones.push({
            type: "region",
            accept: { scaffolds: ["map"] },
            dropAction: { extendPlotSegment: {} },
            p1: { x: x1, y: y1 },
            p2: { x: x2, y: y2 },
            title: "Convert to Map"
        });
        zones.push({
            type: "line",
            p1: { x: x2, y: y1 },
            p2: { x: x1, y: y1 },
            title: "X Axis",
            dropAction: {
                axisInference: { property: "xData" }
            }
        });
        zones.push({
            type: "line",
            p1: { x: x1, y: y1 },
            p2: { x: x1, y: y2 },
            title: "Y Axis",
            dropAction: {
                axisInference: { property: "yData" }
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
        const { x1, x2, y1, y2 } = attrs;
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
            }
        ];
        const builder = this.createBuilder();
        const handles = builder.getHandles();
        for (const handle of handles) {
            h.push({
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
            });
        }
        return h;
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
CartesianPlotSegment.classID = "plot-segment.cartesian";
CartesianPlotSegment.type = "plot-segment";
CartesianPlotSegment.metadata = {
    displayName: "PlotSegment",
    iconPath: "plot-segment/cartesian",
    creatingInteraction: {
        type: "rectangle",
        mapping: { xMin: "x1", yMin: "y1", xMax: "x2", yMax: "y2" }
    }
};
CartesianPlotSegment.defaultMappingValues = {};
CartesianPlotSegment.defaultProperties = {
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
    }
};
exports.CartesianPlotSegment = CartesianPlotSegment;
//# sourceMappingURL=cartesian.js.map