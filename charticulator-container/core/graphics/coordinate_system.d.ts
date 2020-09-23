import { Element, MultiCurveParametrization, PathMaker } from ".";
import { Point } from "../common";
import { RigidTransform, Style } from "./elements";
export declare abstract class CoordinateSystem {
    /** Get the transform of the whole coordinate system (in the final Cartesian system) */
    abstract getBaseTransform(): RigidTransform;
    /** Transform the point (x, y) to Cartesian system */
    abstract transformPoint(x: number, y: number): Point;
    abstract transformDirectionAtPoint(x: number, y: number, dx: number, dy: number): Point;
    /** Get the local affine transform at point (x, y) */
    abstract getLocalTransform(x: number, y: number): RigidTransform;
    abstract transformPointWithBase(x: number, y: number): Point;
    abstract transformDirectionAtPointWithBase(x: number, y: number, dx: number, dy: number): Point;
}
/** Normal cartesian coordinate system */
export declare class CartesianCoordinates extends CoordinateSystem {
    origin: Point;
    constructor(origin?: Point);
    getBaseTransform(): RigidTransform;
    transformPoint(x: number, y: number): Point;
    transformDirectionAtPoint(x: number, y: number, dx: number, dy: number): Point;
    transformPointWithBase(x: number, y: number): Point;
    transformDirectionAtPointWithBase(x: number, y: number, dx: number, dy: number): Point;
    getLocalTransform(x: number, y: number): RigidTransform;
}
/** Polar coordinates. Angle is in degrees, clockwise, top is 0  */
export declare class PolarCoordinates extends CoordinateSystem {
    origin: Point;
    radial1: number;
    radial2: number;
    distortY: boolean;
    constructor(origin?: Point, radial1?: number, radial2?: number, distortY?: boolean);
    getBaseTransform(): RigidTransform;
    transformRadial(radial: number): number;
    inverseTransformRadial(distance: number): number;
    transformPoint(angle: number, radial: number): Point;
    transformDirectionAtPoint(angle: number, radial: number, dx: number, dy: number): Point;
    getLocalTransform(angle: number, radial: number): RigidTransform;
    transformPointWithBase(angle: number, radial: number): Point;
    transformDirectionAtPointWithBase(angle: number, radial: number, dx: number, dy: number): Point;
}
/** Bezier curve coordinate system. */
export declare class BezierCurveCoordinates extends CoordinateSystem {
    origin: Point;
    private curve;
    constructor(origin: Point, curve: MultiCurveParametrization);
    getBaseTransform(): RigidTransform;
    transformPoint(x: number, y: number): Point;
    transformDirectionAtPoint(x: number, y: number, dx: number, dy: number): Point;
    getLocalTransform(x: number, y: number): RigidTransform;
    transformPointWithBase(x: number, y: number): Point;
    transformDirectionAtPointWithBase(x: number, y: number, dx: number, dy: number): Point;
    getLength(): number;
    getCurve(): MultiCurveParametrization;
}
export declare class CoordinateSystemHelper {
    coordinateSystem: CoordinateSystem;
    constructor(coordinateSystem: CoordinateSystem);
    rect(x1: number, y1: number, x2: number, y2: number, style?: Style): Element;
    ellipse(x1: number, y1: number, x2: number, y2: number, style?: Style): Element;
    line(x1: number, y1: number, x2: number, y2: number, style?: Style): Element;
    lineTo(path: PathMaker, x1: number, y1: number, x2: number, y2: number, newPath: boolean): void;
}
