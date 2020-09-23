/** 2D point */
export interface Point {
    x: number;
    y: number;
}
/** 2D vector */
export declare type Vector = Point;
/** 2D line with two points */
export interface Line {
    p1: Point;
    p2: Point;
}
/** Rectangle */
export interface Rect {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
}
/** Zooming information */
export interface ZoomInfo {
    /** The pixel location of the origin of the canvas, unit: px */
    centerX: number;
    centerY: number;
    /** The scale factor between pixel and canvas unit, unit: px / canvas unit */
    scale: number;
}
/** General geometry functions */
export declare namespace Geometry {
    /** Return the length of a vector */
    function vectorLength(p: Vector): number;
    /** Return the distance between two points */
    function pointDistance(p1: Point, p2: Point): number;
    /** Return the normalized version of a vector */
    function vectorNormalize(p: Vector): Vector;
    /** Rotate a vector 90 degrees (counter-clock-wise, but clock-wise in screen coordiantes) */
    function vectorRotate90(p: Vector): Vector;
    /** Rotate a vector by a angle in radians (counter-clock-wise, but clock-wise in screen coordiantes) */
    function vectorRotate(p: Vector, radians: number): Vector;
    /** Add two vectors */
    function vectorAdd(p1: Vector, p2: Vector): Vector;
    /** Subtract two vectors */
    function vectorSub(p1: Vector, p2: Vector): Vector;
    /** Multiply two vectors element-wise */
    function vectorMul(p1: Vector, p2: Vector): Vector;
    /** Divide two vectors element-wise */
    function vectorDiv(p1: Vector, p2: Vector): Vector;
    /** Scale a vector by a constant factor */
    function vectorScale(p: Point, s: number): {
        x: number;
        y: number;
    };
    /** Compute the inner product between two vectors */
    function vectorDot(p1: Vector, p2: Vector): number;
    /** Compute the cross product between two vectors */
    function vectorCross(p1: Vector, p2: Vector): number;
    /** Determine if two intervals overlap */
    function intervalOverlap(xMin: number, xMax: number, yMin: number, yMax: number): boolean;
    /** Determine if two rects overlap */
    function rectOverlap(a1: Rect, a2: Rect): boolean;
    /** Apply zoom to a point (point to pixel) */
    function applyZoom(zoom: ZoomInfo, pt: Point): Point;
    /** Unapply zoom to a point (pixel to point) */
    function unapplyZoom(zoom: ZoomInfo, pt: Point): Point;
}
export declare function prettyNumber(x: number, digits?: number): string;
