"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
const React = require("react");
const R = require("../../../../resources");
const components_1 = require("../../../../components");
const utils_1 = require("../../../../utils");
class Button extends React.Component {
    render() {
        return (React.createElement("span", { className: utils_1.classNames("charticulator__widget-control-button", ["is-active", this.props.active], ["has-text", this.props.text != null], ["has-icon", this.props.icon != null]), title: this.props.title, onClick: e => {
                e.stopPropagation();
                if (this.props.onClick) {
                    this.props.onClick();
                }
            } },
            this.props.icon ? (React.createElement(components_1.SVGImageIcon, { url: R.getSVGIcon(this.props.icon) })) : null,
            this.props.text ? (React.createElement("span", { className: "el-text" }, this.props.text)) : null));
    }
}
exports.Button = Button;
function UpdownButton(props) {
    return (React.createElement("span", { className: "charticulator__widget-control-updown-button" },
        React.createElement("span", { className: "el-part", onClick: () => props.onClick("up") },
            React.createElement(components_1.SVGImageIcon, { url: R.getSVGIcon("general/triangle-up") })),
        React.createElement("span", { className: "el-part", onClick: () => props.onClick("down") },
            React.createElement(components_1.SVGImageIcon, { url: R.getSVGIcon("general/triangle-down") }))));
}
exports.UpdownButton = UpdownButton;
class CheckBox extends React.Component {
    render() {
        return (React.createElement("span", { className: utils_1.classNames("charticulator__widget-control-checkbox", ["is-active", this.props.value], ["is-fill-width", this.props.fillWidth], ["has-text", this.props.text != null]), title: this.props.title, onClick: e => {
                e.stopPropagation();
                if (this.props.onChange) {
                    this.props.onChange(!this.props.value);
                }
            } },
            React.createElement(components_1.SVGImageIcon, { url: R.getSVGIcon(this.props.value ? "checkbox/checked" : "checkbox/empty") }),
            this.props.text ? (React.createElement("span", { className: "el-text" }, this.props.text)) : null));
    }
}
exports.CheckBox = CheckBox;
//# sourceMappingURL=button.js.map