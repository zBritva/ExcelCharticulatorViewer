"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("../../core");
const base_1 = require("../../core/store/base");
const actions_1 = require("../actions");
const indexed_db_1 = require("../backend/indexed_db");
const template_1 = require("../template");
const utils_1 = require("../utils");
const chart_display_1 = require("../views/canvas/chart_display");
const action_handlers_1 = require("./action_handlers");
const defaults_1 = require("./defaults");
const history_manager_1 = require("./history_manager");
const migrator_1 = require("./migrator");
const selection_1 = require("./selection");
const dataset_1 = require("../../core/dataset");
const specification_1 = require("../../core/specification");
class AppStore extends base_1.BaseStore {
    constructor(worker, dataset) {
        super(null);
        /** Is this app a nested chart editor? */
        this.isNestedEditor = false;
        /** Should we disable the FileView */
        this.disableFileView = false;
        this.selectedGlyphIndex = {};
        this.actionHandlers = new action_handlers_1.ActionHandlerRegistry();
        this.propertyExportName = new Map();
        this.registeredExportTemplateTargets = new Map();
        this.preSolveValues = [];
        /** Register action handlers */
        action_handlers_1.registerActionHandlers(this.actionHandlers);
        this.worker = worker;
        this.backend = new indexed_db_1.IndexedDBBackend();
        this.historyManager = new history_manager_1.HistoryManager();
        this.dataset = dataset;
        this.newChartEmpty();
        this.solveConstraintsAndUpdateGraphics();
        this.registerExportTemplateTarget("Charticulator Template", (template) => {
            return {
                getProperties: () => [
                    {
                        displayName: "Name",
                        name: "name",
                        type: "string",
                        default: "template"
                    }
                ],
                getFileName: (props) => `${props.name}.tmplt`,
                generate: () => {
                    return new Promise((resolve, reject) => {
                        const r = utils_1.b64EncodeUnicode(JSON.stringify(template, null, 2));
                        resolve(r);
                    });
                }
            };
        });
    }
    setPropertyExportName(propertyName, value) {
        this.propertyExportName.set(`${propertyName}`, value);
    }
    getPropertyExportName(propertyName) {
        return this.propertyExportName.get(`${propertyName}`);
    }
    saveState() {
        return {
            version: CHARTICULATOR_PACKAGE.version,
            dataset: this.dataset,
            chart: this.chart,
            chartState: this.chartState
        };
    }
    saveDecoupledState() {
        const state = this.saveState();
        return core_1.deepClone(state);
    }
    loadState(state) {
        this.currentSelection = null;
        this.selectedGlyphIndex = {};
        this.dataset = state.dataset;
        this.originDataset = state.dataset;
        this.chart = state.chart;
        this.chartState = state.chartState;
        this.chartManager = new core_1.Prototypes.ChartStateManager(this.chart, this.dataset, this.chartState);
        this.emit(AppStore.EVENT_DATASET);
        this.emit(AppStore.EVENT_GRAPHICS);
        this.emit(AppStore.EVENT_SELECTION);
    }
    saveHistory() {
        this.historyManager.addState(this.saveDecoupledState());
    }
    renderSVG() {
        const svg = '<?xml version="1.0" standalone="no"?>' +
            chart_display_1.renderChartToString(this.dataset, this.chart, this.chartState);
        return svg;
    }
    renderLocalSVG() {
        return __awaiter(this, void 0, void 0, function* () {
            const svg = yield chart_display_1.renderChartToLocalString(this.dataset, this.chart, this.chartState);
            return '<?xml version="1.0" standalone="no"?>' + svg;
        });
    }
    handleAction(action) {
        this.actionHandlers.handleAction(this, action);
    }
    backendOpenChart(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const chart = yield this.backend.get(id);
            this.currentChartID = id;
            this.historyManager.clear();
            const state = new migrator_1.Migrator().migrate(chart.data.state, CHARTICULATOR_PACKAGE.version);
            this.loadState(state);
        });
    }
    // removes unused scale objecs
    updateChartState() {
        function hasMappedProperty(mappings, scaleId) {
            for (const map in mappings) {
                if (mappings[map].type === "scale") {
                    if (mappings[map].scale === scaleId) {
                        return true;
                    }
                }
            }
            return false;
        }
        const chart = this.chart;
        function scaleFilter(scale) {
            return !(chart.elements.find((element) => {
                const mappings = element.mappings;
                if (mappings) {
                    return hasMappedProperty(mappings, scale._id);
                }
                return false;
            }) != null ||
                chart.glyphs.find(glyph => {
                    return (glyph.marks.find(mark => {
                        const mappings = mark.mappings;
                        if (mappings) {
                            return hasMappedProperty(mappings, scale._id);
                        }
                        return false;
                    }) != null);
                }));
        }
        chart.scales
            .filter(scaleFilter)
            .forEach(scale => this.chartManager.removeScale(scale));
        debugger;
        chart.scaleMappings = chart.scaleMappings.filter(scaleMapping => chart.scales.find(scale => scale._id === scaleMapping.scale));
    }
    backendSaveChart() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.currentChartID != null) {
                const chart = yield this.backend.get(this.currentChartID);
                this.updateChartState();
                chart.data.state = this.saveState();
                const svg = utils_1.stringToDataURL("image/svg+xml", yield this.renderLocalSVG());
                const png = yield utils_1.renderDataURLToPNG(svg, {
                    mode: "thumbnail",
                    thumbnail: [200, 150]
                });
                chart.metadata.thumbnail = png.toDataURL();
                yield this.backend.put(chart.id, chart.data, chart.metadata);
                this.emit(AppStore.EVENT_SAVECHART);
            }
        });
    }
    backendSaveChartAs(name) {
        return __awaiter(this, void 0, void 0, function* () {
            this.updateChartState();
            const state = this.saveState();
            const svg = utils_1.stringToDataURL("image/svg+xml", yield this.renderLocalSVG());
            const png = yield utils_1.renderDataURLToPNG(svg, {
                mode: "thumbnail",
                thumbnail: [200, 150]
            });
            const id = yield this.backend.create("chart", {
                state,
                name
            }, {
                name,
                dataset: this.dataset.name,
                thumbnail: png.toDataURL()
            });
            this.currentChartID = id;
            this.emit(AppStore.EVENT_SAVECHART);
            return id;
        });
    }
    setupNestedEditor(callback) {
        this.isNestedEditor = true;
        this.disableFileView = true;
        this.emit(AppStore.EVENT_IS_NESTED_EDITOR);
        this.addListener(AppStore.EVENT_NESTED_EDITOR_EDIT, () => {
            callback(this.chart);
        });
    }
    registerExportTemplateTarget(name, ctor) {
        this.registeredExportTemplateTargets.set(name, ctor);
    }
    unregisterExportTemplateTarget(name) {
        this.registeredExportTemplateTargets.delete(name);
    }
    listExportTemplateTargets() {
        const r = [];
        this.registeredExportTemplateTargets.forEach((x, i) => {
            r.push(i);
        });
        return r;
    }
    createExportTemplateTarget(name, template) {
        return this.registeredExportTemplateTargets.get(name)(template);
    }
    getTable(name) {
        if (this.dataset != null) {
            return this.dataset.tables.filter(d => d.name == name)[0];
        }
        else {
            return null;
        }
    }
    getTables() {
        return this.dataset.tables;
    }
    getColumnVector(table, columnName) {
        return table.rows.map(d => d[columnName]);
    }
    saveSelectionState() {
        const selection = {};
        if (this.currentSelection instanceof selection_1.ChartElementSelection) {
            selection.selection = {
                type: "chart-element",
                chartElementID: this.currentSelection.chartElement._id
            };
        }
        if (this.currentSelection instanceof selection_1.GlyphSelection) {
            selection.selection = {
                type: "glyph",
                glyphID: this.currentSelection.glyph._id
            };
        }
        if (this.currentSelection instanceof selection_1.MarkSelection) {
            selection.selection = {
                type: "mark",
                glyphID: this.currentSelection.glyph._id,
                markID: this.currentSelection.mark._id
            };
        }
        if (this.currentGlyph) {
            selection.currentGlyphID = this.currentGlyph._id;
        }
        return selection;
    }
    loadSelectionState(selectionState) {
        if (selectionState == null) {
            return;
        }
        const selection = selectionState.selection;
        if (selection != null) {
            if (selection.type == "chart-element") {
                const chartElement = core_1.getById(this.chart.elements, selection.chartElementID);
                if (chartElement) {
                    this.currentSelection = new selection_1.ChartElementSelection(chartElement);
                }
            }
            if (selection.type == "glyph") {
                const glyphID = selection.glyphID;
                const glyph = core_1.getById(this.chart.glyphs, glyphID);
                const plotSegment = core_1.getById(this.chart.elements, selection.chartElementID);
                if (plotSegment && glyph) {
                    this.currentSelection = new selection_1.GlyphSelection(plotSegment, glyph);
                    this.currentGlyph = glyph;
                }
            }
            if (selection.type == "mark") {
                const glyphID = selection.glyphID;
                const markID = selection.markID;
                const glyph = core_1.getById(this.chart.glyphs, glyphID);
                const plotSegment = core_1.getById(this.chart.elements, selection.chartElementID);
                if (plotSegment && glyph) {
                    const mark = core_1.getById(glyph.marks, markID);
                    if (mark) {
                        this.currentSelection = new selection_1.MarkSelection(plotSegment, glyph, mark);
                        this.currentGlyph = glyph;
                    }
                }
            }
        }
        if (selectionState.currentGlyphID) {
            const glyph = core_1.getById(this.chart.glyphs, selectionState.currentGlyphID);
            if (glyph) {
                this.currentGlyph = glyph;
            }
        }
        this.emit(AppStore.EVENT_SELECTION);
    }
    setSelectedGlyphIndex(plotSegmentID, glyphIndex) {
        this.selectedGlyphIndex[plotSegmentID] = glyphIndex;
    }
    getSelectedGlyphIndex(plotSegmentID) {
        const plotSegment = this.chartManager.getClassById(plotSegmentID);
        if (!plotSegment) {
            return 0;
        }
        if (this.selectedGlyphIndex.hasOwnProperty(plotSegmentID)) {
            const idx = this.selectedGlyphIndex[plotSegmentID];
            if (idx >= plotSegment.state.dataRowIndices.length) {
                this.selectedGlyphIndex[plotSegmentID] = 0;
                return 0;
            }
            else {
                return idx;
            }
        }
        else {
            this.selectedGlyphIndex[plotSegmentID] = 0;
            return 0;
        }
    }
    getMarkIndex(mark) {
        return this.chart.glyphs.indexOf(mark);
    }
    forAllGlyph(glyph, callback) {
        for (const [element, elementState] of core_1.zipArray(this.chart.elements, this.chartState.elements)) {
            if (core_1.Prototypes.isType(element.classID, "plot-segment")) {
                const plotSegment = element;
                const plotSegmentState = elementState;
                if (plotSegment.glyph == glyph._id) {
                    for (const glyphState of plotSegmentState.glyphs) {
                        callback(glyphState, plotSegment, plotSegmentState);
                    }
                }
            }
        }
    }
    addPresolveValue(strength, state, attr, value) {
        this.preSolveValues.push([strength, state, attr, value]);
    }
    /** Given the current selection, find a reasonable plot segment for a glyph */
    findPlotSegmentForGlyph(glyph) {
        if (this.currentSelection instanceof selection_1.MarkSelection ||
            this.currentSelection instanceof selection_1.GlyphSelection) {
            if (this.currentSelection.glyph == glyph) {
                return this.currentSelection.plotSegment;
            }
        }
        if (this.currentSelection instanceof selection_1.ChartElementSelection) {
            if (core_1.Prototypes.isType(this.currentSelection.chartElement.classID, "plot-segment")) {
                const plotSegment = this.currentSelection
                    .chartElement;
                if (plotSegment.glyph == glyph._id) {
                    return plotSegment;
                }
            }
        }
        for (const elem of this.chart.elements) {
            if (core_1.Prototypes.isType(elem.classID, "plot-segment")) {
                const plotSegment = elem;
                if (plotSegment.glyph == glyph._id) {
                    return plotSegment;
                }
            }
        }
    }
    scaleInference(context, expression, valueType, valueKind, outputType, hints = {}, markAttribute) {
        // Figure out the source table
        let tableName = null;
        if (context.glyph) {
            tableName = context.glyph.table;
        }
        if (context.chart) {
            tableName = context.chart.table;
        }
        // Figure out the groupBy
        let groupBy = null;
        if (context.glyph) {
            // Find plot segments that use the glyph.
            this.chartManager.enumeratePlotSegments(cls => {
                if (cls.object.glyph == context.glyph._id) {
                    groupBy = cls.object.groupBy;
                }
            });
        }
        let table = this.getTable(tableName);
        // If there is an existing scale on the same column in the table, return that one
        if (!hints.newScale) {
            const getExpressionUnit = (expr) => {
                const parsed = core_1.Expression.parse(expr);
                // In the case of an aggregation function
                if (parsed instanceof core_1.Expression.FunctionCall) {
                    const args0 = parsed.args[0];
                    if (args0 instanceof core_1.Expression.Variable) {
                        const column = core_1.getByName(table.columns, args0.name);
                        if (column) {
                            return column.metadata.unit;
                        }
                    }
                }
                return null; // unit is unknown
            };
            for (const element of this.chart.elements) {
                if (core_1.Prototypes.isType(element.classID, "plot-segment")) {
                    const plotSegment = element;
                    if (plotSegment.table != table.name) {
                        continue;
                    }
                    const mark = core_1.getById(this.chart.glyphs, plotSegment.glyph);
                    if (!mark) {
                        continue;
                    }
                    for (const element of mark.marks) {
                        for (const name in element.mappings) {
                            if (!element.mappings.hasOwnProperty(name)) {
                                continue;
                            }
                            if (element.mappings[name].type == "scale") {
                                const scaleMapping = element.mappings[name];
                                if (scaleMapping.scale != null) {
                                    if (scaleMapping.expression == expression &&
                                        (markAttribute == scaleMapping.attribute ||
                                            !markAttribute ||
                                            !scaleMapping.attribute)) {
                                        const scaleObject = core_1.getById(this.chart.scales, scaleMapping.scale);
                                        if (scaleObject.outputType == outputType) {
                                            return scaleMapping.scale;
                                        }
                                    }
                                    // TODO: Fix this part
                                    if (getExpressionUnit(scaleMapping.expression) ==
                                        getExpressionUnit(expression) &&
                                        getExpressionUnit(scaleMapping.expression) != null) {
                                        const scaleObject = core_1.getById(this.chart.scales, scaleMapping.scale);
                                        if (scaleObject.outputType == outputType) {
                                            return scaleMapping.scale;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
            if (this.chart.scaleMappings) {
                for (const scaleMapping of this.chart.scaleMappings) {
                    if (scaleMapping.expression == expression &&
                        ((scaleMapping.attribute &&
                            scaleMapping.attribute === markAttribute) ||
                            !scaleMapping.attribute)) {
                        const scaleObject = core_1.getById(this.chart.scales, scaleMapping.scale);
                        if (scaleObject && scaleObject.outputType == outputType) {
                            return scaleMapping.scale;
                        }
                    }
                }
            }
        }
        // Infer a new scale for this item
        const scaleClassID = core_1.Prototypes.Scales.inferScaleType(valueType, valueKind, outputType);
        if (scaleClassID != null) {
            const newScale = this.chartManager.createObject(scaleClassID);
            newScale.properties.name = this.chartManager.findUnusedName("Scale");
            newScale.inputType = valueType;
            newScale.outputType = outputType;
            this.chartManager.addScale(newScale);
            const scaleClass = this.chartManager.getClassById(newScale._id);
            const parentMainTable = this.getTables().find(table => table.type === dataset_1.TableType.ParentMain);
            if (parentMainTable) {
                table = parentMainTable;
            }
            scaleClass.inferParameters(this.chartManager.getGroupedExpressionVector(table.name, groupBy, expression), hints);
            return newScale._id;
        }
        else {
            return null;
        }
    }
    isLegendExistForScale(scale) {
        // See if we already have a legend
        for (const element of this.chart.elements) {
            if (core_1.Prototypes.isType(element.classID, "legend")) {
                if (element.properties.scale == scale) {
                    return true;
                }
            }
        }
        return false;
    }
    toggleLegendForScale(scale) {
        const scaleObject = core_1.getById(this.chartManager.chart.scales, scale);
        // See if we already have a legend
        for (const element of this.chart.elements) {
            if (core_1.Prototypes.isType(element.classID, "legend")) {
                if (element.properties.scale == scale) {
                    this.chartManager.removeChartElement(element);
                    return;
                }
            }
        }
        // Categorical-color scale
        if (scaleObject.classID == "scale.categorical<string,color>") {
            const newLegend = this.chartManager.createObject(`legend.categorical`);
            newLegend.properties.scale = scale;
            newLegend.mappings.x = {
                type: "parent",
                parentAttribute: "x2"
            };
            newLegend.mappings.y = {
                type: "parent",
                parentAttribute: "y2"
            };
            this.chartManager.addChartElement(newLegend);
            this.chartManager.chart.mappings.marginRight = {
                type: "value",
                value: 100
            };
        }
        // Numerical-color scale
        if (scaleObject.classID == "scale.linear<number,color>" ||
            scaleObject.classID == "scale.linear<integer,color>") {
            const newLegend = this.chartManager.createObject(`legend.numerical-color`);
            newLegend.properties.scale = scale;
            newLegend.mappings.x = {
                type: "parent",
                parentAttribute: "x2"
            };
            newLegend.mappings.y = {
                type: "parent",
                parentAttribute: "y2"
            };
            this.chartManager.addChartElement(newLegend);
            this.chartManager.chart.mappings.marginRight = {
                type: "value",
                value: 100
            };
        }
        // Numerical-number scale
        if (scaleObject.classID == "scale.linear<number,number>" ||
            scaleObject.classID == "scale.linear<integer,number>") {
            const newLegend = this.chartManager.createObject(`legend.numerical-number`);
            newLegend.properties.scale = scale;
            newLegend.mappings.x1 = {
                type: "parent",
                parentAttribute: "x1"
            };
            newLegend.mappings.y1 = {
                type: "parent",
                parentAttribute: "y1"
            };
            newLegend.mappings.x2 = {
                type: "parent",
                parentAttribute: "x1"
            };
            newLegend.mappings.y2 = {
                type: "parent",
                parentAttribute: "y2"
            };
            this.chartManager.addChartElement(newLegend);
        }
    }
    getRepresentativeGlyphState(glyph) {
        // Is there a plot segment using this glyph?
        for (const element of this.chart.elements) {
            if (core_1.Prototypes.isType(element.classID, "plot-segment")) {
                const plotSegment = element;
                if (plotSegment.glyph == glyph._id) {
                    const state = this.chartManager.getClassById(plotSegment._id)
                        .state;
                    return state.glyphs[0];
                }
            }
        }
        return null;
    }
    solveConstraintsAndUpdateGraphics(mappingOnly = false) {
        this.solveConstraintsInWorker(mappingOnly).then(() => {
            this.emit(AppStore.EVENT_GRAPHICS);
        });
    }
    solveConstraintsInWorker(mappingOnly = false) {
        return __awaiter(this, void 0, void 0, function* () {
            this.solverStatus = {
                solving: true
            };
            this.emit(AppStore.EVENT_SOLVER_STATUS);
            yield this.worker.solveChartConstraints(this.chart, this.chartState, this.dataset, this.preSolveValues, mappingOnly);
            this.preSolveValues = [];
            this.solverStatus = {
                solving: false
            };
            this.emit(AppStore.EVENT_SOLVER_STATUS);
        });
    }
    newChartEmpty() {
        this.currentSelection = null;
        this.selectedGlyphIndex = {};
        this.currentTool = null;
        this.currentToolOptions = null;
        this.chart = defaults_1.createDefaultChart(this.dataset);
        this.chartManager = new core_1.Prototypes.ChartStateManager(this.chart, this.dataset);
        this.chartState = this.chartManager.chartState;
    }
    deleteSelection() {
        const sel = this.currentSelection;
        this.currentSelection = null;
        this.emit(AppStore.EVENT_SELECTION);
        if (sel instanceof selection_1.ChartElementSelection) {
            new actions_1.Actions.DeleteChartElement(sel.chartElement).dispatch(this.dispatcher);
        }
        if (sel instanceof selection_1.MarkSelection) {
            new actions_1.Actions.RemoveMarkFromGlyph(sel.glyph, sel.mark).dispatch(this.dispatcher);
        }
        if (sel instanceof selection_1.GlyphSelection) {
            new actions_1.Actions.RemoveGlyph(sel.glyph).dispatch(this.dispatcher);
        }
    }
    handleEscapeKey() {
        if (this.currentTool) {
            this.currentTool = null;
            this.emit(AppStore.EVENT_CURRENT_TOOL);
            return;
        }
        if (this.currentSelection) {
            new actions_1.Actions.ClearSelection().dispatch(this.dispatcher);
        }
    }
    buildChartTemplate() {
        const builder = new template_1.ChartTemplateBuilder(this.chart, this.dataset, this.chartManager);
        const template = builder.build();
        return template;
    }
    verifyUserExpressionWithTable(inputString, table, options = {}) {
        if (table != null) {
            const dfTable = this.chartManager.dataflow.getTable(table);
            const rowIterator = function* () {
                for (let i = 0; i < dfTable.rows.length; i++) {
                    yield dfTable.getRowContext(i);
                }
            };
            return core_1.Expression.verifyUserExpression(inputString, Object.assign({ data: rowIterator() }, options));
        }
        else {
            return core_1.Expression.verifyUserExpression(inputString, Object.assign({}, options));
        }
    }
    updatePlotSegments() {
        // Get plot segments to update with new data
        const plotSegments = this.chart.elements.filter(element => core_1.Prototypes.isType(element.classID, "plot-segment"));
        console.log(plotSegments);
        debugger;
        plotSegments.forEach(plot => {
            const table = this.dataset.tables.find(table => table.name === plot.table);
            // xData
            const xDataProperty = plot.properties.xData;
            if (xDataProperty) {
                const xData = new actions_1.DragData.DataExpression(table, xDataProperty.expression, xDataProperty.valueType, {
                    kind: xDataProperty.type === "numerical" && xDataProperty.numericalMode === "temporal" ? specification_1.DataKind.Temporal : xDataProperty.type
                });
                this.bindDataToAxis({
                    property: "xData",
                    dataExpression: xData,
                    object: plot,
                    appendToProperty: null,
                    type: null,
                    numericalMode: xDataProperty.numericalMode
                });
            }
            // yData
            const yDataProperty = plot.properties.yData;
            if (yDataProperty) {
                const yData = new actions_1.DragData.DataExpression(table, yDataProperty.expression, yDataProperty.valueType, {
                    kind: yDataProperty.type === "numerical" && yDataProperty.numericalMode === "temporal" ? specification_1.DataKind.Temporal : yDataProperty.type
                });
                this.bindDataToAxis({
                    property: "yData",
                    dataExpression: yData,
                    object: plot,
                    appendToProperty: null,
                    type: null,
                    numericalMode: yDataProperty.numericalMode
                });
            }
            const axis = plot.properties.axis;
            if (axis) {
                const axisData = new actions_1.DragData.DataExpression(table, axis.expression, axis.valueType, {
                    kind: axis.type === "numerical" && axis.numericalMode === "temporal" ? specification_1.DataKind.Temporal : axis.type
                });
                this.bindDataToAxis({
                    property: "axis",
                    dataExpression: axisData,
                    object: plot,
                    appendToProperty: null,
                    type: null,
                    numericalMode: axis.numericalMode
                });
            }
        });
    }
    getBindingByDataKind(kind) {
        switch (kind) {
            case specification_1.DataKind.Numerical:
                return "numerical";
            case specification_1.DataKind.Temporal:
            case specification_1.DataKind.Ordinal:
            case specification_1.DataKind.Categorical:
                return "categorical";
        }
    }
    bindDataToAxis(options) {
        this.saveHistory();
        const { object, property, appendToProperty, dataExpression } = options;
        const groupExpression = dataExpression.expression;
        let dataBinding = {
            type: options.type || this.getBindingByDataKind(options.dataExpression.metadata.kind),
            expression: groupExpression,
            valueType: dataExpression.valueType,
            gapRatio: 0.1,
            visible: true,
            side: "default",
            style: core_1.deepClone(core_1.Prototypes.PlotSegments.defaultAxisStyle),
            numericalMode: options.numericalMode
        };
        let expressions = [groupExpression];
        if (appendToProperty) {
            if (object.properties[appendToProperty] == null) {
                object.properties[appendToProperty] = [
                    { name: core_1.uniqueID(), expression: groupExpression }
                ];
            }
            else {
                object.properties[appendToProperty].push({
                    name: core_1.uniqueID(),
                    expression: groupExpression
                });
            }
            expressions = object.properties[appendToProperty].map(x => x.expression);
            if (object.properties[property] == null) {
                object.properties[property] = dataBinding;
            }
            else {
                dataBinding = object.properties[property];
            }
        }
        else {
            object.properties[property] = dataBinding;
        }
        let groupBy = null;
        if (core_1.Prototypes.isType(object.classID, "plot-segment")) {
            groupBy = object.groupBy;
        }
        else {
            // Find groupBy for data-driven guide
            if (core_1.Prototypes.isType(object.classID, "mark")) {
                for (const glyph of this.chart.glyphs) {
                    if (glyph.marks.indexOf(object) >= 0) {
                        // Found the glyph
                        this.chartManager.enumeratePlotSegments(cls => {
                            if (cls.object.glyph == glyph._id) {
                                groupBy = cls.object.groupBy;
                            }
                        });
                    }
                }
            }
        }
        let values = [];
        for (const expr of expressions) {
            const r = this.chartManager.getGroupedExpressionVector(dataExpression.table.name, groupBy, expr);
            values = values.concat(r);
        }
        switch (dataExpression.metadata.kind) {
            case core_1.Specification.DataKind.Categorical:
            case core_1.Specification.DataKind.Ordinal:
                {
                    dataBinding.type = "categorical";
                    dataBinding.valueType = core_1.Specification.DataType.String;
                    if (dataExpression.metadata.order) {
                        dataBinding.categories = dataExpression.metadata.order.slice();
                    }
                    else {
                        const scale = new core_1.Scale.CategoricalScale();
                        let orderMode = "alphabetically";
                        if (dataExpression.metadata.orderMode) {
                            orderMode = dataExpression.metadata.orderMode;
                        }
                        scale.inferParameters(values, orderMode);
                        dataBinding.categories = new Array(scale.length);
                        scale.domain.forEach((index, x) => (dataBinding.categories[index] = x.toString()));
                    }
                }
                break;
            case core_1.Specification.DataKind.Numerical:
                {
                    const scale = new core_1.Scale.LinearScale();
                    scale.inferParameters(values);
                    dataBinding.domainMin = scale.domainMin;
                    dataBinding.domainMax = scale.domainMax;
                    dataBinding.type = "numerical";
                    dataBinding.numericalMode = "linear";
                }
                break;
            case core_1.Specification.DataKind.Temporal:
                {
                    const scale = new core_1.Scale.DateScale();
                    scale.inferParameters(values);
                    dataBinding.domainMin = scale.domainMin;
                    dataBinding.domainMax = scale.domainMax;
                    dataBinding.type = "numerical";
                    dataBinding.numericalMode = "temporal";
                }
                break;
        }
        // Adjust sublayout option if current option is not available
        const props = object.properties;
        if (props.sublayout) {
            if (props.sublayout.type == "dodge-x" ||
                props.sublayout.type == "dodge-y" ||
                props.sublayout.type == "grid") {
                if (props.xData && props.xData.type == "numerical") {
                    props.sublayout.type = "overlap";
                }
                if (props.yData && props.yData.type == "numerical") {
                    props.sublayout.type = "overlap";
                }
            }
        }
    }
}
AppStore.EVENT_IS_NESTED_EDITOR = "is-nested-editor";
AppStore.EVENT_NESTED_EDITOR_EDIT = "nested-editor-edit";
/** Fires when the dataset changes */
AppStore.EVENT_DATASET = "dataset";
/** Fires when the chart state changes */
AppStore.EVENT_GRAPHICS = "graphics";
/** Fires when the selection changes */
AppStore.EVENT_SELECTION = "selection";
/** Fires when the current tool changes */
AppStore.EVENT_CURRENT_TOOL = "current-tool";
/** Fires when solver status changes */
AppStore.EVENT_SOLVER_STATUS = "solver-status";
/** Fires when the chart was saved */
AppStore.EVENT_SAVECHART = "savechart";
exports.AppStore = AppStore;
//# sourceMappingURL=app_store.js.map