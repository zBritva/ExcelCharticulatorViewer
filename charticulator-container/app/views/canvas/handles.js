"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
const React = require("react");
const Hammer = require("hammerjs");
const core_1 = require("../../../core");
const globals = require("../../globals");
const R = require("../../resources");
const utils_1 = require("../../utils");
const core_2 = require("../../../core");
const controllers_1 = require("../../controllers");
const components_1 = require("../../components");
const renderer_1 = require("../../renderer");
const controls_1 = require("../panels/widgets/controls");
const POINT_SIZE = 3;
const POINT_GHOST_SIZE = 6;
class HandlesDragContext extends core_1.EventEmitter {
    onDrag(listener) {
        return this.addListener("drag", listener);
    }
    onEnd(listener) {
        return this.addListener("end", listener);
    }
}
exports.HandlesDragContext = HandlesDragContext;
class HandlesView extends React.Component {
    renderHandle(handle) {
        let isHandleSnapped = false;
        if (this.props.isAttributeSnapped) {
            for (const action of handle.actions) {
                if (action.type == "attribute") {
                    isHandleSnapped =
                        isHandleSnapped || this.props.isAttributeSnapped(action.attribute);
                }
            }
        }
        switch (handle.type) {
            case "point": {
                return (React.createElement(PointHandleView, { zoom: this.props.zoom, active: this.props.active, visible: this.props.visible, snapped: isHandleSnapped, onDragStart: this.props.onDragStart, handle: handle }));
            }
            case "line": {
                return (React.createElement(LineHandleView, { zoom: this.props.zoom, active: this.props.active, visible: this.props.visible, snapped: isHandleSnapped, onDragStart: this.props.onDragStart, handle: handle }));
            }
            case "relative-line": {
                return (React.createElement(RelativeLineHandleView, { zoom: this.props.zoom, active: this.props.active, visible: this.props.visible, onDragStart: this.props.onDragStart, handle: handle }));
            }
            case "gap-ratio": {
                return (React.createElement(GapRatioHandleView, { zoom: this.props.zoom, active: this.props.active, visible: false, onDragStart: this.props.onDragStart, handle: handle }));
            }
            case "margin": {
                return (React.createElement(MarginHandleView, { zoom: this.props.zoom, active: this.props.active, visible: this.props.visible, onDragStart: this.props.onDragStart, handle: handle }));
            }
            case "angle": {
                return (React.createElement(AngleHandleView, { zoom: this.props.zoom, active: this.props.active, visible: this.props.visible, onDragStart: this.props.onDragStart, handle: handle }));
            }
            case "distance-ratio": {
                return (React.createElement(DistanceRatioHandleView, { zoom: this.props.zoom, active: this.props.active, visible: this.props.visible, onDragStart: this.props.onDragStart, handle: handle }));
            }
            case "text-alignment": {
                return (React.createElement(TextAlignmentHandleView, { zoom: this.props.zoom, active: this.props.active, visible: this.props.visible, onDragStart: this.props.onDragStart, handle: handle }));
            }
            case "input-curve": {
                return (React.createElement(InputCurveHandleView, { zoom: this.props.zoom, active: this.props.active, visible: this.props.visible, onDragStart: this.props.onDragStart, handle: handle }));
            }
        }
    }
    render() {
        return (React.createElement("g", null, this.props.handles.map((b, idx) => (React.createElement("g", { key: `m${idx}` }, this.renderHandle(b))))));
    }
}
exports.HandlesView = HandlesView;
class PointHandleView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dragging: false,
            newXValue: this.props.handle.x,
            newYValue: this.props.handle.y
        };
    }
    componentDidMount() {
        this.hammer = new Hammer(this.refs.circle);
        this.hammer.add(new Hammer.Pan());
        let context = null;
        let oldXValue;
        let oldYValue;
        let dXIntegrate = 0;
        let dXLast = 0;
        let dYIntegrate = 0;
        let dYLast = 0;
        this.hammer.on("panstart", e => {
            context = new HandlesDragContext();
            oldXValue = this.props.handle.x;
            oldYValue = this.props.handle.y;
            dXLast = 0;
            dYLast = 0;
            dXIntegrate = 0;
            dYIntegrate = 0;
            this.setState({
                dragging: true,
                newXValue: oldXValue,
                newYValue: oldYValue
            });
            if (this.props.onDragStart) {
                this.props.onDragStart(this.props.handle, context);
            }
        });
        this.hammer.on("pan", e => {
            if (context) {
                dXIntegrate += (e.deltaX - dXLast) / this.props.zoom.scale;
                dYIntegrate += -(e.deltaY - dYLast) / this.props.zoom.scale;
                dXLast = e.deltaX;
                dYLast = e.deltaY;
                const newXValue = dXIntegrate + oldXValue;
                const newYValue = dYIntegrate + oldYValue;
                this.setState({
                    newXValue,
                    newYValue
                });
                context.emit("drag", { x: newXValue, y: newYValue });
            }
        });
        this.hammer.on("panend", e => {
            if (context) {
                dXIntegrate += (e.deltaX - dXLast) / this.props.zoom.scale;
                dYIntegrate += -(e.deltaY - dYLast) / this.props.zoom.scale;
                dXLast = e.deltaX;
                dYLast = e.deltaY;
                const newXValue = dXIntegrate + oldXValue;
                const newYValue = dYIntegrate + oldYValue;
                context.emit("end", { x: newXValue, y: newYValue });
                this.setState({
                    dragging: false
                });
                context = null;
            }
        });
    }
    componentWillUnmount() {
        this.hammer.destroy();
    }
    render() {
        const { handle } = this.props;
        const { x, y } = core_2.Geometry.applyZoom(this.props.zoom, {
            x: handle.x,
            y: -handle.y
        });
        const { x: hx, y: hy } = core_2.Geometry.applyZoom(this.props.zoom, {
            x: this.state.newXValue,
            y: -this.state.newYValue
        });
        return (React.createElement("g", { ref: "circle", className: utils_1.classNames("handle", "handle-point", ["active", this.state.dragging], ["snapped", this.props.snapped], ["visible", handle.visible || this.props.visible]) },
            React.createElement("circle", { className: "element-shape handle-ghost", cx: x, cy: y, r: POINT_GHOST_SIZE }),
            React.createElement("circle", { className: "element-shape handle-highlight", cx: x, cy: y, r: POINT_SIZE }),
            this.state.dragging ? (React.createElement("g", null,
                React.createElement("line", { className: `element-line handle-hint`, x1: hx, y1: hy, x2: x, y2: y }),
                React.createElement("circle", { className: `element-shape handle-hint`, cx: hx, cy: hy, r: POINT_SIZE }))) : null));
    }
}
exports.PointHandleView = PointHandleView;
class LineHandleView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dragging: false,
            newValue: this.props.handle.value
        };
    }
    componentDidMount() {
        this.hammer = new Hammer(this.refs.line);
        this.hammer.add(new Hammer.Pan({ threshold: 1 }));
        let context = null;
        let oldValue;
        let dXIntegrate = 0;
        let dXLast = 0;
        let dYIntegrate = 0;
        let dYLast = 0;
        this.hammer.on("panstart", e => {
            context = new HandlesDragContext();
            oldValue = this.props.handle.value;
            dXLast = 0;
            dYLast = 0;
            dXIntegrate = 0;
            dYIntegrate = 0;
            this.setState({
                dragging: true,
                newValue: oldValue
            });
            if (this.props.onDragStart) {
                this.props.onDragStart(this.props.handle, context);
            }
        });
        this.hammer.on("pan", e => {
            if (context) {
                dXIntegrate += (e.deltaX - dXLast) / this.props.zoom.scale;
                dYIntegrate += -(e.deltaY - dYLast) / this.props.zoom.scale;
                dXLast = e.deltaX;
                dYLast = e.deltaY;
                const newValue = (this.props.handle.axis == "x" ? dXIntegrate : dYIntegrate) +
                    oldValue;
                this.setState({
                    newValue
                });
                context.emit("drag", { value: newValue });
            }
        });
        this.hammer.on("panend", e => {
            if (context) {
                dXIntegrate += (e.deltaX - dXLast) / this.props.zoom.scale;
                dYIntegrate += -(e.deltaY - dYLast) / this.props.zoom.scale;
                dXLast = e.deltaX;
                dYLast = e.deltaY;
                const newValue = (this.props.handle.axis == "x" ? dXIntegrate : dYIntegrate) +
                    oldValue;
                context.emit("end", { value: newValue });
                this.setState({
                    dragging: false
                });
                context = null;
            }
        });
    }
    componentWillUnmount() {
        this.hammer.destroy();
    }
    render() {
        const { handle } = this.props;
        const fX = (x) => x * this.props.zoom.scale + this.props.zoom.centerX;
        const fY = (y) => -y * this.props.zoom.scale + this.props.zoom.centerY;
        switch (handle.axis) {
            case "x": {
                return (React.createElement("g", { className: utils_1.classNames("handle", "handle-line-x", ["active", this.state.dragging], ["visible", handle.visible || this.props.visible]) },
                    React.createElement("g", { ref: "line" },
                        React.createElement("line", { className: "element-line handle-ghost", x1: fX(handle.value), x2: fX(handle.value), y1: fY(handle.span[0]), y2: fY(handle.span[1]) }),
                        React.createElement("line", { className: "element-line handle-highlight", x1: fX(handle.value), x2: fX(handle.value), y1: fY(handle.span[0]), y2: fY(handle.span[1]) })),
                    this.state.dragging ? (React.createElement("g", null,
                        React.createElement("line", { className: `element-line handle-hint`, x1: fX(this.state.newValue), x2: fX(this.state.newValue), y1: fY(handle.span[0]), y2: fY(handle.span[1]) }))) : null));
            }
            case "y": {
                return (React.createElement("g", { className: utils_1.classNames("handle", "handle-line-y", ["active", this.state.dragging], ["visible", handle.visible || this.props.visible]) },
                    React.createElement("g", { ref: "line" },
                        React.createElement("line", { className: "element-line handle-ghost", y1: fY(handle.value), y2: fY(handle.value), x1: fX(handle.span[0]), x2: fX(handle.span[1]) }),
                        React.createElement("line", { className: "element-line handle-highlight", y1: fY(handle.value), y2: fY(handle.value), x1: fX(handle.span[0]), x2: fX(handle.span[1]) })),
                    this.state.dragging ? (React.createElement("g", null,
                        React.createElement("line", { className: `element-line handle-hint`, y1: fY(this.state.newValue), y2: fY(this.state.newValue), x1: fX(handle.span[0]), x2: fX(handle.span[1]) }))) : null));
            }
        }
    }
}
exports.LineHandleView = LineHandleView;
class RelativeLineHandleView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dragging: false,
            newValue: this.props.handle.value
        };
    }
    componentDidMount() {
        this.hammer = new Hammer(this.refs.line);
        this.hammer.add(new Hammer.Pan({ threshold: 1 }));
        let context = null;
        let oldValue;
        let dXIntegrate = 0;
        let dXLast = 0;
        let dYIntegrate = 0;
        let dYLast = 0;
        const sign = this.props.handle.sign;
        this.hammer.on("panstart", e => {
            context = new HandlesDragContext();
            oldValue = this.props.handle.value;
            dXLast = 0;
            dYLast = 0;
            dXIntegrate = 0;
            dYIntegrate = 0;
            this.setState({
                dragging: true,
                newValue: oldValue
            });
            if (this.props.onDragStart) {
                this.props.onDragStart(this.props.handle, context);
            }
        });
        this.hammer.on("pan", e => {
            if (context) {
                dXIntegrate += (e.deltaX - dXLast) / this.props.zoom.scale;
                dYIntegrate += -(e.deltaY - dYLast) / this.props.zoom.scale;
                dXLast = e.deltaX;
                dYLast = e.deltaY;
                const newValue = (this.props.handle.axis == "x" ? dXIntegrate : dYIntegrate) * sign +
                    oldValue;
                this.setState({
                    newValue
                });
                context.emit("drag", { value: newValue });
            }
        });
        this.hammer.on("panend", e => {
            if (context) {
                dXIntegrate += (e.deltaX - dXLast) / this.props.zoom.scale;
                dYIntegrate += -(e.deltaY - dYLast) / this.props.zoom.scale;
                dXLast = e.deltaX;
                dYLast = e.deltaY;
                const newValue = (this.props.handle.axis == "x" ? dXIntegrate : dYIntegrate) * sign +
                    oldValue;
                context.emit("end", { value: newValue });
                this.setState({
                    dragging: false
                });
                context = null;
            }
        });
    }
    componentWillUnmount() {
        this.hammer.destroy();
    }
    render() {
        const { handle } = this.props;
        const fX = (x) => x * this.props.zoom.scale + this.props.zoom.centerX;
        const fY = (y) => -y * this.props.zoom.scale + this.props.zoom.centerY;
        switch (handle.axis) {
            case "x": {
                return (React.createElement("g", { className: utils_1.classNames("handle", "handle-line-x", ["active", this.state.dragging], ["visible", handle.visible || this.props.visible]) },
                    React.createElement("g", { ref: "line" },
                        React.createElement("line", { className: "element-line handle-ghost", x1: fX(handle.reference + handle.sign * handle.value), x2: fX(handle.reference + handle.sign * handle.value), y1: fY(handle.span[0]), y2: fY(handle.span[1]) }),
                        React.createElement("line", { className: "element-line handle-highlight", x1: fX(handle.reference + handle.sign * handle.value), x2: fX(handle.reference + handle.sign * handle.value), y1: fY(handle.span[0]), y2: fY(handle.span[1]) })),
                    this.state.dragging ? (React.createElement("g", null,
                        React.createElement("line", { className: `element-line handle-hint`, x1: fX(handle.reference + handle.sign * this.state.newValue), x2: fX(handle.reference + handle.sign * this.state.newValue), y1: fY(handle.span[0]), y2: fY(handle.span[1]) }))) : null));
            }
            case "y": {
                return (React.createElement("g", { className: utils_1.classNames("handle", "handle-line-y", ["active", this.state.dragging], ["visible", handle.visible || this.props.visible]) },
                    React.createElement("g", { ref: "line" },
                        React.createElement("line", { className: "element-line handle-ghost", y1: fY(handle.reference + handle.sign * handle.value), y2: fY(handle.reference + handle.sign * handle.value), x1: fX(handle.span[0]), x2: fX(handle.span[1]) }),
                        React.createElement("line", { className: "element-line handle-highlight", y1: fY(handle.reference + handle.sign * handle.value), y2: fY(handle.reference + handle.sign * handle.value), x1: fX(handle.span[0]), x2: fX(handle.span[1]) })),
                    this.state.dragging ? (React.createElement("g", null,
                        React.createElement("line", { className: `element-line handle-hint`, y1: fY(handle.reference + handle.sign * this.state.newValue), y2: fY(handle.reference + handle.sign * this.state.newValue), x1: fX(handle.span[0]), x2: fX(handle.span[1]) }))) : null));
            }
        }
    }
}
exports.RelativeLineHandleView = RelativeLineHandleView;
class GapRatioHandleView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dragging: false,
            newValue: this.props.handle.value
        };
    }
    componentDidMount() {
        this.hammer = new Hammer(this.refs.line);
        this.hammer.add(new Hammer.Pan({ threshold: 1 }));
        let context = null;
        let oldValue;
        let xStart = 0;
        let yStart = 0;
        let dXIntegrate = 0;
        let dXLast = 0;
        let dYIntegrate = 0;
        let dYLast = 0;
        let scale = 1 / this.props.handle.scale;
        const getNewValue = () => {
            const cs = this.props.handle.coordinateSystem;
            if (cs == null || cs instanceof core_1.Graphics.CartesianCoordinates) {
                if (this.props.handle.axis == "x") {
                    return oldValue + scale * dXIntegrate;
                }
                if (this.props.handle.axis == "y") {
                    return oldValue + scale * dYIntegrate;
                }
            }
            if (cs instanceof core_1.Graphics.PolarCoordinates) {
                if (this.props.handle.axis == "x") {
                    const getAngle = (x, y) => {
                        return 90 - (Math.atan2(y, x) / Math.PI) * 180;
                    };
                    const angle0 = getAngle(xStart, yStart);
                    let angle1 = getAngle(xStart + dXIntegrate, yStart + dYIntegrate);
                    if (angle1 > angle0 + 180) {
                        angle1 -= 360;
                    }
                    if (angle1 < angle0 - 180) {
                        angle1 += 360;
                    }
                    return oldValue + scale * (angle1 - angle0);
                }
                if (this.props.handle.axis == "y") {
                    const nX = xStart + dXIntegrate;
                    const nY = yStart + dYIntegrate;
                    const radius0 = Math.sqrt(xStart * xStart + yStart * yStart);
                    const radius1 = Math.sqrt(nX * nX + nY * nY);
                    return oldValue + scale * (radius1 - radius0);
                }
            }
            return oldValue;
        };
        this.hammer.on("panstart", e => {
            context = new HandlesDragContext();
            oldValue = this.props.handle.value;
            if (this.refs.cOrigin) {
                const bbox = this.refs.cOrigin.getBoundingClientRect();
                xStart = (e.center.x - e.deltaX - bbox.left) / this.props.zoom.scale;
                yStart = -(e.center.y - e.deltaY - bbox.top) / this.props.zoom.scale;
            }
            else {
                xStart = (e.center.x - e.deltaX) / this.props.zoom.scale;
                yStart = -(e.center.y - e.deltaY) / this.props.zoom.scale;
            }
            dXLast = e.deltaX;
            dYLast = e.deltaY;
            dXIntegrate = e.deltaX / this.props.zoom.scale;
            dYIntegrate = -e.deltaY / this.props.zoom.scale;
            scale = 1 / this.props.handle.scale;
            this.setState({
                dragging: true,
                newValue: oldValue
            });
            if (this.props.onDragStart) {
                this.props.onDragStart(this.props.handle, context);
            }
        });
        this.hammer.on("pan", e => {
            if (context) {
                dXIntegrate += (e.deltaX - dXLast) / this.props.zoom.scale;
                dYIntegrate += -(e.deltaY - dYLast) / this.props.zoom.scale;
                dXLast = e.deltaX;
                dYLast = e.deltaY;
                let newValue = getNewValue();
                if (this.props.handle.range) {
                    newValue = Math.min(this.props.handle.range[1], Math.max(newValue, this.props.handle.range[0]));
                }
                else {
                    newValue = Math.min(1, Math.max(newValue, 0));
                }
                this.setState({
                    newValue
                });
                context.emit("drag", { value: newValue });
            }
        });
        this.hammer.on("panend", e => {
            if (context) {
                dXIntegrate += (e.deltaX - dXLast) / this.props.zoom.scale;
                dYIntegrate += -(e.deltaY - dYLast) / this.props.zoom.scale;
                dXLast = e.deltaX;
                dYLast = e.deltaY;
                let newValue = getNewValue();
                if (this.props.handle.range) {
                    newValue = Math.min(this.props.handle.range[1], Math.max(newValue, this.props.handle.range[0]));
                }
                else {
                    newValue = Math.min(1, Math.max(newValue, 0));
                }
                context.emit("end", { value: newValue });
                this.setState({
                    dragging: false
                });
                context = null;
            }
        });
    }
    componentWillUnmount() {
        this.hammer.destroy();
    }
    render() {
        const handle = this.props.handle;
        if (handle.coordinateSystem == null ||
            handle.coordinateSystem instanceof core_1.Graphics.CartesianCoordinates) {
            return this.renderCartesian();
        }
        if (handle.coordinateSystem instanceof core_1.Graphics.PolarCoordinates) {
            return this.renderPolar();
        }
        return null;
    }
    renderPolar() {
        const { handle } = this.props;
        const polar = handle.coordinateSystem;
        const center = core_2.Geometry.applyZoom(this.props.zoom, {
            x: polar.origin.x,
            y: -polar.origin.y
        });
        switch (handle.axis) {
            case "x": {
                // angular axis
                const pathValue = core_1.Graphics.makePath();
                const pathRegion = core_1.Graphics.makePath();
                const angle = handle.reference + handle.scale * handle.value;
                const angleRef = handle.reference;
                const r1 = handle.span[0] * this.props.zoom.scale, r2 = handle.span[1] * this.props.zoom.scale;
                pathValue.polarLineTo(center.x, -center.y, -angle + 90, r1, -angle + 90, r2, true);
                pathRegion.polarLineTo(center.x, -center.y, -angle + 90, r1, -angle + 90, r2, true);
                pathRegion.polarLineTo(center.x, -center.y, -angle + 90, r2, -angleRef + 90, r2, false);
                pathRegion.polarLineTo(center.x, -center.y, -angleRef + 90, r2, -angleRef + 90, r1, false);
                pathRegion.polarLineTo(center.x, -center.y, -angleRef + 90, r1, -angle + 90, r1, false);
                pathRegion.closePath();
                const pathNew = core_1.Graphics.makePath();
                if (this.state.dragging) {
                    const angleNew = handle.reference + handle.scale * this.state.newValue;
                    pathNew.polarLineTo(center.x, -center.y, -angleNew + 90, r1, -angleNew + 90, r2, true);
                }
                return (React.createElement("g", { className: utils_1.classNames("handle", "handle-line-angular", ["active", this.state.dragging], ["visible", handle.visible || this.props.visible]) },
                    React.createElement("circle", { ref: "cOrigin", cx: center.x, cy: center.y, r: 0 }),
                    React.createElement("g", { ref: "line" },
                        React.createElement("path", { d: renderer_1.renderSVGPath(pathRegion.path.cmds), className: "element-region handle-ghost" }),
                        React.createElement("path", { d: renderer_1.renderSVGPath(pathValue.path.cmds), className: "element-line handle-ghost" }),
                        React.createElement("path", { d: renderer_1.renderSVGPath(pathRegion.path.cmds), className: "element-region handle-highlight" }),
                        React.createElement("path", { d: renderer_1.renderSVGPath(pathValue.path.cmds), className: "element-line handle-highlight" })),
                    this.state.dragging ? (React.createElement("path", { d: renderer_1.renderSVGPath(pathNew.path.cmds), className: "element-line handle-hint" })) : null));
            }
            case "y": {
                const pathValue = core_1.Graphics.makePath();
                const pathRegion = core_1.Graphics.makePath();
                const radius = (handle.reference + handle.scale * handle.value) *
                    this.props.zoom.scale;
                const radiusRef = handle.reference * this.props.zoom.scale;
                const angle1 = handle.span[0], angle2 = handle.span[1];
                pathValue.polarLineTo(center.x, -center.y, -angle1 + 90, radius, -angle2 + 90, radius, true);
                pathRegion.polarLineTo(center.x, -center.y, -angle1 + 90, radius, -angle2 + 90, radius, true);
                pathRegion.polarLineTo(center.x, -center.y, -angle2 + 90, radius, -angle2 + 90, radiusRef, false);
                pathRegion.polarLineTo(center.x, -center.y, -angle2 + 90, radiusRef, -angle1 + 90, radiusRef, false);
                pathRegion.polarLineTo(center.x, -center.y, -angle1 + 90, radiusRef, -angle1 + 90, radius, false);
                pathRegion.closePath();
                const pathNew = core_1.Graphics.makePath();
                if (this.state.dragging) {
                    const radiusNew = (handle.reference + handle.scale * this.state.newValue) *
                        this.props.zoom.scale;
                    pathNew.polarLineTo(center.x, -center.y, -angle1 + 90, radiusNew, -angle2 + 90, radiusNew, true);
                }
                return (React.createElement("g", { className: utils_1.classNames("handle", "handle-line-radial", ["active", this.state.dragging], ["visible", handle.visible || this.props.visible]) },
                    React.createElement("circle", { ref: "cOrigin", cx: center.x, cy: center.y, r: 0 }),
                    React.createElement("g", { ref: "line" },
                        React.createElement("path", { d: renderer_1.renderSVGPath(pathRegion.path.cmds), className: "element-region handle-ghost" }),
                        React.createElement("path", { d: renderer_1.renderSVGPath(pathValue.path.cmds), className: "element-line handle-ghost" }),
                        React.createElement("path", { d: renderer_1.renderSVGPath(pathRegion.path.cmds), className: "element-region handle-highlight" }),
                        React.createElement("path", { d: renderer_1.renderSVGPath(pathValue.path.cmds), className: "element-line handle-highlight" })),
                    this.state.dragging ? (React.createElement("path", { d: renderer_1.renderSVGPath(pathNew.path.cmds), className: "element-line handle-hint" })) : null));
            }
        }
    }
    renderCartesian() {
        const { handle } = this.props;
        const fX = (x) => x * this.props.zoom.scale + this.props.zoom.centerX;
        const fY = (y) => -y * this.props.zoom.scale + this.props.zoom.centerY;
        switch (handle.axis) {
            case "x": {
                const fxRef = fX(handle.reference);
                const fxVal = fX(handle.reference + handle.scale * handle.value);
                const fy1 = fY(handle.span[0]);
                const fy2 = fY(handle.span[1]);
                return (React.createElement("g", { className: utils_1.classNames("handle", "handle-line-x", ["active", this.state.dragging], ["visible", handle.visible || this.props.visible]) },
                    React.createElement("g", { ref: "line" },
                        React.createElement("line", { className: "element-line handle-ghost", x1: fxVal, x2: fxVal, y1: fy1, y2: fy2 }),
                        React.createElement("rect", { className: "element-region handle-ghost", x: Math.min(fxRef, fxVal), width: Math.abs(fxRef - fxVal), y: Math.min(fy1, fy2), height: Math.abs(fy2 - fy1) }),
                        React.createElement("line", { className: "element-line handle-highlight", x1: fxVal, x2: fxVal, y1: fy1, y2: fy2 }),
                        React.createElement("rect", { className: "element-region handle-highlight", x: Math.min(fxRef, fxVal), width: Math.abs(fxRef - fxVal), y: Math.min(fy1, fy2), height: Math.abs(fy2 - fy1) })),
                    this.state.dragging ? (React.createElement("g", null,
                        React.createElement("line", { className: `element-line handle-hint`, x1: fX(handle.reference + handle.scale * this.state.newValue), x2: fX(handle.reference + handle.scale * this.state.newValue), y1: fY(handle.span[0]), y2: fY(handle.span[1]) }))) : null));
            }
            case "y": {
                const fyRef = fY(handle.reference);
                const fyVal = fY(handle.reference + handle.scale * handle.value);
                const fx1 = fX(handle.span[0]);
                const fx2 = fX(handle.span[1]);
                return (React.createElement("g", { className: utils_1.classNames("handle", "handle-line-y", ["active", this.state.dragging], ["visible", handle.visible || this.props.visible]) },
                    React.createElement("g", { ref: "line" },
                        React.createElement("line", { className: "element-line handle-ghost", y1: fyVal, y2: fyVal, x1: fx1, x2: fx2 }),
                        React.createElement("rect", { className: "element-region handle-ghost", y: Math.min(fyRef, fyVal), height: Math.abs(fyRef - fyVal), x: Math.min(fx1, fx2), width: Math.abs(fx2 - fx1) }),
                        React.createElement("line", { className: "element-line handle-highlight", y1: fyVal, y2: fyVal, x1: fx1, x2: fx2 }),
                        React.createElement("rect", { className: "element-region handle-highlight", y: Math.min(fyRef, fyVal), height: Math.abs(fyRef - fyVal), x: Math.min(fx1, fx2), width: Math.abs(fx2 - fx1) })),
                    this.state.dragging ? (React.createElement("g", null,
                        React.createElement("line", { className: `element-line handle-hint`, y1: fY(handle.reference + handle.scale * this.state.newValue), y2: fY(handle.reference + handle.scale * this.state.newValue), x1: fx1, x2: fx2 }))) : null));
            }
        }
    }
}
exports.GapRatioHandleView = GapRatioHandleView;
class MarginHandleView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dragging: false,
            newValue: this.props.handle.value
        };
    }
    componentDidMount() {
        this.hammer = new Hammer(this.refs.margin);
        this.hammer.add(new Hammer.Pan({ threshold: 1 }));
        let context = null;
        let oldValue;
        let sign;
        let total;
        let dXIntegrate = 0;
        let dXLast = 0;
        let dYIntegrate = 0;
        let dYLast = 0;
        this.hammer.on("panstart", e => {
            context = new HandlesDragContext();
            oldValue = this.props.handle.value;
            sign = this.props.handle.sign;
            if (this.props.handle.total != null) {
                total = this.props.handle.total;
            }
            else {
                total = 1;
            }
            dXLast = 0;
            dYLast = 0;
            dXIntegrate = 0;
            dYIntegrate = 0;
            this.setState({
                dragging: true,
                newValue: oldValue
            });
            if (this.props.onDragStart) {
                this.props.onDragStart(this.props.handle, context);
            }
        });
        this.hammer.on("pan", e => {
            if (context) {
                dXIntegrate += (e.deltaX - dXLast) / this.props.zoom.scale;
                dYIntegrate += -(e.deltaY - dYLast) / this.props.zoom.scale;
                dXLast = e.deltaX;
                dYLast = e.deltaY;
                let newValue = ((this.props.handle.axis == "x" ? dXIntegrate : dYIntegrate) * sign) /
                    total +
                    oldValue;
                if (this.props.handle.range) {
                    newValue = Math.min(this.props.handle.range[1], Math.max(newValue, this.props.handle.range[0]));
                }
                this.setState({
                    newValue
                });
                context.emit("drag", { value: newValue });
            }
        });
        this.hammer.on("panend", e => {
            if (context) {
                dXIntegrate += (e.deltaX - dXLast) / this.props.zoom.scale;
                dYIntegrate += -(e.deltaY - dYLast) / this.props.zoom.scale;
                dXLast = e.deltaX;
                dYLast = e.deltaY;
                let newValue = ((this.props.handle.axis == "x" ? dXIntegrate : dYIntegrate) * sign) /
                    total +
                    oldValue;
                if (this.props.handle.range) {
                    newValue = Math.min(this.props.handle.range[1], Math.max(newValue, this.props.handle.range[0]));
                }
                context.emit("end", { value: newValue });
                this.setState({
                    dragging: false
                });
                context = null;
            }
        });
    }
    componentWillUnmount() {
        this.hammer.destroy();
    }
    render() {
        const { handle } = this.props;
        const fX = (x) => x * this.props.zoom.scale + this.props.zoom.centerX;
        const fY = (y) => -y * this.props.zoom.scale + this.props.zoom.centerY;
        let x, y;
        let nx, ny;
        let shape;
        const scale = this.props.handle.total || 1;
        switch (handle.axis) {
            case "x":
                {
                    x = fX(handle.x + handle.value * handle.sign * scale);
                    y = fY(handle.y);
                    nx = fX(handle.x + this.state.newValue * handle.sign * scale);
                    ny = fY(handle.y);
                    shape = "M0,0l5,12.72l-10,0Z";
                }
                break;
            case "y":
                {
                    x = fX(handle.x);
                    y = fY(handle.y + handle.value * handle.sign * scale);
                    nx = fX(handle.x);
                    ny = fY(handle.y + this.state.newValue * handle.sign * scale);
                    shape = "M0,0l-12.72,5l0,-10Z";
                }
                break;
        }
        return (React.createElement("g", { ref: "margin", className: utils_1.classNames("handle", "handle-gap-" + handle.axis, ["active", this.state.dragging], ["visible", handle.visible || this.props.visible]) },
            React.createElement("path", { className: "element-shape handle-ghost", transform: `translate(${x.toFixed(6)},${y.toFixed(6)})`, d: shape }),
            React.createElement("path", { className: "element-shape handle-highlight", transform: `translate(${x.toFixed(6)},${y.toFixed(6)})`, d: shape }),
            this.state.dragging ? (React.createElement("path", { className: "element-shape handle-hint", transform: `translate(${nx.toFixed(6)},${ny.toFixed(6)})`, d: shape })) : null));
    }
}
exports.MarginHandleView = MarginHandleView;
class AngleHandleView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dragging: false,
            newValue: this.props.handle.value
        };
    }
    clipAngle(v) {
        v = Math.round(v / 15) * 15;
        const min = this.props.handle.clipAngles[0];
        const max = this.props.handle.clipAngles[1];
        if (min != null) {
            while (v >= min) {
                v -= 360;
            }
            while (v <= min) {
                v += 360;
            }
        }
        if (max != null) {
            while (v <= max) {
                v += 360;
            }
            while (v >= max) {
                v -= 360;
            }
        }
        return v;
    }
    componentDidMount() {
        this.hammer = new Hammer(this.refs.margin);
        this.hammer.add(new Hammer.Pan({ threshold: 1 }));
        let context = null;
        let oldValue = 0;
        this.hammer.on("panstart", e => {
            context = new HandlesDragContext();
            oldValue = this.props.handle.value;
            this.setState({
                dragging: true,
                newValue: oldValue
            });
            if (this.props.onDragStart) {
                this.props.onDragStart(this.props.handle, context);
            }
        });
        this.hammer.on("pan", e => {
            if (context) {
                const cc = this.refs.centerCircle.getBoundingClientRect();
                const px = e.center.x - (cc.left + cc.width / 2);
                const py = e.center.y - (cc.top + cc.height / 2);
                const newValue = this.clipAngle((Math.atan2(-px, py) / Math.PI) * 180 + 180);
                this.setState({
                    newValue
                });
                context.emit("drag", { value: newValue });
            }
        });
        this.hammer.on("panend", e => {
            if (context) {
                const cc = this.refs.centerCircle.getBoundingClientRect();
                const px = e.center.x - (cc.left + cc.width / 2);
                const py = e.center.y - (cc.top + cc.height / 2);
                const newValue = this.clipAngle((Math.atan2(-px, py) / Math.PI) * 180 + 180);
                // if (this.props.handle.range) {
                //     newValue = Math.min(this.props.handle.range[1], Math.max(newValue, this.props.handle.range[0]));
                // }
                context.emit("end", { value: newValue });
                this.setState({
                    dragging: false
                });
                context = null;
            }
        });
    }
    componentWillUnmount() {
        this.hammer.destroy();
    }
    render() {
        const { handle } = this.props;
        const fX = (x) => x * this.props.zoom.scale + this.props.zoom.centerX;
        const fY = (y) => -y * this.props.zoom.scale + this.props.zoom.centerY;
        const cx = fX(handle.cx);
        const cy = fY(handle.cy);
        const radius = handle.radius * this.props.zoom.scale + 10;
        let shapeF = AngleHandleView.shapeCircle;
        if (handle.icon == "<") {
            shapeF = AngleHandleView.shapeLeft;
        }
        if (handle.icon == ">") {
            shapeF = AngleHandleView.shapeRight;
        }
        return (React.createElement("g", { ref: "margin", className: utils_1.classNames("handle", "handle-angle", ["active", this.state.dragging], ["visible", handle.visible || this.props.visible]) },
            React.createElement("g", { transform: `translate(${cx},${cy}) rotate(${180 + handle.value})` },
                React.createElement("circle", { ref: "centerCircle", cx: 0, cy: 0, r: 0 }),
                React.createElement("line", { x1: 0, y1: 0, x2: 0, y2: radius, className: "element-line handle-ghost" }),
                React.createElement("path", { d: shapeF(9), transform: `translate(0,${radius})`, className: "element-shape handle-ghost" }),
                React.createElement("line", { x1: 0, y1: 0, x2: 0, y2: radius, className: "element-line handle-highlight" }),
                React.createElement("path", { d: shapeF(5), transform: `translate(0,${radius})`, className: "element-shape handle-highlight" })),
            this.state.dragging ? (React.createElement("g", { transform: `translate(${cx},${cy}) rotate(${180 +
                    this.state.newValue})` },
                React.createElement("line", { x1: 0, y1: 0, x2: 0, y2: radius, className: "element-line handle-hint" }),
                React.createElement("path", { d: shapeF(5), transform: `translate(0,${radius})`, className: "element-shape handle-hint" }))) : null));
        // let x: number, y: number;
        // let nx: number, ny: number;
        // let shape: string;
        // let scale = this.props.handle.total || 1;
        // switch (handle.axis) {
        //     case "x": {
        //         x = fX(handle.x + handle.value * handle.sign * scale);
        //         y = fY(handle.y);
        //         nx = fX(handle.x + this.state.newValue * handle.sign * scale);
        //         ny = fY(handle.y);
        //         shape = "M0,0l5,12.72l-10,0Z";
        //     } break;
        //     case "y": {
        //         x = fX(handle.x);
        //         y = fY(handle.y + handle.value * handle.sign * scale);
        //         nx = fX(handle.x);
        //         ny = fY(handle.y + this.state.newValue * handle.sign * scale);
        //         shape = "M0,0l-12.72,5l0,-10Z";
        //     } break;
        // }
        // return (
        //     <g ref="margin" className={classNames("handle", "handle-gap-" + handle.axis, ["active", this.state.dragging], ["visible", handle.visible || this.props.visible])}>
        //         <path className="element-shape handle-ghost"
        //             transform={`translate(${x.toFixed(6)},${y.toFixed(6)})`}
        //             d={shape}
        //         />
        //         <path className="element-shape handle-highlight"
        //             transform={`translate(${x.toFixed(6)},${y.toFixed(6)})`}
        //             d={shape}
        //         />
        //         {this.state.dragging ? (
        //             <path className="element-shape handle-hint"
        //                 transform={`translate(${nx.toFixed(6)},${ny.toFixed(6)})`}
        //                 d={shape}
        //             />
        //         ) : null}
        //     </g>
        // );
    }
}
AngleHandleView.shapeCircle = (r) => `M -${r} 0 A ${r} ${r} 0 1 0 ${r} 0 A ${r} ${r} 0 1 0 ${-r} 0 Z`;
AngleHandleView.shapeRight = (r) => `M 0 ${-r} L ${-1.5 * r} 0 L 0 ${r} Z`;
AngleHandleView.shapeLeft = (r) => `M 0 ${-r} L ${1.5 * r} 0 L 0 ${r} Z`;
exports.AngleHandleView = AngleHandleView;
class DistanceRatioHandleView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dragging: false,
            newValue: this.props.handle.value
        };
    }
    clip(v) {
        const min = this.props.handle.clipRange[0];
        const max = this.props.handle.clipRange[1];
        if (v < min) {
            v = min;
        }
        if (v > max) {
            v = max;
        }
        if (v < 0.05) {
            v = 0;
        }
        return v;
    }
    componentDidMount() {
        this.hammer = new Hammer(this.refs.margin);
        this.hammer.add(new Hammer.Pan({ threshold: 1 }));
        let context = null;
        let oldValue = 0;
        this.hammer.on("panstart", e => {
            context = new HandlesDragContext();
            oldValue = this.props.handle.value;
            this.setState({
                dragging: true,
                newValue: oldValue
            });
            if (this.props.onDragStart) {
                this.props.onDragStart(this.props.handle, context);
            }
        });
        this.hammer.on("pan", e => {
            if (context) {
                const cc = this.refs.centerCircle.getBoundingClientRect();
                const px = e.center.x - (cc.left + cc.width / 2);
                const py = e.center.y - (cc.top + cc.height / 2);
                let d = Math.sqrt(px * px + py * py) / this.props.zoom.scale;
                d =
                    (d - this.props.handle.startDistance) /
                        (this.props.handle.endDistance - this.props.handle.startDistance);
                d = this.clip(d);
                const newValue = d;
                this.setState({
                    newValue
                });
                context.emit("drag", { value: newValue });
            }
        });
        this.hammer.on("panend", e => {
            if (context) {
                const cc = this.refs.centerCircle.getBoundingClientRect();
                const px = e.center.x - (cc.left + cc.width / 2);
                const py = e.center.y - (cc.top + cc.height / 2);
                let d = Math.sqrt(px * px + py * py) / this.props.zoom.scale;
                d =
                    (d - this.props.handle.startDistance) /
                        (this.props.handle.endDistance - this.props.handle.startDistance);
                d = this.clip(d);
                const newValue = d;
                // if (this.props.handle.range) {
                //     newValue = Math.min(this.props.handle.range[1], Math.max(newValue, this.props.handle.range[0]));
                // }
                context.emit("end", { value: newValue });
                this.setState({
                    dragging: false
                });
                context = null;
            }
        });
    }
    componentWillUnmount() {
        this.hammer.destroy();
    }
    render() {
        const { handle } = this.props;
        const fX = (x) => x * this.props.zoom.scale + this.props.zoom.centerX;
        const fY = (y) => -y * this.props.zoom.scale + this.props.zoom.centerY;
        const cx = fX(handle.cx);
        const cy = fY(handle.cy);
        const d1 = handle.startDistance * this.props.zoom.scale;
        const d2 = handle.endDistance * this.props.zoom.scale;
        const fRadius = (x) => x * (d2 - d1) + d1;
        const makePath = (value) => {
            const path = core_1.Graphics.makePath();
            path.polarLineTo(0, 0, 90 - handle.startAngle, fRadius(value), 90 - handle.endAngle, fRadius(value), true);
            return renderer_1.renderSVGPath(path.path.cmds);
        };
        const px = (value) => {
            const alpha = ((90 - handle.startAngle) / 180) * Math.PI;
            return Math.cos(alpha) * fRadius(value);
        };
        const py = (value) => {
            const alpha = ((90 - handle.startAngle) / 180) * Math.PI;
            return -Math.sin(alpha) * fRadius(value);
        };
        return (React.createElement("g", { ref: "margin", className: utils_1.classNames("handle", "handle-distance", ["active", this.state.dragging], ["visible", handle.visible || this.props.visible]) },
            React.createElement("g", { transform: `translate(${cx},${cy})` },
                React.createElement("circle", { ref: "centerCircle", cx: 0, cy: 0, r: 0 }),
                React.createElement("path", { d: makePath(handle.value), className: "element-line handle-ghost" }),
                React.createElement("path", { d: makePath(handle.value), className: "element-line handle-highlight" }),
                handle.value == 0 ? (React.createElement("circle", { cx: px(handle.value), cy: py(handle.value), r: 3, className: "element-shape handle-highlight" })) : null),
            this.state.dragging ? (React.createElement("g", { transform: `translate(${cx},${cy})` },
                React.createElement("path", { d: makePath(this.state.newValue), className: "element-line handle-hint" }),
                this.state.newValue == 0 ? (React.createElement("circle", { cx: px(this.state.newValue), cy: py(this.state.newValue), r: 3, className: "element-shape handle-hint" })) : null)) : null));
    }
}
exports.DistanceRatioHandleView = DistanceRatioHandleView;
class TextAlignmentHandleView extends React.Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
        this.state = {
            dragging: false,
            newAlignment: props.handle.alignment,
            newRotation: props.handle.rotation
        };
    }
    getRelativePoint(px, py) {
        const anchorBounds = this.anchorCircle.getBoundingClientRect();
        const x = px - (anchorBounds.left + anchorBounds.width / 2);
        const y = py - (anchorBounds.top + anchorBounds.height / 2);
        return { x: x / this.props.zoom.scale, y: -y / this.props.zoom.scale };
    }
    componentDidMount() {
        this.hammer = new Hammer(this.container);
        this.hammer.add(new Hammer.Pan({ threshold: 1 }));
        this.hammer.add(new Hammer.Tap());
        let mode = null;
        let startX = 0;
        let startY = 0;
        let sumDeltaX = 0, dXLast = 0;
        let sumDeltaY = 0, dYLast = 0;
        let p0;
        let previousAlignment;
        let previousRotation;
        let context = null;
        const newStateFromMoveAndRotate = (dx, dy, newRotation, snapping) => {
            const rect = this.getRectFromAlignment(previousAlignment, previousRotation);
            const acx = rect.cx - this.props.handle.anchorX;
            const acy = rect.cy - this.props.handle.anchorY;
            const newAlignment = {
                x: previousAlignment.x,
                y: previousAlignment.y,
                xMargin: previousAlignment.xMargin,
                yMargin: previousAlignment.yMargin
            };
            const cos = Math.cos((newRotation / 180) * Math.PI);
            const sin = Math.sin((newRotation / 180) * Math.PI);
            const pdx = dx * cos + dy * sin;
            const pdy = -dx * sin + dy * cos;
            const pcx = acx * cos + acy * sin;
            const pcy = -acx * sin + acy * cos;
            const npcx = pcx + pdx;
            const npcy = pcy + pdy;
            if (snapping && Math.abs(npcy) < 5 / this.props.zoom.scale) {
                newAlignment.y = "middle";
            }
            else if (npcy < 0) {
                newAlignment.y = "top";
                newAlignment.yMargin = -npcy - this.props.handle.textHeight / 2;
                if (Math.abs(newAlignment.yMargin) < 5 / this.props.zoom.scale) {
                    newAlignment.yMargin = 0;
                }
            }
            else {
                newAlignment.y = "bottom";
                newAlignment.yMargin = npcy - this.props.handle.textHeight / 2;
                if (Math.abs(newAlignment.yMargin) < 5 / this.props.zoom.scale) {
                    newAlignment.yMargin = 0;
                }
            }
            if (snapping && Math.abs(npcx) < 5 / this.props.zoom.scale) {
                newAlignment.x = "middle";
            }
            else if (npcx < 0) {
                newAlignment.x = "right";
                newAlignment.xMargin = -npcx - this.props.handle.textWidth / 2;
                if (Math.abs(newAlignment.xMargin) < 5 / this.props.zoom.scale) {
                    newAlignment.xMargin = 0;
                }
            }
            else {
                newAlignment.x = "left";
                newAlignment.xMargin = npcx - this.props.handle.textWidth / 2;
                if (Math.abs(newAlignment.xMargin) < 5 / this.props.zoom.scale) {
                    newAlignment.xMargin = 0;
                }
            }
            return [newAlignment, newRotation];
        };
        const handleRotation = (p1, commit = false) => {
            const rect = this.getRectFromAlignment(previousAlignment, previousRotation);
            const ox = rect.cx - this.props.handle.anchorX;
            const oy = rect.cy - this.props.handle.anchorY;
            let newRotation = (Math.atan2(p1.y - oy, p1.x - ox) / Math.PI) * 180 + 180;
            newRotation = Math.round(newRotation / 15) * 15;
            const newAlignment = newStateFromMoveAndRotate(0, 0, newRotation, false)[0];
            if (commit) {
                this.setState({
                    dragging: false
                });
                context.emit("end", { alignment: newAlignment, rotation: newRotation });
            }
            else {
                this.setState({
                    newAlignment,
                    newRotation
                });
                context.emit("drag", {
                    alignment: newAlignment,
                    rotation: newRotation
                });
            }
        };
        const handleAlignment = (p1, commit = false) => {
            const [newAlignment, newRotation] = newStateFromMoveAndRotate(p1.x - p0.x, p1.y - p0.y, previousRotation, true);
            if (commit) {
                this.setState({
                    dragging: false
                });
                context.emit("end", {
                    alignment: newAlignment,
                    rotation: previousRotation
                });
            }
            else {
                this.setState({
                    newAlignment
                });
                context.emit("drag", {
                    alignment: newAlignment,
                    rotation: previousRotation
                });
            }
        };
        this.hammer.on("panstart", e => {
            const cx = e.center.x - e.deltaX;
            const cy = e.center.y - e.deltaY;
            startX = cx;
            startY = cy;
            dXLast = e.deltaX;
            dYLast = e.deltaY;
            sumDeltaX = e.deltaX;
            sumDeltaY = e.deltaY;
            const el = document.elementFromPoint(cx, cy);
            context = new HandlesDragContext();
            this.props.onDragStart(this.props.handle, context);
            p0 = this.getRelativePoint(cx, cy);
            const p1 = this.getRelativePoint(cx + e.deltaX, cy + e.deltaY);
            previousAlignment = this.props.handle.alignment;
            previousRotation = this.props.handle.rotation;
            if (el == this.rotationCircle) {
                mode = "rotation";
                handleRotation(p1);
            }
            else {
                mode = "alignment";
                handleAlignment(p1);
            }
            this.setState({
                dragging: true,
                newAlignment: previousAlignment,
                newRotation: previousRotation
            });
        });
        this.hammer.on("pan", e => {
            sumDeltaX += e.deltaX - dXLast;
            sumDeltaY += e.deltaY - dYLast;
            dXLast = e.deltaX;
            dYLast = e.deltaY;
            const cx = startX + sumDeltaX;
            const cy = startY + sumDeltaY;
            // cx = e.center.x;
            // cy = e.center.y;
            const p1 = this.getRelativePoint(cx, cy);
            if (mode == "rotation") {
                handleRotation(p1);
            }
            else {
                handleAlignment(p1);
            }
        });
        this.hammer.on("panend", e => {
            sumDeltaX += e.deltaX - dXLast;
            sumDeltaY += e.deltaY - dYLast;
            dXLast = e.deltaX;
            dYLast = e.deltaY;
            const cx = startX + sumDeltaX;
            const cy = startY + sumDeltaY;
            // cx = e.center.x;
            // cy = e.center.y;
            const p1 = this.getRelativePoint(cx, cy);
            if (mode == "rotation") {
                handleRotation(p1, true);
            }
            else {
                handleAlignment(p1, true);
            }
            context = null;
        });
    }
    componentWillUnmount() {
        this.hammer.destroy();
    }
    handleClick() {
        if (this.props.handle.text == null) {
            return;
        }
        globals.popupController.popupAt(context => {
            return (React.createElement(controllers_1.PopupView, { context: context },
                React.createElement("div", { className: "handle-text-view-popup" },
                    React.createElement(components_1.EditableTextView, { text: this.props.handle.text, autofocus: true, onEdit: newText => {
                            const dragContext = new HandlesDragContext();
                            this.props.onDragStart(this.props.handle, dragContext);
                            dragContext.emit("end", { text: newText });
                            context.close();
                        } }))));
        }, {
            anchor: this.container
        });
    }
    getRectFromAlignment(alignment, rotation) {
        const cos = Math.cos((rotation / 180) * Math.PI);
        const sin = Math.sin((rotation / 180) * Math.PI);
        let dx = 0, dy = 0;
        if (alignment.x == "left") {
            dx = this.props.handle.textWidth / 2 + alignment.xMargin;
        }
        if (alignment.x == "right") {
            dx = -this.props.handle.textWidth / 2 - alignment.xMargin;
        }
        const fx = dx - this.props.handle.textWidth / 2 - 10 / this.props.zoom.scale;
        if (alignment.y == "top") {
            dy = -this.props.handle.textHeight / 2 - alignment.yMargin;
        }
        if (alignment.y == "bottom") {
            dy = +this.props.handle.textHeight / 2 + alignment.yMargin;
        }
        return {
            cx: this.props.handle.anchorX + dx * cos - dy * sin,
            cy: this.props.handle.anchorY + dx * sin + dy * cos,
            fx: this.props.handle.anchorX + fx * cos - dy * sin,
            fy: this.props.handle.anchorY + fx * sin + dy * cos,
            width: this.props.handle.textWidth,
            height: this.props.handle.textHeight,
            rotation
        };
    }
    renderDragging() {
        if (this.state.dragging) {
            const zoom = this.props.zoom;
            const rect = this.getRectFromAlignment(this.state.newAlignment, this.state.newRotation);
            const p = core_2.Geometry.applyZoom(zoom, { x: rect.cx, y: -rect.cy });
            const fp = core_2.Geometry.applyZoom(zoom, { x: rect.fx, y: -rect.fy });
            const margin = 0;
            return (React.createElement("g", null,
                React.createElement("rect", { className: "element-shape handle-hint", transform: `translate(${p.x.toFixed(6)},${p.y.toFixed(6)})rotate(${-rect.rotation})`, x: (-rect.width / 2) * zoom.scale - margin, y: (-rect.height / 2) * zoom.scale - margin, width: rect.width * zoom.scale + margin * 2, height: rect.height * zoom.scale + margin * 2 })));
        }
        else {
            return null;
        }
    }
    render() {
        const handle = this.props.handle;
        const zoom = this.props.zoom;
        const margin = 0;
        const rect = this.getRectFromAlignment(handle.alignment, handle.rotation);
        const p = core_2.Geometry.applyZoom(zoom, { x: rect.cx, y: -rect.cy });
        const anchor = core_2.Geometry.applyZoom(zoom, {
            x: handle.anchorX,
            y: -handle.anchorY
        });
        const fp = core_2.Geometry.applyZoom(zoom, { x: rect.fx, y: -rect.fy });
        return (React.createElement("g", { className: utils_1.classNames("handle", "handle-text-input", ["active", this.state.dragging], ["visible", handle.visible || this.props.visible]), onClick: this.handleClick, ref: e => (this.container = e) },
            React.createElement("circle", { className: "element-shape handle-ghost", cx: anchor.x, cy: anchor.y, r: 0, ref: e => (this.anchorCircle = e) }),
            React.createElement("g", { transform: `translate(${fp.x - 16},${fp.y - 16})` },
                React.createElement("path", { className: "element-solid handle-highlight", d: "M22.05664,15a.99974.99974,0,0,0-1,1,5.05689,5.05689,0,1,1-6.07794-4.95319v2.38654l6.04468-3.49042L14.9787,6.45245V9.02539A7.05306,7.05306,0,1,0,23.05664,16,.99973.99973,0,0,0,22.05664,15Z" })),
            React.createElement("line", { className: "element-line handle-dashed-highlight", x1: anchor.x, y1: anchor.y, x2: p.x, y2: p.y }),
            React.createElement("rect", { className: "element-shape handle-ghost element-text-rect", transform: `translate(${p.x.toFixed(6)},${p.y.toFixed(6)})rotate(${-rect.rotation})`, x: (-rect.width / 2) * zoom.scale - margin, y: (-rect.height / 2) * zoom.scale - margin, width: rect.width * zoom.scale + margin * 2, height: rect.height * zoom.scale + margin * 2 }),
            React.createElement("circle", { className: "element-shape handle-ghost element-rotation", ref: e => (this.rotationCircle = e), cx: fp.x, cy: fp.y, r: 8 }),
            this.renderDragging()));
    }
}
exports.TextAlignmentHandleView = TextAlignmentHandleView;
class ResizeHandleView extends React.Component {
    constructor() {
        super(...arguments);
        this.state = {
            dragging: false,
            newX1: this.props.cx - this.props.width / 2,
            newY1: this.props.cy - this.props.height / 2,
            newX2: this.props.cx + this.props.width / 2,
            newY2: this.props.cy + this.props.height / 2
        };
    }
    componentDidMount() {
        this.hammer = new Hammer(this.refs.container);
        this.hammer.add(new Hammer.Pan());
        let oldWidth, oldHeight;
        let dXIntegrate, dYIntegrate;
        let dXLast, dYLast;
        let opX, opY;
        const compute = () => {
            let newWidth = oldWidth + dXIntegrate * opX * 2;
            let newHeight = oldHeight + dYIntegrate * opY * 2;
            if (newWidth < 50) {
                newWidth = 50;
            }
            if (newHeight < 50) {
                newHeight = 50;
            }
            return [newWidth, newHeight];
        };
        this.hammer.on("panstart", e => {
            let element = document.elementFromPoint(e.center.x - e.deltaX, e.center.y - e.deltaY);
            oldWidth = this.props.width;
            oldHeight = this.props.height;
            dXIntegrate = e.deltaX / this.props.zoom.scale;
            dXLast = e.deltaX;
            dYIntegrate = -e.deltaY / this.props.zoom.scale;
            dYLast = e.deltaY;
            opX = 0;
            opY = 0;
            while (element) {
                if (element == this.refs.lineX1) {
                    opX = -1;
                }
                if (element == this.refs.lineX2) {
                    opX = 1;
                }
                if (element == this.refs.lineY1) {
                    opY = -1;
                }
                if (element == this.refs.lineY2) {
                    opY = 1;
                }
                if (element == this.refs.cornerX1Y1) {
                    opX = -1;
                    opY = -1;
                }
                if (element == this.refs.cornerX1Y2) {
                    opX = -1;
                    opY = 1;
                }
                if (element == this.refs.cornerX2Y1) {
                    opX = 1;
                    opY = -1;
                }
                if (element == this.refs.cornerX2Y2) {
                    opX = 1;
                    opY = 1;
                }
                element = element.parentElement;
            }
            const [nW, nH] = compute();
            this.setState({
                dragging: true,
                newX1: this.props.cx - nW / 2,
                newY1: this.props.cy - nH / 2,
                newX2: this.props.cx + nW / 2,
                newY2: this.props.cy + nH / 2
            });
        });
        this.hammer.on("pan", e => {
            dXIntegrate += (e.deltaX - dXLast) / this.props.zoom.scale;
            dXLast = e.deltaX;
            dYIntegrate += -(e.deltaY - dYLast) / this.props.zoom.scale;
            dYLast = e.deltaY;
            const [nW, nH] = compute();
            this.setState({
                newX1: this.props.cx - nW / 2,
                newY1: this.props.cy - nH / 2,
                newX2: this.props.cx + nW / 2,
                newY2: this.props.cy + nH / 2
            });
        });
        this.hammer.on("panend", e => {
            dXIntegrate += (e.deltaX - dXLast) / this.props.zoom.scale;
            dXLast = e.deltaX;
            dYIntegrate += -(e.deltaY - dYLast) / this.props.zoom.scale;
            dYLast = e.deltaY;
            const [nW, nH] = compute();
            this.setState({
                dragging: false
            });
            this.props.onResize(nW, nH);
        });
    }
    componentWillUnmount() {
        this.hammer.destroy();
    }
    render() {
        const fX = (x) => x * this.props.zoom.scale + this.props.zoom.centerX;
        const fY = (y) => -y * this.props.zoom.scale + this.props.zoom.centerY;
        const x1 = this.props.cx - this.props.width / 2;
        const y1 = this.props.cy - this.props.height / 2;
        const x2 = this.props.cx + this.props.width / 2;
        const y2 = this.props.cy + this.props.height / 2;
        return (React.createElement("g", { className: utils_1.classNames("handle", "handle-resize", [
                "active",
                this.state.dragging
            ]), ref: "container" },
            React.createElement("g", { ref: "lineY1", style: { cursor: "ns-resize" } },
                React.createElement("line", { className: "element-line handle-ghost", x1: fX(x1), y1: fY(y1), x2: fX(x2), y2: fY(y1) }),
                React.createElement("line", { className: "element-line handle-highlight", x1: fX(x1), y1: fY(y1), x2: fX(x2), y2: fY(y1) })),
            React.createElement("g", { ref: "lineY2", style: { cursor: "ns-resize" } },
                React.createElement("line", { className: "element-line handle-ghost", x1: fX(x1), y1: fY(y2), x2: fX(x2), y2: fY(y2) }),
                React.createElement("line", { className: "element-line handle-highlight", x1: fX(x1), y1: fY(y2), x2: fX(x2), y2: fY(y2) })),
            React.createElement("g", { ref: "lineX1", style: { cursor: "ew-resize" } },
                React.createElement("line", { className: "element-line handle-ghost", x1: fX(x1), y1: fY(y1), x2: fX(x1), y2: fY(y2) }),
                React.createElement("line", { className: "element-line handle-highlight", x1: fX(x1), y1: fY(y1), x2: fX(x1), y2: fY(y2) })),
            React.createElement("g", { ref: "lineX2", style: { cursor: "ew-resize" } },
                React.createElement("line", { className: "element-line handle-ghost", x1: fX(x2), y1: fY(y1), x2: fX(x2), y2: fY(y2) }),
                React.createElement("line", { className: "element-line handle-highlight", x1: fX(x2), y1: fY(y1), x2: fX(x2), y2: fY(y2) })),
            React.createElement("circle", { className: "element-shape handle-ghost", style: { cursor: "nesw-resize" }, ref: "cornerX1Y1", cx: fX(x1), cy: fY(y1), r: 5 }),
            React.createElement("circle", { className: "element-shape handle-ghost", style: { cursor: "nwse-resize" }, ref: "cornerX2Y1", cx: fX(x2), cy: fY(y1), r: 5 }),
            React.createElement("circle", { className: "element-shape handle-ghost", style: { cursor: "nwse-resize" }, ref: "cornerX1Y2", cx: fX(x1), cy: fY(y2), r: 5 }),
            React.createElement("circle", { className: "element-shape handle-ghost", style: { cursor: "nesw-resize" }, ref: "cornerX2Y2", cx: fX(x2), cy: fY(y2), r: 5 }),
            this.state.dragging ? (React.createElement("g", null,
                React.createElement("line", { className: "element-line handle-hint", x1: fX(this.state.newX1), y1: fY(this.state.newY1), x2: fX(this.state.newX2), y2: fY(this.state.newY1) }),
                React.createElement("line", { className: "element-line handle-hint", x1: fX(this.state.newX1), y1: fY(this.state.newY2), x2: fX(this.state.newX2), y2: fY(this.state.newY2) }),
                React.createElement("line", { className: "element-line handle-hint", x1: fX(this.state.newX1), y1: fY(this.state.newY1), x2: fX(this.state.newX1), y2: fY(this.state.newY2) }),
                React.createElement("line", { className: "element-line handle-hint", x1: fX(this.state.newX2), y1: fY(this.state.newY1), x2: fX(this.state.newX2), y2: fY(this.state.newY2) }))) : null));
    }
}
exports.ResizeHandleView = ResizeHandleView;
class InputCurveHandleView extends React.Component {
    constructor() {
        super(...arguments);
        this.state = {
            enabled: false,
            drawing: false,
            points: []
        };
    }
    getPoint(x, y) {
        const bbox = this.refs.interaction.getBoundingClientRect();
        x -= bbox.left;
        y -= bbox.top + bbox.height;
        x /= this.props.zoom.scale;
        y /= -this.props.zoom.scale;
        // Scale x, y
        const w = Math.abs(this.props.handle.x2 - this.props.handle.x1);
        const h = Math.abs(this.props.handle.y2 - this.props.handle.y1);
        return {
            x: (x - w / 2) / (w / 2),
            y: (y - h / 2) / (w / 2)
        };
    }
    getBezierCurvesFromMousePoints(points) {
        if (points.length < 2) {
            return [];
        }
        const segs = [];
        for (let i = 0; i < points.length - 1; i++) {
            segs.push(new core_1.Graphics.LineSegmentParametrization(points[i], points[i + 1]));
        }
        const lp = new core_1.Graphics.MultiCurveParametrization(segs);
        const lpLength = lp.getLength();
        const segments = Math.ceil(lpLength / 0.2);
        const sampleAtS = (s) => {
            const p = lp.getPointAtS(s);
            let tx = 0, ty = 0;
            for (let k = -5; k <= 5; k++) {
                let ks = s + ((k / 40) * lpLength) / segments;
                ks = Math.max(0, Math.min(lpLength, ks));
                const t = lp.getTangentAtS(ks);
                tx += t.x;
                ty += t.y;
            }
            const t = core_2.Geometry.vectorNormalize({ x: tx, y: ty });
            return [p, t];
        };
        let [p0, t0] = sampleAtS(0);
        let s0 = 0;
        const curves = [];
        for (let i = 1; i <= segments; i++) {
            const s = (i / segments) * lpLength;
            const [pi, ti] = sampleAtS(s);
            const ds = (s - s0) / 3;
            curves.push([
                p0,
                core_2.Geometry.vectorAdd(p0, core_2.Geometry.vectorScale(t0, ds)),
                core_2.Geometry.vectorAdd(pi, core_2.Geometry.vectorScale(ti, -ds)),
                pi
            ]);
            s0 = s;
            p0 = pi;
            t0 = ti;
        }
        return curves;
    }
    componentDidMount() {
        this.hammer = new Hammer(this.refs.interaction);
        this.hammer.on("panstart", e => {
            const x = e.center.x - e.deltaX;
            const y = e.center.y - e.deltaY;
            this.setState({
                drawing: true,
                points: [this.getPoint(x, y)]
            });
        });
        this.hammer.on("pan", e => {
            this.state.points.push(this.getPoint(e.center.x, e.center.y));
            this.setState({
                points: this.state.points
            });
        });
        this.hammer.on("panend", e => {
            const curve = this.getBezierCurvesFromMousePoints(this.state.points);
            const context = new HandlesDragContext();
            this.props.onDragStart(this.props.handle, context);
            context.emit("end", { value: curve });
            this.setState({
                drawing: false,
                enabled: false
            });
        });
    }
    componentWillUnmount() {
        this.hammer.destroy();
    }
    renderDrawing() {
        const handle = this.props.handle;
        const fX = (x) => x * this.props.zoom.scale + this.props.zoom.centerX;
        const fY = (y) => -y * this.props.zoom.scale + this.props.zoom.centerY;
        const transformPoint = (p) => {
            const scaler = Math.abs(handle.x2 - handle.x1) / 2;
            const x = p.x * scaler + (handle.x1 + handle.x2) / 2;
            const y = p.y * scaler + (handle.y1 + handle.y2) / 2;
            return {
                x: fX(x),
                y: fY(y)
            };
        };
        return (React.createElement("path", { d: "M" +
                this.state.points
                    .map(p => {
                    const pt = transformPoint(p);
                    return `${utils_1.toSVGNumber(pt.x)},${utils_1.toSVGNumber(pt.y)}`;
                })
                    .join("L"), className: "handle-hint element-line" }));
    }
    renderButton(x, y) {
        const margin = 2;
        const cx = x - 16 - margin;
        const cy = y + 16 + margin;
        return (React.createElement("g", { className: "handle-button", onClick: () => {
                this.setState({ enabled: true });
            } },
            React.createElement("rect", { x: cx - 16, y: cy - 16, width: 32, height: 32 }),
            React.createElement("image", { xlinkHref: R.getSVGIcon("general/edit"), x: cx - 12, y: cy - 12, width: 24, height: 24 })));
    }
    renderSpiralButton(x, y) {
        const margin = 2;
        const cx = x - 16 - margin;
        const cy = y + 16 + margin;
        let anchorElement;
        return (React.createElement("g", { className: "handle-button", onClick: () => {
                globals.popupController.popupAt(context => {
                    let windings = 4;
                    let startAngle = 180;
                    return (React.createElement(controllers_1.PopupView, { context: context },
                        React.createElement("div", { style: { padding: "10px" } },
                            React.createElement("div", { className: "charticulator__widget-row" },
                                React.createElement("span", { className: "charticulator__widget-row-label" }, "Windings:"),
                                React.createElement(controls_1.InputNumber, { defaultValue: windings, onEnter: value => {
                                        windings = value;
                                        return true;
                                    } })),
                            React.createElement("div", { className: "charticulator__widget-row" },
                                React.createElement("span", { className: "charticulator__widget-row-label" }, "Start Angle:"),
                                React.createElement(controls_1.InputNumber, { defaultValue: startAngle, onEnter: value => {
                                        startAngle = value;
                                        return true;
                                    } })),
                            React.createElement("div", { style: { textAlign: "right", marginTop: "10px" } },
                                React.createElement(components_1.ButtonRaised, { text: "Draw Spiral", onClick: () => {
                                        context.close();
                                        // Make sprial and emit.
                                        const dragContext = new HandlesDragContext();
                                        const curve = [];
                                        this.props.onDragStart(this.props.handle, dragContext);
                                        const thetaStart = (startAngle / 180) * Math.PI;
                                        const thetaEnd = thetaStart + windings * Math.PI * 2;
                                        const N = 64;
                                        const a = 1 / thetaEnd; // r = a theta
                                        const swapXY = (p) => {
                                            return { x: p.y, y: p.x };
                                        };
                                        for (let i = 0; i < N; i++) {
                                            const theta1 = thetaStart + (i / N) * (thetaEnd - thetaStart);
                                            const theta2 = thetaStart +
                                                ((i + 1) / N) * (thetaEnd - thetaStart);
                                            const scaler = 3 / (theta2 - theta1);
                                            const r1 = a * theta1;
                                            const r2 = a * theta2;
                                            const p1 = {
                                                x: r1 * Math.cos(theta1),
                                                y: r1 * Math.sin(theta1)
                                            };
                                            const p2 = {
                                                x: r2 * Math.cos(theta2),
                                                y: r2 * Math.sin(theta2)
                                            };
                                            const cp1 = {
                                                x: p1.x +
                                                    (a *
                                                        (Math.cos(theta1) -
                                                            theta1 * Math.sin(theta1))) /
                                                        scaler,
                                                y: p1.y +
                                                    (a *
                                                        (Math.sin(theta1) +
                                                            theta1 * Math.cos(theta1))) /
                                                        scaler
                                            };
                                            const cp2 = {
                                                x: p2.x -
                                                    (a *
                                                        (Math.cos(theta2) -
                                                            theta2 * Math.sin(theta2))) /
                                                        scaler,
                                                y: p2.y -
                                                    (a *
                                                        (Math.sin(theta2) +
                                                            theta2 * Math.cos(theta2))) /
                                                        scaler
                                            };
                                            curve.push([p1, cp1, cp2, p2].map(swapXY));
                                        }
                                        dragContext.emit("end", { value: curve });
                                    } })))));
                }, { anchor: anchorElement });
            } },
            React.createElement("rect", { x: cx - 16, y: cy - 16, width: 32, height: 32, ref: e => (anchorElement = e) }),
            React.createElement("image", { xlinkHref: R.getSVGIcon("scaffold/spiral"), x: cx - 12, y: cy - 12, width: 24, height: 24 })));
    }
    render() {
        const handle = this.props.handle;
        const fX = (x) => x * this.props.zoom.scale + this.props.zoom.centerX;
        const fY = (y) => -y * this.props.zoom.scale + this.props.zoom.centerY;
        return (React.createElement("g", { className: "handle" },
            React.createElement("rect", { ref: "interaction", style: {
                    pointerEvents: this.state.enabled ? "fill" : "none",
                    cursor: "crosshair"
                }, className: "handle-ghost element-region", x: Math.min(fX(handle.x1), fX(handle.x2)), y: Math.min(fY(handle.y1), fY(handle.y2)), width: Math.abs(fX(handle.x1) - fX(handle.x2)), height: Math.abs(fY(handle.y1) - fY(handle.y2)) }),
            this.state.drawing ? this.renderDrawing() : null,
            !this.state.enabled ? (React.createElement("g", null,
                this.renderSpiralButton(Math.max(fX(handle.x1), fX(handle.x2)) - 38, Math.min(fY(handle.y1), fY(handle.y2))),
                this.renderButton(Math.max(fX(handle.x1), fX(handle.x2)), Math.min(fY(handle.y1), fY(handle.y2))))) : null));
    }
}
exports.InputCurveHandleView = InputCurveHandleView;
//# sourceMappingURL=handles.js.map