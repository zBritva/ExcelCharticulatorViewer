"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
const common_1 = require("../../common");
const solver_1 = require("../../solver");
const Specification = require("../../specification");
const Graphics = require("../../graphics");
const common_2 = require("../common");
class ChartClass extends common_2.ObjectClass {
    setDataflow(dataflow) {
        this.dataflow = dataflow;
    }
    setManager(manager) {
        this.manager = manager;
    }
    getBackgroundGraphics() {
        return null;
    }
    resolveMapping(mapping, defaultValue) {
        if (mapping) {
            if (mapping.type == "value") {
                const value = mapping.value;
                return () => value;
            }
            if (mapping.type == "scale") {
                const scaleMapping = mapping;
                const idx = common_1.indexOf(this.object.scales, x => x._id == scaleMapping.scale);
                const scaleClass = common_2.ObjectClasses.Create(this.parent, this.object.scales[idx], this.state.scales[idx]);
                const expr = this.dataflow.cache.parse(scaleMapping.expression);
                return (row) => scaleClass.mapDataToAttribute(expr.getValue(row));
            }
        }
        return () => defaultValue;
    }
}
ChartClass.metadata = {
    iconPath: "chart",
    displayName: "Chart"
};
exports.ChartClass = ChartClass;
class RectangleChart extends ChartClass {
    constructor() {
        super(...arguments);
        // Get a list of elemnt attributes
        this.attributeNames = [
            "x1",
            "y1",
            "x2",
            "y2",
            "cx",
            "cy",
            "ox1",
            "oy1",
            "ox2",
            "oy2",
            "width",
            "height",
            "marginLeft",
            "marginRight",
            "marginTop",
            "marginBottom"
        ];
        this.attributes = {
            x1: {
                name: "x1",
                type: Specification.AttributeType.Number
            },
            y1: {
                name: "y1",
                type: Specification.AttributeType.Number
            },
            x2: {
                name: "x2",
                type: Specification.AttributeType.Number
            },
            y2: {
                name: "y2",
                type: Specification.AttributeType.Number
            },
            cx: {
                name: "cx",
                type: Specification.AttributeType.Number
            },
            cy: {
                name: "cy",
                type: Specification.AttributeType.Number
            },
            ox1: {
                name: "ox1",
                type: Specification.AttributeType.Number
            },
            oy1: {
                name: "oy1",
                type: Specification.AttributeType.Number
            },
            ox2: {
                name: "ox2",
                type: Specification.AttributeType.Number
            },
            oy2: {
                name: "oy2",
                type: Specification.AttributeType.Number
            },
            width: {
                name: "width",
                type: Specification.AttributeType.Number,
                defaultValue: 900
            },
            height: {
                name: "height",
                type: Specification.AttributeType.Number,
                defaultValue: 600
            },
            marginLeft: {
                name: "marginLeft",
                type: Specification.AttributeType.Number,
                defaultValue: 50
            },
            marginRight: {
                name: "marginRight",
                type: Specification.AttributeType.Number,
                defaultValue: 50
            },
            marginTop: {
                name: "marginTop",
                type: Specification.AttributeType.Number,
                defaultValue: 50
            },
            marginBottom: {
                name: "marginBottom",
                type: Specification.AttributeType.Number,
                defaultValue: 50
            }
        };
    }
    // Initialize the state of a mark so that everything has a valid value
    initializeState() {
        const attrs = this.state.attributes;
        attrs.width = 900;
        attrs.height = 600;
        attrs.marginLeft = 50;
        attrs.marginRight = 50;
        attrs.marginTop = 50;
        attrs.marginBottom = 50;
        attrs.cx = 0;
        attrs.cy = 0;
        attrs.x1 = -attrs.width / 2 + attrs.marginLeft;
        attrs.y1 = -attrs.height / 2 + attrs.marginBottom;
        attrs.x2 = +attrs.width / 2 - attrs.marginRight;
        attrs.y2 = +attrs.height / 2 - attrs.marginTop;
        attrs.ox1 = -attrs.width / 2;
        attrs.oy1 = -attrs.height / 2;
        attrs.ox2 = +attrs.width / 2;
        attrs.oy2 = +attrs.height / 2;
    }
    getBackgroundGraphics() {
        const attrs = this.state.attributes;
        if (this.object.properties.backgroundColor != null) {
            return Graphics.makeRect(-attrs.width / 2, -attrs.height / 2, attrs.width / 2, attrs.height / 2, {
                fillColor: this.object.properties.backgroundColor,
                fillOpacity: this.object.properties.backgroundOpacity
            });
        }
    }
    // Get intrinsic constraints between attributes (e.g., x2 - x1 = width for rectangles)
    buildIntrinsicConstraints(solver) {
        const attrs = this.state.attributes;
        const [x1, y1, x2, y2, ox1, oy1, ox2, oy2, cx, cy, width, height, marginLeft, marginRight, marginTop, marginBottom] = solver.attrs(attrs, [
            "x1",
            "y1",
            "x2",
            "y2",
            "ox1",
            "oy1",
            "ox2",
            "oy2",
            "cx",
            "cy",
            "width",
            "height",
            "marginLeft",
            "marginRight",
            "marginTop",
            "marginBottom"
        ]);
        solver.makeConstant(attrs, "width");
        solver.makeConstant(attrs, "height");
        solver.makeConstant(attrs, "marginLeft");
        solver.makeConstant(attrs, "marginRight");
        solver.makeConstant(attrs, "marginTop");
        solver.makeConstant(attrs, "marginBottom");
        solver.addLinear(solver_1.ConstraintStrength.HARD, 0, [[1, ox1]], [[-0.5, width]]);
        solver.addLinear(solver_1.ConstraintStrength.HARD, 0, [[1, ox2]], [[+0.5, width]]);
        solver.addLinear(solver_1.ConstraintStrength.HARD, 0, [[1, oy1]], [[-0.5, height]]);
        solver.addLinear(solver_1.ConstraintStrength.HARD, 0, [[1, oy2]], [[+0.5, height]]);
        solver.addLinear(solver_1.ConstraintStrength.HARD, 0, [[1, x1]], [[-0.5, width], [+1, marginLeft]]);
        solver.addLinear(solver_1.ConstraintStrength.HARD, 0, [[1, x2]], [[+0.5, width], [-1, marginRight]]);
        solver.addLinear(solver_1.ConstraintStrength.HARD, 0, [[1, y1]], [[-0.5, height], [+1, marginBottom]]);
        solver.addLinear(solver_1.ConstraintStrength.HARD, 0, [[1, y2]], [[+0.5, height], [-1, marginTop]]);
        solver.addLinear(solver_1.ConstraintStrength.HARD, 0, [[2, cx]], [[1, x1], [1, x2]]);
        solver.addLinear(solver_1.ConstraintStrength.HARD, 0, [[2, cy]], [[1, y1], [1, y2]]);
    }
    getSnappingGuides() {
        const attrs = this.state.attributes;
        return [
            {
                type: "x",
                value: attrs.x1,
                attribute: "x1",
                visible: true
            },
            {
                type: "x",
                value: attrs.x2,
                attribute: "x2",
                visible: true
            },
            {
                type: "y",
                value: attrs.y1,
                attribute: "y1",
                visible: true
            },
            {
                type: "y",
                value: attrs.y2,
                attribute: "y2",
                visible: true
            },
            // <SnappingGuides.Axis>{ type: "x", value: attrs.ox1, attribute: "ox1", visible: true },
            // <SnappingGuides.Axis>{ type: "x", value: attrs.ox2, attribute: "ox2", visible: true },
            // <SnappingGuides.Axis>{ type: "y", value: attrs.oy1, attribute: "oy1", visible: true },
            // <SnappingGuides.Axis>{ type: "y", value: attrs.oy2, attribute: "oy2", visible: true },
            {
                type: "x",
                value: attrs.cx,
                attribute: "cx",
                visible: true
            },
            {
                type: "y",
                value: attrs.cy,
                attribute: "cy",
                visible: true
            }
        ];
    }
    getHandles() {
        const attrs = this.state.attributes;
        const { x1, y1, x2, y2 } = attrs;
        const inf = [-10000, 10000];
        return [
            {
                type: "relative-line",
                axis: "x",
                actions: [{ type: "attribute-value-mapping", attribute: "marginLeft" }],
                reference: x1 - attrs.marginLeft,
                sign: 1,
                value: attrs.marginLeft,
                span: inf
            },
            {
                type: "relative-line",
                axis: "x",
                actions: [
                    { type: "attribute-value-mapping", attribute: "marginRight" }
                ],
                reference: x2 + attrs.marginRight,
                sign: -1,
                value: attrs.marginRight,
                span: inf
            },
            {
                type: "relative-line",
                axis: "y",
                actions: [{ type: "attribute-value-mapping", attribute: "marginTop" }],
                reference: y2 + attrs.marginTop,
                sign: -1,
                value: attrs.marginTop,
                span: inf
            },
            {
                type: "relative-line",
                axis: "y",
                actions: [
                    { type: "attribute-value-mapping", attribute: "marginBottom" }
                ],
                reference: y1 - attrs.marginBottom,
                sign: 1,
                value: attrs.marginBottom,
                span: inf
            }
            // <Handles.RelativeLine>{
            //     type: "relative-line", axis: "x",
            //     value: attrs.width, sign: 1,
            //     reference: attrs.ox1,
            //     span: [attrs.oy1, attrs.oy2],
            //     actions: [
            //         { type: "attribute-value-mapping", attribute: "width", minimum: 50 }
            //     ]
            // },
            // <Handles.RelativeLine>{
            //     type: "relative-line", axis: "x",
            //     value: attrs.width, sign: -1,
            //     reference: attrs.ox2,
            //     span: [attrs.oy1, attrs.oy2],
            //     actions: [
            //         { type: "attribute-value-mapping", attribute: "width", minimum: 50 }
            //     ]
            // },
            // <Handles.RelativeLine>{
            //     type: "relative-line", axis: "y",
            //     value: attrs.height, sign: 1,
            //     reference: attrs.oy1,
            //     span: [attrs.ox1, attrs.ox2],
            //     actions: [
            //         { type: "attribute-value-mapping", attribute: "height", minimum: 50 }
            //     ]
            // },
            // <Handles.RelativeLine>{
            //     type: "relative-line", axis: "y",
            //     value: attrs.height, sign: -1,
            //     reference: attrs.oy2,
            //     span: [attrs.ox1, attrs.ox2],
            //     actions: [
            //         { type: "attribute-value-mapping", attribute: "height", minimum: 50 }
            //     ]
            // }
        ];
    }
    getAttributePanelWidgets(manager) {
        const result = [
            manager.sectionHeader("Dimensions"),
            manager.mappingEditor("Width", "width", {}),
            manager.mappingEditor("Height", "height", {}),
            manager.sectionHeader("Margins"),
            manager.mappingEditor("Left", "marginLeft", {}),
            manager.mappingEditor("Right", "marginRight", {}),
            manager.mappingEditor("Top", "marginTop", {}),
            manager.mappingEditor("Bottom", "marginBottom", {}),
            manager.sectionHeader("Background"),
            manager.row("Color", manager.inputColor({ property: "backgroundColor" }, { allowNull: true }))
        ];
        if (this.object.properties.backgroundColor != null) {
            result.push(manager.row("Opacity", manager.inputNumber({ property: "backgroundOpacity" }, { showSlider: true, sliderRange: [0, 1] })));
        }
        return result;
    }
    getTemplateParameters() {
        if (this.object.mappings.text &&
            this.object.mappings.text.type == "scale") {
            return null;
        }
        else {
            return {
                properties: [
                    {
                        objectID: this.object._id,
                        target: {
                            attribute: "marginLeft"
                        },
                        type: Specification.AttributeType.Number,
                        default: this.state.attributes.marginLeft
                    },
                    {
                        objectID: this.object._id,
                        target: {
                            attribute: "marginRight"
                        },
                        type: Specification.AttributeType.Number,
                        default: this.state.attributes.marginRight
                    },
                    {
                        objectID: this.object._id,
                        target: {
                            attribute: "marginTop"
                        },
                        type: Specification.AttributeType.Number,
                        default: this.state.attributes.marginTop
                    },
                    {
                        objectID: this.object._id,
                        target: {
                            attribute: "marginBottom"
                        },
                        type: Specification.AttributeType.Number,
                        default: this.state.attributes.marginBottom
                    }
                ]
            };
        }
    }
}
RectangleChart.classID = "chart.rectangle";
RectangleChart.type = "chart";
RectangleChart.defaultMappingValues = {
    width: 900,
    height: 600,
    marginLeft: 50,
    marginRight: 50,
    marginTop: 50,
    marginBottom: 50,
    cx: 0,
    cy: 0
};
RectangleChart.defaultProperties = {
    backgroundColor: null,
    backgroundOpacity: 1
};
function registerClasses() {
    common_2.ObjectClasses.Register(RectangleChart);
}
exports.registerClasses = registerClasses;
//# sourceMappingURL=index.js.map