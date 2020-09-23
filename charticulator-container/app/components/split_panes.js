"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
const React = require("react");
class HorizontalSplitPaneView extends React.Component {
    render() {
        return (React.createElement("div", { className: "split-pane-view-horizontal" },
            React.createElement("div", { className: "row" }, React.Children.map(this.props.children, (child, index) => (React.createElement("div", { className: "pane" }, child))))));
    }
}
exports.HorizontalSplitPaneView = HorizontalSplitPaneView;
//# sourceMappingURL=split_panes.js.map