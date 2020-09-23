"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
const React = require("react");
class InputText extends React.Component {
    componentWillUpdate(newProps) {
        this.inputElement.value =
            newProps.defaultValue != null ? newProps.defaultValue : "";
    }
    doEnter() {
        if ((this.props.defaultValue != null ? this.props.defaultValue : "") ==
            this.inputElement.value) {
            return;
        }
        if (this.props.onEnter) {
            const ret = this.props.onEnter(this.inputElement.value);
            if (!ret) {
                this.inputElement.value =
                    this.props.defaultValue != null ? this.props.defaultValue : "";
            }
        }
        else {
            this.inputElement.value =
                this.props.defaultValue != null ? this.props.defaultValue : "";
        }
    }
    doCancel() {
        this.inputElement.value =
            this.props.defaultValue != null ? this.props.defaultValue : "";
        if (this.props.onCancel) {
            this.props.onCancel();
        }
    }
    get value() {
        return this.inputElement.value;
    }
    set value(v) {
        this.inputElement.value = v;
    }
    render() {
        return (React.createElement("input", { className: "charticulator__widget-control-input-field", type: "text", ref: e => (this.inputElement = e), defaultValue: this.props.defaultValue != null ? this.props.defaultValue : "", placeholder: this.props.placeholder, onKeyDown: e => {
                if (e.key == "Enter") {
                    this.doEnter();
                }
                if (e.key == "Escape") {
                    this.doCancel();
                }
            }, onFocus: e => {
                // Select the text, with backward selection
                this.inputElement.setSelectionRange(0, this.inputElement.value.length, "backward");
            }, onBlur: () => {
                this.doEnter();
            } }));
    }
}
exports.InputText = InputText;
//# sourceMappingURL=input_text.js.map