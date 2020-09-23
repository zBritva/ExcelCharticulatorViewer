"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const core_1 = require("../../../core");
const globals = require("../../globals");
const utils_1 = require("../../utils");
class DropZoneView extends React.Component {
    constructor(props) {
        super(props);
        this.state = { active: false };
    }
    componentDidMount() {
        globals.dragController.registerDroppable(this, this.refs.container);
    }
    componentWillUnmount() {
        globals.dragController.unregisterDroppable(this);
    }
    onDragEnter(ctx) {
        const data = ctx.data;
        const handler = this.props.onDragEnter(data);
        if (handler) {
            this.setState({
                active: true
            });
            ctx.onLeave(() => {
                this.setState({
                    active: false
                });
            });
            ctx.onDrop((point, modifiers) => {
                return handler(point, modifiers);
            });
            return true;
        }
        else {
            return false;
        }
    }
    makeClosePath(...points) {
        return `M${points.map(d => `${d.x},${d.y}`).join("L")}Z`;
    }
    makeDashedLine(p1, p2) {
        return (React.createElement("line", { className: "dropzone-element-dashline", x1: p1.x, y1: p1.y, x2: p2.x, y2: p2.y }));
    }
    makeLine(p1, p2, arrow1 = 0, arrow2 = 0) {
        const d1 = core_1.Geometry.vectorScale(core_1.Geometry.vectorNormalize(core_1.Geometry.vectorSub(p2, p1)), arrow1);
        const n1 = core_1.Geometry.vectorScale(core_1.Geometry.vectorRotate90(d1), 0.25);
        const p1n = core_1.Geometry.vectorAdd(p1, d1);
        const p1a1 = core_1.Geometry.vectorAdd(p1n, n1);
        const p1a2 = core_1.Geometry.vectorSub(p1n, n1);
        const d2 = core_1.Geometry.vectorScale(core_1.Geometry.vectorNormalize(core_1.Geometry.vectorSub(p2, p1)), arrow2);
        const n2 = core_1.Geometry.vectorScale(core_1.Geometry.vectorRotate90(d2), 0.25);
        const p2n = core_1.Geometry.vectorSub(p2, d2);
        const p2a1 = core_1.Geometry.vectorAdd(p2n, n2);
        const p2a2 = core_1.Geometry.vectorSub(p2n, n2);
        return (React.createElement("g", { className: "dropzone-element-line" },
            React.createElement("line", { x1: p1n.x, y1: p1n.y, x2: p2n.x, y2: p2n.y, style: { strokeLinecap: "butt" } }),
            arrow1 > 0 ? React.createElement("path", { d: this.makeClosePath(p1a1, p1a2, p1) }) : null,
            ",",
            arrow2 > 0 ? React.createElement("path", { d: this.makeClosePath(p2a1, p2a2, p2) }) : null));
    }
    makeTextAtCenter(p1, p2, text, dx = 0, dy = 0) {
        const cx = (p1.x + p2.x) / 2;
        const cy = (p1.y + p2.y) / 2;
        const angle = Math.atan2(p2.y - p1.y, p2.x - p1.x);
        const height = 9;
        let extra = "";
        if (Math.abs(angle) < Math.PI / 2) {
            extra = `translate(0, ${-height / 2}) rotate(180) translate(0, ${height /
                2})`;
        }
        return (React.createElement("g", { transform: `translate(${cx},${cy}) rotate(${((angle + Math.PI) /
                Math.PI) *
                180}) translate(${dx},${dy}) ${extra}` },
            React.createElement("text", { className: "dropzone-element-text", x: 0, y: 0, style: { textAnchor: "middle" } }, text)));
    }
    renderElement(z) {
        switch (z.type) {
            case "line": {
                const zone = z;
                let { p1: zp2, p2: zp1 } = zone;
                zp1 = core_1.Geometry.applyZoom(this.props.zoom, { x: zp1.x, y: -zp1.y });
                zp2 = core_1.Geometry.applyZoom(this.props.zoom, { x: zp2.x, y: -zp2.y });
                const vD = core_1.Geometry.vectorNormalize(core_1.Geometry.vectorSub(zp2, zp1));
                const vN = core_1.Geometry.vectorRotate90(vD);
                const p1 = core_1.Geometry.vectorAdd(zp1, core_1.Geometry.vectorScale(vN, 5));
                const p2 = core_1.Geometry.vectorAdd(zp2, core_1.Geometry.vectorScale(vN, 5));
                return (React.createElement("g", null,
                    React.createElement("path", { className: "dropzone-highlighter", d: this.makeClosePath(
                        // zp1, zp2,
                        core_1.Geometry.vectorAdd(zp1, core_1.Geometry.vectorScale(vN, -10)), core_1.Geometry.vectorAdd(zp2, core_1.Geometry.vectorScale(vN, -10)), core_1.Geometry.vectorAdd(zp2, core_1.Geometry.vectorScale(vN, 25)), core_1.Geometry.vectorAdd(zp1, core_1.Geometry.vectorScale(vN, 25))) }),
                    React.createElement("path", { className: "dropzone-element-solid", d: this.makeClosePath(zp1, zp2, core_1.Geometry.vectorAdd(zp2, core_1.Geometry.vectorScale(vN, 5)), core_1.Geometry.vectorAdd(zp1, core_1.Geometry.vectorScale(vN, 5))) }),
                    this.makeTextAtCenter(zp1, zp2, zone.title, 0, -6)));
            }
            case "arc": {
                const makeArc = (x, y, radius, startAngle, endAngle) => {
                    const angleOffset = -90;
                    const start = [
                        x + radius * Math.cos(((angleOffset + startAngle) * Math.PI) / 180),
                        y + radius * Math.sin(((angleOffset + startAngle) * Math.PI) / 180)
                    ];
                    const end = [
                        x + radius * Math.cos(((angleOffset + endAngle) * Math.PI) / 180),
                        y + radius * Math.sin(((angleOffset + endAngle) * Math.PI) / 180)
                    ];
                    const largeArcFlag = endAngle - startAngle < 180 ? 0 : 1;
                    return [
                        "M",
                        start[0].toFixed(6),
                        start[1].toFixed(6),
                        "A",
                        radius.toFixed(6),
                        radius.toFixed(6),
                        0,
                        largeArcFlag,
                        1,
                        end[0].toFixed(6),
                        end[1].toFixed(6)
                    ].join(" ");
                };
                const zone = z;
                const zcenter = core_1.Geometry.applyZoom(this.props.zoom, {
                    x: zone.center.x,
                    y: -zone.center.y
                });
                const zradius = zone.radius * this.props.zoom.scale;
                const width = 5;
                const angle1 = zone.angleStart;
                let angle2 = zone.angleEnd;
                const angleCenter = (angle1 + angle2) / 2;
                if ((angle2 - angle1) % 360 == 0) {
                    angle2 -= 1e-4;
                }
                const arc = makeArc(zcenter.x, zcenter.y, zradius + width / 2, angle1, angle2);
                const p1 = core_1.Geometry.vectorAdd(zcenter, core_1.Geometry.vectorRotate({ x: zradius + 5, y: 0 }, ((-angleCenter + 1 + 90) / 180) * Math.PI));
                const p2 = core_1.Geometry.vectorAdd(zcenter, core_1.Geometry.vectorRotate({ x: zradius + 5, y: 0 }, ((-angleCenter - 1 + 90) / 180) * Math.PI));
                return (React.createElement("g", null,
                    React.createElement("path", { className: "dropzone-highlighter-stroke", d: arc, style: { strokeWidth: 25 } }),
                    React.createElement("path", { className: "dropzone-element-arc", d: arc, style: { strokeWidth: 5 } }),
                    this.makeTextAtCenter(p1, p2, zone.title, 0, 8)));
            }
            // case "coordinate": {
            //     let zone = z as Prototypes.DropZones.Coordinate;
            //     let p1 = Geometry.applyZoom(this.props.zoom, { x: zone.p.x, y: zone.p.y });
            //     let p2 = Geometry.applyZoom(this.props.zoom, { x: zone.p.x, y: zone.p.y });
            //     let distance = 20;
            //     let length = 25;
            //     if (zone.mode == "x") {
            //         p1.y -= distance * zone.direction;
            //         p2.y -= distance * zone.direction;
            //         p1.x += length / 2 * zone.direction;
            //         p2.x -= length / 2 * zone.direction;
            //     }
            //     if (zone.mode == "y") {
            //         p1.x -= distance * zone.direction;
            //         p2.x -= distance * zone.direction;
            //         p1.y -= length / 2 * zone.direction;
            //         p2.y += length / 2 * zone.direction;
            //     }
            //     return (
            //         <g>
            //             {zone.mode == "x" ? (
            //                 <rect className="dropzone-highlighter"
            //                     x={Math.min(p1.x, p2.x)}
            //                     width={Math.abs(p2.x - p1.x)}
            //                     y={p1.y - 10}
            //                     height={20}
            //                 />
            //             ) : (
            //                     <rect className="dropzone-highlighter"
            //                         y={Math.min(p1.y, p2.y)}
            //                         height={Math.abs(p2.y - p1.y)}
            //                         x={p1.x - 10}
            //                         width={20}
            //                     />
            //                 )}
            //             {this.makeDashedLine({ x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2 }, Geometry.applyZoom(this.props.zoom, zone.p))}
            //             {this.makeLine(p1, p2, 10, 10)}
            //             {this.makeTextAtCenter(p1, p2, zone.title, 0, -5)}
            //         </g>
            //     )
            // }
            case "region": {
                const zone = z;
                const p1 = core_1.Geometry.applyZoom(this.props.zoom, {
                    x: zone.p1.x,
                    y: -zone.p1.y
                });
                const p2 = core_1.Geometry.applyZoom(this.props.zoom, {
                    x: zone.p2.x,
                    y: -zone.p2.y
                });
                return (React.createElement("g", null,
                    React.createElement("rect", { className: "dropzone-highlighter", opacity: 0.5, x: Math.min(p1.x, p2.x), y: Math.min(p1.y, p2.y), width: Math.abs(p2.x - p1.x), height: Math.abs(p2.y - p1.y) }),
                    React.createElement("rect", { className: "dropzone-element-solid", opacity: 0.5, x: Math.min(p1.x, p2.x), y: Math.min(p1.y, p2.y), width: Math.abs(p2.x - p1.x), height: Math.abs(p2.y - p1.y) }),
                    this.makeTextAtCenter({ x: p1.x, y: (p1.y + p2.y) / 2 }, { x: p2.x, y: (p1.y + p2.y) / 2 }, zone.title, 0, 0)));
            }
            case "rectangle": {
                const zone = z;
                const c = core_1.Geometry.applyZoom(this.props.zoom, {
                    x: zone.cx,
                    y: -zone.cy
                });
                const width = this.props.zoom.scale * zone.width;
                const height = this.props.zoom.scale * zone.height;
                return (React.createElement("g", { transform: `translate(${c.x},${c.y}) rotate(${-zone.rotation})` },
                    React.createElement("rect", { className: "dropzone-highlighter", opacity: 0.5, x: -width / 2, y: -height / 2, width: width, height: height }),
                    React.createElement("rect", { className: "dropzone-element-solid", opacity: 0.5, x: -width / 2, y: -height / 2, width: width, height: height }),
                    this.makeTextAtCenter({ x: -width / 2, y: height / 2 }, { x: width / 2, y: height / 2 }, zone.title, 0, 0)));
            }
        }
    }
    render() {
        const z = this.props.zone;
        return (React.createElement("g", { ref: "container", className: utils_1.classNames("dropzone", `dropzone-${z.type}`, [
                "active",
                this.state.active
            ]) }, this.renderElement(z)));
    }
}
exports.DropZoneView = DropZoneView;
//# sourceMappingURL=dropzone.js.map