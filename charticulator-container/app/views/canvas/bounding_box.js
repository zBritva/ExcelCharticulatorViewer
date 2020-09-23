"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
const React = require("react");
const core_1 = require("../../../core");
const utils_1 = require("../../utils");
const renderer_1 = require("../../renderer");
class BoundingBoxView extends React.Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
        this.handleMouseEnter = this.handleMouseEnter.bind(this);
        this.handleMouseLeave = this.handleMouseLeave.bind(this);
    }
    handleClick() {
        if (this.props.onClick) {
            this.props.onClick();
        }
    }
    handleMouseEnter() {
        if (this.props.onMouseEnter) {
            this.props.onMouseEnter();
        }
    }
    handleMouseLeave() {
        if (this.props.onMouseLeave) {
            this.props.onMouseLeave();
        }
    }
    render() {
        const bbox = this.props.boundingBox;
        const zoom = this.props.zoom;
        const offset = this.props.offset || { x: 0, y: 0 };
        const coordinateSystem = this.props.coordinateSystem || new core_1.Graphics.CartesianCoordinates();
        const helper = new core_1.Graphics.CoordinateSystemHelper(coordinateSystem);
        const mainClassName = utils_1.classNames("bounding-box", ["active", this.props.active], ["visible", bbox.visible], ["interactable", this.props.onClick != null]);
        switch (bbox.type) {
            case "rectangle": {
                const rect = bbox;
                const cx = rect.cx + offset.x;
                const cy = rect.cy + offset.y;
                const element = helper.rect(cx - rect.width / 2, cy - rect.height / 2, cx + rect.width / 2, cy + rect.height / 2);
                const p = core_1.Geometry.applyZoom(zoom, { x: cx, y: -cy });
                return (React.createElement("g", { className: mainClassName, onClick: this.handleClick, onMouseEnter: this.handleMouseEnter, onMouseLeave: this.handleMouseLeave, transform: `${utils_1.toSVGZoom(zoom)} translate(${utils_1.toSVGNumber(coordinateSystem.getBaseTransform().x)},${utils_1.toSVGNumber(-coordinateSystem.getBaseTransform().y)})` },
                    renderer_1.renderGraphicalElementSVG(element, {
                        className: "element-shape ghost",
                        noStyle: true
                    }),
                    renderer_1.renderGraphicalElementSVG(element, {
                        className: "element-shape indicator",
                        noStyle: true
                    })));
            }
            case "anchored-rectangle": {
                const rect = bbox;
                const cx = rect.anchorX + offset.x;
                const cy = rect.anchorY + offset.y;
                const trCenter = {
                    x: rect.cx,
                    y: rect.cy,
                    angle: rect.rotation
                };
                const tr = core_1.Graphics.concatTransform(core_1.Graphics.concatTransform(coordinateSystem.getBaseTransform(), coordinateSystem.getLocalTransform(cx, cy)), trCenter);
                const p = core_1.Geometry.applyZoom(zoom, { x: tr.x, y: -tr.y });
                const margin = 0;
                return (React.createElement("g", { className: mainClassName, transform: `translate(${utils_1.toSVGNumber(p.x)},${utils_1.toSVGNumber(p.y)})rotate(${-tr.angle})`, onClick: this.handleClick, onMouseEnter: this.handleMouseEnter, onMouseLeave: this.handleMouseLeave },
                    React.createElement("rect", { className: "element-shape ghost", x: (-rect.width / 2) * zoom.scale - margin, y: (-rect.height / 2) * zoom.scale - margin, width: rect.width * zoom.scale + margin * 2, height: rect.height * zoom.scale + margin * 2 }),
                    React.createElement("rect", { className: "element-shape indicator", x: (-rect.width / 2) * zoom.scale, y: (-rect.height / 2) * zoom.scale, width: rect.width * zoom.scale, height: rect.height * zoom.scale })));
            }
            case "circle": {
                const circle = bbox;
                const cx = circle.cx + offset.x;
                const cy = circle.cy + offset.y;
                const center = coordinateSystem.transformPointWithBase(cx, cy);
                const margin = 2;
                const p = core_1.Geometry.applyZoom(zoom, { x: center.x, y: -center.y });
                const radius = circle.radius * zoom.scale;
                return (React.createElement("g", { className: mainClassName, onClick: this.handleClick, onMouseEnter: this.handleMouseEnter, onMouseLeave: this.handleMouseLeave },
                    React.createElement("circle", { className: "element-shape ghost", cx: p.x, cy: p.y, r: radius + margin }),
                    React.createElement("circle", { className: "element-shape indicator", cx: p.x, cy: p.y, r: radius })));
            }
            case "line": {
                const line = bbox;
                if (line.morphing) {
                    const element = helper.line(line.x1 + offset.x, line.y1 + offset.y, line.x2 + offset.x, line.y2 + offset.y);
                    return (React.createElement("g", { className: mainClassName, onClick: this.handleClick, onMouseEnter: this.handleMouseEnter, onMouseLeave: this.handleMouseLeave, transform: `${utils_1.toSVGZoom(zoom)} translate(${utils_1.toSVGNumber(coordinateSystem.getBaseTransform().x)},${utils_1.toSVGNumber(-coordinateSystem.getBaseTransform().y)})` },
                        renderer_1.renderGraphicalElementSVG(element, {
                            className: "element-line ghost",
                            noStyle: true
                        }),
                        renderer_1.renderGraphicalElementSVG(element, {
                            className: "element-line indicator",
                            noStyle: true
                        })));
                }
                else {
                    let p1 = coordinateSystem.transformPointWithBase(line.x1 + offset.x, line.y1 + offset.y);
                    let p2 = coordinateSystem.transformPointWithBase(line.x2 + offset.x, line.y2 + offset.y);
                    p1 = core_1.Geometry.applyZoom(zoom, { x: p1.x, y: -p1.y });
                    p2 = core_1.Geometry.applyZoom(zoom, { x: p2.x, y: -p2.y });
                    return (React.createElement("g", { className: mainClassName, onClick: this.handleClick, onMouseEnter: this.handleMouseEnter, onMouseLeave: this.handleMouseLeave },
                        React.createElement("line", { className: "element-line ghost", x1: p1.x, y1: p1.y, x2: p2.x, y2: p2.y }),
                        React.createElement("line", { className: "element-line indicator", x1: p1.x, y1: p1.y, x2: p2.x, y2: p2.y })));
                }
            }
        }
    }
}
exports.BoundingBoxView = BoundingBoxView;
//# sourceMappingURL=bounding_box.js.map