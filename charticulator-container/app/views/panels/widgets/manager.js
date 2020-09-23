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
const React = require("react");
const ReactDOM = require("react-dom");
const globals = require("../../../globals");
const R = require("../../../resources");
const core_1 = require("../../../../core");
const actions_1 = require("../../../actions");
const components_1 = require("../../../components");
const icons_1 = require("../../../components/icons");
const controllers_1 = require("../../../controllers");
const index_1 = require("../../../utils/index");
const data_field_selector_1 = require("../../dataset/data_field_selector");
const object_list_editor_1 = require("../object_list_editor");
const controls_1 = require("./controls");
const filter_editor_1 = require("./filter_editor");
const mapping_editor_1 = require("./mapping_editor");
const groupby_editor_1 = require("./groupby_editor");
const container_1 = require("../../../../container");
const input_date_1 = require("./controls/input_date");
class WidgetManager {
    constructor(store, objectClass) {
        this.store = store;
        this.objectClass = objectClass;
    }
    mappingEditor(name, attribute, options) {
        const objectClass = this.objectClass;
        const info = objectClass.attributes[attribute];
        if (options.defaultValue == null) {
            options.defaultValue = info.defaultValue;
        }
        return this.row(name, React.createElement(mapping_editor_1.MappingEditor, { parent: this, attribute: attribute, type: info.type, options: options }));
    }
    getAttributeMapping(attribute) {
        return this.objectClass.object.mappings[attribute];
    }
    getPropertyValue(property) {
        const prop = this.objectClass.object.properties[property.property];
        let value;
        if (property.field != null) {
            value = core_1.getField(prop, property.field);
        }
        else {
            value = prop;
        }
        return value;
    }
    emitSetProperty(property, value) {
        new actions_1.Actions.SetObjectProperty(this.objectClass.object, property.property, property.field, value, property.noUpdateState, property.noComputeLayout).dispatch(this.store.dispatcher);
    }
    // Property widgets
    inputNumber(property, options = {}) {
        const value = this.getPropertyValue(property);
        return (React.createElement(controls_1.InputNumber, Object.assign({}, options, { defaultValue: value, onEnter: value => {
                if (value == null) {
                    this.emitSetProperty(property, null);
                    return true;
                }
                else {
                    this.emitSetProperty(property, value);
                    return true;
                }
                return false;
            } })));
    }
    inputDate(property, options = {}) {
        const value = this.getPropertyValue(property);
        return (React.createElement(input_date_1.InputDate, Object.assign({}, options, { defaultValue: value, onEnter: value => {
                if (value == null) {
                    this.emitSetProperty(property, null);
                    return true;
                }
                else {
                    this.emitSetProperty(property, value);
                    return true;
                }
                return false;
            } })));
    }
    inputText(property, placeholder) {
        return (React.createElement(controls_1.InputText, { defaultValue: this.getPropertyValue(property), placeholder: placeholder, onEnter: value => {
                this.emitSetProperty(property, value);
                return true;
            } }));
    }
    inputFontFamily(property) {
        return (React.createElement(controls_1.ComboBoxFontFamily, { defaultValue: this.getPropertyValue(property), onEnter: value => {
                this.emitSetProperty(property, value);
                return true;
            } }));
    }
    inputComboBox(property, values, valuesOnly = false) {
        return (React.createElement(controls_1.ComboBox, { defaultValue: this.getPropertyValue(property), options: values, optionsOnly: valuesOnly, onEnter: value => {
                this.emitSetProperty(property, value);
                return true;
            } }));
    }
    inputSelect(property, options) {
        if (options.type == "dropdown") {
            return (React.createElement(controls_1.Select, { labels: options.labels, icons: options.icons, options: options.options, value: this.getPropertyValue(property), showText: options.showLabel, onChange: value => {
                    this.emitSetProperty(property, value);
                } }));
        }
        else {
            return (React.createElement(controls_1.Radio, { labels: options.labels, icons: options.icons, options: options.options, value: this.getPropertyValue(property), showText: options.showLabel, onChange: value => {
                    this.emitSetProperty(property, value);
                } }));
        }
    }
    inputBoolean(property, options) {
        switch (options.type) {
            case "checkbox-fill-width":
            case "checkbox": {
                return (React.createElement(controls_1.CheckBox, { value: this.getPropertyValue(property), text: options.label, title: options.label, fillWidth: options.type == "checkbox-fill-width", onChange: v => {
                        this.emitSetProperty(property, v);
                    } }));
            }
            case "highlight": {
                return (React.createElement(controls_1.Button, { icon: options.icon, text: options.label, active: this.getPropertyValue(property), onClick: () => {
                        const v = this.getPropertyValue(property);
                        this.emitSetProperty(property, !v);
                    } }));
            }
        }
    }
    inputExpression(property, options = {}) {
        return (React.createElement(controls_1.InputExpression, { defaultValue: this.getPropertyValue(property), validate: value => this.store.verifyUserExpressionWithTable(value, options.table), placeholder: "(none)", onEnter: value => {
                if (value.trim() == "") {
                    this.emitSetProperty(property, null);
                }
                else {
                    this.emitSetProperty(property, value);
                }
                return true;
            } }));
    }
    inputColor(property, options = {}) {
        const color = this.getPropertyValue(property);
        return (React.createElement(controls_1.InputColor, { defaultValue: color, allowNull: options.allowNull, onEnter: value => {
                this.emitSetProperty(property, value);
                return true;
            } }));
    }
    inputColorGradient(property, inline = false) {
        const gradient = this.getPropertyValue(property);
        if (inline) {
            return (React.createElement("span", { className: "charticulator__widget-control-input-color-gradient-inline" },
                React.createElement(components_1.GradientPicker, { defaultValue: gradient, onPick: (value) => {
                        this.emitSetProperty(property, value);
                    } })));
        }
        else {
            return (React.createElement(controls_1.InputColorGradient, { defaultValue: gradient, onEnter: (value) => {
                    this.emitSetProperty(property, value);
                    return true;
                } }));
        }
    }
    inputImage(property) {
        return (React.createElement(controls_1.InputImage, { value: this.getPropertyValue(property), onChange: image => {
                this.emitSetProperty(property, image);
                return true;
            } }));
    }
    inputImageProperty(property) {
        return (React.createElement(controls_1.InputImageProperty, { value: this.getPropertyValue(property), onChange: image => {
                this.emitSetProperty(property, image);
                return true;
            } }));
    }
    clearButton(property, icon) {
        return (React.createElement(controls_1.Button, { icon: icon || "general/eraser", onClick: () => {
                this.emitSetProperty(property, null);
            } }));
    }
    setButton(property, value, icon, text) {
        return (React.createElement(controls_1.Button, { text: text, icon: icon, onClick: () => {
                this.emitSetProperty(property, value);
            } }));
    }
    orderByWidget(property, options) {
        let ref;
        return (React.createElement(DropZoneView, { filter: data => data instanceof actions_1.DragData.DataExpression, onDrop: (data) => {
                this.emitSetProperty(property, { expression: data.expression });
            }, ref: e => (ref = e), className: index_1.classNames("charticulator__widget-control-order-widget", [
                "is-active",
                this.getPropertyValue(property) != null
            ]), onClick: () => {
                globals.popupController.popupAt(context => {
                    let fieldSelector;
                    let currentExpression = null;
                    const currentSortBy = this.getPropertyValue(property);
                    if (currentSortBy != null) {
                        currentExpression = currentSortBy.expression;
                    }
                    return (React.createElement(controllers_1.PopupView, { context: context },
                        React.createElement("div", { className: "charticulator__widget-popup-order-widget" },
                            React.createElement("div", { className: "el-row" },
                                React.createElement(data_field_selector_1.DataFieldSelector, { ref: e => (fieldSelector = e), nullDescription: "(default order)", datasetStore: this.store, useAggregation: true, defaultValue: currentExpression
                                        ? {
                                            table: options.table,
                                            expression: currentExpression
                                        }
                                        : null, onChange: value => {
                                        if (value != null) {
                                            this.emitSetProperty(property, {
                                                expression: value.expression
                                            });
                                        }
                                        else {
                                            this.emitSetProperty(property, null);
                                        }
                                        context.close();
                                    } })))));
                }, { anchor: ref.dropContainer });
            } },
            React.createElement(icons_1.SVGImageIcon, { url: R.getSVGIcon("general/sort") }),
            React.createElement(icons_1.SVGImageIcon, { url: R.getSVGIcon("general/dropdown") })));
    }
    reorderWidget(property) {
        let container;
        return (React.createElement("span", { ref: e => (container = e) },
            React.createElement(controls_1.Button, { icon: "general/sort", active: false, onClick: () => {
                    globals.popupController.popupAt(context => {
                        const items = this.getPropertyValue(property);
                        return (React.createElement(controllers_1.PopupView, { context: context },
                            React.createElement(ReorderStringsValue, { items: items, onConfirm: items => {
                                    this.emitSetProperty(property, items);
                                    context.close();
                                } })));
                    }, { anchor: container });
                } })));
    }
    arrayWidget(property, renderItem, options = {
        allowDelete: true,
        allowReorder: true
    }) {
        const items = this.getPropertyValue(property).slice();
        return (React.createElement("div", { className: "charticulator__widget-array-view" },
            React.createElement(object_list_editor_1.ReorderListView, { enabled: options.allowReorder, onReorder: (dragIndex, dropIndex) => {
                    object_list_editor_1.ReorderListView.ReorderArray(items, dragIndex, dropIndex);
                    this.emitSetProperty(property, items);
                } }, items.map((item, index) => {
                return (React.createElement("div", { key: index, className: "charticulator__widget-array-view-item" },
                    options.allowReorder ? (React.createElement("span", { className: "charticulator__widget-array-view-control charticulator__widget-array-view-order" },
                        React.createElement(icons_1.SVGImageIcon, { url: R.getSVGIcon("general/order") }))) : null,
                    React.createElement("span", { className: "charticulator__widget-array-view-content" }, renderItem({
                        property: property.property,
                        field: property.field
                            ? property.field instanceof Array
                                ? [...property.field, index]
                                : [property.field, index]
                            : index
                    })),
                    options.allowDelete ? (React.createElement("span", { className: "charticulator__widget-array-view-control" },
                        React.createElement(controls_1.Button, { icon: "general/cross", onClick: () => {
                                items.splice(index, 1);
                                this.emitSetProperty(property, items);
                            } }))) : null));
            }))));
    }
    dropTarget(options, widget) {
        return (React.createElement(DropZoneView, { filter: data => data instanceof actions_1.DragData.DataExpression, onDrop: (data) => {
                this.emitSetProperty(options.property, {
                    expression: data.expression
                });
            }, className: index_1.classNames("charticulator__widget-control-drop-target"), draggingHint: () => (React.createElement("span", { className: "el-dropzone-hint" }, options.label)) }, widget));
    }
    // Label and text
    icon(icon) {
        return (React.createElement("span", { className: "charticulator__widget-label" },
            React.createElement(icons_1.SVGImageIcon, { url: R.getSVGIcon(icon) })));
    }
    label(title) {
        return React.createElement("span", { className: "charticulator__widget-label" }, title);
    }
    text(title, align = "left") {
        return (React.createElement("span", { className: "charticulator__widget-text", style: { textAlign: align } }, title));
    }
    sep() {
        return React.createElement("span", { className: "charticulator__widget-sep" });
    }
    // Layout elements
    sectionHeader(title, widget, options = {}) {
        if (options.dropzone && options.dropzone.type == "axis-data-binding") {
            let refButton;
            const current = this.getPropertyValue({
                property: options.dropzone.property
            });
            return (React.createElement(DropZoneView, { filter: data => data instanceof actions_1.DragData.DataExpression, onDrop: (data) => {
                    new actions_1.Actions.BindDataToAxis(this.objectClass.object, options.dropzone.property, null, data).dispatch(this.store.dispatcher);
                }, className: "charticulator__widget-section-header charticulator__widget-section-header-dropzone", draggingHint: () => (React.createElement("span", { className: "el-dropzone-hint" }, options.dropzone.prompt)) },
                React.createElement("span", { className: "charticulator__widget-section-header-title" }, title),
                widget,
                React.createElement(controls_1.Button, { icon: "general/bind-data", ref: e => (refButton = ReactDOM.findDOMNode(e)), onClick: () => {
                        globals.popupController.popupAt(context => {
                            return (React.createElement(controllers_1.PopupView, { context: context },
                                React.createElement(data_field_selector_1.DataFieldSelector, { datasetStore: this.store, defaultValue: current && current.expression
                                        ? { table: null, expression: current.expression }
                                        : null, useAggregation: true, nullDescription: "(none)", nullNotHighlightable: true, onChange: value => {
                                        if (!value) {
                                            this.emitSetProperty({ property: options.dropzone.property }, null);
                                        }
                                        else {
                                            const data = new actions_1.DragData.DataExpression(this.store.getTable(value.table), value.expression, value.type, value.metadata);
                                            new actions_1.Actions.BindDataToAxis(this.objectClass
                                                .object, options.dropzone.property, null, data).dispatch(this.store.dispatcher);
                                        }
                                    } })));
                        }, { anchor: refButton });
                    }, active: false })));
        }
        else {
            return (React.createElement("div", { className: "charticulator__widget-section-header" },
                React.createElement("span", { className: "charticulator__widget-section-header-title" }, title),
                widget));
        }
    }
    horizontal(cols, ...widgets) {
        return (React.createElement("div", { className: "charticulator__widget-horizontal" }, widgets.map((x, id) => (React.createElement("span", { className: `el-layout-item el-layout-item-col-${cols[id]}`, key: id }, x)))));
    }
    detailsButton(...widgets) {
        return React.createElement(DetailsButton, { widgets: widgets, manager: this });
    }
    filterEditor(options) {
        switch (options.mode) {
            case "button":
                let button;
                let text = "Filter by...";
                if (options.value) {
                    if (options.value.categories) {
                        text = "Filter by " + options.value.categories.expression;
                    }
                    if (options.value.expression) {
                        text = "Filter by " + options.value.expression;
                    }
                }
                return (React.createElement(controls_1.Button, { text: text, ref: e => (button = e), onClick: () => {
                        globals.popupController.popupAt(context => {
                            return (React.createElement(controllers_1.PopupView, { context: context },
                                React.createElement(filter_editor_1.FilterEditor, { manager: this, value: options.value, options: options })));
                        }, { anchor: ReactDOM.findDOMNode(button) });
                    } }));
            case "panel":
                return (React.createElement(filter_editor_1.FilterEditor, { manager: this, value: options.value, options: options }));
        }
    }
    groupByEditor(options) {
        switch (options.mode) {
            case "button":
                let button;
                let text = "Group by...";
                if (options.value) {
                    if (options.value.expression) {
                        text = "Group by " + options.value.expression;
                    }
                }
                return (React.createElement(controls_1.Button, { text: text, ref: e => (button = e), onClick: () => {
                        globals.popupController.popupAt(context => {
                            return (React.createElement(controllers_1.PopupView, { context: context },
                                React.createElement(groupby_editor_1.GroupByEditor, { manager: this, value: options.value, options: options })));
                        }, { anchor: ReactDOM.findDOMNode(button) });
                    } }));
            case "panel":
                return (React.createElement(groupby_editor_1.GroupByEditor, { manager: this, value: options.value, options: options }));
        }
    }
    nestedChartEditor(property, options) {
        return this.row("", this.vertical(React.createElement(components_1.ButtonRaised, { text: "Edit Nested Chart...", onClick: () => {
                const editorID = core_1.uniqueID();
                const newWindow = window.open("index.html#!nestedEditor=" + editorID, "nested_chart_" + options.specification._id);
                const listener = (e) => {
                    if (e.origin == document.location.origin) {
                        const data = e.data;
                        if (data.id == editorID) {
                            switch (data.type) {
                                case "initialized":
                                    {
                                        newWindow.postMessage({
                                            id: editorID,
                                            type: "load",
                                            specification: options.specification,
                                            dataset: options.dataset,
                                            width: options.width,
                                            height: options.height,
                                            filterCondition: options.filterCondition
                                        }, document.location.origin);
                                    }
                                    break;
                                case "save":
                                    {
                                        this.emitSetProperty(property, data.specification);
                                    }
                                    break;
                            }
                        }
                    }
                };
                window.addEventListener("message", listener);
            } }), React.createElement("div", { style: { marginTop: "5px" } },
            React.createElement(components_1.ButtonRaised, { text: "Import Template...", onClick: () => __awaiter(this, void 0, void 0, function* () {
                    const file = yield index_1.showOpenFileDialog(["tmplt"]);
                    const str = yield index_1.readFileAsString(file);
                    const data = JSON.parse(str);
                    const template = new container_1.ChartTemplate(data);
                    for (const table of options.dataset.tables) {
                        const tTable = template.getDatasetSchema()[0];
                        template.assignTable(tTable.name, table.name);
                        for (const column of tTable.columns) {
                            template.assignColumn(tTable.name, column.name, column.name);
                        }
                    }
                    const instance = template.instantiate(options.dataset, false // no scale inference
                    );
                    this.emitSetProperty(property, instance.chart);
                }) }))));
    }
    row(title, widget) {
        return (React.createElement("div", { className: "charticulator__widget-row" },
            title != null ? (React.createElement("span", { className: "charticulator__widget-row-label el-layout-item" }, title)) : null,
            widget));
    }
    vertical(...widgets) {
        return (React.createElement("div", { className: "charticulator__widget-vertical" }, widgets.map((x, id) => (React.createElement("span", { className: "el-layout-item", key: id }, x)))));
    }
    table(rows, options) {
        return (React.createElement("table", { className: "charticulator__widget-table" },
            React.createElement("tbody", null, rows.map((row, index) => (React.createElement("tr", { key: index }, row.map((x, i) => (React.createElement("td", { key: i },
                React.createElement("span", { className: "el-layout-item" }, x))))))))));
    }
    scrollList(widgets, options = {}) {
        return (React.createElement("div", { className: "charticulator__widget-scroll-list", style: {
                maxHeight: options.maxHeight ? options.maxHeight + "px" : undefined,
                height: options.height ? options.height + "px" : undefined
            } }, widgets.map((widget, i) => (React.createElement("div", { className: "charticulator__widget-scroll-list-item", key: i }, widget)))));
    }
}
exports.WidgetManager = WidgetManager;
class DropZoneView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isInSession: false,
            isDraggingOver: false,
            data: null
        };
    }
    componentDidMount() {
        globals.dragController.registerDroppable(this, this.dropContainer);
        this.tokens = [
            globals.dragController.addListener("sessionstart", () => {
                const session = globals.dragController.getSession();
                if (this.props.filter(session.data)) {
                    this.setState({
                        isInSession: true
                    });
                }
            }),
            globals.dragController.addListener("sessionend", () => {
                this.setState({
                    isInSession: false
                });
            })
        ];
    }
    componentWillUnmount() {
        globals.dragController.unregisterDroppable(this);
        this.tokens.forEach(x => x.remove());
    }
    onDragEnter(ctx) {
        const data = ctx.data;
        const judge = this.props.filter(data);
        if (judge) {
            this.setState({
                isDraggingOver: true,
                data
            });
            ctx.onLeave(() => {
                this.setState({
                    isDraggingOver: false,
                    data: null
                });
            });
            ctx.onDrop((point, modifiers) => {
                this.props.onDrop(data, point, modifiers);
            });
            return true;
        }
    }
    render() {
        return (React.createElement("div", { className: index_1.classNames(this.props.className, ["is-in-session", this.state.isInSession], ["is-dragging-over", this.state.isDraggingOver]), onClick: this.props.onClick, ref: e => (this.dropContainer = e) }, this.props.draggingHint == null
            ? this.props.children
            : this.state.isInSession
                ? this.props.draggingHint()
                : this.props.children));
    }
}
exports.DropZoneView = DropZoneView;
class ReorderStringsValue extends React.Component {
    constructor() {
        super(...arguments);
        this.state = {
            items: this.props.items.slice()
        };
    }
    render() {
        const items = this.state.items.slice();
        return (React.createElement("div", { className: "charticulator__widget-popup-reorder-widget" },
            React.createElement("div", { className: "el-row el-list-view" },
                React.createElement(object_list_editor_1.ReorderListView, { enabled: true, onReorder: (a, b) => {
                        object_list_editor_1.ReorderListView.ReorderArray(items, a, b);
                        this.setState({ items });
                    } }, items.map(x => (React.createElement("div", { key: x, className: "el-item" }, x))))),
            React.createElement("div", { className: "el-row" },
                React.createElement(controls_1.Button, { icon: "general/order-reversed", text: "Reverse", onClick: () => {
                        this.setState({ items: this.state.items.reverse() });
                    } }),
                " ",
                React.createElement(controls_1.Button, { icon: "general/sort", text: "Sort", onClick: () => {
                        this.setState({ items: this.state.items.sort() });
                    } })),
            React.createElement("div", { className: "el-row" },
                React.createElement(components_1.ButtonRaised, { text: "OK", onClick: () => {
                        this.props.onConfirm(this.state.items);
                    } }))));
    }
}
exports.ReorderStringsValue = ReorderStringsValue;
class DetailsButton extends React.Component {
    componentDidUpdate() {
        if (this.inner) {
            this.inner.forceUpdate();
        }
    }
    render() {
        let btn;
        return (React.createElement(controls_1.Button, { icon: "general/more-horizontal", ref: e => (btn = ReactDOM.findDOMNode(e)), onClick: () => {
                globals.popupController.popupAt(context => {
                    return (React.createElement(controllers_1.PopupView, { context: context },
                        React.createElement(DetailsButtonInner, { parent: this, ref: e => (this.inner = e) })));
                }, { anchor: btn });
            } }));
    }
}
exports.DetailsButton = DetailsButton;
class DetailsButtonInner extends React.Component {
    render() {
        const parent = this.props.parent;
        return (React.createElement("div", { className: "charticulator__widget-popup-details" }, parent.props.manager.vertical(...parent.props.widgets)));
    }
}
exports.DetailsButtonInner = DetailsButtonInner;
//# sourceMappingURL=manager.js.map