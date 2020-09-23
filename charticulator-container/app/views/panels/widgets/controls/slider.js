"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
const Hammer = require("hammerjs");
const React = require("react");
const utils_1 = require("../../../../utils");
class Slider extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentValue: props.defaultValue,
            dragging: false
        };
    }
    componentWillReceiveProps(props) {
        this.setState({
            currentValue: props.defaultValue
        });
    }
    niceValue(v) {
        const digits = Math.ceil(Math.log(this.props.max - this.props.min) / Math.log(10) + 2);
        v = parseFloat(v.toPrecision(digits));
        v = Math.min(this.props.max, Math.max(this.props.min, v));
        return v;
    }
    valueToRatio(v) {
        if (this.props.mapping == "sqrt") {
            return ((Math.sqrt(v) - Math.sqrt(this.props.min)) /
                (Math.sqrt(this.props.max) - Math.sqrt(this.props.min)));
        }
        else {
            return (v - this.props.min) / (this.props.max - this.props.min);
        }
    }
    ratioToValue(r) {
        if (this.props.mapping == "sqrt") {
            const f = r * (Math.sqrt(this.props.max) - Math.sqrt(this.props.min)) +
                Math.sqrt(this.props.min);
            return f * f;
        }
        else {
            return r * (this.props.max - this.props.min) + this.props.min;
        }
    }
    componentDidMount() {
        this.hammer = new Hammer(this.refs.svg);
        this.hammer.add(new Hammer.Pan({ threshold: 0 }));
        this.hammer.add(new Hammer.Tap());
        const margin = 13;
        this.hammer.on("panstart pan panend tap", e => {
            const left = this.refs.svg.getBoundingClientRect().left;
            const x = e.center.x - left;
            let pos = (x - margin) / (this.props.width - margin - margin);
            pos = Math.max(0, Math.min(1, pos));
            const value = this.niceValue(this.ratioToValue(pos));
            this.setState({
                currentValue: value
            });
            if (this.props.onChange) {
                if (e.type == "panend" || e.type == "tap") {
                    this.props.onChange(value, true);
                }
                else {
                    this.props.onChange(value, false);
                }
            }
            if (e.type == "panstart") {
                this.setState({
                    dragging: true
                });
            }
            if (e.type == "panend") {
                this.setState({
                    dragging: false
                });
            }
        });
    }
    componentWillUnmount() {
        this.hammer.destroy();
    }
    render() {
        const height = 24;
        const { min, max, width } = this.props;
        const margin = height / 2 + 1;
        const scale = (v) => this.valueToRatio(v) * (width - margin - margin) + margin;
        const y = height / 2;
        const px = scale(this.state.currentValue != null
            ? this.state.currentValue
            : (min + max) / 2);
        return (React.createElement("span", { className: "charticulator__widget-control-slider" },
            React.createElement("svg", { width: width, height: height, ref: "svg", className: utils_1.classNames(["invalid", this.state.currentValue == null], ["active", this.state.dragging]) },
                React.createElement("line", { className: "track", x1: margin, x2: width - margin, y1: y, y2: y }),
                React.createElement("line", { className: "track-highlight", x1: margin, x2: px, y1: y, y2: y }),
                React.createElement("circle", { className: "indicator", cx: px, cy: y, r: (height / 2) * 0.5 }))));
    }
}
exports.Slider = Slider;
//# sourceMappingURL=slider.js.map