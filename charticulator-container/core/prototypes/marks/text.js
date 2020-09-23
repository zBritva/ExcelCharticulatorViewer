"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("../../common");
const Graphics = require("../../graphics");
const Specification = require("../../specification");
const emphasis_1 = require("./emphasis");
const text_attrs_1 = require("./text.attrs");
class TextElementClass extends emphasis_1.EmphasizableMarkClass {
    constructor() {
        super(...arguments);
        this.attributes = text_attrs_1.textAttributes;
        this.attributeNames = Object.keys(text_attrs_1.textAttributes);
    }
    // Initialize the state of an element so that everything has a valid value
    initializeState() {
        const attrs = this.state.attributes;
        attrs.x = 0;
        attrs.y = 0;
        attrs.text = "Text";
        attrs.fontFamily = "Arial";
        attrs.fontSize = 14;
        attrs.color = {
            r: 0,
            g: 0,
            b: 0
        };
        attrs.visible = true;
        attrs.outline = null;
        attrs.opacity = 1;
    }
    // Get intrinsic constraints between attributes (e.g., x2 - x1 = width for rectangles)
    buildConstraints(solver) { }
    // Get the graphical element from the element
    getGraphics(cs, offset, glyphIndex = 0, manager, empasized) {
        const attrs = this.state.attributes;
        const props = this.object.properties;
        if (!attrs.visible || !this.object.properties.visible) {
            return null;
        }
        const metrics = Graphics.TextMeasurer.Measure(attrs.text, attrs.fontFamily, attrs.fontSize);
        const [dx, dy] = Graphics.TextMeasurer.ComputeTextPosition(0, 0, metrics, props.alignment.x, props.alignment.y, props.alignment.xMargin, props.alignment.yMargin);
        const p = cs.getLocalTransform(attrs.x + offset.x, attrs.y + offset.y);
        p.angle += props.rotation;
        const text = Graphics.makeText(dx, dy, attrs.text, attrs.fontFamily, attrs.fontSize, Object.assign({ strokeColor: attrs.outline, fillColor: attrs.color, opacity: attrs.opacity }, this.generateEmphasisStyle(empasized)));
        const g = Graphics.makeGroup([text]);
        g.transform = p;
        return g;
    }
    // Get DropZones given current state
    getDropZones() {
        return [
            Object.assign({ type: "rectangle" }, this.getBoundingRectangle(), { title: "text", dropAction: {
                    scaleInference: {
                        attribute: "text",
                        attributeType: Specification.AttributeType.Text
                    }
                } })
        ];
    }
    // Get bounding rectangle given current state
    getHandles() {
        const attrs = this.state.attributes;
        const props = this.object.properties;
        const { x, y, x1, y1, x2, y2 } = attrs;
        const bbox = this.getBoundingRectangle();
        return [
            {
                type: "point",
                x,
                y,
                actions: [
                    { type: "attribute", source: "x", attribute: "x" },
                    { type: "attribute", source: "y", attribute: "y" }
                ]
            },
            {
                type: "text-alignment",
                actions: [
                    { type: "property", source: "alignment", property: "alignment" },
                    { type: "property", source: "rotation", property: "rotation" },
                    { type: "attribute-value-mapping", source: "text", attribute: "text" }
                ],
                textWidth: bbox.width,
                textHeight: bbox.height,
                anchorX: x,
                anchorY: y,
                text: attrs.text,
                alignment: props.alignment,
                rotation: props.rotation
            }
        ];
    }
    getBoundingRectangle() {
        const props = this.object.properties;
        const attrs = this.state.attributes;
        const metrics = Graphics.TextMeasurer.Measure(attrs.text, attrs.fontFamily, attrs.fontSize);
        const [dx, dy] = Graphics.TextMeasurer.ComputeTextPosition(0, 0, metrics, props.alignment.x, props.alignment.y, props.alignment.xMargin, props.alignment.yMargin);
        const cx = dx + metrics.width / 2;
        const cy = dy + metrics.middle;
        const rotation = this.object.properties.rotation;
        const cos = Math.cos((rotation / 180) * Math.PI);
        const sin = Math.sin((rotation / 180) * Math.PI);
        return {
            cx: attrs.x + cx * cos - cy * sin,
            cy: attrs.y + cx * sin + cy * cos,
            width: metrics.width,
            height: (metrics.middle - metrics.ideographicBaseline) * 2,
            rotation
        };
    }
    getBoundingBox() {
        const rect = this.getBoundingRectangle();
        const attrs = this.state.attributes;
        return {
            type: "anchored-rectangle",
            anchorX: attrs.x,
            anchorY: attrs.y,
            cx: rect.cx - attrs.x,
            cy: rect.cy - attrs.y,
            width: rect.width,
            height: rect.height,
            rotation: rect.rotation
        };
    }
    getSnappingGuides() {
        const attrs = this.state.attributes;
        const { x, y, x1, y1, x2, y2 } = attrs;
        return [
            { type: "x", value: x, attribute: "x" },
            { type: "y", value: y, attribute: "y" }
        ];
    }
    getAttributePanelWidgets(manager) {
        const props = this.object.properties;
        return [
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
            manager.sectionHeader("Anchor & Rotation"),
            manager.row("Anchor X", manager.horizontal([0, 1], manager.inputSelect({ property: "alignment", field: "x" }, {
                type: "radio",
                icons: [
                    "text-align/left",
                    "text-align/x-middle",
                    "text-align/right"
                ],
                labels: ["Left", "Middle", "Right"],
                options: ["left", "middle", "right"]
            }), props.alignment.x != "middle"
                ? manager.horizontal([0, 1], manager.label("Margin:"), manager.inputNumber({ property: "alignment", field: "xMargin" }, {
                    updownTick: 1,
                    showUpdown: true
                }))
                : null)),
            manager.row("Anchor Y", manager.horizontal([0, 1], manager.inputSelect({ property: "alignment", field: "y" }, {
                type: "radio",
                icons: [
                    "text-align/top",
                    "text-align/y-middle",
                    "text-align/bottom"
                ],
                labels: ["Top", "Middle", "Bottom"],
                options: ["top", "middle", "bottom"]
            }), props.alignment.y != "middle"
                ? manager.horizontal([0, 1], manager.label("Margin:"), manager.inputNumber({ property: "alignment", field: "yMargin" }, {
                    updownTick: 1,
                    showUpdown: true
                }))
                : null)),
            // manager.row("Rotation", manager.inputNumber({ property: "rotation" })),
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
    }
    getTemplateParameters() {
        const properties = [];
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
        if (this.object.mappings.text &&
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
        return {
            properties
        };
    }
}
TextElementClass.classID = "mark.text";
TextElementClass.type = "mark";
TextElementClass.metadata = {
    displayName: "Text",
    iconPath: "mark/text",
    creatingInteraction: {
        type: "point",
        mapping: { x: "x", y: "y" }
    }
};
TextElementClass.defaultMappingValues = {
    text: "Text",
    fontFamily: "Arial",
    fontSize: 14,
    color: { r: 0, g: 0, b: 0 },
    opacity: 1,
    visible: true
};
TextElementClass.defaultProperties = {
    alignment: { x: "middle", y: "top", xMargin: 5, yMargin: 5 },
    rotation: 0,
    visible: true
};
exports.TextElementClass = TextElementClass;
//# sourceMappingURL=text.js.map