"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
const _1 = require(".");
const common_1 = require("../common");
const elements_1 = require("./elements");
class CoordinateSystem {
}
exports.CoordinateSystem = CoordinateSystem;
/** Normal cartesian coordinate system */
class CartesianCoordinates extends CoordinateSystem {
    constructor(origin = { x: 0, y: 0 }) {
        super();
        this.origin = origin;
    }
    getBaseTransform() {
        return {
            x: this.origin.x,
            y: this.origin.y,
            angle: 0
        };
    }
    transformPoint(x, y) {
        return { x, y };
    }
    transformDirectionAtPoint(x, y, dx, dy) {
        return { x: dx, y: dy };
    }
    transformPointWithBase(x, y) {
        return { x: x + this.origin.x, y: y + this.origin.y };
    }
    transformDirectionAtPointWithBase(x, y, dx, dy) {
        return { x: dx, y: dy };
    }
    getLocalTransform(x, y) {
        return {
            x,
            y,
            angle: 0
        };
    }
}
exports.CartesianCoordinates = CartesianCoordinates;
const sqrt60 = Math.sqrt(60);
/** Polar coordinates. Angle is in degrees, clockwise, top is 0  */
class PolarCoordinates extends CoordinateSystem {
    constructor(origin = { x: 0, y: 0 }, radial1 = 0, radial2 = 1, distortY = false) {
        super();
        this.origin = origin;
        this.radial1 = radial1;
        this.radial2 = radial2;
        this.distortY = distortY;
    }
    getBaseTransform() {
        return {
            x: this.origin.x,
            y: this.origin.y,
            angle: 0
        };
    }
    transformRadial(radial) {
        if (this.distortY) {
            return Math.sqrt(Math.max(0, (this.radial1 + this.radial2) * radial - this.radial1 * this.radial2));
        }
        else {
            return radial;
        }
    }
    inverseTransformRadial(distance) {
        const y = distance / sqrt60;
        return y * y;
    }
    transformPoint(angle, radial) {
        return {
            x: this.transformRadial(radial) * Math.sin(angle * (Math.PI / 180)),
            y: this.transformRadial(radial) * Math.cos(angle * (Math.PI / 180))
        };
    }
    transformDirectionAtPoint(angle, radial, dx, dy) {
        const t = -angle * (Math.PI / 180);
        return {
            x: dx * Math.cos(t) - dy * Math.sin(t),
            y: dx * Math.sin(t) + dy * Math.cos(t)
        };
    }
    getLocalTransform(angle, radial) {
        const t = angle * (Math.PI / 180);
        return {
            x: this.transformRadial(radial) * Math.sin(t),
            y: this.transformRadial(radial) * Math.cos(t),
            angle: -angle
        };
    }
    transformPointWithBase(angle, radial) {
        const t = angle * (Math.PI / 180);
        return {
            x: this.transformRadial(radial) * Math.sin(t) + this.origin.x,
            y: this.transformRadial(radial) * Math.cos(t) + this.origin.y
        };
    }
    transformDirectionAtPointWithBase(angle, radial, dx, dy) {
        const t = -angle * (Math.PI / 180);
        return {
            x: dx * Math.cos(t) - dy * Math.sin(t),
            y: dx * Math.sin(t) + dy * Math.cos(t)
        };
    }
}
exports.PolarCoordinates = PolarCoordinates;
/** Bezier curve coordinate system. */
class BezierCurveCoordinates extends CoordinateSystem {
    constructor(origin = { x: 0, y: 0 }, curve) {
        super();
        this.origin = origin;
        this.curve = curve;
    }
    getBaseTransform() {
        return {
            x: this.origin.x,
            y: this.origin.y,
            angle: 0
        };
    }
    transformPoint(x, y) {
        const frame = this.curve.getFrameAtS(x);
        return {
            x: frame.p.x + y * frame.n.x,
            y: frame.p.y + y * frame.n.y
        };
    }
    transformDirectionAtPoint(x, y, dx, dy) {
        const frame = this.curve.getFrameAtS(x);
        return {
            x: dx * frame.t.x + dy * frame.n.x,
            y: dx * frame.t.y + dy * frame.n.y
        };
    }
    getLocalTransform(x, y) {
        const frame = this.curve.getFrameAtS(x);
        const angle = (Math.atan2(frame.t.y, frame.t.x) / Math.PI) * 180;
        return {
            x: frame.p.x + y * frame.n.x,
            y: frame.p.y + y * frame.n.y,
            angle
        };
    }
    transformPointWithBase(x, y) {
        const p = this.transformPoint(x, y);
        return {
            x: p.x + this.origin.x,
            y: p.y + this.origin.y
        };
    }
    transformDirectionAtPointWithBase(x, y, dx, dy) {
        return this.transformDirectionAtPoint(x, y, dx, dy);
    }
    getLength() {
        return this.curve.getLength();
    }
    getCurve() {
        return this.curve;
    }
}
exports.BezierCurveCoordinates = BezierCurveCoordinates;
class CoordinateSystemHelper {
    constructor(coordinateSystem) {
        this.coordinateSystem = coordinateSystem;
    }
    rect(x1, y1, x2, y2, style = {}) {
        const cs = this.coordinateSystem;
        if (cs instanceof CartesianCoordinates) {
            return _1.makeRect(x1, y1, x2, y2, style);
        }
        else {
            const path = _1.makePath(style);
            this.lineTo(path, x1, y1, x1, y2, true);
            this.lineTo(path, x1, y2, x2, y2, false);
            this.lineTo(path, x2, y2, x2, y1, false);
            this.lineTo(path, x2, y1, x1, y1, false);
            path.closePath();
            return path.path;
        }
    }
    ellipse(x1, y1, x2, y2, style = {}) {
        const cs = this.coordinateSystem;
        if (cs instanceof CartesianCoordinates) {
            return elements_1.makeEllipse(x1, y1, x2, y2, style);
        }
        else {
            const path = _1.makePath(style);
            const cx = (x1 + x2) / 2, cy = (y1 + y2) / 2;
            const rx = Math.abs(x2 - x1) / 2, ry = Math.abs(y2 - y1) / 2;
            const N = 32;
            for (let i = 0; i < N; i++) {
                const theta1 = (i / N) * (Math.PI * 2);
                const theta2 = ((i + 1) / N) * (Math.PI * 2);
                this.lineTo(path, cx + rx * Math.cos(theta1), cy + ry * Math.sin(theta1), cx + rx * Math.cos(theta2), cy + ry * Math.sin(theta2), i == 0);
            }
            path.closePath();
            return path.path;
        }
    }
    line(x1, y1, x2, y2, style = {}) {
        const cs = this.coordinateSystem;
        if (cs instanceof CartesianCoordinates) {
            return _1.makeLine(x1, y1, x2, y2, style);
        }
        else {
            const path = _1.makePath(style);
            this.lineTo(path, x1, y1, x2, y2, true);
            return path.path;
        }
    }
    lineTo(path, x1, y1, x2, y2, newPath) {
        const cs = this.coordinateSystem;
        if (newPath) {
            const p = cs.transformPoint(x1, y1);
            path.moveTo(p.x, p.y);
        }
        if (cs instanceof CartesianCoordinates) {
            path.lineTo(x2, y2);
        }
        if (cs instanceof PolarCoordinates) {
            path.polarLineTo(0, 0, 90 - x1, cs.transformRadial(y1), 90 - x2, cs.transformRadial(y2), false);
        }
        if (cs instanceof BezierCurveCoordinates) {
            if (Math.abs(x1 - x2) < 1e-6) {
                const p = cs.transformPoint(x2, y2);
                path.lineTo(p.x, p.y);
            }
            else {
                let framePrevious = cs.getLocalTransform(x1, y1);
                const direction = Math.atan2(y2 - y1, x2 - x1);
                const segments = Math.max(2, Math.ceil((3 * cs.getCurve().getSegments().length * Math.abs(x2 - x1)) /
                    cs.getCurve().getLength()));
                for (let i = 1; i <= segments; i++) {
                    const t = i / segments;
                    const frame = cs.getLocalTransform((x2 - x1) * t + x1, (y2 - y1) * t + y1);
                    const len = common_1.Geometry.pointDistance(frame, framePrevious) / 3;
                    const angle1 = (framePrevious.angle / 180) * Math.PI + direction;
                    const angle2 = (frame.angle / 180) * Math.PI + direction;
                    path.cubicBezierCurveTo(framePrevious.x + Math.cos(angle1) * len, framePrevious.y + Math.sin(angle1) * len, frame.x - Math.cos(angle2) * len, frame.y - Math.sin(angle2) * len, frame.x, frame.y);
                    // path.lineTo(frame.x, frame.y);
                    framePrevious = frame;
                }
            }
        }
    }
}
exports.CoordinateSystemHelper = CoordinateSystemHelper;
//# sourceMappingURL=coordinate_system.js.map