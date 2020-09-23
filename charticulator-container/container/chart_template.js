"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("../core");
const prototypes_1 = require("../core/prototypes");
const group_by_1 = require("../core/prototypes/group_by");
/** Represents a chart template */
class ChartTemplate {
    /** Create a chart template */
    constructor(template) {
        this.template = template;
        this.columnAssignment = {};
        this.tableAssignment = {};
    }
    getDatasetSchema() {
        return this.template.tables;
    }
    /** Reset slot assignments */
    reset() {
        this.columnAssignment = {};
        this.tableAssignment = {};
    }
    /** Assign a table */
    assignTable(tableName, table) {
        this.tableAssignment[tableName] = table;
    }
    /** Assign an expression to a data mapping slot */
    assignColumn(tableName, columnName, column) {
        if (!this.columnAssignment.hasOwnProperty(tableName)) {
            this.columnAssignment[tableName] = {};
        }
        this.columnAssignment[tableName][columnName] = column;
    }
    /** Get variable map for a given table */
    getVariableMap(table) {
        if (this.columnAssignment[table]) {
            return this.columnAssignment[table];
        }
        else {
            return {};
        }
    }
    transformExpression(expr, table) {
        return core_1.Expression.parse(expr)
            .replace(core_1.Expression.variableReplacer(this.getVariableMap(table)))
            .toString();
    }
    transformTextExpression(expr, table) {
        return core_1.Expression.parseTextExpression(expr)
            .replace(core_1.Expression.variableReplacer(this.getVariableMap(table)))
            .toString();
    }
    transformGroupBy(groupBy, table) {
        if (!groupBy) {
            return null;
        }
        if (groupBy.expression) {
            return {
                expression: this.transformExpression(groupBy.expression, table)
            };
        }
    }
    instantiate(dataset, inference = true) {
        // Make a copy of the chart spec so we won't touch the original template data
        const chart = core_1.deepClone(this.template.specification);
        // Transform table and expressions with current assignments
        for (const item of prototypes_1.forEachObject(chart)) {
            // Replace table with assigned table
            if (item.kind == "chart-element") {
                // PlotSegment
                if (core_1.Prototypes.isType(item.chartElement.classID, "plot-segment")) {
                    const plotSegment = item.chartElement;
                    const originalTable = plotSegment.table;
                    plotSegment.table = this.tableAssignment[originalTable];
                    // Also fix filter and gropyBy expressions
                    if (plotSegment.filter) {
                        if (plotSegment.filter.categories) {
                            plotSegment.filter.categories.expression = this.transformExpression(plotSegment.filter.categories.expression, originalTable);
                        }
                        if (plotSegment.filter.expression) {
                            plotSegment.filter.expression = this.transformExpression(plotSegment.filter.expression, originalTable);
                        }
                    }
                    if (plotSegment.groupBy) {
                        if (plotSegment.groupBy.expression) {
                            plotSegment.groupBy.expression = this.transformExpression(plotSegment.groupBy.expression, originalTable);
                        }
                    }
                }
                // Links
                if (core_1.Prototypes.isType(item.chartElement.classID, "links")) {
                    if (item.chartElement.classID == "links.through") {
                        const props = item.chartElement
                            .properties;
                        if (props.linkThrough.facetExpressions) {
                            props.linkThrough.facetExpressions = props.linkThrough.facetExpressions.map(x => this.transformExpression(x, core_1.getById(this.template.specification.elements, props.linkThrough.plotSegment).table));
                        }
                    }
                    if (item.chartElement.classID == "links.table") {
                        const props = item.chartElement
                            .properties;
                        props.linkTable.table = this.tableAssignment[props.linkTable.table];
                    }
                }
            }
            // Glyphs
            if (item.kind == "glyph") {
                item.glyph.table = this.tableAssignment[item.glyph.table];
            }
            // Replace data-mapping expressions with assigned columns
            const mappings = item.object.mappings;
            for (const [attr, mapping] of prototypes_1.forEachMapping(mappings)) {
                if (mapping.type == "scale") {
                    const scaleMapping = mapping;
                    scaleMapping.expression = this.transformExpression(scaleMapping.expression, scaleMapping.table);
                    scaleMapping.table = this.tableAssignment[scaleMapping.table];
                }
                if (mapping.type == "text") {
                    const textMapping = mapping;
                    textMapping.textExpression = this.transformTextExpression(textMapping.textExpression, textMapping.table);
                    textMapping.table = this.tableAssignment[textMapping.table];
                }
            }
        }
        if (!inference) {
            return {
                chart,
                defaultAttributes: this.template.defaultAttributes
            };
        }
        const df = new core_1.Prototypes.Dataflow.DataflowManager(dataset);
        const getExpressionVector = (expression, table, groupBy) => {
            const expr = core_1.Expression.parse(expression);
            const tableContext = df.getTable(table);
            const indices = groupBy
                ? new group_by_1.CompiledGroupBy(groupBy, df.cache).groupBy(tableContext)
                : core_1.makeRange(0, tableContext.rows.length).map(x => [x]);
            return indices.map(is => expr.getValue(tableContext.getGroupedContext(is)));
        };
        // Perform inferences
        for (const inference of this.template.inference) {
            const object = prototypes_1.findObjectById(chart, inference.objectID);
            if (inference.expression) {
                const expr = this.transformExpression(inference.expression.expression, inference.dataSource.table);
                prototypes_1.setProperty(object, inference.expression.property, expr);
            }
            if (inference.axis) {
                const axis = inference.axis;
                if (axis.type == "default") {
                    continue;
                }
                const expression = this.transformExpression(inference.axis.expression, inference.dataSource.table);
                const axisDataBinding = prototypes_1.getProperty(object, axis.property);
                axisDataBinding.expression = expression;
                if (axisDataBinding.tickDataExpression) {
                    axisDataBinding.tickDataExpression = null; // TODO: fixme
                }
                if (!inference.disableAuto) {
                    let vector = getExpressionVector(expression, this.tableAssignment[inference.dataSource.table], this.transformGroupBy(inference.dataSource.groupBy, inference.dataSource.table));
                    if (inference.axis.additionalExpressions) {
                        for (const item of inference.axis.additionalExpressions) {
                            const expr = this.transformExpression(item, inference.dataSource.table);
                            vector = vector.concat(getExpressionVector(expr, this.tableAssignment[inference.dataSource.table], this.transformGroupBy(inference.dataSource.groupBy, inference.dataSource.table)));
                        }
                    }
                    if (axis.type == "categorical") {
                        const scale = new core_1.Scale.CategoricalScale();
                        scale.inferParameters(vector, "order");
                        axisDataBinding.categories = new Array(scale.domain.size);
                        scale.domain.forEach((index, key) => {
                            axisDataBinding.categories[index] = key;
                        });
                    }
                    else if (axis.type == "numerical") {
                        const scale = new core_1.Scale.LinearScale();
                        scale.inferParameters(vector);
                        debugger;
                        if (!inference.disableAutoMin) {
                            axisDataBinding.domainMin = scale.domainMin;
                        }
                        if (!inference.disableAutoMax) {
                            axisDataBinding.domainMax = scale.domainMax;
                        }
                    }
                }
            }
            if (inference.scale) {
                if (!inference.disableAuto) {
                    const scale = inference.scale;
                    const expressions = scale.expressions.map(x => this.transformExpression(x, inference.dataSource.table));
                    const vectors = expressions.map(x => getExpressionVector(x, this.tableAssignment[inference.dataSource.table], this.transformGroupBy(inference.dataSource.groupBy, inference.dataSource.table)));
                    debugger;
                    if (!inference.disableAutoMin) {
                        vectors.push([object.properties.domainMin]);
                    }
                    if (!inference.disableAutoMax) {
                        vectors.push([object.properties.domainMax]);
                    }
                    const vector = vectors.reduce((a, b) => a.concat(b), []);
                    const scaleClass = core_1.Prototypes.ObjectClasses.Create(null, object, {
                        attributes: {}
                    });
                    scaleClass.inferParameters(vector, {
                        reuseRange: true
                    });
                }
            }
            if (inference.nestedChart) {
                const { nestedChart } = inference;
                const columnNameMap = {};
                Object.keys(nestedChart.columnNameMap).forEach(key => {
                    const newKey = this.columnAssignment[inference.dataSource.table][key];
                    columnNameMap[newKey] = nestedChart.columnNameMap[key];
                });
                prototypes_1.setProperty(object, "columnNameMap", columnNameMap);
            }
        }
        return {
            chart,
            defaultAttributes: this.template.defaultAttributes
        };
    }
    static SetChartProperty(chart, objectID, property, value) {
        const obj = core_1.Prototypes.findObjectById(chart, objectID);
        if (!obj) {
            return;
        }
        core_1.Prototypes.setProperty(obj, property, value);
    }
    static GetChartProperty(chart, objectID, property) {
        const obj = core_1.Prototypes.findObjectById(chart, objectID);
        if (!obj) {
            return null;
        }
        return core_1.Prototypes.getProperty(obj, property);
    }
    static SetChartAttributeMapping(chart, objectID, attribute, value) {
        const obj = core_1.Prototypes.findObjectById(chart, objectID);
        if (!obj) {
            return;
        }
        obj.mappings[attribute] = value;
    }
    static GetChartAttributeMapping(chart, objectID, attribute) {
        const obj = core_1.Prototypes.findObjectById(chart, objectID);
        if (!obj) {
            return null;
        }
        return obj.mappings[attribute];
    }
}
exports.ChartTemplate = ChartTemplate;
//# sourceMappingURL=chart_template.js.map