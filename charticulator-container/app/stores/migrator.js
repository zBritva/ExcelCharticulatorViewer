"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("../../core");
const dataset_1 = require("../../core/dataset");
/** Upgrade old versions of chart spec and state to newer version */
class Migrator {
    migrate(state, targetVersion) {
        // First, fix version if missing
        if (!state.version) {
            // Initially we didn't have the version field, so fix it.
            state.version = "1.0.0";
        }
        // console.log(`Migrate state from ${state.version} to ${targetVersion}`);
        if (core_1.compareVersion(state.version, "1.3.0") < 0 &&
            core_1.compareVersion(targetVersion, "1.3.0") >= 0) {
            // Major change at version 1.3.0: MainStoreState => AppStoreState
            const stateOld = state;
            state = {
                version: stateOld.version,
                dataset: stateOld.dataset.dataset,
                chart: stateOld.chart.chart,
                chartState: stateOld.chart.chartState
            };
        }
        if (core_1.compareVersion(state.version, "1.1.0") < 0 &&
            core_1.compareVersion(targetVersion, "1.1.0") >= 0) {
            // Major change in spec from 1.1.0: the dataRowIndices are changed from number[] to number[][]
            state = this.fixDataRowIndices(state);
            state = this.fixDataMappingExpressions(state);
        }
        if (core_1.compareVersion(state.version, "1.4.0") < 0 &&
            core_1.compareVersion(targetVersion, "1.4.0") >= 0) {
            // Major change at version 1.4.0: Links are not automatically sorted in rendering now
            state = this.fixLinkOrder_v130(state);
        }
        if (core_1.compareVersion(state.version, "1.5.0") < 0 &&
            core_1.compareVersion(targetVersion, "1.5.0") >= 0) {
            // Major change at version 1.4.0: Links are not automatically sorted in rendering now
            state = this.addScaleMappings(state);
        }
        if (core_1.compareVersion(state.version, "1.5.1") < 0 &&
            core_1.compareVersion(targetVersion, "1.5.1") >= 0) {
            // Major change at version 1.4.0: Links are not automatically sorted in rendering now
            state = this.addTableTypes(state);
        }
        if (core_1.compareVersion(state.version, "1.6.0") < 0 &&
            core_1.compareVersion(targetVersion, "1.6.0") >= 0) {
            // Major change at version 1.4.0: Links are not automatically sorted in rendering now
            state = this.addOriginDataSet(state);
        }
        // After migration, set version to targetVersion
        state.version = targetVersion;
        return state;
    }
    addOriginDataSet(state) {
        state.originDataset = core_1.deepClone(state.dataset);
        return state;
    }
    addScaleMappings(state) {
        state.chart.scaleMappings = [];
        return state;
    }
    addTableTypes(state) {
        state.dataset.tables[0].type = dataset_1.TableType.Main;
        if (state.dataset.tables[1]) {
            state.dataset.tables[1].type = dataset_1.TableType.Links;
        }
        // TODO append current mappings
        return state;
    }
    fixDataRowIndices(state) {
        // Convert all data row indices in plot segment states to
        for (const [element, elementState] of core_1.zip(state.chart.elements, state.chartState.elements)) {
            if (core_1.Prototypes.isType(element.classID, "plot-segment")) {
                const plotSegmentState = elementState;
                plotSegmentState.dataRowIndices = plotSegmentState.dataRowIndices.map(i => [i]);
            }
        }
        return state;
    }
    addAggregationToExpression(expr, valueType) {
        if (valueType == "number") {
            return "avg(" + expr + ")";
        }
        else {
            return "first(" + expr + ")";
        }
    }
    fixAxisDataMapping(mapping, table) {
        if (!mapping) {
            return;
        }
        mapping.expression = this.addAggregationToExpression(mapping.expression, mapping.valueType);
    }
    fixDataMappingExpressions(state) {
        for (const [element, elementState] of core_1.zip(state.chart.elements, state.chartState.elements)) {
            if (core_1.Prototypes.isType(element.classID, "plot-segment")) {
                const plotSegment = element;
                this.fixAxisDataMapping(plotSegment.properties.xData, plotSegment.table);
                this.fixAxisDataMapping(plotSegment.properties.yData, plotSegment.table);
                if (plotSegment.properties.sublayout) {
                    const sublayout = plotSegment.properties.sublayout;
                    if (sublayout.order) {
                        const parsed = core_1.Expression.parse(sublayout.order);
                        let expr = null;
                        // This is supposed to be in the form of sortBy((x) => x.Column);
                        if (parsed instanceof core_1.Expression.FunctionCall) {
                            if (parsed.name == "sortBy") {
                                if (parsed.args[0] instanceof core_1.Expression.LambdaFunction) {
                                    const lambda = parsed.args[0];
                                    if (lambda.expr instanceof core_1.Expression.FieldAccess) {
                                        const field = lambda.expr;
                                        const column = field.fields[0];
                                        expr = core_1.Expression.functionCall("first", core_1.Expression.variable(column)).toString();
                                    }
                                }
                            }
                        }
                        if (expr) {
                            sublayout.order = { expression: expr };
                        }
                    }
                }
                if (plotSegment.filter) {
                    if (plotSegment.filter.categories.column) {
                        const column = plotSegment.filter.categories.column;
                        delete plotSegment.filter.categories.column;
                        plotSegment.filter.categories.expression = core_1.Expression.variable(column).toString();
                    }
                }
            }
        }
        // Fix data mapping on glyphs/marks
        for (const glyph of state.chart.glyphs) {
            for (const mark of glyph.marks) {
                for (const key in mark.mappings) {
                    if (mark.mappings.hasOwnProperty(key)) {
                        const mapping = mark.mappings[key];
                        if (mapping.type == "scale") {
                            const scaleMapping = mapping;
                            scaleMapping.expression = this.addAggregationToExpression(scaleMapping.expression, scaleMapping.valueType);
                        }
                        if (mapping.type == "scale" || mapping.type == "text") {
                            mapping.table = glyph.table;
                        }
                    }
                }
            }
        }
        // Fix axis data mappings for data-axes
        for (const glyph of state.chart.glyphs) {
            for (const mark of glyph.marks) {
                if (core_1.Prototypes.isType(mark.classID, "mark.data-axis")) {
                    const properties = mark.properties;
                    const valueType = properties.axis.valueType;
                    properties.axis.expression = this.addAggregationToExpression(properties.axis.expression, valueType);
                    if (properties.dataExpressions) {
                        properties.dataExpressions = properties.dataExpressions.map((x, index) => ({
                            name: index.toString(),
                            expression: this.addAggregationToExpression(x, valueType)
                        }));
                    }
                }
            }
        }
        return state;
    }
    fixLinkOrder_v130(state) {
        const linkIndices = [];
        const otherIndices = [];
        for (let i = 0; i < state.chart.elements.length; i++) {
            if (core_1.Prototypes.isType(state.chart.elements[i].classID, "links")) {
                linkIndices.push(i);
            }
            else {
                otherIndices.push(i);
            }
        }
        const allIndices = linkIndices.concat(otherIndices);
        state.chart.elements = allIndices.map(i => state.chart.elements[i]);
        state.chartState.elements = allIndices.map(i => state.chartState.elements[i]);
        return state;
    }
}
exports.Migrator = Migrator;
//# sourceMappingURL=migrator.js.map