"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
const Dataset = require("../../dataset");
const Expression = require("../../expression");
class DataflowTableGroupedContext {
    constructor(table, indices) {
        this.table = table;
        this.indices = indices;
    }
    getTable() {
        return this.table;
    }
    getVariable(name) {
        if (this.table.rows[this.indices[0]].hasOwnProperty(name)) {
            return this.indices.map(i => this.table.rows[i][name]);
        }
        return this.table.getVariable(name);
    }
}
exports.DataflowTableGroupedContext = DataflowTableGroupedContext;
class DataflowTable {
    constructor(parent, name, rows, columns, options) {
        this.parent = parent;
        this.name = name;
        this.rows = rows;
        this.columns = columns;
        this.options = options;
    }
    /** Implements Expression.Context */
    getVariable(name) {
        if (name == "rows") {
            return this.rows;
        }
        if (name == "columns") {
            return this.columns;
        }
        return this.parent.getVariable(name);
    }
    /** Get a row with index */
    getRow(index) {
        return this.rows[index];
    }
    /** Get a row context with index */
    getRowContext(index) {
        return new Expression.ShadowContext(this, this.rows[index]);
    }
    getGroupedContext(rowIndices) {
        return new DataflowTableGroupedContext(this, rowIndices);
    }
}
exports.DataflowTable = DataflowTable;
class DataflowManager {
    constructor(dataset) {
        this.context = new Dataset.DatasetContext(dataset);
        this.cache = new Expression.ExpressionCache();
        this.tables = new Map();
        for (const table of dataset.tables) {
            const dfTable = new DataflowTable(this, table.name, table.rows, table.columns, {
                displayName: table.displayName
            });
            this.tables.set(table.name, dfTable);
        }
    }
    /** Get a table by name (either original table or derived table) */
    getTable(name) {
        return this.tables.get(name);
    }
    /** Implements Expression.Context */
    getVariable(name) {
        if (this.tables.has(name)) {
            return this.tables.get(name);
        }
    }
}
exports.DataflowManager = DataflowManager;
//# sourceMappingURL=index.js.map