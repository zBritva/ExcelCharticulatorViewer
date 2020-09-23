"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
Object.defineProperty(exports, "__esModule", { value: true });
const Graphics = require("../../graphics");
const Specification = require("../../specification");
const emphasis_1 = require("./emphasis");
const icon_attrs_1 = require("./icon.attrs");
const image_1 = require("./image");
class IconElementClass extends emphasis_1.EmphasizableMarkClass {
    constructor() {
        super(...arguments);
        this.attributes = icon_attrs_1.iconAttributes;
        this.attributeNames = Object.keys(icon_attrs_1.iconAttributes);
    }
    initializeState() {
        super.initializeState();
        const attrs = this.state.attributes;
        attrs.x = 0;
        attrs.y = 0;
        attrs.size = 400;
        attrs.opacity = 1;
        attrs.visible = true;
        attrs.image = null;
    }
    /** Get link anchors for this mark */
    getLinkAnchors(mode) {
        const attrs = this.state.attributes;
        return [
            {
                element: this.object._id,
                points: [
                    {
                        x: attrs.x,
                        y: attrs.y,
                        xAttribute: "x",
                        yAttribute: "y",
                        direction: { x: mode == "begin" ? 1 : -1, y: 0 }
                    }
                ]
            }
        ];
    }
    getLayoutProps() {
        const attrs = this.state.attributes;
        const image = attrs.image || image_1.imagePlaceholder;
        if (attrs.size <= 0) {
            return { width: 0, height: 0, dx: 0, dy: 0 };
        }
        const h = Math.sqrt((attrs.size * image.height) / image.width);
        const w = (h * image.width) / image.height;
        const offsets = this.getCenterOffset(this.object.properties.alignment, w, h);
        return {
            width: w,
            height: h,
            dx: offsets[0],
            dy: offsets[1]
        };
    }
    getCenterOffset(alignment, width, height) {
        let cx = width / 2, cy = height / 2;
        if (alignment.x == "left") {
            cx = -alignment.xMargin;
        }
        if (alignment.x == "right") {
            cx = width + alignment.xMargin;
        }
        if (alignment.y == "bottom") {
            cy = -alignment.yMargin;
        }
        if (alignment.y == "top") {
            cy = height + alignment.yMargin;
        }
        return [cx, cy];
    }
    // Get the graphical element from the element
    getGraphics(cs, offset, glyphIndex = 0, manager, emphasize) {
        const attrs = this.state.attributes;
        if (!attrs.visible || !this.object.properties.visible) {
            return null;
        }
        if (attrs.size <= 0) {
            return null;
        }
        const image = attrs.image || image_1.imagePlaceholder;
        // Compute w, h to resize the image to the desired size
        const layout = this.getLayoutProps();
        const gImage = Graphics.makeGroup([
            {
                type: "image",
                src: image.src,
                x: -layout.dx,
                y: -layout.dy,
                width: layout.width,
                height: layout.height,
                mode: "stretch"
            }
        ]);
        gImage.transform = cs.getLocalTransform(attrs.x + offset.x, attrs.y + offset.y);
        gImage.transform.angle += this.object.properties.rotation;
        return gImage;
    }
    // Get DropZones given current state
    getDropZones() {
        return [
            Object.assign({ type: "rectangle" }, this.getBoundingRectangle(), { title: "size", dropAction: {
                    scaleInference: {
                        attribute: "size",
                        attributeType: Specification.AttributeType.Number
                    }
                } })
        ];
    }
    // Get bounding rectangle given current state
    getHandles() {
        const attrs = this.state.attributes;
        const { x, y } = attrs;
        const bbox = this.getBoundingRectangle();
        const props = this.object.properties;
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
                text: null,
                alignment: props.alignment,
                rotation: props.rotation
            }
        ];
    }
    getBoundingRectangle() {
        const attrs = this.state.attributes;
        const rotation = this.object.properties.rotation;
        const layout = this.getLayoutProps();
        const cos = Math.cos((rotation / 180) * Math.PI);
        const sin = Math.sin((rotation / 180) * Math.PI);
        const dx = layout.dx - layout.width / 2;
        const dy = layout.dy - layout.height / 2;
        return {
            cx: attrs.x - dx * cos + dy * sin,
            cy: attrs.y - dx * sin - dy * cos,
            width: layout.width,
            height: layout.height,
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
        const { x, y } = attrs;
        return [
            { type: "x", value: x, attribute: "x" },
            { type: "y", value: y, attribute: "y" }
        ];
    }
    getAttributePanelWidgets(manager) {
        const props = this.object.properties;
        let widgets = [
            manager.sectionHeader("Icon"),
            manager.mappingEditor("Image", "image", {}),
            manager.mappingEditor("Size", "size", {
                acceptKinds: [Specification.DataKind.Numerical],
                hints: { rangeNumber: [0, 100] },
                defaultValue: 400,
                numberOptions: {
                    showSlider: true,
                    minimum: 0,
                    sliderRange: [0, 3600],
                    sliderFunction: "sqrt"
                }
            })
        ];
        widgets = widgets.concat([
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
                ? manager.horizontal([0, 1], manager.label("Margin:"), manager.inputNumber({ property: "alignment", field: "xMargin" }))
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
                ? manager.horizontal([0, 1], manager.label("Margin:"), manager.inputNumber({ property: "alignment", field: "yMargin" }))
                : null)),
            manager.sectionHeader("Style"),
            manager.mappingEditor("Opacity", "opacity", {
                hints: { rangeNumber: [0, 1] },
                defaultValue: 1,
                numberOptions: { showSlider: true, minimum: 0, maximum: 1 }
            }),
            manager.mappingEditor("Visibility", "visible", {
                defaultValue: true
            })
        ]);
        return widgets;
    }
    getTemplateParameters() {
        const properties = [];
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
        if (this.object.mappings.size &&
            this.object.mappings.size.type === "value") {
            properties.push({
                objectID: this.object._id,
                target: {
                    attribute: "size"
                },
                type: Specification.AttributeType.Number,
                default: this.state.attributes.size
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
IconElementClass.classID = "mark.icon";
IconElementClass.type = "mark";
IconElementClass.metadata = {
    displayName: "Icon",
    iconPath: "mark/icon",
    creatingInteraction: {
        type: "point",
        mapping: { x: "x", y: "y" }
    }
};
IconElementClass.defaultProperties = {
    alignment: { x: "middle", y: "top", xMargin: 5, yMargin: 5 },
    rotation: 0,
    visible: true
};
IconElementClass.defaultMappingValues = {
    opacity: 1,
    size: 400,
    visible: true
};
exports.IconElementClass = IconElementClass;
//# sourceMappingURL=icon.js.map