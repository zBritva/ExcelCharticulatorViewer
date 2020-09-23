import * as Dataset from "../dataset";
import * as Expression from "../expression";
import * as Specification from "../specification";
import * as Charts from "./charts";
import * as Glyphs from "./glyphs";
import * as Prototypes from "./index";
import * as Marks from "./marks";
import * as PlotSegments from "./plot_segments";
import * as Scales from "./scales";
import { ChartElementClass } from "./chart_element";
import { DataflowManager, DataflowTable } from "./dataflow";
import { ObjectClass } from "./object";
import { ChartConstraintSolver } from "../solver";
import { ValueType } from "../expression/classes";
/**
 * Represents a set of default attributes
 */
export interface DefaultAttributes {
    [objectId: string]: {
        [attribute: string]: any;
    };
}
export declare type ClassEnumerationCallback = (cls: ObjectClass, state: Specification.ObjectState) => void;
/** Handles the life cycle of states and the dataflow */
export declare class ChartStateManager {
    readonly chart: Specification.Chart;
    chartState: Specification.ChartState;
    dataset: Dataset.Dataset;
    dataflow: DataflowManager;
    classCache: Prototypes.ObjectClassCache;
    idIndex: Map<string, [Specification.Object<Specification.ObjectProperties>, Specification.ObjectState<Specification.AttributeMap>]>;
    constructor(chart: Specification.Chart, dataset: Dataset.Dataset, state?: Specification.ChartState, defaultAttributes?: DefaultAttributes, options?: {
        [key: string]: any;
    });
    /** Set an existing state */
    setState(state: Specification.ChartState): void;
    /** Set a new dataset, this will reset the state */
    setDataset(dataset: Dataset.Dataset): void;
    /** Get data table by name */
    getTable(name: string): DataflowTable;
    /** Get an object by its unique ID */
    getObjectById(id: string): Specification.Object;
    /** Get a chart-level element or scale by its id */
    getClassById(id: string): ObjectClass;
    /** Get classes for chart elements */
    getElements(): ObjectClass[];
    /** Create an empty chart state using chart and dataset */
    private createChartState;
    /** Initialize the object class cache */
    initializeCache(): void;
    /** Enumerate all object classes */
    enumerateClasses(callback: ClassEnumerationCallback): void;
    /** Enumerate classes, only return a specific type */
    enumerateClassesByType(type: string, callback: ClassEnumerationCallback): void;
    enumeratePlotSegments(callback: (cls: PlotSegments.PlotSegmentClass) => void): void;
    /** Initialize the chart state with default parameters */
    initializeState(defaultAttributes?: DefaultAttributes): void;
    /** Recreate the chart state from scratch */
    private initialize;
    /** Rebuild id to object map */
    private rebuildID2Object;
    /** Test if a name is already used */
    isNameUsed(candidate: string): boolean;
    /** Find an unused name given a prefix, will try prefix1, prefix2, and so on. */
    findUnusedName(prefix: string): string;
    /** Create a new object */
    createObject(classID: string, ...args: any[]): Specification.Object;
    /** Add a new glyph */
    addGlyph(classID: string, table: string): Specification.Glyph;
    /** Remove a glyph */
    removeGlyph(glyph: Specification.Glyph): void;
    /** Add a new element to a glyph */
    addMarkToGlyph(mark: Specification.Element, glyph: Specification.Glyph): void;
    /** Remove an element from a glyph */
    removeMarkFromGlyph(mark: Specification.Element, glyph: Specification.Glyph): void;
    /** Add a chart element */
    addChartElement(element: Specification.ChartElement, index?: number): void;
    reorderArray<T>(array: T[], fromIndex: number, toIndex: number): void;
    reorderChartElement(fromIndex: number, toIndex: number): void;
    reorderGlyphElement(glyph: Specification.Glyph, fromIndex: number, toIndex: number): void;
    /**
     * Map/remap plot segment glyphs
     * @param plotSegment
     * @param plotSegmentState
     */
    private mapPlotSegmentState;
    private initializePlotSegmentCache;
    private initializePlotSegmentState;
    /** Remove a chart element */
    removeChartElement(element: Specification.ChartElement): void;
    remapPlotSegmentGlyphs(plotSegment: Specification.PlotSegment): void;
    /** Add a new scale */
    addScale(scale: Specification.Scale): void;
    /** Remove a scale */
    removeScale(scale: Specification.Scale): void;
    getMarkClass(state: Specification.MarkState): Marks.MarkClass;
    getGlyphClass(state: Specification.GlyphState): Glyphs.GlyphClass;
    getChartElementClass(state: Specification.ChartElementState): ChartElementClass;
    getPlotSegmentClass(state: Specification.PlotSegmentState): PlotSegments.PlotSegmentClass;
    getScaleClass(state: Specification.ScaleState): Scales.ScaleClass;
    getChartClass(state: Specification.ChartState): Charts.ChartClass;
    getClass(state: Specification.ObjectState): ObjectClass;
    findGlyphState(plotSegment: Specification.PlotSegment, glyph: Specification.Glyph, glyphIndex?: number): Specification.GlyphState;
    findMarkState(plotSegment: Specification.PlotSegment, glyph: Specification.Glyph, mark: Specification.Element, glyphIndex?: number): Specification.MarkState;
    /** Remove constraints that relate to non-existant element */
    validateConstraints(constraints: Specification.Constraint[], elements: Specification.Object[]): Specification.Constraint[];
    resolveResource(description: string): any;
    /** Get chart-level data context for a given table */
    getChartDataContext(tableName: string): Expression.Context;
    /** Get glyph-level data context for the glyphIndex-th glyph */
    getGlpyhDataContext(plotSegment: Specification.PlotSegment, glyphIndex: number): Expression.Context;
    /** Get all glyph-level data contexts for a given plot segment */
    getGlpyhDataContexts(plotSegment: Specification.PlotSegment, glyphIndex: number): Expression.Context[];
    getGroupedExpressionVector(tableName: string, groupBy: Specification.Types.GroupBy, expression: string): ValueType[];
    solveConstraints(additional?: (solver: ChartConstraintSolver) => void, mappingOnly?: boolean): void;
}
