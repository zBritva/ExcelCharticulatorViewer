import * as Dataset from "../dataset";
import * as Expression from "../expression";
import * as Prototypes from "../prototypes";
import * as Specification from "../specification";
import { ConstraintSolver, ConstraintStrength, Variable } from "./abstract";
import { WASMSolver } from "./wasm_solver";
/** Solves constraints in the scope of a chart */
export declare class ChartConstraintSolver {
    solver: WASMSolver;
    stage: "chart" | "glyphs";
    chart: Specification.Chart;
    chartState: Specification.ChartState;
    manager: Prototypes.ChartStateManager;
    dataset: Dataset.Dataset;
    datasetContext: Dataset.DatasetContext;
    expressionCache: Expression.ExpressionCache;
    /** Create a ChartConstraintSolver
     * - stage == "chart": disregard glyphs, solve chart-level constraints
     * - stage == "glyphs": fix chart-level attributes, solve only glyphs
     * @param stage determines the scope of the variables to solve
     */
    constructor(stage: "chart" | "glyphs");
    setManager(manager: Prototypes.ChartStateManager): void;
    setDataset(dataset: Dataset.Dataset): void;
    solve(): {
        softLoss: number;
        hardLoss: number;
    };
    destroy(): void;
    addMapping(attrs: Specification.AttributeMap, parentAttrs: Specification.AttributeMap, attr: string, info: Prototypes.AttributeDescription, mapping: Specification.Mapping, rowContext: Expression.Context): void;
    addObject(object: Specification.Object, objectState: Specification.ObjectState, parentState: Specification.ObjectState, rowContext: Expression.Context, solve: boolean): void;
    addScales(allowScaleParameterChange?: boolean): void;
    private supportVariables;
    getSupportVariable(key: Object, name: string, defaultValue: number): Variable;
    addMark(layout: Specification.PlotSegment, mark: Specification.Glyph, rowContext: Expression.Context, markState: Specification.GlyphState, element: Specification.Element, elementState: Specification.MarkState): void;
    getAttachedAttributes(mark: Specification.Glyph): Set<string>;
    private glyphAnalyzeResults;
    getGlyphAnalyzeResult(glyph: Specification.Glyph): GlyphConstraintAnalyzer;
    addGlyph(layout: Specification.PlotSegment, rowContext: Expression.Context, glyph: Specification.Glyph, glyphState: Specification.GlyphState): void;
    addAttribute(attrs: Specification.AttributeMap, attr: string, edit: boolean): void;
    addChart(): void;
    setup(manager: Prototypes.ChartStateManager): void;
}
/** Closed-form solution for single marks
 *
 * Closed-form solution is: MarkAttributes = F(DataValues, ScaleAttributes, FreeVariables)
 */
export interface GlyphConstraintAnalyzerAttribute {
    index: number;
    type: "object" | "input";
    id: string;
    attribute: string;
}
export declare class GlyphConstraintAnalyzer extends ConstraintSolver {
    private variableRegistry;
    private indexToAttribute;
    private currentVariableIndex;
    private linears;
    private inputBiases;
    private indexToBias;
    private inputBiasesCount;
    glyphState: Specification.GlyphState;
    addAttribute(attrs: Specification.AttributeMap, attr: string, id: string): GlyphConstraintAnalyzerAttribute;
    attr(attrs: Specification.AttributeMap, attr: string): GlyphConstraintAnalyzerAttribute;
    addLinear(strength: ConstraintStrength, bias: number, lhs: Array<[number, {
        index: number;
    }]>, rhs?: Array<[number, {
        index: number;
    }]>): void;
    addSoftInequality(strength: ConstraintStrength, bias: number, lhs: Array<[number, {
        index: number;
    }]>, rhs?: Array<[number, {
        index: number;
    }]>): void;
    addInputAttribute(name: string, attr: {
        index: number;
    }): void;
    private dataInputList;
    addDataInput(name: string, expression: string): void;
    addMapping(attrs: Specification.AttributeMap, attr: string, mapping: Specification.Mapping, parentAttrs: Specification.AttributeMap): void;
    constructor(glyph: Specification.Glyph);
    setValue(): void;
    getValue(): number;
    makeConstant(attr: {
        index: number;
    }): void;
    destroy(): void;
    private ker;
    private X0;
    solve(): [number, number];
    isAttributeFree(attr: GlyphConstraintAnalyzerAttribute): boolean;
    readonly widthFree: boolean;
    readonly heightFree: boolean;
    computeAttribute(attr: GlyphConstraintAnalyzerAttribute, rowContext: Expression.Context): number;
    computeAttributes(rowContext: Expression.Context): {
        [name: string]: number;
    };
}
