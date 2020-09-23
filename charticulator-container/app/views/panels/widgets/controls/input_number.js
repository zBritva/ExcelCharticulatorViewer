"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
const React = require("react");
const core_1 = require("../../../../../core");
const button_1 = require("./button");
const input_text_1 = require("./input_text");
const slider_1 = require("./slider");
class InputNumber extends React.Component {
    formatNumber(value) {
        if (value == null) {
            return "";
        }
        if (value != value) {
            return "N/A";
        }
        if (this.props.percentage) {
            return (core_1.prettyNumber(value * 100, this.props.digits != null ? this.props.digits : 2) + "%");
        }
        else {
            return core_1.prettyNumber(value, this.props.digits != null ? this.props.digits : 2);
        }
    }
    parseNumber(str) {
        str = str.trim();
        if (str == "") {
            return null;
        }
        if (this.props.percentage) {
            str = str.replace(/\%$/, "");
            return +str / 100;
        }
        else {
            return +str;
        }
    }
    reportValue(value) {
        if (value == null) {
            return this.props.onEnter(value);
        }
        else {
            if (this.props.minimum != null) {
                value = Math.max(this.props.minimum, value);
            }
            if (this.props.maximum != null) {
                value = Math.min(this.props.maximum, value);
            }
            return this.props.onEnter(value);
        }
    }
    renderSlider() {
        let sliderMin = 0;
        let sliderMax = 1;
        if (this.props.minimum != null) {
            sliderMin = this.props.minimum;
        }
        if (this.props.maximum != null) {
            sliderMax = this.props.maximum;
        }
        if (this.props.sliderRange != null) {
            sliderMin = this.props.sliderRange[0];
            sliderMax = this.props.sliderRange[1];
        }
        return (React.createElement(slider_1.Slider, { width: 70, min: sliderMin, max: sliderMax, defaultValue: this.props.defaultValue, mapping: this.props.sliderFunction, onChange: (newValue, isFinished) => {
                this.textInput.value = this.formatNumber(newValue);
                if (isFinished) {
                    this.reportValue(newValue);
                }
            } }));
    }
    renderUpdown() {
        const tick = this.props.updownTick || 0.1;
        if (this.props.updownStyle == "font") {
            return [
                React.createElement(button_1.Button, { key: "up", icon: "general/text-size-up", onClick: () => {
                        this.reportValue(this.props.defaultValue + tick);
                    } }),
                React.createElement(button_1.Button, { key: "down", icon: "general/text-size-down", onClick: () => {
                        this.reportValue(this.props.defaultValue - tick);
                    } })
            ];
        }
        else {
            return (React.createElement(button_1.UpdownButton, { onClick: part => {
                    if (part == "up") {
                        this.reportValue(this.props.defaultValue + tick);
                    }
                    else {
                        this.reportValue(this.props.defaultValue - tick);
                    }
                } }));
        }
    }
    render() {
        return (React.createElement("span", { className: "charticulator__widget-control-input-number" },
            React.createElement("div", { className: "charticulator__widget-control-input-number-input" },
                React.createElement(input_text_1.InputText, { ref: e => (this.textInput = e), placeholder: this.props.placeholder, defaultValue: this.formatNumber(this.props.defaultValue), onEnter: str => {
                        const num = this.parseNumber(str);
                        return this.reportValue(num);
                    } })),
            this.props.showSlider ? this.renderSlider() : null,
            this.props.showUpdown ? this.renderUpdown() : null));
    }
}
exports.InputNumber = InputNumber;
//# sourceMappingURL=input_number.js.map