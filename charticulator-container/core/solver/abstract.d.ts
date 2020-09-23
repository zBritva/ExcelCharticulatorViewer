import { AttributeMap } from "../specification";
export declare enum ConstraintStrength {
    HARD = 1,
    STRONG = 2,
    MEDIUM = 3,
    WEAK = 4,
    WEAKER = 5
}
export interface AttributeOptions {
    /** Attribute is editable, default: true */
    edit: boolean;
}
export interface Variable {
}
export declare abstract class ConstraintPlugin {
    abstract apply(): boolean;
}
export declare abstract class ConstraintSolver {
    /** Make an attribute constant */
    abstract makeConstant(map: AttributeMap, name: string): void;
    /** Get the variable of an attribute */
    abstract attr(map: AttributeMap, name: string, options?: AttributeOptions): Variable;
    /** Get the value of a variable */
    abstract getValue(attr: Variable): number;
    /** Set the value of a variable */
    abstract setValue(attr: Variable, value: number): void;
    /** Add a linear constraint: bias + linear(lhs) == linear(rhs) */
    abstract addLinear(strength: ConstraintStrength, bias: number, lhs: Array<[number, Variable]>, rhs?: Array<[number, Variable]>): void;
    /** Add a soft inequality constraint: bias + linear(lhs) >= linear(rhs) */
    abstract addSoftInequality(strength: ConstraintStrength, bias: number, lhs: Array<[number, Variable]>, rhs?: Array<[number, Variable]>): void;
    /** Solve the constraints */
    abstract solve(): [number, number];
    abstract destroy(): void;
    /** Get attributes */
    attrs(map: AttributeMap, name: string[]): Variable[];
    /** Get a linear value */
    getLinear(...items: Array<[number, Variable]>): number;
    /** Add a constraint that enfoces a = b */
    addEquals(strength: ConstraintStrength, a: Variable, b: Variable): void;
    /** Add a constraint that enfoces a = value */
    addEqualToConstant(strength: ConstraintStrength, a: Variable, value: number): void;
    plugins: ConstraintPlugin[];
    addPlugin(plugin: ConstraintPlugin): void;
    applyPlugins(): void;
}
