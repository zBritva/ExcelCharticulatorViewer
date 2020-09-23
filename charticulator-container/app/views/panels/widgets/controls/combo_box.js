"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
const React = require("react");
const R = require("../../../../resources");
const globals = require("../../../../globals");
const components_1 = require("../../../../components");
const controllers_1 = require("../../../../controllers");
const utils_1 = require("../../../../utils");
class ComboBox extends React.Component {
    constructor() {
        super(...arguments);
        this.state = {
            value: this.props.defaultValue
        };
        this.handleChange = (e) => {
            this.setState({
                value: e.target.value
            });
        };
        this.handleFocus = (e) => {
            this.refInput.select();
        };
        this.handleBlur = (e) => {
            this.tryEmitValue(this.refInput.value);
        };
        this.handleKeydown = (e) => {
            if (e.key == "Enter") {
                this.tryEmitValue(this.refInput.value);
            }
            else if (e.key == "Escape") {
                this.reset();
            }
        };
    }
    componentWillReceiveProps(newProps) {
        this.setState({
            value: newProps.defaultValue
        });
    }
    tryEmitValue(val) {
        if (!this.props.onEnter) {
            return;
        }
        const ok = this.props.onEnter(val);
        if (ok) {
            this.setState({
                value: val
            });
        }
    }
    reset() {
        this.setState({
            value: this.props.defaultValue
        });
    }
    renderOptions(onSelect) {
        const renderOptionItem = this.props.renderOptionItem ||
            ((x, props) => (React.createElement("span", { className: utils_1.classNames("el-default-option-item", [
                    "is-active",
                    props.selected
                ]), onClick: props.onClick }, x)));
        return (React.createElement("span", { className: "charticulator__widget-control-combo-box-suggestions" }, this.props.options.map(x => (React.createElement("span", { className: "charticulator__widget-control-combo-box-suggestions-option", key: x }, renderOptionItem(x, {
            onClick: () => {
                if (onSelect) {
                    onSelect();
                }
                this.tryEmitValue(x);
            },
            selected: this.state.value == x
        }))))));
    }
    render() {
        return (React.createElement("span", { className: "charticulator__widget-control-combo-box", ref: e => (this.refContainer = e) },
            this.props.optionsOnly ? (React.createElement("span", { className: "el-value" }, this.state.value)) : (React.createElement("input", { ref: e => (this.refInput = e), className: "el-input", value: this.state.value, onChange: this.handleChange, onKeyDown: this.handleKeydown, onFocus: this.handleFocus, onBlur: this.handleBlur })),
            React.createElement("span", { className: "el-dropdown", onClick: () => {
                    globals.popupController.popupAt(context => {
                        return (React.createElement(controllers_1.PopupView, { className: "charticulator__widget-control-combo-box-popup", context: context, width: this.refContainer.getBoundingClientRect().width }, this.renderOptions(() => context.close())));
                    }, { anchor: this.refContainer });
                } },
                React.createElement(components_1.SVGImageIcon, { url: R.getSVGIcon("general/dropdown") }))));
    }
}
exports.ComboBox = ComboBox;
const fontList = [
    "Arial Black",
    "Arial",
    "Comic Sans MS",
    "Consolas",
    "Courier New",
    "Geneva",
    "Georgia",
    "Helvetica",
    "Impact",
    "Inconsolata",
    "Lato",
    "Lucida Console",
    "Lucida Grande",
    "Palatino",
    "Tahoma",
    "Times",
    "Trebuchet MS",
    "Verdana"
];
class ComboBoxFontFamily extends React.Component {
    render() {
        return (React.createElement(ComboBox, { defaultValue: this.props.defaultValue, options: fontList, renderOptionItem: (x, props) => (React.createElement("span", Object.assign({ className: utils_1.classNames("el-default-option-item", [
                    "is-active",
                    props.selected
                ]), style: { fontFamily: x } }, props), x)), onEnter: this.props.onEnter, onCancel: this.props.onCancel }));
    }
}
exports.ComboBoxFontFamily = ComboBoxFontFamily;
//# sourceMappingURL=combo_box.js.map