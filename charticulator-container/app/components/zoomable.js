"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
const React = require("react");
const Hammer = require("hammerjs");
const core_1 = require("../../core");
class ZoomableCanvas extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            zoom: {
                centerX: props.width / 2,
                centerY: props.height / 2,
                scale: 1
            }
        };
    }
    setZooming(zoom) {
        this.setState({
            zoom
        });
    }
    canvasToPixel(pt) {
        return core_1.Geometry.applyZoom(this.state.zoom, pt);
    }
    pixelToCanvas(pt) {
        return core_1.Geometry.unapplyZoom(this.state.zoom, pt);
    }
    getRelativePoint(point) {
        const r = this.refs.container.getBoundingClientRect();
        return {
            x: point.x - r.left,
            y: point.y - r.top
        };
    }
    componentDidMount() {
        this.hammer = new Hammer(this.refs.handler);
        // this.hammer.add(new Hammer.Pan());
        // this.hammer.add(new Hammer.Pinch());
        // let centerX: number = null;
        // let centerY: number = null;
        // this.hammer.on("panstart", (e) => {
        //     centerX = this.state.centerX;
        //     centerY = this.state.centerY;
        // });
        // this.hammer.on("pan", (e) => {
        //     this.setState({
        //         centerX: centerX + e.deltaX,
        //         centerY: centerY + e.deltaY,
        //     });
        // });
        // this.hammer.on("pinch", (e) => {
        //     console.log("Pinch", e);
        // });
    }
    componentWillUnmount() {
        this.hammer.destroy();
    }
    render() {
        const transform = `translate(${this.state.zoom.centerX},${this.state.zoom.centerY}) scale(${this.state.zoom.scale})`;
        return (React.createElement("g", { ref: "container" },
            React.createElement("rect", { ref: "handler", x: 0, y: 0, width: this.props.width, height: this.props.height, style: {
                    fill: "transparent",
                    stroke: "none",
                    pointerEvents: "fill"
                } }),
            React.createElement("g", { transform: transform }, this.props.children)));
    }
}
exports.ZoomableCanvas = ZoomableCanvas;
//# sourceMappingURL=zoomable.js.map