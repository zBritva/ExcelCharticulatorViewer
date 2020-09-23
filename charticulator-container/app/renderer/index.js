"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
const React = require("react");
const core_1 = require("../../core");
const utils_1 = require("../utils");
const chart_component_1 = require("../../container/chart_component");
// adapted from https://stackoverflow.com/a/20820649
function desaturate(color, amount) {
    const { r, g, b } = color;
    const l = 0.3 * r + 0.6 * g + 0.1 * b;
    return {
        r: Math.min(r + amount * (l - r), 255),
        g: Math.min(g + amount * (l - g), 255),
        b: Math.min(b + amount * (l - b), 255)
    };
}
const srgb2lab = core_1.getColorConverter("sRGB", "lab");
const lab2srgb = core_1.getColorConverter("lab", "sRGB");
function modifyNumber(value, modifier) {
    if (modifier.set != null) {
        return modifier.set;
    }
    else {
        if (modifier.multiply != null) {
            value *= modifier.multiply;
        }
        if (modifier.add != null) {
            value += modifier.add;
        }
        if (modifier.pow != null) {
            value = Math.pow(value, modifier.pow);
        }
        return value;
    }
}
function applyColorFilter(color, colorFilter) {
    let [L, A, B] = srgb2lab(color.r, color.g, color.b);
    if (colorFilter.saturation) {
        const s = Math.sqrt(A * A + B * B);
        const sPrime = modifyNumber(s, colorFilter.saturation);
        if (s == 0) {
            A = 0;
            B = 0;
        }
        else {
            A *= sPrime / s;
            B *= sPrime / s;
        }
    }
    if (colorFilter.lightness) {
        L = modifyNumber(L / 100, colorFilter.lightness) * 100;
    }
    const [r, g, b] = lab2srgb(L, A, B);
    return { r, g, b };
}
exports.applyColorFilter = applyColorFilter;
/** Coverts {@Color} to `rgb(r,g,b)` string. Or coverts `#RRGGBB` fromat to `rgb(r,g,b)`}
 * @param color {@Color} object or color string in HEX format (`#RRGGBB`)
 */
