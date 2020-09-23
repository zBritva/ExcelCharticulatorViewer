"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
Object.defineProperty(exports, "__esModule", { value: true });
// This implements Data-Driven Guides (straight line guide).
const mark_1 = require("./mark");
const solver_1 = require("../../solver");
const Specification = require("../../specification");
const attrs_1 = require("../attrs");
const axis_1 = require("../plot_segments/axis");
class DataAxisClass extends mark_1.MarkClass {
    getAttributeNames(expr) {
        return [`anchorX${expr.name}`, `anchorY${expr.name}`];
    }
    get attributeNames() {
        const r = ["x1", "y1", "x2", "y2"];
        for (const item of this.object.properties.dataExpressions) {
            const [xName, yName] = this.getAttributeNames(item);
            r.push(xName);
            r.push(yName);
        }
        return r;
    }
    get attributes() {
        const r = Object.assign({}, attrs_1.AttrBuilder.line());
        for (const item of this.object.properties.dataExpressions) {
            const [xName, yName] = this.getAttributeNames(item);
            r[xName] = {
                name: xName,
                type: Specification.AttributeType.Number
            };
            r[yName] = {
                name: yName,
                type: Specification.AttributeType.Number
            };
        }
        return r;
    }
    buildConstraints(solver, context) {
        if (context == null) {
            return;
        }
        const attrs = this.state.attributes;
        const props = this.object.properties;
        const [x1, y1, x2, y2] = solver.attrs(attrs, ["x1", "y1", "x2", "y2"]);
        if (props.axis) {
            if (props.axis.type == "numerical") {
                for (const item of props.dataExpressions) {
                    const [attrX, attrY] = this.getAttributeNames(item);
                    const expr = context.getExpressionValue(item.expression, context.rowContext);
                    const interp = axis_1.getNumericalInterpolate(props.axis);
                    const t = interp(expr);
                    if (attrs[attrX] == null) {
                        attrs[attrX] = attrs.x1;
                    }
                    if (attrs[attrY] == null) {
                        attrs[attrY] = attrs.y1;
                    }
                    solver.addLinear(solver_1.ConstraintStrength.HARD, 0, [[t, x2], [1 - t, x1]], [[1, solver.attr(attrs, attrX)]]);
                    solver.addLinear(solver_1.ConstraintStrength.HARD, 0, [[t, y2], [1 - t, y1]], [[1, solver.attr(attrs, attrY)]]);
                }
            }
        }
    }
    // Initialize the state of an element so that everything has a valid value
    initializeState() {
        const attrs = this.state.attributes;
        attrs.x1 = -10;
        attrs.y1 = -10;
        attrs.x2 = 10;
        attrs.y2 = 10;
    }
    // Get bounding rectangle given current state
    getHandles() {
        const attrs = this.state.attributes;
        return [
            {
                type: "point",
                x: attrs.x1,
                y: attrs.y1,
                actions: [
                    { type: "attribute", source: "x", attribute: "x1" },
                    { type: "attribute", source: "y", attribute: "y1" }
                ]
            },
            {
                type: "point",
                x: attrs.x2,
                y: attrs.y2,
                actions: [
                    { type: "attribute", source: "x", attribute: "x2" },
                    { type: "attribute", source: "y", attribute: "y2" }
                ]
            }
        ];
    }
    getGraphics(cs, offset, glyphIndex = 0) {
        const attrs = this.state.attributes;
        const props = this.object.properties;
        switch (props.visibleOn) {
            case "all":
                break;
            case "last":
                {
                    if (glyphIndex !=
                        this.getPlotSegmentClass().state.glyphs.length - 1) {
                        return null;
                    }
                }
                break;
            case "first":
            default:
                {
                    if (glyphIndex != 0) {
                        return null;
                    }
                }
                break;
        }
        if (props.axis) {
            if (props.axis.visible) {
                const renderer = new axis_1.AxisRenderer();
                renderer.setAxisDataBinding(props.axis, 0, Math.sqrt((attrs.x2 - attrs.x1) * (attrs.x2 - attrs.x1) +
                    (attrs.y2 - attrs.y1) * (attrs.y2 - attrs.y1)), false, false);
                const g = renderer.renderLine(0, 0, (Math.atan2(attrs.y2 - attrs.y1, attrs.x2 - attrs.x1) / Math.PI) *
                    180, -1);
                g.transform = cs.getLocalTransform(attrs.x1 + offset.x, attrs.y1 + offset.y);
                return g;
            }
            else {
                return null;
            }
        }
        else {
            const renderer = new axis_1.AxisRenderer();
            renderer.setAxisDataBinding(null, 0, Math.sqrt((attrs.x2 - attrs.x1) * (attrs.x2 - attrs.x1) +
                (attrs.y2 - attrs.y1) * (attrs.y2 - attrs.y1)), false, false);
            const g = renderer.renderLine(0, 0, (Math.atan2(attrs.y2 - attrs.y1, attrs.x2 - attrs.x1) / Math.PI) * 180, -1);
            g.transform = cs.getLocalTransform(attrs.x1 + offset.x, attrs.y1 + offset.y);
            return g;
        }
    }
    getSnappingGuides() {
        const attrs = this.state.attributes;
        const guides = [];
        if (attrs.x1 != attrs.x2) {
            for (const item of this.object.properties.dataExpressions) {
                const attr = this.getAttributeNames(item)[0];
                guides.push({
                    type: "x",
                    value: attrs[attr],
                    attribute: attr
                });
            }
        }
        if (attrs.y1 != attrs.y2) {
            for (const item of this.object.properties.dataExpressions) {
                const attr = this.getAttributeNames(item)[1];
                guides.push({
                    type: "y",
                    value: attrs[attr],
                    attribute: attr
                });
            }
        }
        for (const item of this.object.properties.dataExpressions) {
            const [attrX, attrY] = this.getAttributeNames(item);
            guides.push({
                type: "label",
                x: attrs[attrX],
                y: attrs[attrY],
                text: item.expression
            });
        }
        return guides;
    }
    getBoundingBox() {
        const attrs = this.state.attributes;
        return {
            type: "line",
            x1: attrs.x1,
            y1: attrs.y1,
            x2: attrs.x2,
            y2: attrs.y2
        };
    }
    // Get DropZones given current state
    getDropZones() {
        const attrs = this.state.attributes;
        const { x1, y1, x2, y2 } = attrs;
        return [
            {
                type: "line",
                p1: { x: x1, y: y1 },
                p2: { x: x2, y: y2 },
                title: "Data Axis",
                dropAction: {
                    axisInference: {
                        property: "axis",
                        appendToProperty: "dataExpressions"
                    }
                }
            }
        ];
    }
    getAttributePanelWidgets(manager) {
        const props = this.object.properties;
        const axisWidgets = axis_1.buildAxisWidgets(props.axis, "axis", manager, "Data Axis");
        const r = [...axisWidgets];
        r.push(manager.row("Visible On", manager.inputSelect({ property: "visibleOn" }, {
            labels: ["All", "First", "Last"],
            showLabel: true,
            options: ["all", "first", "last"],
            type: "dropdown"
        })));
        if (props.dataExpressions.length > 0) {
            r.push(manager.sectionHeader("Data Expressions"));
            r.push(manager.arrayWidget({ property: "dataExpressions" }, item => manager.inputExpression({
                property: "dataExpressions",
                field: item.field instanceof Array
                    ? [...item.field, "expression"]
                    : [item.field, "expression"]
            }, { table: this.getGlyphClass().object.table }), {
                allowDelete: true,
                allowReorder: true
            }));
        }
        return r;
    }
    getTemplateParameters() {
        const props = this.object.properties;
        const dataSource = {
            table: this.getGlyphClass().object.table,
            groupBy: null // TODO: fixme
        };
        if (props.dataExpressions && props.dataExpressions.length > 0) {
            return {
                inferences: [
                    {
                        objectID: this.object._id,
                        dataSource,
                        axis: {
                            expression: props.dataExpressions[0].expression,
                            additionalExpressions: props.dataExpressions.map(x => x.expression),
                            type: props.axis.type,
                            property: "axis"
                        }
                    },
                    ...props.dataExpressions.map((x, i) => {
                        return {
                            objectID: this.object._id,
                            dataSource,
                            expression: {
                                expression: x.expression,
                                property: {
                                    property: "dataExpressions",
                                    field: [i, "expression"]
                                }
                            }
                        };
                    })
                ]
            };
        }
    }
}
DataAxisClass.classID = "mark.data-axis";
DataAxisClass.type = "mark";
DataAxisClass.metadata = {
    displayName: "DataAxis",
    iconPath: "mark/data-axis",
    creatingInteraction: {
        type: "line-segment",
        mapping: { x1: "x1", y1: "y1", x2: "x2", y2: "y2" }
    }
};
DataAxisClass.defaultProperties = {
    dataExpressions: [],
    axis: null,
    visible: true,
    visibleOn: "first"
};
exports.DataAxisClass = DataAxisClass;
//# sourceMappingURL=data_axis.js.map