"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Compute numerical integral y' = f(t, y), y(t0) = y0,
 *  start from t0, step size h, with specified number of steps,
 *  with Runge-Kutta Method order 4
 */
function RK4(f, y0, t0, h, steps, result = new Array(steps)) {
    if (steps == 0) {
        return result;
    }
    result[0] = y0;
    let yp = y0;
    let tp = t0;
    for (let i = 1; i < steps; i++) {
        const k1 = f(tp, yp);
        const k2 = f(tp + h / 2, yp + (h * k1) / 2);
        const k3 = f(tp + h / 2, yp + (h * k2) / 2);
        const k4 = f(tp + h, yp + h * k3);
        const yi = yp + (h / 6) * (k1 + 2 * k2 + 2 * k3 + k4);
        const ti = tp + h;
        result[i] = yi;
        yp = yi;
        tp = ti;
    }
    return result;
}
exports.RK4 = RK4;
function linearApproximation(points, t) {
    let i1, i2, k;
    const w = t * (points.length - 1);
    i1 = Math.floor(w);
    i2 = i1 + 1;
    k = w - i1;
    if (i1 < 0) {
        i1 = 0;
        i2 = 0;
    }
    if (i1 >= points.length - 1) {
        i1 = points.length - 1;
        i2 = points.length - 1;
    }
    return points[i1] * (1 - k) + points[i2] * k;
}
exports.linearApproximation = linearApproximation;
function findSegment(bounds, k) {
    // Linear search
    for (let i = 0; i < bounds.length - 1; i++) {
        const b1 = bounds[i];
        const b2 = bounds[i + 1];
        if (k >= b1 && k <= b2) {
            return [i, k - b1];
        }
    }
    if (k < bounds[0]) {
        return [0, 0];
    }
    else {
        return [
            bounds.length - 2,
            bounds[bounds.length - 1] - bounds[bounds.length - 2]
        ];
    }
}
exports.findSegment = findSegment;
function linearInvert(points, result = new Array(points.length)) {
    const s0 = points[0];
    const s1 = points[points.length - 1];
    let ptr = 0;
    for (let i = 0; i < points.length; i++) {
        const si = s0 + ((s1 - s0) * i) / (points.length - 1);
        while (ptr + 2 < points.length && si >= points[ptr + 1]) {
            ptr += 1;
        }
        const sA = points[ptr];
        const tA = ptr / (points.length - 1);
        const sB = points[ptr + 1];
        const tB = (ptr + 1) / (points.length - 1);
        const ti = ((si - sA) / (sB - sA)) * (tB - tA) + tA;
        result[i] = ti;
    }
    return result;
}
exports.linearInvert = linearInvert;
class CurveParameterization {
    getNormalAtT(t) {
        const tangent = this.getTangentAtT(t);
        return {
            x: -tangent.y,
            y: tangent.x
        };
    }
}
exports.CurveParameterization = CurveParameterization;
/** Parametrize a given bezier curve */
class BezierCurveParameterization extends CurveParameterization {
    /** Construct the cubic bezier curve with four control points */
    constructor(p1, p2, p3, p4) {
        super();
        this.k3x = 3 * (p2.x - p3.x) + p4.x - p1.x;
        this.k2x = 3 * (p1.x + p3.x - 2 * p2.x);
        this.k1x = 3 * (p2.x - p1.x);
        this.k0x = p1.x;
        this.k3y = 3 * (p2.y - p3.y) + p4.y - p1.y;
        this.k2y = 3 * (p1.y + p3.y - 2 * p2.y);
        this.k1y = 3 * (p2.y - p1.y);
        this.k0y = p1.y;
        // Len = 8.080527392389182  10000
        //       8.080527036296594  100
        //       8.084824756247663  10
        const steps = 100;
        this.tToS = RK4((t, y) => this.getDsDtAtT(t), 0, 0, 1 / (steps - 1), steps);
        this.len = this.tToS[steps - 1];
        this.sToT = linearInvert(this.tToS);
    }
    getPointAtT(t) {
        return {
            x: this.k0x + t * (this.k1x + t * (this.k2x + t * this.k3x)),
            y: this.k0y + t * (this.k1y + t * (this.k2y + t * this.k3y))
        };
    }
    /** Get the tangent direction at t */
    getTangentAtT(t) {
        const t2 = t * t;
        const dxdt = 3 * t2 * this.k3x + 2 * t * this.k2x + this.k1x;
        const dydt = 3 * t2 * this.k3y + 2 * t * this.k2y + this.k1y;
        const length = Math.sqrt(dxdt * dxdt + dydt * dydt);
        return {
            x: dxdt / length,
            y: dydt / length
        };
    }
    /** Get ds/dt at t */
    getDsDtAtT(t) {
        const t2 = t * t;
        const dxdt = 3 * t2 * this.k3x + 2 * t * this.k2x + this.k1x;
        const dydt = 3 * t2 * this.k3y + 2 * t * this.k2y + this.k1y;
        return Math.sqrt(dxdt * dxdt + dydt * dydt);
    }
    getSFromT(t) {
        return linearApproximation(this.tToS, t);
    }
    getTFromS(s) {
        return linearApproximation(this.sToT, s / this.len);
    }
    getLength() {
        return this.len;
    }
}
exports.BezierCurveParameterization = BezierCurveParameterization;
class LineSegmentParametrization extends CurveParameterization {
    constructor(p1, p2) {
        super();
        this.p1 = p1;
        this.p2 = p2;
        this.length = Math.sqrt((p2.x - p1.x) * (p2.x - p1.x) + (p2.y - p1.y) * (p2.y - p1.y));
        this.tangent = {
            x: (p2.x - p1.x) / this.length,
            y: (p2.y - p1.y) / this.length
        };
    }
    getTangentAtT(t) {
        return this.tangent;
    }
    getPointAtT(t) {
        return {
            x: this.p1.x + (this.p2.x - this.p1.x) * t,
            y: this.p1.y + (this.p2.y - this.p1.y) * t
        };
    }
    getSFromT(t) {
        return t * this.length;
    }
    getTFromS(s) {
        return s / this.length;
    }
    getLength() {
        return this.length;
    }
}
exports.LineSegmentParametrization = LineSegmentParametrization;
class MultiCurveParametrization {
    constructor(segments) {
        this.segments = segments;
        this.len = 0;
        this.sBounds = new Array(this.segments.length + 1);
        this.sBounds[0] = 0;
        for (let i = 0; i < this.segments.length; i++) {
            this.len += this.segments[i].getLength();
            this.sBounds[i + 1] = this.len;
        }
    }
    getSegmentAtS(s) {
        const [pi, ps] = findSegment(this.sBounds, s);
        const p = this.segments[pi];
        const pt = p.getTFromS(ps);
        return [p, pt];
    }
    getPointAtS(s) {
        const [p, t] = this.getSegmentAtS(s);
        return p.getPointAtT(t);
    }
    getTangentAtS(s) {
        const [p, t] = this.getSegmentAtS(s);
        return p.getTangentAtT(t);
    }
    getNormalAtS(s) {
        const [p, k] = this.getSegmentAtS(s);
        return p.getNormalAtT(k);
    }
    getFrameAtS(s) {
        const [p, t] = this.getSegmentAtS(s);
        return {
            p: p.getPointAtT(t),
            t: p.getTangentAtT(t),
            n: p.getNormalAtT(t)
        };
    }
    getLength() {
        return this.len;
    }
    getSegments() {
        return this.segments;
    }
}
exports.MultiCurveParametrization = MultiCurveParametrization;
//# sourceMappingURL=bezier_curve.js.map