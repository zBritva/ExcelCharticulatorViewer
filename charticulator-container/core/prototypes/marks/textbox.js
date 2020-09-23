"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("../../common");
const Graphics = require("../../graphics");
const solver_1 = require("../../solver");
const Specification = require("../../specification");
const emphasis_1 = require("./emphasis");
const textbox_attrs_1 = require("./textbox.attrs");
class TextboxElementClass extends emphasis_1.EmphasizableMarkClass {
    constructor() {
        super(...arguments);
        this.attributes = textbox_attrs_1.textboxAttributes;
        this.attributeNames = Object.keys(textbox_attrs_1.textboxAttributes);
    }
    // Initialize the state of an element so that everything has a valid value
    initializeState() {
        const defaultWidth = 30;
        const defaultHeight = 50;
        const attrs = this.state.attributes;
        attrs.x1 = -defaultWidth / 2;
        attrs.y1 = -defaultHeight / 2;
        attrs.x2 = +defaultWidth / 2;
        attrs.y2 = +defaultHeight / 2;
        attrs.cx = 0;
        attrs.cy = 0;
        attrs.width = defaultWidth;
        attrs.height = defaultHeight;
        attrs.color = {
            r: 0,
            g: 0,
            b: 0
        };
        attrs.visible = true;
        attrs.outline = null;
        attrs.opacity = 1;
        attrs.text = null;
        attrs.fontFamily = "Arial";
        attrs.fontSize = 14;
    }
    getAttributePanelWidgets(manager) {
        const props = this.object.properties;
        const widgets = [
            manager.sectionHeader("Size"),
            manager.mappingEditor("Width", "width", {
                hints: { autoRange: true, startWithZero: "always" },
                acceptKinds: [Specification.DataKind.Numerical],
                defaultAuto: true
            }),
            manager.mappingEditor("Height", "height", {
                hints: { autoRange: true, startWithZero: "always" },
                acceptKinds: [Specification.DataKind.Numerical],
                defaultAuto: true
            }),
            manager.sectionHeader("Text"),
            manager.mappingEditor("Text", "text", {}),
            manager.mappingEditor("Font", "fontFamily", {
                defaultValue: "Arial"
            }),
            manager.mappingEditor("Size", "fontSize", {
                hints: { rangeNumber: [0, 36] },
                defaultValue: 14,
                numberOptions: {
                    showUpdown: true,
                    updownStyle: "font",
                    minimum: 0,
                    updownTick: 2
                }
            }),
            manager.row("Align X", manager.horizontal([0, 1], manager.inputSelect({ property: "alignX" }, {
                type: "radio",
                options: ["start", "middle", "end"],
                icons: ["align/left", "align/x-middle", "align/right"],
                labels: ["Left", "Middle", "Right"]
            }), props.alignX != "middle"
                ? manager.horizontal([0, 1], manager.label("Margin:"), manager.inputNumber({ property: "paddingX" }, {
                    updownTick: 1,
                    showUpdown: true
                }))
                : null)),
            manager.row("Align Y", manager.horizontal([0, 1], manager.inputSelect({ property: "alignY" }, {
                type: "radio",
                options: ["start", "middle", "end"],
                icons: ["align/bottom", "align/y-middle", "align/top"],
                labels: ["Bottom", "Middle", "Top"]
            }), props.alignY != "middle"
                ? manager.horizontal([0, 1], manager.label("Margin:"), manager.inputNumber({ property: "paddingY" }, {
                    updownTick: 1,
                    showUpdown: true
                }))
                : null)),
            manager.sectionHeader("Style"),
            manager.mappingEditor("Color", "color", {}),
            manager.mappingEditor("Outline", "outline", {}),
            manager.mappingEditor("Opacity", "opacity", {
                hints: { rangeNumber: [0, 1] },
                defaultValue: 1,
                numberOptions: { showSlider: true, minimum: 0, maximum: 1 }
            }),
            manager.mappingEditor("Visibility", "visible", {
                defaultValue: true
            })
        ];
        return widgets;
    }
    // Get intrinsic constraints between attributes (e.g., x2 - x1 = width for rectangles)
    buildConstraints(solver) {
        const [x1, y1, x2, y2, cx, cy, width, height] = solver.attrs(this.state.attributes, ["x1", "y1", "x2", "y2", "cx", "cy", "width", "height"]);
        solver.addLinear(solver_1.ConstraintStrength.HARD, 0, [[1, x2], [-1, x1]], [[1, width]]);
        solver.addLinear(solver_1.ConstraintStrength.HARD, 0, [[1, y2], [-1, y1]], [[1, height]]);
        solver.addLinear(solver_1.ConstraintStrength.HARD, 0, [[2, cx]], [[1, x1], [1, x2]]);
        solver.addLinear(solver_1.ConstraintStrength.HARD, 0, [[2, cy]], [[1, y1], [1, y2]]);
    }
    // Get the graphical element from the element
    getGraphics(cs, offset, glyphIndex, manager) {
        const attrs = this.state.attributes;
        const props = this.object.properties;
        if (!attrs.text ||
            (!attrs.color && !attrs.outline) ||
            !attrs.visible ||
            attrs.opacity == 0) {
            return Graphics.makeGroup([]);
        }
        const metrics = Graphics.TextMeasurer.Measure(attrs.text, attrs.fontFamily, attrs.fontSize);
        const helper = new Graphics.CoordinateSystemHelper(cs);
        const pathMaker = new Graphics.PathMaker();
        const cheight = (metrics.middle - metrics.ideographicBaseline) * 2;
        let y = 0;
        switch (props.alignY) {
            case "start":
                {
                    y = attrs.y1 - metrics.ideographicBaseline + props.paddingY;
                }
                break;
            case "middle":
                {
                    y = attrs.cy - cheight / 2 - metrics.ideographicBaseline;
                }
                break;
            case "end":
                {
                    y = attrs.y2 - cheight - metrics.ideographicBaseline - props.paddingY;
                }
                break;
        }
        helper.lineTo(pathMaker, attrs.x1 + offset.x + props.paddingX, y + offset.y, attrs.x2 + offset.x - props.paddingX, y + offset.y, true);
        const cmds = pathMaker.path.cmds;
        const textElement = {
            type: "text-on-path",
            pathCmds: cmds,
            text: attrs.text,
            fontFamily: attrs.fontFamily,
            fontSize: attrs.fontSize,
            align: props.alignX
        };
        if (attrs.outline) {
            if (attrs.color) {
                const g = Graphics.makeGroup([
                    Object.assign({}, textElement, { style: {
                            strokeColor: attrs.outline
                        } }),
                    Object.assign({}, textElement, { style: {
                            fillColor: attrs.color
                        } })
                ]);
                g.style = { opacity: attrs.opacity };
                return g;
            }
            else {
                return Object.assign({}, textElement, { style: {
                        strokeColor: attrs.outline,
                        opacity: attrs.opacity
                    } });
            }
        }
        else {
            return Object.assign({}, textElement, { style: {
                    fillColor: attrs.color,
                    opacity: attrs.opacity
                } });
        }
    }
    /** Get link anchors for this mark */
    getLinkAnchors() {
        const attrs = this.state.attributes;
        const element = this.object._id;
        return [
            {
                element,
                points: [
                    {
                        x: attrs.x1,
                        y: attrs.y1,
                        xAttribute: "x1",
                        yAttribute: "y1",
                        direction: { x: -1, y: 0 }
                    },
                    {
                        x: attrs.x1,
                        y: attrs.y2,
                        xAttribute: "x1",
                        yAttribute: "y2",
                        direction: { x: -1, y: 0 }
                    }
                ]
            },
            {
                element,
                points: [
                    {
                        x: attrs.x2,
                        y: attrs.y1,
                        xAttribute: "x2",
                        yAttribute: "y1",
                        direction: { x: 1, y: 0 }
                    },
                    {
                        x: attrs.x2,
                        y: attrs.y2,
                        xAttribute: "x2",
                        yAttribute: "y2",
                        direction: { x: 1, y: 0 }
                    }
                ]
            },
            {
                element,
                points: [
                    {
                        x: attrs.x1,
                        y: attrs.y1,
                        xAttribute: "x1",
                        yAttribute: "y1",
                        direction: { x: 0, y: -1 }
                    },
                    {
                        x: attrs.x2,
                        y: attrs.y1,
                        xAttribute: "x2",
                        yAttribute: "y1",
                        direction: { x: 0, y: -1 }
                    }
                ]
            },
            {
                element,
                points: [
                    {
                        x: attrs.x1,
                        y: attrs.y2,
                        xAttribute: "x1",
                        yAttribute: "y2",
                        direction: { x: 0, y: 1 }
                    },
                    {
                        x: attrs.x2,
                        y: attrs.y2,
                        xAttribute: "x2",
                        yAttribute: "y2",
                        direction: { x: 0, y: 1 }
                    }
                ]
            },
            {
                element,
                points: [
                    {
                        x: attrs.cx,
                        y: attrs.y1,
                        xAttribute: "cx",
                        yAttribute: "y1",
                        direction: { x: 0, y: -1 }
                    }
                ]
            },
            {
                element,
                points: [
                    {
                        x: attrs.cx,
                        y: attrs.y2,
                        xAttribute: "cx",
                        yAttribute: "y2",
                        direction: { x: 0, y: 1 }
                    }
                ]
            },
            {
                element,
                points: [
                    {
                        x: attrs.x1,
                        y: attrs.cy,
                        xAttribute: "x1",
                        yAttribute: "cy",
                        direction: { x: -1, y: 0 }
                    }
                ]
            },
            {
                element,
                points: [
                    {
                        x: attrs.x2,
                        y: attrs.cy,
                        xAttribute: "x2",
                        yAttribute: "cy",
                        direction: { x: 1, y: 0 }
                    }
                ]
            }
        ];
    }
    // Get DropZones given current state
    getDropZones() {
        const attrs = this.state.attributes;
        const { x1, y1, x2, y2 } = attrs;
        return [
            {
                type: "line",
                p1: { x: x2, y: y1 },
                p2: { x: x1, y: y1 },
                title: "width",
                accept: { kind: Specification.DataKind.Numerical },
                dropAction: {
                    scaleInference: {
                        attribute: "width",
                        attributeType: Specification.AttributeType.Number,
                        hints: { autoRange: true, startWithZero: "always" }
                    }
                }
            },
            {
                type: "line",
                p1: { x: x1, y: y1 },
                p2: { x: x1, y: y2 },
                title: "height",
                accept: { kind: Specification.DataKind.Numerical },
                dropAction: {
                    scaleInference: {
                        attribute: "height",
                        attributeType: Specification.AttributeType.Number,
                        hints: { autoRange: true, startWithZero: "always" }
                    }
                }
            }
        ];
    }
    // Get bounding rectangle given current state
    getHandles() {
        const attrs = this.state.attributes;
        const { x1, y1, x2, y2 } = attrs;
        return [
            {
                type: "line",
                axis: "x",
                actions: [{ type: "attribute", attribute: "x1" }],
                value: x1,
                span: [y1, y2]
            },
            {
                type: "line",
                axis: "x",
                actions: [{ type: "attribute", attribute: "x2" }],
                value: x2,
                span: [y1, y2]
            },
            {
                type: "line",
                axis: "y",
                actions: [{ type: "attribute", attribute: "y1" }],
                value: y1,
                span: [x1, x2]
            },
            {
                type: "line",
                axis: "y",
                actions: [{ type: "attribute", attribute: "y2" }],
                value: y2,
                span: [x1, x2]
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
                y: y1,
                actions: [
                    { type: "attribute", source: "x", attribute: "x2" },
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
        const { x1, y1, x2, y2 } = attrs;
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
        const { x1, y1, x2, y2, cx, cy } = attrs;
        return [
            { type: "x", value: x1, attribute: "x1" },
            { type: "x", value: x2, attribute: "x2" },
            { type: "x", value: cx, attribute: "cx" },
            { type: "y", value: y1, attribute: "y1" },
            { type: "y", value: y2, attribute: "y2" },
            { type: "y", value: cy, attribute: "cy" }
        ];
    }
    getTemplateParameters() {
        const properties = [];
        if (this.object.mappings.vistextible &&
            this.object.mappings.text.type === "value") {
            properties.push({
                objectID: this.object._id,
                target: {
                    attribute: "text"
                },
                type: Specification.AttributeType.Text,
                default: this.state.attributes.text
            });
        }
        if (this.object.mappings.fontFamily &&
            this.object.mappings.fontFamily.type === "value") {
            properties.push({
                objectID: this.object._id,
                target: {
                    attribute: "fontFamily"
                },
                type: Specification.AttributeType.FontFamily,
                default: this.state.attributes.fontFamily
            });
        }
        if (this.object.mappings.fontSize &&
            this.object.mappings.fontSize.type === "value") {
            properties.push({
                objectID: this.object._id,
                target: {
                    attribute: "fontSize"
                },
                type: Specification.AttributeType.Number,
                default: this.state.attributes.fontSize
            });
        }
        if (this.object.mappings.color &&
            this.object.mappings.color.type === "value") {
            properties.push({
                objectID: this.object._id,
                target: {
                    attribute: "color"
                },
                type: Specification.AttributeType.Color,
                default: common_1.rgbToHex(this.state.attributes.color)
            });
        }
        if (this.object.mappings.visible &&
            this.object.mappings.visible.type === "value") {
            properties.push({
                objectID: this.object._id,
                target: {
                    attribute: "visible"
                },
                type: Specification.AttributeType.Boolean,
                default: this.state.attributes.visible
            });
        }
        if (this.object.mappings.opacity &&
            this.object.mappings.opacity.type === "value") {
            properties.push({
                objectID: this.object._id,
                target: {
                    attribute: "opacity"
                },
                type: Specification.AttributeType.Number,
                default: this.state.attributes.opacity
            });
        }
        return {
            properties
        };
    }
}
TextboxElementClass.classID = "mark.textbox";
TextboxElementClass.type = "mark";
TextboxElementClass.metadata = {
    displayName: "Textbox",
    iconPath: "mark/textbox",
    creatingInteraction: {
        type: "rectangle",
        mapping: { xMin: "x1", yMin: "y1", xMax: "x2", yMax: "y2" }
    }
};
TextboxElementClass.defaultProperties = {
    visible: true,
    paddingX: 0,
    paddingY: 0,
    alignX: "middle",
    alignY: "middle"
};
TextboxElementClass.defaultMappingValues = {
    text: "Text",
    fontFamily: "Arial",
    fontSize: 14,
    color: { r: 0, g: 0, b: 0 },
    opacity: 1,
    visible: true
};
exports.TextboxElementClass = TextboxElementClass;
//# sourceMappingURL=textbox.js.map