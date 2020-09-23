import { ConstraintSolver } from "../../solver";
import * as Specification from "../../specification";
export declare abstract class ConstraintTypeClass {
    abstract type: string;
    abstract buildConstraints(constraint: Specification.Constraint, elements: Specification.Object[], states: Specification.ObjectState[], solver: ConstraintSolver): void;
    private static _classes;
    static register(entry: ConstraintTypeClass): void;
    static getClass(type: string): ConstraintTypeClass;
}
export declare class SnapConstraintClass {
    type: string;
    buildConstraints(constraint: Specification.Constraint, elements: Specification.Object[], states: Specification.ObjectState[], solver: ConstraintSolver): void;
}
export declare function registerClasses(): void;
