import * as Expression from "../../../expression";
import { ConstraintSolver, ConstraintStrength, Variable } from "../../../solver";
import * as Specification from "../../../specification";
import { BuildConstraintsContext, Controls } from "../../common";
import { DataflowTable } from "../../dataflow";
import { PlotSegmentClass } from "../plot_segment";
export interface Region2DSublayoutOptions extends Specification.AttributeMap {
    type: "overlap" | "dodge-x" | "dodge-y" | "grid" | "packing";
    /** Sublayout alignment (for dodge and grid) */
    align: {
        x: "start" | "middle" | "end";
        y: "start" | "middle" | "end";
    };
    ratioX: number;
    ratioY: number;
    /** Grid options */
    grid?: {
        /** Grid direction */
        direction: "x" | "y";
        /** Number of glyphs in X direction (direction == "x") */
        xCount?: number;
        /** Number of glyphs in Y direction (direction == "x") */
        yCount?: number;
    };
    /** Order in sublayout objects */
    order: Specification.Types.SortBy;
    orderReversed: boolean;
    /** packing options */
    packing: {
        gravityX: number;
        gravityY: number;
    };
}
export interface Region2DAttributes extends Specification.AttributeMap {
    /** Horizontal/vertical line guide line position */
    x?: number;
    y?: number;
    gapX?: number;
    gapY?: number;
}
export interface Region2DHandleDescription {
    type: "gap";
    gap?: {
        property: Controls.Property;
        axis: "x" | "y";
        reference: number;
        value: number;
        span: [number, number];
        scale: number;
    };
}
export interface Region2DProperties extends Specification.AttributeMap {
    /** X axis data binding, set to null to remove the axis, set to { type: "none" } to keep the axis but don't bind data */
    xData?: Specification.Types.AxisDataBinding;
    /** Y axis data binding, set to null to remove the axis, set to { type: "none" } to keep the axis but don't bind data */
    yData?: Specification.Types.AxisDataBinding;
    sublayout: Region2DSublayoutOptions;
    marginX1?: number;
    marginX2?: number;
    marginY1?: number;
    marginY2?: number;
}
export interface Region2DConfiguration {
    terminology: {
        xAxis: string;
        yAxis: string;
        xMin: string;
        xMinIcon: string;
        xMiddle: string;
        xMiddleIcon: string;
        xMax: string;
        xMaxIcon: string;
        yMin: string;
        yMinIcon: string;
        yMiddle: string;
        yMiddleIcon: string;
        yMax: string;
        yMaxIcon: string;
        dodgeX: string;
        dodgeXIcon: string;
        dodgeY: string;
        dodgeYIcon: string;
        grid: string;
        gridIcon: string;
        gridDirectionX: string;
        gridDirectionY: string;
        packing: string;
        packingIcon: string;
        overlap: string;
        overlapIcon: string;
    };
    xAxisPrePostGap: boolean;
    yAxisPrePostGap: boolean;
    getXYScale?(): {
        x: number;
        y: number;
    };
}
export declare class CrossFitter {
    private solver;
    private mode;
    private candidates;
    constructor(solver: ConstraintSolver, mode: "min" | "max");
    add(src: Variable, dst: Variable): void;
    addComplex(src: Variable, dst: Array<[number, Variable]>, dstBias?: number): void;
    addConstraint(w: ConstraintStrength): void;
}
export declare class DodgingFitters {
    xMin: CrossFitter;
    xMax: CrossFitter;
    yMin: CrossFitter;
    yMax: CrossFitter;
    constructor(solver: ConstraintSolver);
    addConstraint(w: ConstraintStrength): void;
}
export declare class SublayoutGroup {
    group: number[];
    x1: Variable;
    y1: Variable;
    x2: Variable;
    y2: Variable;
}
export interface SublayoutContext {
    mode: "default" | "x-only" | "y-only" | "disabled";
    xAxisPrePostGap?: boolean;
    yAxisPrePostGap?: boolean;
}
export declare class Region2DConstraintBuilder {
    plotSegment: PlotSegmentClass<Region2DProperties, Region2DAttributes>;
    config: Region2DConfiguration;
    x1Name: string;
    x2Name: string;
    y1Name: string;
    y2Name: string;
    solver?: ConstraintSolver;
    solverContext?: BuildConstraintsContext;
    terminology: Region2DConfiguration["terminology"];
    constructor(plotSegment: PlotSegmentClass<Region2DProperties, Region2DAttributes>, config: Region2DConfiguration, x1Name: string, x2Name: string, y1Name: string, y2Name: string, solver?: ConstraintSolver, solverContext?: BuildConstraintsContext);
    getTableContext(): DataflowTable;
    getExpression(expr: string): Expression.Expression;
    groupMarksByCategories(categories: Array<{
        expression: string;
        categories: string[];
    }>): number[][];
    orderMarkGroups(groups: SublayoutGroup[]): SublayoutGroup[];
    /** Make sure gapX correctly correspond to gapXRatio */
    gapX(length: number, ratio: number): void;
    /** Make sure gapY correctly correspond to gapYRatio */
    gapY(length: number, ratio: number): void;
    /** Map elements according to numerical/categorical mapping */
    numericalMapping(axis: "x" | "y"): void;
    groupMarksByCategoricalMapping(axis: "x" | "y" | "xy"): number[][];
    categoricalMapping(axis: "x" | "y" | "xy", sublayoutContext: SublayoutContext): void;
    categoricalHandles(axis: "x" | "y" | "xy", sublayout: boolean): Region2DHandleDescription[];
    stacking(axis: "x" | "y"): void;
    fitGroups(groups: SublayoutGroup[], axis: "x" | "y" | "xy"): void;
    applySublayout(groups: SublayoutGroup[], axis: "x" | "y" | "xy", context: SublayoutContext): void;
    sublayoutDodging(groups: SublayoutGroup[], direction: "x" | "y", enablePrePostGap: boolean): void;
    getGlyphPreSolveAttributes(rowIndices: number[]): {
        [name: string]: number;
    };
    sublayoutGrid(groups: SublayoutGroup[], directionOverride?: string): void;
    sublayoutHandles(groups: Array<{
        group: number[];
        x1: number;
        y1: number;
        x2: number;
        y2: number;
    }>, enablePrePostGapX: boolean, enablePrePostGapY: boolean): Region2DHandleDescription[];
    sublayoutPacking(groups: SublayoutGroup[], axisOnly?: "x" | "y"): void;
    getHandles(): Region2DHandleDescription[];
    build(): void;
    applicableSublayoutOptions(): {
        value: string;
        label: string;
        icon: string;
    }[];
    isSublayoutApplicable(): boolean;
    buildSublayoutWidgets(m: Controls.WidgetManager): any[];
    buildAxisWidgets(m: Controls.WidgetManager, axisName: string, axis: "x" | "y"): Controls.Widget[];
    buildPanelWidgets(m: Controls.WidgetManager): Controls.Widget[];
    buildPopupWidgets(m: Controls.WidgetManager): Controls.Widget[];
}
