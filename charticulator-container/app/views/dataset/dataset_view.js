"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
const React = require("react");
const core_1 = require("../../../core");
const actions_1 = require("../../actions");
const components_1 = require("../../components");
const controllers_1 = require("../../controllers");
const globals = require("../../globals");
const R = require("../../resources");
const stores_1 = require("../../stores");
const utils_1 = require("../../utils");
const controls_1 = require("../panels/widgets/controls");
const common_1 = require("./common");
const table_view_1 = require("./table_view");
const dataset_1 = require("../../../core/dataset");
class DatasetView extends React.Component {
    componentDidMount() {
        this.props.store.addListener(stores_1.AppStore.EVENT_DATASET, () => this.forceUpdate());
    }
    render() {
        const tables = this.props.store.getTables();
        const mainTables = [dataset_1.TableType.Main, dataset_1.TableType.Links];
        return (React.createElement("div", { className: "charticulator__dataset-view" }, tables
            .filter(table => mainTables.find(m => m === table.type))
            .map((table, idx) => (React.createElement(ColumnsView, { key: `t${idx}`, table: table, store: this.props.store })))));
    }
    onImportConnections() {
        alert("Not implemented yet");
    }
}
exports.DatasetView = DatasetView;
class ColumnsView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedColumn: null
        };
    }
    render() {
        const table = this.props.table;
        let anchor;
        return (React.createElement("div", { className: "charticulator__dataset-view-columns", ref: e => (anchor = e) },
            React.createElement("h2", { className: "el-title" },
                React.createElement("span", { className: "el-text" }, this.props.table.type === dataset_1.TableType.Links
                    ? "Link Data"
                    : "Columns"),
                React.createElement(controls_1.Button, { icon: "general/replace", title: "Replace data with CSV file", active: false, onClick: () => {
                        utils_1.showOpenFileDialog(["csv"]).then(file => {
                            const loader = new core_1.Dataset.DatasetLoader();
                            const reader = new FileReader();
                            reader.onload = () => {
                                const newTable = loader.loadCSVFromContents(table.name, reader.result);
                                newTable.displayName = utils_1.getFileNameWithoutExtension(file.name);
                                newTable.name = table.name;
                                newTable.type = table.type;
                                const store = this.props.store;
                                const newDataset = {
                                    name: store.dataset.name,
                                    tables: store.dataset.tables.map(x => {
                                        if (x.name == table.name) {
                                            return newTable;
                                        }
                                        else {
                                            return x;
                                        }
                                    })
                                };
                                store.dispatcher.dispatch(new actions_1.Actions.ReplaceDataset(newDataset));
                            };
                            reader.readAsText(file);
                        });
                    } }),
                React.createElement(controls_1.Button, { icon: "general/more-horizontal", title: "Show data values", active: false, onClick: () => {
                        globals.popupController.popupAt(context => (React.createElement(controllers_1.PopupView, { context: context },
                            React.createElement("div", { className: "charticulator__dataset-view-detail" },
                                React.createElement("h2", null, table.displayName || table.name),
                                React.createElement("p", null,
                                    table.rows.length,
                                    " rows, ",
                                    table.columns.length,
                                    " columns"),
                                React.createElement(table_view_1.TableView, { table: table, onTypeChange: (column, type) => {
                                        const store = this.props.store;
                                        store.dispatcher.dispatch(new actions_1.Actions.ConvertColumnDataType(table.name, column, type));
                                    } })))), { anchor, alignX: "outer", alignY: "start-inner" });
                    } })),
            React.createElement("p", { className: "el-details" }, table.displayName || table.name),
            table.columns.map((c, idx) => (React.createElement(ColumnView, { key: `t${idx}`, store: this.props.store, table: this.props.table, column: c })))));
    }
}
exports.ColumnsView = ColumnsView;
class ColumnViewProps {
}
exports.ColumnViewProps = ColumnViewProps;
class ColumnViewState {
}
exports.ColumnViewState = ColumnViewState;
class ColumnView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isSelected: null,
            isExpanded: false
        };
    }
    renderDerivedColumns() {
        const c = this.props.column;
        const derivedColumns = common_1.type2DerivedColumns[c.type];
        if (!derivedColumns) {
            return null;
        }
        return (React.createElement("div", { className: "charticulator__dataset-view-derived-fields" }, derivedColumns.map(desc => {
            const expr = core_1.Expression.functionCall(desc.function, core_1.Expression.variable(this.props.column.name)).toString();
            const lambdaExpr = core_1.Expression.lambda(["x"], core_1.Expression.functionCall(desc.function, core_1.Expression.fields(core_1.Expression.variable("x"), this.props.column.name))).toString();
            const type = desc.type;
            return this.renderColumnControl(desc.name, R.getSVGIcon(common_1.kind2Icon[desc.metadata.kind]), expr, lambdaExpr, type, null, desc.metadata);
        })));
    }
    applyAggregation(expr, type) {
        const aggregation = core_1.Expression.getDefaultAggregationFunction(type);
        return core_1.Expression.functionCall(aggregation, core_1.Expression.parse(expr)).toString();
    }
    renderColumnControl(label, icon, expr, lambdaExpr, type, additionalElement = null, metadata, onColumnKindChanged) {
        let anchor;
        return (React.createElement("div", { className: "click-handler", ref: e => (anchor = e), onClick: () => {
                if (!onColumnKindChanged) {
                    return;
                }
                globals.popupController.popupAt(context => (React.createElement(controllers_1.PopupView, { key: label, context: context },
                    React.createElement("div", null,
                        React.createElement(controls_1.DropdownListView, { selected: type, list: utils_1.getConvertableDataKind(type).map(type => {
                                return {
                                    name: type.toString(),
                                    text: type.toString(),
                                    url: R.getSVGIcon(common_1.kind2Icon[type])
                                };
                            }), context: context, onClick: (value) => {
                                onColumnKindChanged(label, value);
                            } })))), { anchor, alignX: "outer", alignY: "start-inner" });
            } },
            React.createElement(components_1.DraggableElement, { key: expr, className: utils_1.classNames("charticulator__dataset-view-column", [
                    "is-active",
                    this.state.isSelected == expr
                ]), onDragStart: () => this.setState({ isSelected: expr }), onDragEnd: () => this.setState({ isSelected: null }), dragData: () => {
                    this.setState({ isSelected: expr });
                    const r = new actions_1.DragData.DataExpression(this.props.table, this.applyAggregation(expr, type), type, metadata);
                    return r;
                }, renderDragElement: () => [
                    React.createElement("span", { className: "dragging-table-cell" }, expr),
                    { x: -10, y: -8 }
                ] },
                React.createElement(components_1.SVGImageIcon, { url: icon }),
                React.createElement("span", { className: "el-text" }, label),
                additionalElement)));
    }
    render() {
        const c = this.props.column;
        const derivedColumnsControl = this.renderDerivedColumns();
        if (derivedColumnsControl != null) {
            return (React.createElement("div", null,
                this.renderColumnControl(c.name, R.getSVGIcon(common_1.kind2Icon[c.metadata.kind]), core_1.Expression.variable(c.name).toString(), core_1.Expression.lambda(["x"], core_1.Expression.fields(core_1.Expression.variable("x"), c.name)).toString(), c.type, React.createElement(components_1.ButtonFlat, { title: "Show derived fields", url: this.state.isExpanded
                        ? R.getSVGIcon("general/minus")
                        : R.getSVGIcon("general/more-vertical"), onClick: () => {
                        this.setState({ isExpanded: !this.state.isExpanded });
                    } }), c.metadata, (column, type) => {
                    c.metadata.kind = type;
                    this.forceUpdate();
                    this.props.store.dispatcher.dispatch(new actions_1.Actions.UpdatePlotSegments());
                }),
                this.state.isExpanded ? derivedColumnsControl : null));
        }
        else {
            return this.renderColumnControl(c.name, R.getSVGIcon(common_1.kind2Icon[c.metadata.kind]), core_1.Expression.variable(c.name).toString(), core_1.Expression.lambda(["x"], core_1.Expression.fields(core_1.Expression.variable("x"), c.name)).toString(), c.type, null, c.metadata, (column, type) => {
                c.metadata.kind = type;
                this.props.store.dispatcher.dispatch(new actions_1.Actions.UpdatePlotSegments());
                this.forceUpdate();
            });
        }
    }
}
exports.ColumnView = ColumnView;
//# sourceMappingURL=dataset_view.js.map