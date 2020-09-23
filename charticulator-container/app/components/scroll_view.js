"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
const React = require("react");
const Hammer = require("hammerjs");
class ScrollView extends React.Component {
    componentDidMount() {
        this.hammer = new Hammer(this.refs.container);
        this.hammer.on("panstart", e => { });
    }
    componentWillUnmount() {
        this.hammer.destroy();
    }
    render() {
        return (React.createElement("div", { className: "scroll-view", ref: "container" },
            React.createElement("div", { className: "scroll-view-content" }, this.props.children),
            React.createElement("div", { className: "scroll-bar" },
                React.createElement("div", { className: "scroll-bar-handle" }))));
    }
}
exports.ScrollView = ScrollView;
//# sourceMappingURL=scroll_view.js.map