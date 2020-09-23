import * as LSCGSolver from "lscg-solver";
import { KeyNameMap } from "../common";
import { AttributeMap } from "../specification";
import { AttributeOptions, ConstraintSolver, ConstraintStrength, Variable } from "./abstract";
export declare function initialize(): Promise<void>;
export declare let Matrix: typeof LSCGSolver.Matrix;
export interface WASMSolverVariable extends Variable {
    map: AttributeMap;
    name: string;
    index: number;
}
export declare class WASMSolver extends ConstraintSolver {
    solver: LSCGSolver.ConstraintSolver;
    variables: KeyNameMap<AttributeMap, WASMSolverVariable>;
    currentIndex: number;
    softInequalities: Array<{
        id: number;
        bias: number;
        variable_names: number[];
        weights: number[];
    }>;
    constructor();
    makeConstant(map: AttributeMap, name: string): void;
    /** Get the variable of an attribute */
    attr(map: AttributeMap, name: string, options?: AttributeOptions): WASMSolverVariable;
    /** Get the value of a variable */
    getValue(attr: WASMSolverVariable): number;
    /** Set the value of a variable */
    setValue(attr: WASMSolverVariable, value: number): void;
    /** Add a linear constraint */
    addLinear(strength: ConstraintStrength, bias: number, lhs: Array<[number, WASMSolverVariable]>, rhs?: Array<[number, WASMSolverVariable]>): void;
    /** Add a soft inequality constraint: bias + linear(lhs) >= linear(rhs) */
    addSoftInequality(strength: ConstraintStrength, bias: number, lhs: Array<[number, WASMSolverVariable]>, rhs?: Array<[number, WASMSolverVariable]>): void;
    /** Solve the constraints */
    solve(): [number, number];
    destroy(): void;
}
