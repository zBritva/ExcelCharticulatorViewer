"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("../../core");
class ChartTemplateBuilder {
    constructor(chart, dataset, manager) {
        this.chart = chart;
        this.dataset = dataset;
        this.manager = manager;
    }
    reset() {
        this.template = {
            specification: core_1.deepClone(this.chart),
            defaultAttributes: {},
            tables: [],
            inference: [],
            properties: []
        };
        this.tableColumns = {};
        this.objectVisited = {};
    }
    addTable(table) {
        if (!this.tableColumns.hasOwnProperty(table)) {
            this.tableColumns[table] = new Set();
        }
    }
    addColumn(table, column) {
        if (table == null) {
            table = this.dataset.tables[0].name;
        }
        const tableObject = core_1.getByName(this.dataset.tables, table);
        if (tableObject) {
            if (core_1.getByName(tableObject.columns, column)) {
                if (this.tableColumns.hasOwnProperty(table)) {
                    this.tableColumns[table].add(column);
                }
                else {
                    this.tableColumns[table] = new Set([column]);
                }
            }
        }
    }
    addColumnsFromExpression(table, expr, textExpression) {
        if (expr) {
            let ex;
            if (textExpression) {
                ex = core_1.Expression.parseTextExpression(expr);
            }
            else {
                ex = core_1.Expression.parse(expr);
            }
            ex.replace((e) => {
                if (e instanceof core_1.Expression.Variable) {
                    this.addColumn(table, e.name);
                }
            });
        }
    }
    propertyToString(property) {
        let pn;
        if (typeof property == "string" || typeof property == "number") {
            pn = property.toString();
        }
        else {
            pn = property.property;
            if (property.field) {
                if (typeof property.field == "string" ||
                    typeof property.field == "number") {
                    pn += "." + property.field.toString();
                }
                else {
                    pn += "." + property.field.join(".");
                }
            }
        }
        return pn;
    }
    addObject(table, objectClass) {
        // Visit a object only once
        if (this.objectVisited[objectClass.object._id]) {
            return;
        }
        this.objectVisited[objectClass.object._id] = true;
        const template = this.template;
        // Get template inference data
        const params = objectClass.getTemplateParameters();
        if (params && params.inferences) {
            for (const inference of params.inferences) {
                if (inference.axis) {
                    this.addColumnsFromExpression(inference.dataSource.table, inference.axis.expression);
                }
                if (inference.scale) {
                    // Find all objects that use the scale
                    const expressions = new Set();
                    let table = null;
                    let groupBy = null;
                    for (const item of core_1.Prototypes.forEachObject(this.template.specification)) {
                        for (const [, mapping] of core_1.Prototypes.forEachMapping(item.object.mappings)) {
                            if (mapping.type == "scale") {
                                const scaleMapping = mapping;
                                if (scaleMapping.scale == inference.objectID) {
                                    expressions.add(scaleMapping.expression);
                                    if (item.kind == "glyph" || item.kind == "mark") {
                                        table = item.glyph.table;
                                        // Find the plot segment
                                        for (const ps of core_1.Prototypes.forEachObject(this.template.specification)) {
                                            if (ps.kind == "chart-element" &&
                                                core_1.Prototypes.isType(ps.object.classID, "plot-segment")) {
                                                groupBy = ps.chartElement
                                                    .groupBy;
                                                break; // TODO: for now, we assume it's the first one
                                            }
                                        }
                                    }
                                    if (item.kind == "chart-element" &&
                                        core_1.Prototypes.isType(item.chartElement.classID, "links")) {
                                        const linkTable = item.object.properties.linkTable;
                                        const defaultTable = this.dataset.tables[0];
                                        table = (linkTable && linkTable.table) || defaultTable.name;
                                    }
                                }
                            }
                        }
                    }
                    if (expressions.size == 0) {
                        // Scale not used
                        continue;
                    }
                    inference.scale.expressions = Array.from(expressions);
                    if (!inference.dataSource) {
                        inference.dataSource = {
                            table,
                            groupBy
                        };
                    }
                }
                if (inference.expression) {
                    this.addColumnsFromExpression(inference.dataSource.table, inference.expression.expression);
                }
                if (inference.nestedChart) {
                    const { nestedChart } = inference;
                    Object.keys(nestedChart.columnNameMap).forEach(key => {
                        this.addColumn(inference.dataSource.table, key);
                    });
                }
                template.inference.push(inference);
            }
        }
        if (params && params.properties) {
            for (const property of params.properties) {
                // Make a default display name
                let pn = "";
                if (property.target.property) {
                    pn = this.propertyToString(property.target.property);
                }
                else if (property.target.attribute) {
                    pn = property.target.attribute;
                }
                property.displayName = objectClass.object.properties.name + "/" + pn;
                template.properties.push(property);
            }
        }
        // Add filter
        const plotSegmentObj = objectClass.object;
        if (core_1.Prototypes.isType(plotSegmentObj.classID, "plot-segment")) {
            this.addTable(plotSegmentObj.table);
            const filter = plotSegmentObj.filter;
            if (filter) {
                const { categories, expression } = filter;
                if (expression) {
                    this.addColumnsFromExpression(table, expression);
                }
                if (categories) {
                    this.addColumnsFromExpression(table, categories.expression);
                }
            }
            const groupBy = plotSegmentObj.groupBy;
            if (groupBy && groupBy.expression) {
                this.addColumnsFromExpression(table, groupBy.expression);
            }
        }
        // Get mappings
        for (const [, mapping] of core_1.Prototypes.forEachMapping(objectClass.object.mappings)) {
            if (mapping.type == "scale") {
                const scaleMapping = mapping;
                this.addColumnsFromExpression(scaleMapping.table, scaleMapping.expression);
            }
            if (mapping.type == "text") {
                const textMapping = mapping;
                this.addColumnsFromExpression(textMapping.table, textMapping.textExpression, true);
            }
        }
    }
    build() {
        debugger;
        this.reset();
        const template = this.template;
        for (const elementClass of this.manager.getElements()) {
            let table = null;
            if (core_1.Prototypes.isType(elementClass.object.classID, "plot-segment")) {
                const plotSegment = elementClass.object;
                table = plotSegment.table;
            }
            if (core_1.Prototypes.isType(elementClass.object.classID, "links")) {
                const linkTable = elementClass.object.properties
                    .linkTable;
                if (linkTable) {
                    const linksTableName = linkTable.table;
                    this.addTable(linksTableName); // TODO get table by type
                    const linksTable = this.dataset.tables.find(table => table.name === linksTableName);
                    linksTable.columns.forEach(linksColumn => this.addColumn(linksTableName, linksColumn.name));
                    const table = this.dataset.tables[0];
                    const idColumn = table && table.columns.find(column => column.name === "id");
                    if (idColumn) {
                        this.addColumn(table.name, idColumn.name);
                    }
                }
            }
            this.addObject(table, elementClass);
            if (core_1.Prototypes.isType(elementClass.object.classID, "plot-segment")) {
                const plotSegmentState = elementClass.state;
                for (const glyph of plotSegmentState.glyphs) {
                    this.addObject(table, this.manager.getClass(glyph));
                    for (const mark of glyph.marks) {
                        this.addObject(table, this.manager.getClass(mark));
                    }
                    // Only one glyph is enough.
                    break;
                }
            }
        }
        for (const scaleState of this.manager.chartState.scales) {
            this.addObject(null, this.manager.getClass(scaleState));
        }
        this.addObject(null, this.manager.getChartClass(this.manager.chartState));
        // Extract data tables
        template.tables = this.dataset.tables
            .map(table => {
            if (this.tableColumns.hasOwnProperty(table.name)) {
                return {
                    name: table.name,
                    columns: table.columns
                        .filter(x => {
                        return this.tableColumns[table.name].has(x.name);
                    })
                        .map(x => ({
                        displayName: x.name,
                        name: x.name,
                        type: x.type,
                        metadata: x.metadata
                    }))
                };
            }
            else {
                return null;
            }
        })
            .filter(x => x != null);
        this.computeDefaultAttributes();
        return template;
    }
    /**
     * Computes the default attributes
     */
    computeDefaultAttributes() {
        const counts = {};
        // Go through all the mark instances
        this.manager.enumerateClassesByType("mark", (cls, state) => {
            const { _id } = cls.object;
            // Basic idea is sum up the attributes for each mark object, and then average them at the end
            const totals = (this.template.defaultAttributes[_id] =
                this.template.defaultAttributes[_id] || {});
            Object.keys(state.attributes).forEach(attribute => {
                // Only support numbers for now
                if (cls.attributes[attribute].type === "number") {
                    totals[attribute] = totals[attribute] || 0;
                    totals[attribute] += state.attributes[attribute] || 0;
                    counts[_id] = (counts[_id] || 0) + 1;
                }
            });
        });
        // The default attributes are currently totals, now divide each attribute by the count to average them
        Object.keys(this.template.defaultAttributes).forEach(objId => {
            const attribs = this.template.defaultAttributes[objId];
            Object.keys(attribs).forEach(attribute => {
                attribs[attribute] = attribs[attribute] / counts[objId];
            });
        });
    }
}
exports.ChartTemplateBuilder = ChartTemplateBuilder;
//# sourceMappingURL=index.js.map