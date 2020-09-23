"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("../../common");
const Graphics = require("../../graphics");
const solver_1 = require("../../solver");
const Specification = require("../../specification");
const emphasis_1 = require("./emphasis");
const image_attrs_1 = require("./image.attrs");
exports.imagePlaceholder = {
    src: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAzMiAzMiI+PHRpdGxlPmljb25zPC90aXRsZT48cmVjdCB4PSI1LjE1MTI0IiB5PSI2LjY4NDYyIiB3aWR0aD0iMjEuNjk3NTIiIGhlaWdodD0iMTguNjEyNSIgc3R5bGU9ImZpbGw6bm9uZTtzdHJva2U6IzAwMDtzdHJva2UtbGluZWpvaW46cm91bmQ7c3Ryb2tlLXdpZHRoOjAuOTI2MTg0MTE3Nzk0MDM2OXB4Ii8+PHBvbHlnb24gcG9pbnRzPSIyMC4xNSAxMi45NDMgMTMuODExIDIxLjQwNCAxMC4xNTQgMTYuNDk4IDUuMTUxIDIzLjE3NiA1LjE1MSAyNS4zMDYgMTAuODg4IDI1LjMwNiAxNi43MTkgMjUuMzA2IDI2Ljg0OSAyNS4zMDYgMjYuODQ5IDIxLjkzIDIwLjE1IDEyLjk0MyIgc3R5bGU9ImZpbGwtb3BhY2l0eTowLjI7c3Ryb2tlOiMwMDA7c3Ryb2tlLWxpbmVjYXA6cm91bmQ7c3Ryb2tlLWxpbmVqb2luOnJvdW5kO3N0cm9rZS13aWR0aDowLjcwMDAwMDAwMDAwMDAwMDFweCIvPjxjaXJjbGUgY3g9IjExLjkyMDI3IiBjeT0iMTIuMzk5MjMiIHI9IjEuOTAyMTYiIHN0eWxlPSJmaWxsLW9wYWNpdHk6MC4yO3N0cm9rZTojMDAwO3N0cm9rZS1saW5lY2FwOnJvdW5kO3N0cm9rZS1saW5lam9pbjpyb3VuZDtzdHJva2Utd2lkdGg6MC43MDAwMDAwMDAwMDAwMDAxcHgiLz48L3N2Zz4=",
    width: 100,
    height: 100
};
class ImageElementClass extends emphasis_1.EmphasizableMarkClass {
    constructor() {
        super(...arguments);
        this.attributes = image_attrs_1.imageAttributes;
        this.attributeNames = Object.keys(image_attrs_1.imageAttributes);
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
        attrs.stroke = null;
        attrs.fill = null;
        attrs.strokeWidth = 1;
        attrs.opacity = 1;
        attrs.visible = true;
        attrs.image = null;
    }
    getAttributePanelWidgets(manager) {
        let widgets = [
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
            manager.sectionHeader("Image"),
            manager.mappingEditor("Image", "image", {}),
            manager.row("Resize Mode", manager.inputSelect({ property: "imageMode" }, {
                type: "dropdown",
                showLabel: true,
                labels: ["Letterbox", "Stretch"],
                options: ["letterbox", "stretch"]
            })),
            ...(this.object.properties.imageMode == "letterbox"
                ? [
                    manager.row("Align", manager.horizontal([0, 1], manager.inputSelect({ property: "alignX" }, {
                        type: "radio",
                        options: ["start", "middle", "end"],
                        icons: ["align/left", "align/x-middle", "align/right"],
                        labels: ["Left", "Middle", "Right"]
                    }), manager.inputSelect({ property: "alignY" }, {
                        type: "radio",
                        options: ["start", "middle", "end"],
                        icons: ["align/bottom", "align/y-middle", "align/top"],
                        labels: ["Bottom", "Middle", "Top"]
                    })))
                ]
                : []),
            manager.row("Padding", manager.horizontal([0, 2, 0, 2], manager.label("x:"), manager.inputNumber({ property: "paddingX" }, {
                updownTick: 1,
                showUpdown: true
            }), manager.label("y:"), manager.inputNumber({ property: "paddingY" }, {
                updownTick: 1,
                showUpdown: true
            }))),
            manager.sectionHeader("Style"),
            manager.mappingEditor("Fill", "fill", {}),
            manager.mappingEditor("Stroke", "stroke", {})
        ];
        if (this.object.mappings.stroke != null) {
            widgets.push(manager.mappingEditor("Line Width", "strokeWidth", {
                hints: { rangeNumber: [0, 5] },
                defaultValue: 1,
                numberOptions: { showSlider: true, sliderRange: [0, 5], minimum: 0 }
            }));
        }
        widgets = widgets.concat([
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
        if (!attrs.visible || !this.object.properties.visible) {
            return null;
        }
        const paddingX = props.paddingX || 0;
        const paddingY = props.paddingY || 0;
        const alignX = props.alignX || "middle";
        const alignY = props.alignY || "middle";
        let image = attrs.image || exports.imagePlaceholder;
        if (typeof image == "string") {
            // Be compatible with old version
            image = { src: image, width: 100, height: 100 };
        }
        const helper = new Graphics.CoordinateSystemHelper(cs);
        const g = Graphics.makeGroup([]);
        // If fill color is specified, draw a background rect
        if (attrs.fill) {
            g.elements.push(helper.rect(attrs.x1 + offset.x, attrs.y1 + offset.y, attrs.x2 + offset.x, attrs.y2 + offset.y, {
                strokeColor: null,
                fillColor: attrs.fill
            }));
        }
        // Center in local coordiantes
        const cx = (attrs.x1 + attrs.x2) / 2;
        const cy = (attrs.y1 + attrs.y2) / 2;
        // Decide the width/height of the image area
        // For special coordinate systems, use the middle lines' length as width/height
        const containerWidth = common_1.Geometry.pointDistance(cs.transformPoint(attrs.x1 + offset.x, cy + offset.y), cs.transformPoint(attrs.x2 + offset.x, cy + offset.y));
        const containerHeight = common_1.Geometry.pointDistance(cs.transformPoint(cx + offset.x, attrs.y1 + offset.y), cs.transformPoint(cx + offset.x, attrs.y2 + offset.y));
        const boxWidth = Math.max(0, containerWidth - paddingX * 2);
        const boxHeight = Math.max(0, containerHeight - paddingY * 2);
        // Fit image into boxWidth x boxHeight, based on the specified option
        let imageWidth;
        let imageHeight;
        switch (props.imageMode) {
            case "stretch":
                {
                    imageWidth = boxWidth;
                    imageHeight = boxHeight;
                }
                break;
            case "letterbox":
            default:
                {
                    if (image.width / image.height > boxWidth / boxHeight) {
                        imageWidth = boxWidth;
                        imageHeight = (image.height / image.width) * boxWidth;
                    }
                    else {
                        imageHeight = boxHeight;
                        imageWidth = (image.width / image.height) * boxHeight;
                    }
                }
                break;
        }
        // Decide the anchor position (px, py) in local coordinates
        let px = cx;
        let py = cy;
        let imgX = -imageWidth / 2;
        let imgY = -imageHeight / 2;
        if (alignX == "start") {
            px = attrs.x1;
            imgX = paddingX;
        }
        else if (alignX == "end") {
            px = attrs.x2;
            imgX = -imageWidth - paddingX;
        }
        if (alignY == "start") {
            py = attrs.y1;
            imgY = paddingY;
        }
        else if (alignY == "end") {
            py = attrs.y2;
            imgY = -imageHeight - paddingY;
        }
        // Create the image element
        const gImage = Graphics.makeGroup([
            {
                type: "image",
                src: image.src,
                x: imgX,
                y: imgY,
                width: imageWidth,
                height: imageHeight,
                mode: "stretch"
            }
        ]);
        gImage.transform = cs.getLocalTransform(px + offset.x, py + offset.y);
        g.elements.push(gImage);
        // If stroke color is specified, stroke a foreground rect
        if (attrs.stroke) {
            g.elements.push(helper.rect(attrs.x1 + offset.x, attrs.y1 + offset.y, attrs.x2 + offset.x, attrs.y2 + offset.y, {
                strokeColor: attrs.stroke,
                strokeWidth: attrs.strokeWidth,
                strokeLinejoin: "miter",
                fillColor: null
            }));
        }
        // Apply the opacity
        g.style = {
            opacity: attrs.opacity
        };
        return g;
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
        if (this.object.mappings.strokeWidth &&
            this.object.mappings.strokeWidth.type === "value") {
            properties.push({
                objectID: this.object._id,
                target: {
                    attribute: "strokeWidth"
                },
                type: Specification.AttributeType.Number,
                default: this.state.attributes.strokeWidth
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
        if (this.object.mappings.visible &&
            this.object.mappings.visible.type === "value") {
            properties.push({
                objectID: this.object._id,
                target: {
                    attribute: "visible"
                },
                type: Specification.AttributeType.Number,
                default: this.state.attributes.visible
            });
        }
        if (this.object.mappings.image &&
            this.object.mappings.image.type === "value") {
            properties.push({
                objectID: this.object._id,
                target: {
                    attribute: "image"
                },
                type: Specification.AttributeType.Image,
                default: this.state.attributes.image.src
            });
        }
        if (this.object.mappings.fill &&
            this.object.mappings.fill.type === "value") {
            properties.push({
                objectID: this.object._id,
                target: {
                    attribute: "fill"
                },
                type: Specification.AttributeType.Color,
                default: common_1.rgbToHex(this.state.attributes.fill)
            });
        }
        if (this.object.mappings.stroke &&
            this.object.mappings.stroke.type === "value") {
            properties.push({
                objectID: this.object._id,
                target: {
                    attribute: "stroke"
                },
                type: Specification.AttributeType.Color,
                default: common_1.rgbToHex(this.state.attributes.stroke)
            });
        }
        return {
            properties
        };
    }
}
ImageElementClass.classID = "mark.image";
ImageElementClass.type = "mark";
ImageElementClass.metadata = {
    displayName: "Image",
    iconPath: "mark/image",
    creatingInteraction: {
        type: "rectangle",
        mapping: { xMin: "x1", yMin: "y1", xMax: "x2", yMax: "y2" }
    }
};
ImageElementClass.defaultProperties = {
    visible: true,
    imageMode: "letterbox",
    paddingX: 0,
    paddingY: 0,
    alignX: "middle",
    alignY: "middle"
};
ImageElementClass.defaultMappingValues = {
    strokeWidth: 1,
    opacity: 1,
    visible: true
};
exports.ImageElementClass = ImageElementClass;
//# sourceMappingURL=image.js.map