function renderColor(color, colorFilter) {
    if (!color) {
        return `rgb(0,0,0)`;
    }
    if (typeof color === "string") {
        color = core_1.hexToRgb(color);
    }
    if (typeof color === "object") {
        if (colorFilter) {
            color = applyColorFilter(color, colorFilter);
        }
        return `rgb(${color.r.toFixed(0)},${color.g.toFixed(0)},${color.b.toFixed(0)})`;
    }
}
exports.renderColor = renderColor;
function renderStyle(style) {
    if (style == null) {
        return {};
    }
    return {
        stroke: style.strokeColor
            ? renderColor(style.strokeColor, style.colorFilter)
            : "none",
        strokeOpacity: style.strokeOpacity != undefined ? style.strokeOpacity : 1,
        strokeWidth: style.strokeWidth != undefined ? style.strokeWidth : 1,
        strokeLinecap: style.strokeLinecap != undefined ? style.strokeLinecap : "round",
        strokeLinejoin: style.strokeLinejoin != undefined ? style.strokeLinejoin : "round",
        fill: style.fillColor
            ? renderColor(style.fillColor, style.colorFilter)
            : "none",
        fillOpacity: style.fillOpacity != undefined ? style.fillOpacity : 1,
        textAnchor: style.textAnchor != undefined ? style.textAnchor : "start",
        opacity: style.opacity != undefined ? style.opacity : 1,
        strokeDasharray: style.strokeDasharray != undefined ? style.strokeDasharray : null
    };
}
exports.renderStyle = renderStyle;
const path_commands = {
    M: (args) => `M ${utils_1.toSVGNumber(args[0])},${utils_1.toSVGNumber(-args[1])}`,
    L: (args) => `L ${utils_1.toSVGNumber(args[0])},${utils_1.toSVGNumber(-args[1])}`,
    C: (args) => `C ${utils_1.toSVGNumber(args[0])},${utils_1.toSVGNumber(-args[1])},${utils_1.toSVGNumber(args[2])},${utils_1.toSVGNumber(-args[3])},${utils_1.toSVGNumber(args[4])},${utils_1.toSVGNumber(-args[5])}`,
    Q: (args) => `Q ${utils_1.toSVGNumber(args[0])},${utils_1.toSVGNumber(-args[1])},${utils_1.toSVGNumber(args[2])},${utils_1.toSVGNumber(-args[3])}`,
    A: (args) => `A ${utils_1.toSVGNumber(args[0])},${utils_1.toSVGNumber(args[1])},${utils_1.toSVGNumber(args[2])},${utils_1.toSVGNumber(args[3])},${utils_1.toSVGNumber(args[4])},${utils_1.toSVGNumber(args[5])},${utils_1.toSVGNumber(-args[6])}`,
    Z: () => `Z`
};
function renderSVGPath(cmds) {
    return cmds.map(x => path_commands[x.cmd](x.args)).join(" ");
}
exports.renderSVGPath = renderSVGPath;
function renderTransform(transform) {
    if (!transform) {
        return null;
    }
    if (Math.abs(transform.angle) < 1e-7) {
        return `translate(${utils_1.toSVGNumber(transform.x)},${utils_1.toSVGNumber(-transform.y)})`;
    }
    else {
        return `translate(${utils_1.toSVGNumber(transform.x)},${utils_1.toSVGNumber(-transform.y)}) rotate(${utils_1.toSVGNumber(-transform.angle)})`;
    }
}
exports.renderTransform = renderTransform;
class TextOnPath extends React.PureComponent {
    constructor() {
        super(...arguments);
        this.pathID = core_1.uniqueID();
    }
    render() {
        return (React.createElement("g", null,
            React.createElement("defs", null,
                React.createElement("path", { id: this.pathID, fill: "none", stroke: "red", d: renderSVGPath(this.props.cmds) })),
            React.createElement("text", { style: Object.assign({}, this.props.style, { textAnchor: this.props.align }) },
                React.createElement("textPath", { href: `#${this.pathID}`, startOffset: this.props.align == "start"
                        ? "0%"
                        : this.props.align == "middle"
                            ? "50%"
                            : "100%" }, this.props.text))));
    }
}
function renderGraphicalElementSVG(element, options) {
    if (!element) {
        return null;
    }
    if (!options) {
        options = {};
    }
    const style = options.noStyle
        ? null
        : renderStyle(options.styleOverride || element.style);
    // OnClick event handler
    const mouseEvents = {};
    if (element.selectable) {
        style.cursor = "pointer";
        style.pointerEvents = "all";
        if (options.onClick) {
            mouseEvents.onClick = (e) => {
                e.stopPropagation();
                options.onClick(element.selectable, e.nativeEvent);
            };
        }
        if (options.onMouseEnter) {
            mouseEvents.onMouseEnter = (e) => {
                options.onMouseEnter(element.selectable, e.nativeEvent);
            };
        }
        if (options.onMouseLeave) {
            mouseEvents.onMouseLeave = (e) => {
                options.onMouseLeave(element.selectable, e.nativeEvent);
            };
        }
        if (options.onContextMenu) {
            mouseEvents.onContextMenu = (e) => {
                e.stopPropagation();
                options.onContextMenu(element.selectable, e.nativeEvent);
            };
        }
    }
    switch (element.type) {
        case "rect": {
            const rect = element;
            return (React.createElement("rect", Object.assign({ key: options.key }, mouseEvents, { className: options.className || null, style: style, x: Math.min(rect.x1, rect.x2), y: -Math.max(rect.y1, rect.y2), width: Math.abs(rect.x1 - rect.x2), height: Math.abs(rect.y1 - rect.y2) })));
        }
        case "circle": {
            const circle = element;
            return (React.createElement("circle", Object.assign({ key: options.key }, mouseEvents, { className: options.className || null, style: style, cx: circle.cx, cy: -circle.cy, r: circle.r })));
        }
        case "ellipse": {
            const ellipse = element;
            return (React.createElement("ellipse", Object.assign({ key: options.key }, mouseEvents, { className: options.className || null, style: style, cx: (ellipse.x1 + ellipse.x2) / 2, cy: -(ellipse.y1 + ellipse.y2) / 2, rx: Math.abs(ellipse.x1 - ellipse.x2) / 2, ry: Math.abs(ellipse.y1 - ellipse.y2) / 2 })));
        }
        case "line": {
            const line = element;
            return (React.createElement("line", Object.assign({ key: options.key }, mouseEvents, { className: options.className || null, style: style, x1: line.x1, y1: -line.y1, x2: line.x2, y2: -line.y2 })));
        }
        case "polygon": {
            const polygon = element;
            return (React.createElement("polygon", Object.assign({ key: options.key }, mouseEvents, { className: options.className || null, style: style, points: polygon.points
                    .map(p => `${utils_1.toSVGNumber(p.x)},${utils_1.toSVGNumber(-p.y)}`)
                    .join(" ") })));
        }
        case "path": {
            const path = element;
            const d = renderSVGPath(path.cmds);
            return (React.createElement("path", Object.assign({ key: options.key }, mouseEvents, { className: options.className || null, style: style, d: d })));
        }
        case "text-on-path": {
            const text = element;
            style.fontFamily = text.fontFamily;
            style.fontSize = text.fontSize + "px";
            console.log(text);
            return (React.createElement(TextOnPath, { text: text.text, style: style, cmds: text.pathCmds, align: text.align }));
        }
        case "text": {
            const text = element;
            style.fontFamily = text.fontFamily;
            style.fontSize = text.fontSize + "px";
            if (style.stroke != "none") {
                const style2 = core_1.shallowClone(style);
                style2.fill = style.stroke;
                const e1 = (React.createElement("text", Object.assign({}, mouseEvents, { className: options.className || null, style: style2, x: text.cx, y: -text.cy }), text.text));
                style.stroke = "none";
                const e2 = (React.createElement("text", Object.assign({}, mouseEvents, { className: options.className || null, style: style, x: text.cx, y: -text.cy }), text.text));
                return (React.createElement("g", { key: options.key },
                    e1,
                    e2));
            }
            else {
                return (React.createElement("text", Object.assign({ key: options.key }, mouseEvents, { className: options.className || null, style: style, x: text.cx, y: -text.cy }), text.text));
            }
        }
        case "image": {
            const image = element;
            let preserveAspectRatio = null;
            switch (image.mode) {
                case "letterbox":
                    preserveAspectRatio = "meet";
                    break;
                case "stretch":
                    preserveAspectRatio = "none";
                    break;
            }
            return (React.createElement("image", Object.assign({ key: options.key }, mouseEvents, { className: options.className || null, style: style, preserveAspectRatio: preserveAspectRatio, xlinkHref: options.externalResourceResolver
                    ? options.externalResourceResolver(image.src)
                    : image.src, x: image.x, y: -image.y - image.height, width: image.width, height: image.height })));
        }
        case "chart-container": {
            const component = element;
            const subSelection = options.selection
                ? {
                    isSelected: (table, rowIndices) => {
                        // Get parent row indices from component row indices
                        const parentRowIndices = rowIndices.map(x => component.selectable.rowIndices[x]);
                        // Query the selection with parent row indices
                        return options.selection.isSelected(component.selectable.plotSegment.table, parentRowIndices);
                    }
                }
                : null;
            const convertEventHandler = (handler) => {
                if (!handler) {
                    return null;
                }
                return (s, parameters) => {
                    if (s == null) {
                        // Clicked inside the ChartComponent but not on a glyph,
                        // in this case we select the whole thing
                        handler(component.selectable, parameters);
                    }
                    else {
                        // Clicked on a glyph of ChartComponent (or a sub-component)
                        // in this case we translate the component's rowIndices its parent's
                        handler({
                            plotSegment: component.selectable.plotSegment,
                            glyphIndex: component.selectable.glyphIndex,
                            rowIndices: s.rowIndices.map(i => component.selectable.rowIndices[i])
                        }, parameters);
                    }
                };
            };
            return (React.createElement(chart_component_1.ChartComponent, { key: options.key, chart: component.chart, dataset: component.dataset, width: component.width, height: component.height, rootElement: "g", sync: options.chartComponentSync, selection: subSelection, onGlyphClick: convertEventHandler(options.onClick), onGlyphMouseEnter: convertEventHandler(options.onMouseEnter), onGlyphMouseLeave: convertEventHandler(options.onMouseLeave), rendererOptions: {
                    chartComponentSync: options.chartComponentSync,
                    externalResourceResolver: options.externalResourceResolver
                } }));
        }
        case "group": {
            const group = element;
            return (React.createElement("g", Object.assign({ transform: renderTransform(group.transform), key: group.key || options.key, style: {
                    opacity: group.style && group.style.opacity != null
                        ? group.style.opacity
                        : 1
                } }, mouseEvents), group.elements.map((x, index) => {
                return renderGraphicalElementSVG(x, {
                    key: `m${index}`,
                    chartComponentSync: options.chartComponentSync,
                    externalResourceResolver: options.externalResourceResolver,
                    onClick: options.onClick,
                    onMouseEnter: options.onMouseEnter,
                    onMouseLeave: options.onMouseLeave,
                    onContextMenu: options.onContextMenu,
                    selection: options.selection
                });
            })));
        }
    }
}
exports.renderGraphicalElementSVG = renderGraphicalElementSVG;
class GraphicalElementDisplay extends React.PureComponent {
    render() {
        return renderGraphicalElementSVG(this.props.element);
    }
}
exports.GraphicalElementDisplay = GraphicalElementDisplay;
//# sourceMappingURL=index.js.map