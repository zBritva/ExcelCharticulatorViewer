"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
const React = require("react");
const core_1 = require("../../../../core");
const actions_1 = require("../../../actions");
const data_field_selector_1 = require("../../dataset/data_field_selector");
const controls_1 = require("./controls");
class FilterEditor extends React.Component {
    constructor() {
        super(...arguments);
        this.state = this.getDefaultState(this.props.value);
    }
    getDefaultState(value) {
        let filterType = "none";
        if (value) {
            if (value.expression) {
                filterType = "expression";
            }
            if (value.categories) {
                filterType = "categories";
            }
        }
        return {
            type: filterType,
            currentValue: value
        };
    }
    emitUpdateFilter(newValue) {
        if (this.props.options.target.property) {
            this.props.manager.emitSetProperty(this.props.options.target.property, newValue);
        }
        if (this.props.options.target.plotSegment) {
            this.props.manager.store.dispatcher.dispatch(new actions_1.Actions.SetPlotSegmentFilter(this.props.options.target.plotSegment, newValue));
        }
        this.setState(this.getDefaultState(newValue));
    }
    render() {
        const { manager, options } = this.props;
        const value = this.state.currentValue;
        let typedControls = [];
        switch (this.state.type) {
            case "expression":
                {
                    typedControls = [
                        manager.row("Expression", React.createElement(controls_1.InputExpression, { validate: newValue => manager.store.verifyUserExpressionWithTable(newValue, options.table, { expectedTypes: ["boolean"] }), defaultValue: this.state.currentValue.expression, onEnter: newValue => {
                                this.emitUpdateFilter({
                                    expression: newValue
                                });
                                return true;
                            } }))
                    ];
                }
                break;
            case "categories":
                {
                    const keysSorted = [];
                    if (value && value.categories) {
                        for (const k in value.categories.values) {
                            if (value.categories.values.hasOwnProperty(k)) {
                                keysSorted.push(k);
                            }
                        }
                        keysSorted.sort((a, b) => (a < b ? -1 : 1));
                    }
                    typedControls = [
                        manager.row("Column", React.createElement("div", { className: "charticulator__filter-editor-column-selector" },
                            React.createElement(data_field_selector_1.DataFieldSelector, { defaultValue: {
                                    table: options.table,
                                    expression: this.state.currentValue.categories.expression
                                }, table: options.table, datasetStore: this.props.manager.store, kinds: [core_1.Specification.DataKind.Categorical], onChange: field => {
                                    // Enumerate all values of this field
                                    if (field.expression) {
                                        const parsed = core_1.Expression.parse(field.expression);
                                        const table = this.props.manager.store.chartManager.dataflow.getTable(field.table);
                                        const exprValues = {};
                                        for (let i = 0; i < table.rows.length; i++) {
                                            const rowContext = table.getRowContext(i);
                                            exprValues[parsed.getStringValue(rowContext)] = true;
                                        }
                                        this.emitUpdateFilter({
                                            categories: {
                                                expression: field.expression,
                                                values: exprValues
                                            }
                                        });
                                    }
                                } }))),
                        keysSorted.length > 0
                            ? manager.row("Values", React.createElement("div", { className: "charticulator__filter-editor-values-selector" },
                                React.createElement("div", { className: "el-buttons" },
                                    React.createElement(controls_1.Button, { text: "Select All", onClick: () => {
                                            for (const key in value.categories.values) {
                                                if (value.categories.values.hasOwnProperty(key)) {
                                                    value.categories.values[key] = true;
                                                }
                                            }
                                            this.emitUpdateFilter({
                                                categories: {
                                                    expression: value.categories.expression,
                                                    values: value.categories.values
                                                }
                                            });
                                        } }),
                                    " ",
                                    React.createElement(controls_1.Button, { text: "Clear", onClick: () => {
                                            for (const key in value.categories.values) {
                                                if (value.categories.values.hasOwnProperty(key)) {
                                                    value.categories.values[key] = false;
                                                }
                                            }
                                            this.emitUpdateFilter({
                                                categories: {
                                                    expression: value.categories.expression,
                                                    values: value.categories.values
                                                }
                                            });
                                        } })),
                                React.createElement("div", { className: "el-list" }, keysSorted.map(key => (React.createElement("div", { key: key },
                                    React.createElement(controls_1.CheckBox, { value: value.categories.values[key], text: key, fillWidth: true, onChange: newValue => {
                                            value.categories.values[key] = newValue;
                                            this.emitUpdateFilter({
                                                categories: {
                                                    expression: value.categories.expression,
                                                    values: value.categories.values
                                                }
                                            });
                                        } })))))))
                            : null
                    ];
                }
                break;
        }
        return (React.createElement("div", { className: "charticulator__filter-editor" },
            React.createElement("div", { className: "attribute-editor" },
                React.createElement("div", { className: "header" }, "Edit Filter"),
                manager.vertical(manager.row("Filter Type", React.createElement(controls_1.Select, { onChange: newValue => {
                        if (this.state.type != newValue) {
                            if (newValue == "none") {
                                this.emitUpdateFilter(null);
                            }
                            else {
                                this.setState({
                                    type: newValue,
                                    currentValue: {
                                        expression: "",
                                        categories: {
                                            expression: "",
                                            values: {}
                                        }
                                    }
                                });
                            }
                        }
                    }, value: this.state.type, options: ["none", "categories", "expression"], labels: ["None", "Categories", "Expression"], showText: true })), ...typedControls))));
    }
}
exports.FilterEditor = FilterEditor;
//# sourceMappingURL=filter_editor.js.map