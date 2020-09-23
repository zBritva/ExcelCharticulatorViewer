"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("../../common");
const Graphics = require("../../graphics");
const Specification = require("../../specification");
const chart_element_1 = require("../chart_element");
const common_2 = require("../common");
const axis_1 = require("../plot_segments/axis");
class LegendClass extends chart_element_1.ChartElementClass {
    constructor() {
        super(...arguments);
        this.attributeNames = ["x", "y"];
        this.attributes = {
            x: {
                name: "x",
                type: Specification.AttributeType.Number
            },
            y: {
                name: "y",
                type: Specification.AttributeType.Number
            }
        };
    }
    initializeState() {
        const attrs = this.state.attributes;
        attrs.x = 0;
        attrs.y = 0;
    }
    getLayoutBox() {
        const { x, y } = this.state.attributes;
        const [width, height] = this.getLegendSize();
        let x1, y1, x2, y2;
        switch (this.object.properties.alignX) {
            case "start":
                x1 = x;
                x2 = x + width;
                break;
            case "middle":
                x1 = x - width / 2;
                x2 = x + width / 2;
                break;
            case "end":
                x1 = x - width;
                x2 = x;
                break;
        }
        switch (this.object.properties.alignY) {
            case "start":
                y1 = y;
                y2 = y + height;
                break;
            case "middle":
                y1 = y - height / 2;
                y2 = y + height / 2;
                break;
            case "end":
                y1 = y - height;
                y2 = y;
                break;
        }
        return { x1, y1, x2, y2 };
    }
    getBoundingBox() {
        const attrs = this.state.attributes;
        const { x1, y1, x2, y2 } = this.getLayoutBox();
        return {
            type: "rectangle",
            cx: (x1 + x2) / 2,
            cy: (y1 + y2) / 2,
            width: Math.abs(x2 - x1),
            height: Math.abs(y2 - y1),
            rotation: 0
        };
    }
    getHandles() {
        const attrs = this.state.attributes;
        const { x, y } = attrs;
        return [
            {
                type: "point",
                x,
                y,
                actions: [
                    { type: "attribute", source: "x", attribute: "x" },
                    { type: "attribute", source: "y", attribute: "y" }
                ]
            }
        ];
    }
    getScale() {
        const scale = this.object.properties.scale;
        const scaleIndex = common_1.indexOf(this.parent.object.scales, x => x._id == scale);
        if (scaleIndex >= 0) {
            return [
                this.parent.object.scales[scaleIndex],
                this.parent.state.scales[scaleIndex]
            ];
        }
        else {
            return null;
        }
    }
    getLegendSize() {
        return [10, 10];
    }
    getAttributePanelWidgets(manager) {
        const props = this.object.properties;
        return [
            manager.sectionHeader("Alignment"),
            manager.row("Horizontal", manager.inputSelect({ property: "alignX" }, {
                type: "radio",
                icons: ["align/left", "align/x-middle", "align/right"],
                labels: ["Left", "Middle", "Right"],
                options: ["start", "middle", "end"]
            })),
            manager.row("Vertical", manager.inputSelect({ property: "alignY" }, {
                type: "radio",
                icons: ["align/top", "align/y-middle", "align/bottom"],
                labels: ["Top", "Middle", "Bottom"],
                options: ["end", "middle", "start"]
            })),
            manager.sectionHeader("Labels"),
            manager.row("Font", manager.inputFontFamily({ property: "fontFamily" })),
            manager.row("Size", manager.inputNumber({ property: "fontSize" }, { showUpdown: true, updownStyle: "font", updownTick: 2 })),
            manager.row("Color", manager.inputColor({ property: "textColor" }))
        ];
    }
    getTemplateParameters() {
        return {
            properties: [
                {
                    objectID: this.object._id,
                    target: {
                        property: "fontFamily"
                    },
                    type: Specification.AttributeType.FontFamily,
                    default: this.object.properties.fontFamily
                },
                {
                    objectID: this.object._id,
                    target: {
                        property: "fontSize"
                    },
                    type: Specification.AttributeType.Number,
                    default: this.object.properties.fontSize
                },
                {
                    objectID: this.object._id,
                    target: {
                        property: "textColor"
                    },
                    type: Specification.AttributeType.Color,
                    default: common_1.rgbToHex(this.object.properties.textColor)
                },
                {
                    objectID: this.object._id,
                    target: {
                        property: "alignY"
                    },
                    type: Specification.AttributeType.Enum,
                    default: this.object.properties.alignY
                },
                {
                    objectID: this.object._id,
                    target: {
                        property: "alignX"
                    },
                    type: Specification.AttributeType.Enum,
                    default: this.object.properties.alignX
                }
            ]
        };
    }
}
LegendClass.metadata = {
    displayName: "Legend",
    iconPath: "legend/legend"
};
LegendClass.defaultProperties = {
    visible: true,
    alignX: "start",
    alignY: "end",
    fontFamily: "Arial",
    fontSize: 14,
    textColor: { r: 0, g: 0, b: 0 }
};
exports.LegendClass = LegendClass;
class CategoricalLegendClass extends LegendClass {
    constructor() {
        super(...arguments);
        this.textMeasure = new Graphics.TextMeasurer();
    }
    getLegendItems() {
        const scale = this.getScale();
        if (scale) {
            const [scaleObject, scaleState] = scale;
            const mapping = scaleObject.properties.mapping;
            const items = [];
            for (const key in mapping) {
                if (mapping.hasOwnProperty(key)) {
                    switch (scaleObject.classID) {
                        case "scale.categorical<string,boolean>":
                            {
                                items.push({
                                    type: "boolean",
                                    label: key,
                                    value: mapping[key]
                                });
                            }
                            break;
                        case "scale.categorical<string,number>":
                            {
                                items.push({ type: "number", label: key, value: mapping[key] });
                            }
                            break;
                        case "scale.categorical<string,color>":
                            {
                                items.push({ type: "color", label: key, value: mapping[key] });
                            }
                            break;
                    }
                }
            }
            items.sort((a, b) => (a.label < b.label ? -1 : 1));
            return items;
        }
        else {
            return [];
        }
    }
    getLineHeight() {
        return this.object.properties.fontSize + 10;
    }
    getLegendSize() {
        const items = this.getLegendItems();
        return [100, items.length * this.getLineHeight()];
    }
    getGraphics() {
        const fontFamily = this.object.properties.fontFamily;
        const fontSize = this.object.properties.fontSize;
        const lineHeight = this.getLineHeight();
        this.textMeasure.setFontFamily(fontFamily);
        this.textMeasure.setFontSize(fontSize);
        const g = Graphics.makeGroup([]);
        const items = this.getLegendItems();
        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            const metrics = this.textMeasure.measure(item.label);
            const offsets = Graphics.TextMeasurer.ComputeTextPosition(lineHeight, lineHeight / 2, metrics, "left", "middle", 5, 0);
            const textLabel = Graphics.makeText(offsets[0], offsets[1], item.label, fontFamily, fontSize, { fillColor: this.object.properties.textColor });
            const gItem = Graphics.makeGroup([textLabel]);
            switch (item.type) {
                case "color":
                    {
                        gItem.elements.push(Graphics.makeRect(8, 4, lineHeight, lineHeight - 4, {
                            fillColor: item.value
                        }));
                    }
                    break;
            }
            gItem.transform = {
                x: 0,
                y: lineHeight * (items.length - 1 - i),
                angle: 0
            };
            g.elements.push(gItem);
        }
        const { x1, y1 } = this.getLayoutBox();
        g.transform = { x: x1, y: y1, angle: 0 };
        return g;
    }
}
CategoricalLegendClass.classID = "legend.categorical";
CategoricalLegendClass.type = "legend";
exports.CategoricalLegendClass = CategoricalLegendClass;
class NumericalColorLegendClass extends LegendClass {
    getLegendSize() {
        return [100, 100];
    }
    getGraphics() {
        const height = this.getLegendSize()[1];
        const marginLeft = 5;
        const gradientWidth = 12;
        const scale = this.getScale();
        if (!scale) {
            return null;
        }
        const range = scale[0].properties
            .range;
        const domainMin = scale[0].properties.domainMin;
        const domainMax = scale[0].properties.domainMax;
        const axisRenderer = new axis_1.AxisRenderer();
        axisRenderer.setLinearScale(domainMin, domainMax, 0, height, null);
        axisRenderer.setStyle({
            tickColor: this.object.properties.textColor,
            fontSize: this.object.properties.fontSize,
            fontFamily: this.object.properties.fontFamily,
            lineColor: this.object.properties.textColor
        });
        const g = Graphics.makeGroup([]);
        g.elements.push(axisRenderer.renderLine(marginLeft + gradientWidth + 2, 0, 90, 1));
        const ticks = height * 2;
        const interp = common_1.interpolateColors(range.colors, range.colorspace);
        for (let i = 0; i < ticks; i++) {
            const t = (i + 0.5) / ticks;
            const color = interp(t);
            const y1 = (i / ticks) * height;
            const y2 = Math.min(height, ((i + 1.5) / ticks) * height);
            g.elements.push(Graphics.makeRect(marginLeft, y1, marginLeft + gradientWidth, y2, {
                fillColor: color
            }));
        }
        const { x1, y1 } = this.getLayoutBox();
        g.transform = { x: x1, y: y1, angle: 0 };
        return g;
    }
}
NumericalColorLegendClass.classID = "legend.numerical-color";
NumericalColorLegendClass.type = "legend";
exports.NumericalColorLegendClass = NumericalColorLegendClass;
class NumericalNumberLegendClass extends chart_element_1.ChartElementClass {
    constructor() {
        super(...arguments);
        this.attributeNames = ["x1", "y1", "x2", "y2"];
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
        attrs.x1 = 0;
        attrs.y1 = 0;
        attrs.x2 = 0;
        attrs.y2 = 0;
    }
    getScale() {
        const scale = this.object.properties.scale;
        const scaleIndex = common_1.indexOf(this.parent.object.scales, x => x._id == scale);
        if (scaleIndex >= 0) {
            return [
                this.parent.object.scales[scaleIndex],
                this.parent.state.scales[scaleIndex]
            ];
        }
        else {
            return null;
        }
    }
    getBoundingBox() {
        return {
            type: "line",
            x1: this.state.attributes.x1,
            y1: this.state.attributes.y1,
            x2: this.state.attributes.x2,
            y2: this.state.attributes.y2
        };
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
    getGraphics() {
        const scale = this.getScale();
        if (!scale) {
            return null;
        }
        if (!this.object.properties.axis.visible) {
            return null;
        }
        const rangeMin = scale[1].attributes.rangeMin;
        const rangeMax = scale[1].attributes.rangeMax;
        const domainMin = scale[0].properties.domainMin;
        const domainMax = scale[0].properties.domainMax;
        const dx = this.state.attributes.x2 -
            this.state.attributes.x1;
        const dy = this.state.attributes.y2 -
            this.state.attributes.y1;
        const length = Math.sqrt(dx * dx + dy * dy);
        const renderer = new axis_1.AxisRenderer();
        // Extend/shrink range, and update the domain accordingly. Keep the scaling factor.
        const scaling = (rangeMax - rangeMin) / (domainMax - domainMin);
        renderer.setLinearScale(domainMin, domainMin + (length - rangeMin) / scaling, rangeMin, length, null);
        renderer.setStyle(this.object.properties.axis.style);
        return renderer.renderLine(this.state.attributes.x1, this.state.attributes.y1, (Math.atan2(dy, dx) / Math.PI) * 180, -1);
    }
    getAttributePanelWidgets(manager) {
        const props = this.object.properties;
        return [
            manager.sectionHeader("Axis"),
            axis_1.buildAxisAppearanceWidgets(props.axis.visible, "axis", manager)
        ];
    }
}
NumericalNumberLegendClass.classID = "legend.numerical-number";
NumericalNumberLegendClass.type = "legend";
NumericalNumberLegendClass.metadata = {
    displayName: "Legend",
    iconPath: "legend/legend"
};
NumericalNumberLegendClass.defaultProperties = {
    visible: true,
    axis: {
        side: "default",
        visible: true,
        style: common_1.deepClone(axis_1.defaultAxisStyle)
    }
};
exports.NumericalNumberLegendClass = NumericalNumberLegendClass;
function registerClasses() {
    common_2.ObjectClasses.Register(CategoricalLegendClass);
    common_2.ObjectClasses.Register(NumericalColorLegendClass);
    common_2.ObjectClasses.Register(NumericalNumberLegendClass);
}
exports.registerClasses = registerClasses;
//# sourceMappingURL=index.js.map