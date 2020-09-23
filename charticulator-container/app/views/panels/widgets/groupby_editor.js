"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
const React = require("react");
const core_1 = require("../../../../core");
const actions_1 = require("../../../actions");
const data_field_selector_1 = require("../../dataset/data_field_selector");
class GroupByEditor extends React.Component {
    constructor() {
        super(...arguments);
        this.state = this.getDefaultState(this.props.value);
    }
    getDefaultState(value) {
        let groupByType = "none";
        if (value) {
            if (value.expression) {
                groupByType = "expression";
            }
        }
        return {
            type: groupByType,
            currentValue: value
        };
    }
    emitUpdateGroupBy(newValue) {
        if (this.props.options.target.property) {
            this.props.manager.emitSetProperty(this.props.options.target.property, newValue);
        }
        if (this.props.options.target.plotSegment) {
            this.props.manager.store.dispatcher.dispatch(new actions_1.Actions.SetPlotSegmentGroupBy(this.props.options.target.plotSegment, newValue));
        }
        this.setState(this.getDefaultState(newValue));
    }
    render() {
        const { manager, options } = this.props;
        const value = this.state.currentValue;
        return (React.createElement("div", { className: "charticulator__groupby-editor" },
            React.createElement(data_field_selector_1.DataFieldSelector, { defaultValue: this.state.currentValue && this.state.currentValue.expression
                    ? {
                        table: options.table,
                        expression: this.state.currentValue.expression
                    }
                    : null, table: options.table, nullDescription: "(none)", datasetStore: this.props.manager.store, kinds: [core_1.Specification.DataKind.Categorical], onChange: field => {
                    if (field == null) {
                        this.emitUpdateGroupBy(null);
                    }
                    else {
                        this.emitUpdateGroupBy({
                            expression: field.expression
                        });
                    }
                } })));
    }
}
exports.GroupByEditor = GroupByEditor;
//# sourceMappingURL=groupby_editor.js.map