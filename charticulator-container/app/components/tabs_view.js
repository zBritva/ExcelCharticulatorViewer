"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
const React = require("react");
const icons_1 = require("./icons");
const utils_1 = require("../utils");
class TabsView extends React.Component {
    render() {
        return (React.createElement("div", { className: "charticulator__tabs-view" },
            React.createElement("div", { className: "charticulator__tabs-view-tabs" }, this.props.tabs.map(tab => (React.createElement("span", { key: tab.name, className: utils_1.classNames("charticulator__tabs-view-tab", [
                    "is-active",
                    this.props.currentTab == tab.name
                ]), onClick: () => this.props.onSelect(tab.name) },
                tab.icon ? React.createElement(icons_1.SVGImageIcon, { url: tab.icon }) : null,
                React.createElement("span", { className: "el-label" }, tab.label)))))));
    }
}
exports.TabsView = TabsView;
//# sourceMappingURL=tabs_view.js.map