import { Dataset, Expression, Prototypes, Solver, Specification } from "../../core";
import { BaseStore } from "../../core/store/base";
import { CharticulatorWorker } from "../../worker";
import { Actions, DragData } from "../actions";
import { AbstractBackend } from "../backend/abstract";
import { ExportTemplateTarget } from "../template";
import { ActionHandlerRegistry } from "./action_handlers";
import { HistoryManager } from "./history_manager";
import { Selection } from "./selection";
export interface ChartStoreStateSolverStatus {
    solving: boolean;
}
export interface SelectionState {
    selection?: {
        type: string;
        chartElementID?: string;
        glyphID?: string;
        markID?: string;
        glyphIndex?: number;
    };
    currentGlyphID?: string;
}
export interface AppStoreState {
    version: string;
    originDataset?: Dataset.Dataset;
    dataset: Dataset.Dataset;
    chart: Specification.Chart;
    chartState: Specification.ChartState;
}
export declare class AppStore extends BaseStore {
    static EVENT_IS_NESTED_EDITOR: string;
    static EVENT_NESTED_EDITOR_EDIT: string;
    /** Fires when the dataset changes */
    static EVENT_DATASET: string;
    /** Fires when the chart state changes */
    static EVENT_GRAPHICS: string;
    /** Fires when the selection changes */
    static EVENT_SELECTION: string;
    /** Fires when the current tool changes */
    static EVENT_CURRENT_TOOL: string;
    /** Fires when solver status changes */
    static EVENT_SOLVER_STATUS: string;
    /** Fires when the chart was saved */
    static EVENT_SAVECHART: string;
    /** The WebWorker for solving constraints */
    readonly worker: CharticulatorWorker;
    /** Is this app a nested chart editor? */
    isNestedEditor: boolean;
    /** Should we disable the FileView */
    disableFileView: boolean;
    /** The dataset created on import */
    originDataset: Dataset.Dataset;
    /** The current dataset */
    dataset: Dataset.Dataset;
    /** The current chart */
    chart: Specification.Chart;
    /** The current chart state */
    chartState: Specification.ChartState;
    currentSelection: Selection;
    currentGlyph: Specification.Glyph;
    protected selectedGlyphIndex: {
        [id: string]: number;
    };
    currentTool: string;
    currentToolOptions: string;
    chartManager: Prototypes.ChartStateManager;
    solverStatus: ChartStoreStateSolverStatus;
    /** Manages the history of states */
    historyManager: HistoryManager<AppStoreState>;
    /** The backend that manages data */
    backend: AbstractBackend;
    /** The id of the currently editing chart */
    currentChartID: string;
    actionHandlers: ActionHandlerRegistry<AppStore, Actions.Action>;
    private propertyExportName;
    constructor(worker: CharticulatorWorker, dataset: Dataset.Dataset);
    setPropertyExportName(propertyName: string, value: string): void;
    getPropertyExportName(propertyName: string): string;
    saveState(): AppStoreState;
    saveDecoupledState(): AppStoreState;
    loadState(state: AppStoreState): void;
    saveHistory(): void;
    renderSVG(): string;
    renderLocalSVG(): Promise<string>;
    handleAction(action: Actions.Action): void;
    backendOpenChart(id: string): Promise<void>;
    private updateChartState;
    backendSaveChart(): Promise<void>;
    backendSaveChartAs(name: string): Promise<string>;
    setupNestedEditor(callback: (newSpecification: Specification.Chart) => void): void;
    private registeredExportTemplateTargets;
    registerExportTemplateTarget(name: string, ctor: (template: Specification.Template.ChartTemplate) => ExportTemplateTarget): void;
    unregisterExportTemplateTarget(name: string): void;
    listExportTemplateTargets(): string[];
    createExportTemplateTarget(name: string, template: Specification.Template.ChartTemplate): ExportTemplateTarget;
    getTable(name: string): Dataset.Table;
    getTables(): Dataset.Table[];
    getColumnVector(table: Dataset.Table, columnName: string): Dataset.DataValue[];
    saveSelectionState(): SelectionState;
    loadSelectionState(selectionState: SelectionState): void;
    setSelectedGlyphIndex(plotSegmentID: string, glyphIndex: number): void;
    getSelectedGlyphIndex(plotSegmentID: string): number;
    getMarkIndex(mark: Specification.Glyph): number;
    forAllGlyph(glyph: Specification.Glyph, callback: (glyphState: Specification.GlyphState, plotSegment: Specification.PlotSegment, plotSegmentState: Specification.PlotSegmentState) => void): void;
    preSolveValues: Array<[Solver.ConstraintStrength, Specification.AttributeMap, string, number]>;
    addPresolveValue(strength: Solver.ConstraintStrength, state: Specification.AttributeMap, attr: string, value: number): void;
    /** Given the current selection, find a reasonable plot segment for a glyph */
    findPlotSegmentForGlyph(glyph: Specification.Glyph): Specification.PlotSegment<Specification.ObjectProperties>;
    scaleInference(context: {
        glyph?: Specification.Glyph;
        chart?: {
            table: string;
        };
    }, expression: string, valueType: Specification.DataType, valueKind: Specification.DataKind, outputType: Specification.AttributeType, hints?: Prototypes.DataMappingHints, markAttribute?: string): string;
    isLegendExistForScale(scale: string): boolean;
    toggleLegendForScale(scale: string): void;
    getRepresentativeGlyphState(glyph: Specification.Glyph): Specification.GlyphState<Specification.AttributeMap>;
    solveConstraintsAndUpdateGraphics(mappingOnly?: boolean): void;
    solveConstraintsInWorker(mappingOnly?: boolean): Promise<void>;
    newChartEmpty(): void;
    deleteSelection(): void;
    handleEscapeKey(): void;
    buildChartTemplate(): Specification.Template.ChartTemplate;
    verifyUserExpressionWithTable(inputString: string, table: string, options?: Expression.VerifyUserExpressionOptions): Expression.VerifyUserExpressionReport;
    updatePlotSegments(): void;
    private getBindingByDataKind;
    bindDataToAxis(options: {
        object: Specification.Object;
        property?: string;
        appendToProperty?: string;
        dataExpression: DragData.DataExpression;
        type?: "default" | "numerical" | "categorical";
        numericalMode?: "linear" | "logarithmic" | "temporal";
    }): void;
}
