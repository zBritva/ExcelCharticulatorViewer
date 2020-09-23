"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
const React = require("react");
const core_1 = require("../../../../../core");
const utils_1 = require("../../../../utils");
class InputExpression extends React.Component {
    constructor() {
        super(...arguments);
        this.state = {
            errorMessage: null,
            errorIndicator: false,
            value: this.props.defaultValue || ""
        };
    }
    componentWillReceiveProps(newProps) {
        this.setState({
            errorMessage: null,
            errorIndicator: false,
            value: newProps.defaultValue || ""
        });
    }
    doEnter() {
        if (this.props.allowNull && this.refInput.value.trim() == "") {
            this.setState({
                value: "",
                errorIndicator: false,
                errorMessage: null
            });
            this.props.onEnter(null);
        }
        else {
            const result = this.props.validate(this.refInput.value);
            if (result.pass) {
                this.setState({
                    value: result.formatted,
                    errorIndicator: false,
                    errorMessage: null
                });
                this.props.onEnter(result.formatted);
            }
            else {
                this.setState({
                    errorIndicator: true,
                    errorMessage: result.error
                });
            }
        }
    }
    doCancel() {
        this.setState({
            value: this.props.defaultValue || "",
            errorIndicator: false,
            errorMessage: null
        });
        if (this.props.onCancel) {
            this.props.onCancel();
        }
    }
    render() {
        return (React.createElement("span", { className: "charticulator__widget-control-input-expression" },
            React.createElement("input", { className: utils_1.classNames("charticulator__widget-control-input-expression-input", ["is-error", this.state.errorIndicator]), type: "text", ref: e => (this.refInput = e), value: this.state.value, placeholder: this.props.placeholder, onKeyDown: e => {
                    if (e.key == "Enter") {
                        this.doEnter();
                    }
                    if (e.key == "Escape") {
                        this.doCancel();
                    }
                }, onFocus: e => {
                    this.refInput.select();
                }, onBlur: () => {
                    this.doEnter();
                }, onChange: () => {
                    // Check for parse errors while input
                    const newValue = this.refInput.value;
                    if (this.props.allowNull && newValue.trim() == "") {
                        this.setState({
                            value: newValue,
                            errorIndicator: false
                        });
                    }
                    else {
                        const result = core_1.Expression.verifyUserExpression(newValue, {
                            textExpression: this.props.textExpression
                        });
                        this.setState({
                            value: this.refInput.value,
                            errorIndicator: !result.pass
                        });
                    }
                } }),
            this.state.errorMessage != null ? (React.createElement("span", { className: "charticulator__widget-control-input-expression-error" }, this.state.errorMessage)) : null));
    }
}
exports.InputExpression = InputExpression;
//# sourceMappingURL=input_expression.js.map