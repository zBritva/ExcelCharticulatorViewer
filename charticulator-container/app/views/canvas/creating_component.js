"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
const React = require("react");
const Hammer = require("hammerjs");
const core_1 = require("../../../core");
class PointSnapping {
    constructor(guides, threshold = 10) {
        this.guides = guides;
        this.snappedGuides = new Set();
        this.threshold = threshold;
    }
    beginSnapping() {
        this.snappedGuides = new Set();
    }
    snapXValue(x) {
        let candidate = null;
        let candidateGuide = null;
        let candidateDistance = 1e10;
        let candidateValue = 0;
        for (const guide of this.guides) {
            switch (guide.guide.type) {
                case "x":
                    {
                        const axis = guide.guide;
                        const d = Math.abs(axis.value - x);
                        if (d < this.threshold &&
                            (candidate == null || d < candidateDistance)) {
                            candidateDistance = d;
                            if (guide.element == null) {
                                candidate = {
                                    type: "parent",
                                    parentAttribute: axis.attribute
                                };
                            }
                            else {
                                candidate = {
                                    type: "_element",
                                    element: guide.element._id,
                                    attribute: axis.attribute
                                };
                            }
                            candidateValue = axis.value;
                            candidateGuide = guide;
                        }
                    }
                    break;
            }
        }
        if (candidate) {
            this.snappedGuides.add(candidateGuide);
            return [candidateValue, candidate];
        }
        else {
            return [x, null];
        }
    }
    snapYValue(y) {
        let candidate = null;
        let candidateGuide = null;
        let candidateDistance = 1e10;
        let candidateValue = 0;
        for (const guide of this.guides) {
            switch (guide.guide.type) {
                case "y":
                    {
                        const axis = guide.guide;
                        const d = Math.abs(axis.value - y);
                        if (d < this.threshold &&
                            (candidate == null || d < candidateDistance)) {
                            candidateDistance = d;
                            if (guide.element == null) {
                                candidate = {
                                    type: "parent",
                                    parentAttribute: axis.attribute
                                };
                            }
                            else {
                                candidate = {
                                    type: "_element",
                                    element: guide.element._id,
                                    attribute: axis.attribute
                                };
                            }
                            candidateValue = axis.value;
                            candidateGuide = guide;
                        }
                    }
                    break;
            }
        }
        if (candidate) {
            this.snappedGuides.add(candidateGuide);
            return [candidateValue, candidate];
        }
        else {
            return [y, null];
        }
    }
    endSnapping() {
        return this.snappedGuides;
    }
}
exports.PointSnapping = PointSnapping;
class CreatingComponent extends React.Component {
    constructor(props) {
        super(props);
        this.isHammering = false;
        this.state = {
            points: null,
            draggingPoint: null,
            activeGuides: [],
            hoverCandidateX: null,
            hoverCandidateY: null
        };
    }
    getPointFromEvent(point) {
        const r = this.refs.handler.getBoundingClientRect();
        const p = core_1.Geometry.unapplyZoom(this.props.zoom, {
            x: point.x - r.left,
            y: point.y - r.top
        });
        return { x: p.x, y: -p.y };
    }
    componentDidMount() {
        this.hammer = new Hammer(this.refs.handler);
        switch (this.props.mode) {
            case "point":
            case "hline":
            case "vline":
                {
                    this.hammer.add(new Hammer.Tap());
                    this.hammer.on("tap", e => {
                        const p = this.getPointFromEvent(e.center);
                        let p0X = this.state.hoverCandidateX;
                        let p0Y = this.state.hoverCandidateY;
                        if (p0X == null) {
                            p0X = [p.x, null];
                        }
                        if (p0Y == null) {
                            p0Y = [p.y, null];
                        }
                        if (this.props.mode == "point") {
                            this.props.onCreate(p0X, p0Y);
                        }
                        if (this.props.mode == "hline") {
                            this.props.onCreate(p0Y);
                        }
                        if (this.props.mode == "vline") {
                            this.props.onCreate(p0X);
                        }
                    });
                }
                break;
            case "line":
            case "rectangle": {
                this.hammer.add(new Hammer.Pan());
                this.hammer.add(new Hammer.Tap());
                this.hammer.on("tap", e => {
                    this.props.onCancel();
                });
                let p0X = null;
                let p0Y = null;
                let p1X = null;
                let p1Y = null;
                this.hammer.on("panstart", e => {
                    this.isHammering = true;
                    const p0 = this.getPointFromEvent(core_1.Geometry.vectorSub(e.center, { x: e.deltaX, y: e.deltaY }));
                    const mgr = new PointSnapping(this.props.guides, 10 / this.props.zoom.scale);
                    mgr.beginSnapping();
                    p0X = mgr.snapXValue(p0.x);
                    p0Y = mgr.snapYValue(p0.y);
                    mgr.endSnapping();
                    this.setState({
                        points: [{ x: p0X[0], y: p0Y[0] }],
                        draggingPoint: { x: p0X[0], y: p0Y[0] }
                    });
                });
                this.hammer.on("pan", e => {
                    const p1 = this.getPointFromEvent(e.center);
                    const mgr = new PointSnapping(this.props.guides, 10 / this.props.zoom.scale);
                    mgr.beginSnapping();
                    p1X = mgr.snapXValue(p1.x);
                    p1Y = mgr.snapYValue(p1.y);
                    const guides = mgr.endSnapping();
                    this.setState({
                        points: [{ x: p0X[0], y: p0Y[0] }],
                        draggingPoint: { x: p1X[0], y: p1Y[0] },
                        activeGuides: Array.from(guides)
                    });
                });
                this.hammer.on("panend", e => {
                    this.isHammering = false;
                    this.setState({
                        points: null,
                        draggingPoint: null,
                        activeGuides: []
                    });
                    this.props.onCreate(p0X, p0Y, p1X, p1Y);
                });
            }
        }
    }
    componentWillUnmount() {
        this.hammer.destroy();
    }
    getPixelPoint(p) {
        return core_1.Geometry.applyZoom(this.props.zoom, { x: p.x, y: -p.y });
    }
    renderHint() {
        switch (this.props.mode) {
            case "point": {
                if (this.state.hoverCandidateX == null ||
                    this.state.hoverCandidateY == null) {
                    return null;
                }
                const pp = this.getPixelPoint({
                    x: this.state.hoverCandidateX[0],
                    y: this.state.hoverCandidateY[0]
                });
                return React.createElement("circle", { cx: pp.x, cy: pp.y, r: 3 });
            }
            case "hline": {
                if (this.state.hoverCandidateX == null ||
                    this.state.hoverCandidateY == null) {
                    return null;
                }
                const pp = this.getPixelPoint({
                    x: this.state.hoverCandidateX[0],
                    y: this.state.hoverCandidateY[0]
                });
                return React.createElement("line", { x1: 0, x2: this.props.width, y1: pp.y, y2: pp.y });
            }
            case "vline": {
                if (this.state.hoverCandidateX == null ||
                    this.state.hoverCandidateY == null) {
                    return null;
                }
                const pp = this.getPixelPoint({
                    x: this.state.hoverCandidateX[0],
                    y: this.state.hoverCandidateY[0]
                });
                return React.createElement("line", { y1: 0, y2: this.props.height, x1: pp.x, x2: pp.x });
            }
            case "line": {
                const { points, draggingPoint } = this.state;
                if (points == null || points.length != 1 || draggingPoint == null) {
                    return null;
                }
                const p1 = this.getPixelPoint(points[0]);
                const p2 = this.getPixelPoint(draggingPoint);
                return React.createElement("line", { x1: p1.x, y1: p1.y, x2: p2.x, y2: p2.y });
            }
            case "rectangle": {
                const { points, draggingPoint } = this.state;
                if (points == null || points.length != 1 || draggingPoint == null) {
                    return null;
                }
                const p1 = this.getPixelPoint(points[0]);
                const p2 = this.getPixelPoint(draggingPoint);
                return (React.createElement("rect", { x: Math.min(p1.x, p2.x), y: Math.min(p1.y, p2.y), width: Math.abs(p1.x - p2.x), height: Math.abs(p1.y - p2.y) }));
            }
        }
    }
    renderSnappingGuides() {
        const guides = this.state.activeGuides;
        if (!guides || guides.length == 0) {
            return null;
        }
        return guides.map((guide, idx) => {
            const key = `m${idx}`;
            switch (guide.guide.type) {
                case "x": {
                    const axisGuide = guide.guide;
                    return (React.createElement("line", { key: key, className: "snapping-guide", x1: axisGuide.value * this.props.zoom.scale +
                            this.props.zoom.centerX, x2: axisGuide.value * this.props.zoom.scale +
                            this.props.zoom.centerX, y1: 0, y2: this.props.height }));
                }
                case "y": {
                    const axisGuide = guide.guide;
                    return (React.createElement("line", { key: key, className: "snapping-guide", y1: -axisGuide.value * this.props.zoom.scale +
                            this.props.zoom.centerY, y2: -axisGuide.value * this.props.zoom.scale +
                            this.props.zoom.centerY, x1: 0, x2: this.props.width }));
                }
            }
        });
    }
    render() {
        return (React.createElement("g", { className: "creating-component" },
            this.renderSnappingGuides(),
            this.renderHint(),
            React.createElement("rect", { className: "interaction-handler", style: { cursor: "crosshair" }, ref: "handler", x: 0, y: 0, width: this.props.width, height: this.props.height, onMouseEnter: e => {
                    const move = (e) => {
                        const mgr = new PointSnapping(this.props.guides, 10 / this.props.zoom.scale);
                        if (this.isHammering) {
                            return;
                        }
                        const p = this.getPointFromEvent({ x: e.pageX, y: e.pageY });
                        mgr.beginSnapping();
                        const hx = mgr.snapXValue(p.x);
                        const hy = mgr.snapYValue(p.y);
                        this.setState({
                            activeGuides: Array.from(mgr.endSnapping()),
                            hoverCandidateX: hx,
                            hoverCandidateY: hy
                        });
                    };
                    const leave = () => {
                        this.refs.handler.removeEventListener("mousemove", move);
                        this.refs.handler.removeEventListener("mouseleave", leave);
                    };
                    this.refs.handler.addEventListener("mousemove", move);
                    this.refs.handler.addEventListener("mouseleave", leave);
                } })));
    }
}
exports.CreatingComponent = CreatingComponent;
class CreatingComponentFromCreatingInteraction extends React.Component {
    doCreate(inMappings) {
        const desc = this.props.description;
        const mappings = {};
        const attributes = {};
        for (const attr in desc.mapping) {
            if (inMappings.hasOwnProperty(attr)) {
                const name = desc.mapping[attr];
                mappings[name] = inMappings[attr];
            }
        }
        for (const attr in desc.valueMappings) {
            mappings[attr] = [
                null,
                {
                    type: "value",
                    value: desc.valueMappings[attr]
                }
            ];
        }
        for (const attr in desc.attributes) {
            attributes[attr] = desc.attributes[attr];
        }
        this.props.onCreate(mappings, attributes);
    }
    render() {
        const desc = this.props.description;
        let mode = "point";
        let onCreate = this.props.onCancel;
        function autoSwap(a, b) {
            if (a[0] < b[0]) {
                return [a, b];
            }
            else {
                return [b, a];
            }
        }
        switch (desc.type) {
            case "point":
                {
                    mode = "point";
                    onCreate = (x, y) => {
                        this.doCreate({ x, y });
                    };
                }
                break;
            case "line-segment":
                {
                    mode = "line";
                    onCreate = (x1, y1, x2, y2) => {
                        this.doCreate({ x1, y1, x2, y2 });
                    };
                }
                break;
            case "rectangle":
                {
                    mode = "rectangle";
                    onCreate = (x1, y1, x2, y2) => {
                        [x1, x2] = autoSwap(x1, x2);
                        [y1, y2] = autoSwap(y1, y2);
                        this.doCreate({ xMin: x1, yMin: y1, xMax: x2, yMax: y2 });
                    };
                }
                break;
        }
        return (React.createElement(CreatingComponent, { width: this.props.width, height: this.props.height, zoom: this.props.zoom, guides: this.props.guides, mode: mode, onCancel: this.props.onCancel, onCreate: onCreate }));
    }
}
exports.CreatingComponentFromCreatingInteraction = CreatingComponentFromCreatingInteraction;
//# sourceMappingURL=creating_component.js.map