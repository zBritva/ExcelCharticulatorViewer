"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
const React = require("react");
const components_1 = require("../../../../components");
const popup_controller_1 = require("../../../../controllers/popup_controller");
const globals = require("../../../../globals");
const R = require("../../../../resources");
const utils_1 = require("../../../../utils");
function DropdownListView(props) {
    return (React.createElement("ul", { className: "dropdown-list" }, props.list.map(item => (React.createElement("li", { key: item.name, className: props.selected == item.name ? "is-active" : null, onClick: () => {
            if (props.onClick) {
                props.onClick(item.name);
            }
            props.context.close();
        } },
        item.url != null ? React.createElement(components_1.SVGImageIcon, { url: item.url }) : null,
        item.text != null ? (React.createElement("span", { className: "text", style: { fontFamily: item.font } }, item.text)) : null)))));
}
exports.DropdownListView = DropdownListView;
class Select extends React.Component {
    constructor(props) {
        super(props);
        this._startDropdown = (e) => {
            e.stopPropagation();
            this.startDropdown();
        };
        this.state = {
            active: false
        };
    }
    startDropdown() {
        globals.popupController.popupAt(context => {
            context.addListener("close", () => {
                this.setState({
                    active: false
                });
            });
            const list = this.props.options.map((x, i) => {
                return {
                    url: this.props.icons ? R.getSVGIcon(this.props.icons[i]) : null,
                    name: x,
                    text: this.props.labels ? this.props.labels[i] : null
                };
            });
            return (React.createElement(popup_controller_1.PopupView, { context: context },
                React.createElement(DropdownListView, { selected: this.props.value, list: list, context: context, onClick: (value) => {
                        this.props.onChange(value);
                    } })));
        }, { anchor: this.anchor });
        this.setState({
            active: true
        });
    }
    render() {
        const currentIndex = this.props.options.indexOf(this.props.value);
        const props = this.props;
        return (React.createElement("span", { className: utils_1.classNames("charticulator__widget-control-select", ["is-active", this.state.active], ["has-text", this.props.labels != null && props.showText], ["has-icon", this.props.icons != null]), ref: e => (this.anchor = e), onClick: this._startDropdown },
            props.icons != null ? (React.createElement(components_1.SVGImageIcon, { url: R.getSVGIcon(props.icons[currentIndex]) })) : null,
            props.labels != null && props.showText ? (React.createElement("span", { className: "el-text" }, props.labels[currentIndex])) : null,
            React.createElement(components_1.SVGImageIcon, { url: R.getSVGIcon("general/dropdown") })));
    }
}
exports.Select = Select;
class Radio extends React.Component {
    render() {
        const currentIndex = this.props.options.indexOf(this.props.value);
        return (React.createElement("span", { className: "charticulator__widget-control-radio" }, this.props.options.map((value, index) => {
            return (React.createElement("span", { key: value, className: utils_1.classNames("charticulator__widget-control-radio-item", ["is-active", value == this.props.value]), title: this.props.labels ? this.props.labels[index] : null, onClick: () => {
                    this.props.onChange(value);
                } },
                this.props.icons ? (React.createElement(components_1.SVGImageIcon, { url: R.getSVGIcon(this.props.icons[index]) })) : null,
                this.props.showText ? (React.createElement("span", { className: "el-text" }, this.props.labels[index])) : null));
        })));
    }
}
exports.Radio = Radio;
//# sourceMappingURL=select.js.map