import { Point } from "../common";
/**
 * Compute numerical integral y' = f(t, y), y(t0) = y0,
 *  start from t0, step size h, with specified number of steps,
 *  with Runge-Kutta Method order 4
 */
export declare function RK4(f: (t: number, y: number) => number, y0: number, t0: number, h: number, steps: number, result?: number[]): number[];
export declare function linearApproximation(points: ArrayLike<number>, t: number): number;
export declare function findSegment(bounds: number[], k: number): [number, number];
export declare function linearInvert(points: ArrayLike<number>, result?: number[]): number[];
export declare abstract class CurveParameterization {
    abstract getPointAtT(t: number): Point;
    abstract getTangentAtT(t: number): Point;
    abstract getSFromT(t: number): number;
    abstract getTFromS(s: number): number;
    abstract getLength(): number;
    getNormalAtT(t: number): {
        x: number;
        y: number;
    };
}
/** Parametrize a given bezier curve */
export declare class BezierCurveParameterization extends CurveParameterization {
    private k3x;
    private k2x;
    private k1x;
    private k0x;
    private k3y;
    private k2y;
    private k1y;
    private k0y;
    private tToS;
    private sToT;
    private len;
    /** Construct the cubic bezier curve with four control points */
    constructor(p1: Point, p2: Point, p3: Point, p4: Point);
    getPointAtT(t: number): {
        x: number;
        y: number;
    };
    /** Get the tangent direction at t */
    getTangentAtT(t: number): {
        x: number;
        y: number;
    };
    /** Get ds/dt at t */
    getDsDtAtT(t: number): number;
    getSFromT(t: number): number;
    getTFromS(s: number): number;
    getLength(): number;
}
export declare class LineSegmentParametrization extends CurveParameterization {
    p1: Point;
    p2: Point;
    length: number;
    tangent: Point;
    constructor(p1: Point, p2: Point);
    getTangentAtT(t: number): Point;
    getPointAtT(t: number): {
        x: number;
        y: number;
    };
    getSFromT(t: number): number;
    getTFromS(s: number): number;
    getLength(): number;
}
export declare class MultiCurveParametrization {
    private segments;
    private len;
    private sBounds;
    constructor(segments: CurveParameterization[]);
    private getSegmentAtS;
    getPointAtS(s: number): Point;
    getTangentAtS(s: number): Point;
    getNormalAtS(s: number): Point;
    getFrameAtS(s: number): {
        p: Point;
        t: Point;
        n: Point;
    };
    getLength(): number;
    getSegments(): CurveParameterization[];
}
