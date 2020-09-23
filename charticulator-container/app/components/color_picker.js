"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const core_1 = require("../../core");
const resources_1 = require("../resources");
const utils_1 = require("../utils");
const controls_1 = require("../views/panels/widgets/controls");
const color_space_picker_1 = require("./color_space_picker");
const sRGB_to_HCL = core_1.getColorConverter("sRGB", "hcl");
const HCL_to_sRGB = core_1.getColorConverter("hcl", "sRGB");
function colorToCSS(color) {
    return `rgb(${color.r.toFixed(0)},${color.g.toFixed(0)},${color.b.toFixed(0)})`;
}
exports.colorToCSS = colorToCSS;
function HSVtoRGB(h, s, v) {
    h /= 360;
    s /= 100;
    v /= 100;
    let r, g, b, i, f, p, q, t;
    i = Math.floor(h * 6);
    f = h * 6 - i;
    p = v * (1 - s);
    q = v * (1 - f * s);
    t = v * (1 - (1 - f) * s);
    switch (i % 6) {
        case 0:
            (r = v), (g = t), (b = p);
            break;
        case 1:
            (r = q), (g = v), (b = p);
            break;
        case 2:
            (r = p), (g = v), (b = t);
            break;
        case 3:
            (r = p), (g = q), (b = v);
            break;
        case 4:
            (r = t), (g = p), (b = v);
            break;
        case 5:
            (r = v), (g = p), (b = q);
            break;
    }
    return [
        Math.max(0, Math.min(255, r * 255)),
        Math.max(0, Math.min(255, g * 255)),
        Math.max(0, Math.min(255, b * 255)),
        false
    ];
}
function RGBtoHSV(r, g, b) {
    const max = Math.max(r, g, b), min = Math.min(r, g, b), d = max - min, s = max === 0 ? 0 : d / max, v = max / 255;
    let h;
    switch (max) {
        case min:
            h = 0;
            break;
        case r:
            h = g - b + d * (g < b ? 6 : 0);
            h /= 6 * d;
            break;
        case g:
            h = b - r + d * 2;
            h /= 6 * d;
            break;
        case b:
            h = r - g + d * 4;
            h /= 6 * d;
            break;
    }
    return [h * 360, s * 100, v * 100];
}
class HSVColorPicker extends React.Component {
    render() {
        return (React.createElement(color_space_picker_1.ColorSpacePicker, Object.assign({}, this.props, { colorSpaces: HSVColorPicker.colorSpaces })));
    }
}
HSVColorPicker.colorSpaces = [
    {
        name: "Hue",
        description: "Saturation, Value | Hue",
        dimension1: { name: "Hue", range: [360, 0] },
        dimension2: { name: "Saturation", range: [0, 100] },
        dimension3: { name: "Value", range: [100, 0] },
        toRGB: HSVtoRGB,
        fromRGB: RGBtoHSV
    },
    {
        name: "Saturation",
        description: "Hue, Value | Saturation",
        dimension1: { name: "Saturation", range: [100, 0] },
        dimension2: { name: "Hue", range: [360, 0] },
        dimension3: { name: "Value", range: [100, 0] },
        toRGB: (x1, x2, x3) => HSVtoRGB(x2, x1, x3),
        fromRGB: (r, g, b) => {
            const [h, s, v] = RGBtoHSV(r, g, b);
            return [s, h, v];
        }
    },
    {
        name: "Value",
        description: "Hue, Saturation | Value",
        dimension1: { name: "Value", range: [100, 0] },
        dimension2: { name: "Hue", range: [360, 0] },
        dimension3: { name: "Saturation", range: [100, 0] },
        toRGB: (x1, x2, x3) => HSVtoRGB(x2, x3, x1),
        fromRGB: (r, g, b) => {
            const [h, s, v] = RGBtoHSV(r, g, b);
            return [v, h, s];
        }
    }
];
exports.HSVColorPicker = HSVColorPicker;
class HCLColorPicker extends React.Component {
    render() {
        return (React.createElement(color_space_picker_1.ColorSpacePicker, Object.assign({}, this.props, { colorSpaces: HCLColorPicker.colorSpaces })));
    }
}
HCLColorPicker.colorSpaces = [
    {
        name: "Lightness",
        description: "Hue, Chroma | Lightness",
        dimension1: { name: "Lightness", range: [100, 0] },
        dimension2: { name: "Hue", range: [0, 360] },
        dimension3: { name: "Chroma", range: [100, 0] },
        toRGB: (x1, x2, x3) => HCL_to_sRGB(x2, x3, x1),
        fromRGB: (r, g, b) => {
            const [h, c, l] = sRGB_to_HCL(r, g, b);
            return [l, h, c];
        }
    },
    {
        name: "Hue",
        description: "Chroma, Lightness | Hue",
        dimension1: { name: "Hue", range: [0, 360] },
        dimension2: { name: "Chroma", range: [0, 100] },
        dimension3: { name: "Lightness", range: [100, 0] },
        toRGB: (x1, x2, x3) => HCL_to_sRGB(x1, x2, x3),
        fromRGB: (r, g, b) => sRGB_to_HCL(r, g, b)
    },
    {
        name: "Chroma",
        description: "Hue, Lightness | Chroma",
        dimension1: { name: "Chroma", range: [100, 0] },
        dimension2: { name: "Hue", range: [0, 360] },
        dimension3: { name: "Lightness", range: [100, 0] },
        toRGB: (x1, x2, x3) => HCL_to_sRGB(x2, x1, x3),
        fromRGB: (r, g, b) => {
            const [h, c, l] = sRGB_to_HCL(r, g, b);
            return [c, h, l];
        }
    }
];
exports.HCLColorPicker = HCLColorPicker;
class ColorGrid extends React.PureComponent {
    render() {
        return (React.createElement("div", { className: "color-grid" }, this.props.colors.map((colors, index) => (React.createElement("div", { className: "color-row", key: `m${index}` }, colors.map((color, i) => (React.createElement("span", { key: `m${i}`, className: utils_1.classNames("color-item", [
                "active",
                this.props.defaultValue != null &&
                    colorToCSS(this.props.defaultValue) == colorToCSS(color)
            ]), onClick: () => {
                if (this.props.onClick) {
                    this.props.onClick(color);
                }
            } },
            React.createElement("span", { style: { backgroundColor: colorToCSS(color) } })))))))));
    }
}
exports.ColorGrid = ColorGrid;
class PaletteList extends React.PureComponent {
    render() {
        const palettes = this.props.palettes;
        const groups = [];
        const group2Index = new Map();
        for (const p of palettes) {
            const groupName = p.name.split("/")[0];
            let group;
            if (group2Index.has(groupName)) {
                group = groups[group2Index.get(groupName)][1];
            }
            else {
                group = [];
                group2Index.set(groupName, groups.length);
                groups.push([groupName, group]);
            }
            group.push(p);
        }
        return (React.createElement("ul", null, groups.map((group, index) => {
            return (React.createElement("li", { key: `m${index}` },
                React.createElement("div", { className: "label" }, group[0]),
                React.createElement("ul", null, group[1].map(x => (React.createElement("li", { key: x.name, className: utils_1.classNames("item", [
                        "active",
                        this.props.selected == x
                    ]), onClick: () => this.props.onClick(x) }, x.name.split("/")[1]))))));
        })));
    }
}
exports.PaletteList = PaletteList;
class ColorPicker extends React.Component {
    constructor(props) {
        super(props);
        if (this.props.defaultValue) {
            const colorCSS = colorToCSS(this.props.defaultValue);
            let matchedPalette = null;
            for (const p of resources_1.predefinedPalettes.filter(x => x.type == "palette")) {
                for (const g of p.colors) {
                    for (const c of g) {
                        if (colorToCSS(c) == colorCSS) {
                            matchedPalette = p;
                            break;
                        }
                    }
                    if (matchedPalette) {
                        break;
                    }
                }
                if (matchedPalette) {
                    break;
                }
            }
            if (matchedPalette) {
                this.state = {
                    currentPalette: matchedPalette,
                    currentPicker: null,
                    currentColor: this.props.defaultValue
                };
            }
            else {
                this.state = {
                    currentPalette: null,
                    currentPicker: "hcl",
                    currentColor: this.props.defaultValue
                };
            }
        }
        else {
            this.state = {
                currentPalette: resources_1.predefinedPalettes.filter(x => x.name == "Palette/ColorBrewer")[0],
                currentPicker: null
            };
        }
    }
    render() {
        return (React.createElement("div", { className: "color-picker" },
            React.createElement("section", { className: "color-picker-left" },
                React.createElement("div", { className: "color-picker-palettes-list" },
                    React.createElement("ul", null,
                        React.createElement("li", null,
                            React.createElement("div", { className: "label" }, "ColorPicker"),
                            React.createElement("ul", null,
                                React.createElement("li", { className: utils_1.classNames("item", [
                                        "active",
                                        this.state.currentPicker == "hcl"
                                    ]), onClick: () => {
                                        this.setState({
                                            currentPalette: null,
                                            currentPicker: "hcl"
                                        });
                                    } }, "HCL Picker"),
                                React.createElement("li", { className: utils_1.classNames("item", [
                                        "active",
                                        this.state.currentPicker == "hsv"
                                    ]), onClick: () => {
                                        this.setState({
                                            currentPalette: null,
                                            currentPicker: "hsv"
                                        });
                                    } }, "HSV Picker")))),
                    React.createElement(PaletteList, { palettes: resources_1.predefinedPalettes.filter(x => x.type == "palette"), selected: this.state.currentPalette, onClick: p => {
                            this.setState({ currentPalette: p, currentPicker: null });
                        } })),
                this.props.allowNull ? (React.createElement("div", { className: "color-picker-null" },
                    React.createElement(controls_1.Button, { text: "none", icon: "general/cross", onClick: () => {
                            this.setState({
                                currentColor: null
                            });
                            this.props.onPick(null);
                        } }))) : null),
            React.createElement("section", { className: "colors" },
                this.state.currentPalette != null ? (React.createElement(ColorGrid, { colors: this.state.currentPalette.colors, defaultValue: this.state.currentColor, onClick: c => {
                        this.props.onPick(c);
                        this.setState({ currentColor: c });
                    } })) : null,
                this.state.currentPicker == "hcl" ? (React.createElement(HCLColorPicker, { defaultValue: this.state.currentColor || { r: 0, g: 0, b: 0 }, onChange: c => {
                        this.props.onPick(c);
                        this.setState({ currentColor: c });
                    } })) : null,
                this.state.currentPicker == "hsv" ? (React.createElement(HSVColorPicker, { defaultValue: this.state.currentColor || { r: 0, g: 0, b: 0 }, onChange: c => {
                        this.props.onPick(c);
                        this.setState({ currentColor: c });
                    } })) : null)));
    }
}
exports.ColorPicker = ColorPicker;
//# sourceMappingURL=color_picker.js.map