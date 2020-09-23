"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
const React = require("react");
class CanvasBar extends React.Component {
    render() {
        const width = this.props.canvasWidth;
        const height = 20;
        return (React.createElement("g", { className: "charticulator__canvas-canvas-bar", transform: `translate(0,${(this.props.canvasHeight - height).toFixed(6)})` },
            React.createElement("rect", { className: "el-background", x: 0, y: 0, width: width, height: height })));
    }
}
exports.CanvasBar = CanvasBar;
//# sourceMappingURL=canvas_bar.js.map