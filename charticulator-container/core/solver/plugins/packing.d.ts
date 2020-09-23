import { ConstraintPlugin, ConstraintSolver, Variable } from "../abstract";
export interface PackingPluginOptions {
    gravityX: number;
    gravityY: number;
}
export declare class PackingPlugin extends ConstraintPlugin {
    solver: ConstraintSolver;
    cx: Variable;
    cy: Variable;
    points: Array<[Variable, Variable, number]>;
    xEnable: boolean;
    yEnable: boolean;
    getXYScale: () => {
        x: number;
        y: number;
    };
    gravityX?: number;
    gravityY?: number;
    constructor(solver: ConstraintSolver, cx: Variable, cy: Variable, points: Array<[Variable, Variable, number]>, axisOnly?: "x" | "y", getXYScale?: () => {
        x: number;
        y: number;
    }, options?: PackingPluginOptions);
    apply(): boolean;
}
