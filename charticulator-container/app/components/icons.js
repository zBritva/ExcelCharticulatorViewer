"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
const React = require("react");
class SVGImageIcon extends React.PureComponent {
    render() {
        const style = {};
        if (this.props.width != null) {
            style.width = this.props.width + "px";
        }
        if (this.props.height != null) {
            style.height = this.props.height + "px";
        }
        if (this.props.url) {
            style.backgroundImage = `url(${this.props.url})`;
            return (React.createElement("span", { className: "el-svg-icon svg-image-icon", style: style, onDragStart: e => false }));
        }
        else {
            return React.createElement("span", { className: "el-svg-icon svg-image-icon" });
        }
    }
}
exports.SVGImageIcon = SVGImageIcon;
//# sourceMappingURL=icons.js.map