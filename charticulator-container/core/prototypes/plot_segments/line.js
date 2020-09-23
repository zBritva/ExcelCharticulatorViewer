"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
const Graphics = require("../../graphics");
const solver_1 = require("../../solver");
const Specification = require("../../specification");
const axis_1 = require("./axis");
const plot_segment_1 = require("./plot_segment");
class LineGuide extends plot_segment_1.PlotSegmentClass {
    constructor() {
        super(...arguments);
        this.attributeNames = ["x1", "x2", "y1", "y2"];
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
            }
        };
    }
    initializeState() {
        const attrs = this.state.attributes;
        attrs.x1 = -100;
        attrs.x2 = 100;
        attrs.y1 = -100;
        attrs.y2 = 100;
    }
    buildGlyphConstraints(solver) {
        const chart = this.parent.object;
        const props = this.object.properties;
        const rows = this.parent.dataflow.getTable(this.object.table);
        const [x1, y1, x2, y2] = solver.attrs(this.state.attributes, [
            "x1",
            "y1",
            "x2",
            "y2"
        ]);
        const attrs = this.state.attributes;
        const count = this.state.dataRowIndices.length;
        const dataIndices = this.state.dataRowIndices;
        for (const [index, markState] of this.state.glyphs.entries()) {
            let t = (0.5 + index) / count;
            if (props.axis == null) {
                t = (0.5 + index) / count;
            }
            else {
                const data = props.axis;
                switch (data.type) {
                    case "numerical":
                        {
                            const row = rows.getGroupedContext(dataIndices[index]);
                            const expr = this.parent.dataflow.cache.parse(data.expression);
                            const value = expr.getNumberValue(row);
                            t = (value - data.domainMin) / (data.domainMax - data.domainMin);
                        }
                        break;
                    case "categorical":
                        {
                            const axis = axis_1.getCategoricalAxis(props.axis, false, false);
                            const row = rows.getGroupedContext(dataIndices[index]);
                            const expr = this.parent.dataflow.cache.parse(data.expression);
                            const value = expr.getStringValue(row);
                            const i = data.categories.indexOf(value);
                            t = (axis.ranges[i][0] + axis.ranges[i][1]) / 2;
                        }
                        break;
                    case "default":
                        {
                            t = (0.5 + index) / count;
                        }
                        break;
                }
            }
            solver.addLinear(solver_1.ConstraintStrength.HARD, 0, [[t, x2], [1 - t, x1]], [[1, solver.attr(markState.attributes, "x")]]);
            solver.addLinear(solver_1.ConstraintStrength.HARD, 0, [[t, y2], [1 - t, y1]], [[1, solver.attr(markState.attributes, "y")]]);
        }
    }
    getDropZones() {
        const attrs = this.state.attributes;
        const { x1, y1, x2, y2 } = attrs;
        const zones = [];
        zones.push({
            type: "line",
            p1: { x: x1, y: y1 },
            p2: { x: x2, y: y2 },
            title: "Axis",
            dropAction: {
                axisInference: { property: "axis" }
            }
        });
        return zones;
    }
    getHandles() {
        const attrs = this.state.attributes;
        const { x1, y1, x2, y2 } = attrs;
        return [
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
                y: y2,
                actions: [
                    { type: "attribute", source: "x", attribute: "x2" },
                    { type: "attribute", source: "y", attribute: "y2" }
                ]
            }
        ];
    }
    getBoundingBox() {
        const attrs = this.state.attributes;
        const { x1, x2, y1, y2 } = attrs;
        return {
            type: "line",
            x1,
            y1,
            x2,
            y2
        };
    }
    getGraphics() {
        const attrs = this.state.attributes;
        const { x1, y1, x2, y2 } = attrs;
        const props = this.object.properties;
        const length = Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
        if (props.axis == null) {
            return Graphics.makeLine(x1, y1, x2, y2, {
                strokeColor: { r: 0, g: 0, b: 0 },
                fillColor: null
            });
        }
        if (props.axis && props.axis.visible) {
            const renderer = new axis_1.AxisRenderer();
            renderer.setAxisDataBinding(props.axis, 0, length, false, false);
            const g = renderer.renderLine(x1, y1, (Math.atan2(y2 - y1, x2 - x1) / Math.PI) * 180, 1);
            return g;
        }
    }
    getAttributePanelWidgets(manager) {
        const props = this.object.properties;
        return [
            ...super.getAttributePanelWidgets(manager),
            ...axis_1.buildAxisWidgets(props.axis, "axis", manager, "Axis")
        ];
    }
    getTemplateParameters() {
        const r = [];
        let p = [];
        if (this.object.properties.axis) {
            const axis = this.object.properties.axis;
            r.push(axis_1.buildAxisInference(this.object, "axis"));
            p = p.concat(axis_1.buildAxisProperties(this.object, "axis"));
        }
        return { inferences: r, properties: p };
    }
}
LineGuide.classID = "plot-segment.line";
LineGuide.type = "plot-segment";
LineGuide.metadata = {
    displayName: "PlotSegment",
    iconPath: "plot-segment/line",
    creatingInteraction: {
        type: "line-segment",
        mapping: { x1: "x1", y1: "y1", x2: "x2", y2: "y2" }
    }
};
LineGuide.defaultProperties = {
    visible: true
};
exports.LineGuide = LineGuide;
//# sourceMappingURL=line.js.map