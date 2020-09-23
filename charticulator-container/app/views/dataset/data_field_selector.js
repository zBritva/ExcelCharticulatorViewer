"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
const React = require("react");
const core_1 = require("../../../core");
const components_1 = require("../../components");
const R = require("../../resources");
const utils_1 = require("../../utils");
const common_1 = require("./common");
const controls_1 = require("../panels/widgets/controls");
class DataFieldSelector extends React.Component {
    constructor(props) {
        super(props);
        this.state = this.getDefaultState(props);
    }
    getDefaultState(props) {
        let expression = this.props.defaultValue
            ? this.props.defaultValue.expression
            : null;
        let expressionAggregation = null;
        if (props.useAggregation) {
            if (expression != null) {
                const parsed = core_1.Expression.parse(expression);
                if (parsed instanceof core_1.Expression.FunctionCall) {
                    expression = parsed.args[0].toString();
                    expressionAggregation = parsed.name;
                }
            }
        }
        if (props.defaultValue) {
            for (const f of this.getAllFields()) {
                if (props.defaultValue.table != null &&
                    f.table != props.defaultValue.table) {
                    continue;
                }
                if (expression != null) {
                    if (f.expression == expression) {
                        return {
                            currentSelection: f,
                            currentSelectionAggregation: expressionAggregation
                        };
                    }
                }
            }
        }
        return {
            currentSelection: null,
            currentSelectionAggregation: null
        };
    }
    get value() {
        return this.state.currentSelection;
    }
    getAllFields() {
        const fields = this.getFields();
        const r = [];
        for (const item of fields) {
            r.push(item);
            if (item.derived) {
                for (const ditem of item.derived) {
                    r.push(ditem);
                }
            }
        }
        return r;
    }
    getFields() {
        const store = this.props.datasetStore;
        const table = store
            .getTables()
            .filter(table => table.name == this.props.table || this.props.table == null)[0];
        const columns = table.columns;
        const columnFilters = [];
        if (this.props.table) {
            columnFilters.push(x => x.table == this.props.table);
        }
        if (this.props.kinds) {
            columnFilters.push(x => x.metadata != null &&
                common_1.isKindAcceptable(x.metadata.kind, this.props.kinds));
        }
        if (this.props.types) {
            columnFilters.push(x => x.metadata != null && this.props.types.indexOf(x.type) >= 0);
        }
        const columnFilter = (x) => {
            for (const f of columnFilters) {
                if (!f(x)) {
                    return false;
                }
            }
            return true;
        };
        let candidates = columns.map(c => {
            const r = {
                selectable: true,
                table: table.name,
                columnName: c.name,
                expression: core_1.Expression.variable(c.name).toString(),
                type: c.type,
                displayName: c.name,
                metadata: c.metadata,
                derived: []
            };
            // Compute derived columns.
            const derivedColumns = common_1.type2DerivedColumns[r.type];
            if (derivedColumns) {
                for (const item of derivedColumns) {
                    const ditem = {
                        table: table.name,
                        columnName: null,
                        expression: core_1.Expression.functionCall(item.function, core_1.Expression.parse(r.expression)).toString(),
                        type: item.type,
                        metadata: item.metadata,
                        displayName: item.name,
                        selectable: true
                    };
                    if (columnFilter(ditem)) {
                        r.derived.push(ditem);
                    }
                }
            }
            r.selectable = columnFilter(r);
            return r;
        });
        // Make sure we only show good ones
        candidates = candidates.filter(x => x.derived.length > 0 || x.selectable);
        return candidates;
    }
    isValueEqual(v1, v2) {
        if (v1 == v2) {
            return true;
        }
        if (v1 == null || v2 == null) {
            return false;
        }
        return v1.expression == v2.expression && v1.table == v2.table;
    }
    selectItem(item, aggregation = null) {
        if (item == null) {
            if (this.props.onChange) {
                this.props.onChange(null);
            }
        }
        else {
            if (this.props.useAggregation) {
                if (aggregation == null) {
                    aggregation = core_1.Expression.getDefaultAggregationFunction(item.type);
                }
            }
            this.setState({
                currentSelection: item,
                currentSelectionAggregation: aggregation
            });
            if (this.props.onChange) {
                const r = {
                    table: item.table,
                    expression: item.expression,
                    columnName: item.columnName,
                    type: item.type,
                    metadata: item.metadata
                };
                if (this.props.useAggregation) {
                    r.expression = core_1.Expression.functionCall(aggregation, core_1.Expression.parse(item.expression)).toString();
                }
                this.props.onChange(r);
            }
        }
    }
    renderCandidate(item) {
        let elDerived;
        return (React.createElement("div", { className: "el-column-item", key: item.table + item.expression },
            React.createElement("div", { className: utils_1.classNames("el-field-item", ["is-active", this.isValueEqual(this.state.currentSelection, item)], ["is-selectable", item.selectable]), onClick: item.selectable
                    ? () => this.selectItem(item, this.isValueEqual(this.state.currentSelection, item)
                        ? this.state.currentSelectionAggregation
                        : null)
                    : null },
                React.createElement(components_1.SVGImageIcon, { url: R.getSVGIcon(common_1.kind2Icon[item.metadata.kind]) }),
                React.createElement("span", { className: "el-text" }, item.displayName),
                this.props.useAggregation &&
                    this.isValueEqual(this.state.currentSelection, item) ? (React.createElement(controls_1.Select, { value: this.state.currentSelectionAggregation, options: core_1.Expression.getCompatibleAggregationFunctions(item.type).map(x => x.name), labels: core_1.Expression.getCompatibleAggregationFunctions(item.type).map(x => x.displayName), showText: true, onChange: newValue => {
                        this.selectItem(item, newValue);
                    } })) : null,
                item.derived && item.derived.length > 0 ? (React.createElement(controls_1.Button, { icon: "general/more-vertical", onClick: () => {
                        if (elDerived) {
                            if (elDerived.style.display == "none") {
                                elDerived.style.display = "block";
                            }
                            else {
                                elDerived.style.display = "none";
                            }
                        }
                    } })) : null),
            item.derived && item.derived.length > 0 ? (React.createElement("div", { className: "el-derived-fields", style: { display: "none" }, ref: e => (elDerived = e) }, item.derived.map(df => this.renderCandidate(df)))) : null));
    }
    render() {
        const fields = this.getFields();
        return (React.createElement("div", { className: "charticulator__data-field-selector" },
            this.props.nullDescription ? (React.createElement("div", { className: utils_1.classNames("el-field-item", "is-null", "is-selectable", [
                    "is-active",
                    !this.props.nullNotHighlightable &&
                        this.state.currentSelection == null
                ]), onClick: () => this.selectItem(null) }, this.props.nullDescription)) : null,
            fields.length == 0 && !this.props.nullDescription ? (React.createElement("div", { className: "el-field-item is-null" }, "(no suitable column)")) : null,
            fields.map(f => this.renderCandidate(f))));
    }
}
exports.DataFieldSelector = DataFieldSelector;
//# sourceMappingURL=data_field_selector.js.map