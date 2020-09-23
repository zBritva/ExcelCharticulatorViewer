"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
Object.defineProperty(exports, "__esModule", { value: true });
const Hammer = require("hammerjs");
const React = require("react");
const core_1 = require("../../core");
const controls_1 = require("../views/panels/widgets/controls");
function clipToRange(num, range) {
    if (range[0] < range[1]) {
        return Math.max(range[0], Math.min(range[1], num));
    }
    else {
        return Math.max(range[1], Math.min(range[0], num));
    }
}
// A general three component color picker
class ColorSpacePicker extends React.Component {
    constructor(props) {
        super(props);
        this.pickerSize = 200;
        const defaultValue = props.defaultValue || { r: 0, g: 0, b: 0 };
        const [x1, x2, x3] = props.colorSpaces[0].fromRGB(defaultValue.r, defaultValue.g, defaultValue.b);
        this.state = {
            desc: props.colorSpaces[0],
            x1,
            x2,
            x3
        };
    }
    componentWillUpdate() { }
    reset() {
        const props = this.props;
        const defaultValue = props.defaultValue || { r: 0, g: 0, b: 0 };
        const [x1, x2, x3] = this.state.desc.fromRGB(defaultValue.r, defaultValue.g, defaultValue.b);
        this.setState({ x1, x2, x3 }, () => this.raiseChange());
    }
    raiseChange() {
        const currentColor = this.state.desc.toRGB(this.state.x1, this.state.x2, this.state.x3);
        const rgb = { r: currentColor[0], g: currentColor[1], b: currentColor[2] };
        if (this.props.onChange) {
            this.props.onChange(rgb);
        }
    }
    renderZ() {
        const width = 30;
        const height = this.pickerSize;
        const cWidth = 5;
        const cHeight = this.pickerSize * 2;
        const [x1Min, x1Max] = this.state.desc.dimension1.range;
        return (React.createElement(ZCanvas, { width: width, height: height, canvasWidth: cWidth, canvasHeight: cHeight, x1Offset: x1Min, x1StrideZ: x1Max - x1Min, x2Offset: this.state.x2, x2StrideZ: 0, x3Offset: this.state.x3, x3StrideZ: 0, pz: (this.state.x1 - x1Min) / (x1Max - x1Min), toRGB: this.state.desc.toRGB, onMove: (value, isEnd) => {
                this.setState({ x1: value * (x1Max - x1Min) + x1Min }, () => {
                    if (isEnd) {
                        this.raiseChange();
                    }
                });
            } }));
    }
    renderXY() {
        const width = this.pickerSize;
        const height = this.pickerSize;
        const cWidth = this.pickerSize;
        const cHeight = this.pickerSize;
        const [x2Min, x2Max] = this.state.desc.dimension2.range;
        const [x3Min, x3Max] = this.state.desc.dimension3.range;
        return (React.createElement(XYCanvas, { width: width, height: height, canvasWidth: cWidth, canvasHeight: cHeight, x1Offset: this.state.x1, x1StrideX: 0, x1StrideY: 0, x2Offset: x2Min, x2StrideX: x2Max - x2Min, x2StrideY: 0, x3Offset: x3Min, x3StrideX: 0, x3StrideY: x3Max - x3Min, px: (this.state.x2 - x2Min) / (x2Max - x2Min), py: (this.state.x3 - x3Min) / (x3Max - x3Min), toRGB: this.state.desc.toRGB, onMove: (v2, v3, isEnd) => {
                this.setState({
                    x2: v2 * (x2Max - x2Min) + x2Min,
                    x3: v3 * (x3Max - x3Min) + x3Min
                }, () => {
                    if (isEnd) {
                        this.raiseChange();
                    }
                });
            } }));
    }
    render() {
        const currentColor = this.state.desc.toRGB(this.state.x1, this.state.x2, this.state.x3);
        const rgb = { r: currentColor[0], g: currentColor[1], b: currentColor[2] };
        return (React.createElement("div", { className: "hcl-color-picker" },
            React.createElement("div", { className: "part-picker" },
                React.createElement("section", { className: "palette-xy" }, this.renderXY()),
                React.createElement("section", { className: "palette-z" }, this.renderZ()),
                React.createElement("section", { className: "values" },
                    React.createElement("div", { className: "row" },
                        React.createElement(controls_1.Select, { value: this.state.desc.name, showText: true, options: this.props.colorSpaces.map(x => x.name), labels: this.props.colorSpaces.map(x => x.description), onChange: v => {
                                for (const sp of this.props.colorSpaces) {
                                    if (sp.name == v) {
                                        const [r, g, b] = this.state.desc.toRGB(this.state.x1, this.state.x2, this.state.x3);
                                        const [x1, x2, x3] = sp.fromRGB(r, g, b);
                                        this.setState({ desc: sp, x1, x2, x3 });
                                    }
                                }
                            } })),
                    React.createElement("div", { className: "row" },
                        React.createElement("div", { className: "columns" },
                            React.createElement("div", { className: "column" },
                                React.createElement("span", { className: "current-color" },
                                    React.createElement("span", { style: { backgroundColor: core_1.colorToHTMLColor(rgb) } }))),
                            React.createElement("div", { className: "column" },
                                React.createElement("label", null, "HEX"),
                                React.createElement(InputField, { defaultValue: core_1.colorToHTMLColorHEX(rgb), onEnter: v => {
                                        const color = core_1.colorFromHTMLColor(v);
                                        if (color) {
                                            const [x1, x2, x3] = this.state.desc.fromRGB(color.r, color.g, color.b);
                                            this.setState({ x1, x2, x3 }, () => this.raiseChange());
                                            return true;
                                        }
                                    } })))),
                    React.createElement("div", { className: "columns" },
                        React.createElement("div", { className: "column" },
                            React.createElement("div", { className: "row" },
                                React.createElement("label", null, this.state.desc.dimension1.name),
                                React.createElement(InputField, { defaultValue: core_1.prettyNumber(this.state.x1, 1), onEnter: v => {
                                        let num = parseFloat(v);
                                        if (num == num && num != null) {
                                            num = clipToRange(num, this.state.desc.dimension1.range);
                                            this.setState({ x1: num }, () => this.raiseChange());
                                            return true;
                                        }
                                    } })),
                            React.createElement("div", { className: "row" },
                                React.createElement("label", null, this.state.desc.dimension2.name),
                                React.createElement(InputField, { defaultValue: core_1.prettyNumber(this.state.x2, 1), onEnter: v => {
                                        let num = parseFloat(v);
                                        if (num == num && num != null) {
                                            num = clipToRange(num, this.state.desc.dimension2.range);
                                            this.setState({ x2: num }, () => this.raiseChange());
                                            return true;
                                        }
                                    } })),
                            React.createElement("div", { className: "row" },
                                React.createElement("label", null, this.state.desc.dimension3.name),
                                React.createElement(InputField, { defaultValue: core_1.prettyNumber(this.state.x3, 1), onEnter: v => {
                                        let num = parseFloat(v);
                                        if (num == num && num != null) {
                                            num = clipToRange(num, this.state.desc.dimension3.range);
                                            this.setState({ x3: num }, () => this.raiseChange());
                                            return true;
                                        }
                                    } }))),
                        React.createElement("div", { className: "column" },
                            React.createElement("div", { className: "row" },
                                React.createElement("label", null, "R"),
                                React.createElement(InputField, { defaultValue: core_1.prettyNumber(rgb.r, 0), onEnter: v => {
                                        let num = parseFloat(v);
                                        if (num == num && num != null) {
                                            num = Math.max(0, Math.min(255, num));
                                            const [x1, x2, x3] = this.state.desc.fromRGB(num, rgb.g, rgb.b);
                                            this.setState({ x1, x2, x3 }, () => this.raiseChange());
                                            return true;
                                        }
                                    } })),
                            React.createElement("div", { className: "row" },
                                React.createElement("label", null, "G"),
                                React.createElement(InputField, { defaultValue: core_1.prettyNumber(rgb.g, 0), onEnter: v => {
                                        let num = parseFloat(v);
                                        if (num == num && num != null) {
                                            num = Math.max(0, Math.min(255, num));
                                            const [x1, x2, x3] = this.state.desc.fromRGB(rgb.r, num, rgb.b);
                                            this.setState({ x1, x2, x3 }, () => this.raiseChange());
                                            return true;
                                        }
                                    } })),
                            React.createElement("div", { className: "row" },
                                React.createElement("label", null, "B"),
                                React.createElement(InputField, { defaultValue: core_1.prettyNumber(rgb.b, 0), onEnter: v => {
                                        let num = parseFloat(v);
                                        if (num == num && num != null) {
                                            num = Math.max(0, Math.min(255, num));
                                            const [x1, x2, x3] = this.state.desc.fromRGB(rgb.r, rgb.g, num);
                                            this.setState({ x1, x2, x3 }, () => this.raiseChange());
                                            return true;
                                        }
                                    } }))))))));
    }
}
exports.ColorSpacePicker = ColorSpacePicker;
class InputField extends React.Component {
    componentWillUpdate(newProps) {
        this.inputElement.value = newProps.defaultValue;
    }
    doEnter() {
        if (this.props.defaultValue == this.inputElement.value) {
            return;
        }
        if (this.props.onEnter) {
            const ret = this.props.onEnter(this.inputElement.value);
            if (!ret) {
                this.inputElement.value = this.props.defaultValue;
            }
        }
        else {
            this.inputElement.value = this.props.defaultValue;
        }
    }
    doCancel() {
        this.inputElement.value = this.props.defaultValue;
    }
    get value() {
        return this.inputElement.value;
    }
    set value(v) {
        this.inputElement.value = v;
    }
    render() {
        return (React.createElement("input", { type: "text", ref: e => (this.inputElement = e), defaultValue: this.props.defaultValue, autoFocus: true, onKeyDown: e => {
                if (e.key == "Enter") {
                    this.doEnter();
                }
                if (e.key == "Escape") {
                    this.doCancel();
                }
            }, onFocus: e => {
                e.currentTarget.select();
            }, onBlur: () => {
                this.doEnter();
            } }));
    }
}
exports.InputField = InputField;
class XYCanvas extends React.PureComponent {
    componentDidMount() {
        this.renderCanvas();
        this.hammer = new Hammer(this.refs.canvasElement);
        this.hammer.add(new Hammer.Pan({ threshold: 0 }));
        this.hammer.add(new Hammer.Tap());
        this.hammer.on("panstart tap pan panend", e => {
            const bounds = this.refs.canvasElement.getBoundingClientRect();
            let x = e.center.x - bounds.left;
            let y = e.center.y - bounds.top;
            x /= this.props.width;
            y /= this.props.height;
            const isEnd = e.type == "tap" || e.type == "panend";
            x = Math.max(0, Math.min(1, x));
            y = Math.max(0, Math.min(1, y));
            this.props.onMove(x, y, isEnd);
        });
    }
    componentWillUnmount() {
        this.hammer.destroy();
        this.hammer = null;
    }
    componentDidUpdate() {
        this.renderCanvas();
    }
    renderCanvas() {
        const canvas = this.refs.canvasElement;
        const width = canvas.width;
        const height = canvas.height;
        const ctx = canvas.getContext("2d");
        setTimeout(() => {
            const data = ctx.getImageData(0, 0, width, height);
            const { x1Offset, x2Offset, x3Offset } = this.props;
            let { x1StrideX, x1StrideY } = this.props;
            let { x2StrideX, x2StrideY } = this.props;
            let { x3StrideX, x3StrideY } = this.props;
            x1StrideX /= data.width - 1;
            x2StrideX /= data.width - 1;
            x3StrideX /= data.width - 1;
            x1StrideY /= data.height - 1;
            x2StrideY /= data.height - 1;
            x3StrideY /= data.height - 1;
            let ptr = 0;
            for (let j = 0; j < data.height; j++) {
                const th = x1Offset + j * x1StrideY;
                const tc = x2Offset + j * x2StrideY;
                const tl = x3Offset + j * x3StrideY;
                for (let i = 0; i < data.width; i++) {
                    const color = this.props.toRGB(th + i * x1StrideX, tc + i * x2StrideX, tl + i * x3StrideX);
                    data.data[ptr++] = color[0];
                    data.data[ptr++] = color[1];
                    data.data[ptr++] = color[2];
                    data.data[ptr++] = color[3] ? 128 : 255;
                }
            }
            ctx.putImageData(data, 0, 0);
        }, 0);
    }
    render() {
        const { width, height, canvasWidth, canvasHeight, px, py } = this.props;
        const x = px * (width - 1) + 0.5;
        const y = py * (height - 1) + 0.5;
        return (React.createElement("div", { className: "canvas-xy" },
            React.createElement("div", { className: "canvas-container", style: { padding: "2px 2px" } },
                React.createElement("canvas", { ref: "canvasElement", width: canvasWidth, height: canvasHeight, style: { width: width + "px", height: height + "px" } })),
            React.createElement("svg", { width: width + 4, height: height + 4 },
                React.createElement("g", { transform: "translate(2, 2)" },
                    React.createElement("circle", { className: "bg", cx: x, cy: y, r: 5 }),
                    React.createElement("circle", { className: "fg", cx: x, cy: y, r: 5 })))));
    }
}
class ZCanvas extends React.PureComponent {
    constructor(props) {
        super(props);
    }
    componentDidMount() {
        this.renderCanvas();
        this.hammer = new Hammer(this.refs.canvasElement);
        this.hammer.add(new Hammer.Pan({ threshold: 0 }));
        this.hammer.add(new Hammer.Tap());
        this.hammer.on("panstart tap pan panend", e => {
            const bounds = this.refs.canvasElement.getBoundingClientRect();
            let y = e.center.y - bounds.top;
            y /= this.props.height;
            const isEnd = e.type == "tap" || e.type == "panend";
            y = Math.max(0, Math.min(1, y));
            this.props.onMove(y, isEnd);
        });
    }
    componentWillUnmount() {
        this.hammer.destroy();
        this.hammer = null;
    }
    componentDidUpdate() {
        this.renderCanvas();
    }
    renderCanvas() {
        const canvas = this.refs.canvasElement;
        const width = canvas.width;
        const height = canvas.height;
        const ctx = canvas.getContext("2d");
        setTimeout(() => {
            const data = ctx.getImageData(0, 0, width, height);
            const { x1Offset, x2Offset, x3Offset } = this.props;
            let { x1StrideZ, x2StrideZ, x3StrideZ } = this.props;
            x1StrideZ /= data.height - 1;
            x2StrideZ /= data.height - 1;
            x3StrideZ /= data.height - 1;
            let ptr = 0;
            for (let j = 0; j < data.height; j++) {
                const th = x1Offset + j * x1StrideZ;
                const tc = x2Offset + j * x2StrideZ;
                const tl = x3Offset + j * x3StrideZ;
                const color = this.props.toRGB(th, tc, tl);
                for (let i = 0; i < data.width; i++) {
                    data.data[ptr++] = color[0];
                    data.data[ptr++] = color[1];
                    data.data[ptr++] = color[2];
                    data.data[ptr++] = color[3] ? 128 : 255;
                }
            }
            ctx.putImageData(data, 0, 0);
        }, 0);
    }
    render() {
        const { width, height, canvasWidth, canvasHeight, pz } = this.props;
        const z = pz * (height - 1) + 0.5;
        return (React.createElement("div", { className: "canvas-z" },
            React.createElement("div", { className: "canvas-container", style: { padding: "2px 2px" } },
                React.createElement("canvas", { ref: "canvasElement", width: canvasWidth, height: canvasHeight, style: { width: width + "px", height: height + "px" } })),
            React.createElement("svg", { width: width + 4, height: height + 4 },
                React.createElement("g", { transform: "translate(2, 2)" },
                    React.createElement("rect", { className: "bg", x: 0, y: z - 2, width: 30, height: 4 }),
                    React.createElement("rect", { className: "fg", x: 0, y: z - 2, width: 30, height: 4 })))));
    }
}
//# sourceMappingURL=color_space_picker.js.map