"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const ReactDOM = require("react-dom");
const core_1 = require("../../../../core");
const actions_1 = require("../../../actions");
const components_1 = require("../../../components");
const context_component_1 = require("../../../context_component");
const controllers_1 = require("../../../controllers");
const globals = require("../../../globals");
const R = require("../../../resources");
const common_1 = require("../../dataset/common");
const data_field_selector_1 = require("../../dataset/data_field_selector");
const scale_editor_1 = require("../scale_editor");
const controls_1 = require("./controls");
const manager_1 = require("./manager");
const value_editor_1 = require("./value_editor");
class MappingEditor extends React.Component {
    constructor() {
        super(...arguments);
        this.updateEvents = new core_1.EventEmitter();
        this.state = {
            showNoneAsValue: false
        };
    }
    beginDataFieldSelection(anchor = this.mappingButton) {
        const parent = this.props.parent;
        const attribute = this.props.attribute;
        const options = this.props.options;
        const mapping = parent.getAttributeMapping(attribute);
        globals.popupController.popupAt(context => {
            return (React.createElement(controllers_1.PopupView, { context: context },
                React.createElement(DataMappAndScaleEditor, { attribute: attribute, parent: this, defaultMapping: mapping, options: options, onClose: () => context.close() })));
        }, { anchor });
    }
    initiateValueEditor() {
        switch (this.props.type) {
            case "number":
            case "font-family":
            case "text":
                {
                    this.setState({
                        showNoneAsValue: true
                    });
                }
                break;
            case "color":
                {
                    if (this.noneLabel == null) {
                        return;
                    }
                    globals.popupController.popupAt(context => (React.createElement(controllers_1.PopupView, { context: context },
                        React.createElement(components_1.ColorPicker, { defaultValue: null, allowNull: true, onPick: color => {
                                if (color == null) {
                                    this.clearMapping();
                                    context.close();
                                }
                                else {
                                    this.setValueMapping(color);
                                }
                            } }))), { anchor: this.noneLabel });
                }
                break;
        }
    }
    setValueMapping(value) {
        this.props.parent.onEditMappingHandler(this.props.attribute, {
            type: "value",
            value
        });
    }
    clearMapping() {
        this.props.parent.onEditMappingHandler(this.props.attribute, null);
        this.setState({
            showNoneAsValue: false
        });
    }
    mapData(data, hints) {
        this.props.parent.onMapDataHandler(this.props.attribute, data, hints);
    }
    componentDidUpdate() {
        this.updateEvents.emit("update");
    }
    getTableOrDefault() {
        if (this.props.options.table) {
            return this.props.options.table;
        }
        else {
            return this.props.parent.store.getTables()[0].name;
        }
    }
    renderValueEditor(value) {
        let placeholderText = this.props.options.defaultAuto ? "(auto)" : "(none)";
        if (this.props.options.defaultValue != null) {
            placeholderText = this.props.options.defaultValue.toString();
        }
        return (React.createElement(value_editor_1.ValueEditor, { value: value, type: this.props.type, placeholder: placeholderText, onClear: () => this.clearMapping(), onEmitValue: value => this.setValueMapping(value), onEmitMapping: mapping => this.props.parent.onEditMappingHandler(this.props.attribute, mapping), onBeginDataFieldSelection: ref => this.beginDataFieldSelection(ref), getTable: () => this.getTableOrDefault(), hints: this.props.options.hints, numberOptions: this.props.options.numberOptions }));
    }
    renderCurrentAttributeMapping() {
        const parent = this.props.parent;
        const attribute = this.props.attribute;
        const options = this.props.options;
        const mapping = parent.getAttributeMapping(attribute);
        if (!mapping) {
            if (options.defaultValue != undefined) {
                return this.renderValueEditor(options.defaultValue);
            }
            else {
                let alwaysShowNoneAsValue = false;
                if (this.props.type == "number" ||
                    this.props.type == "enum" ||
                    this.props.type == "image") {
                    alwaysShowNoneAsValue = true;
                }
                if (this.state.showNoneAsValue || alwaysShowNoneAsValue) {
                    return this.renderValueEditor(null);
                }
                else {
                    if (options.defaultAuto) {
                        return (React.createElement("span", { className: "el-clickable-label", ref: e => (this.noneLabel = e), onClick: () => this.initiateValueEditor() }, "(auto)"));
                    }
                    else {
                        return (React.createElement("span", { className: "el-clickable-label", ref: e => (this.noneLabel = e), onClick: () => this.initiateValueEditor() }, "(none)"));
                    }
                }
            }
        }
        else {
            switch (mapping.type) {
                case "value": {
                    const valueMapping = mapping;
                    return this.renderValueEditor(valueMapping.value);
                }
                case "text": {
                    const textMapping = mapping;
                    return (React.createElement(controls_1.InputExpression, { defaultValue: textMapping.textExpression, textExpression: true, validate: value => parent.store.verifyUserExpressionWithTable(value, textMapping.table, { textExpression: true, expectedTypes: ["string"] }), allowNull: true, onEnter: newValue => {
                            if (newValue == null || newValue.trim() == "") {
                                this.clearMapping();
                            }
                            else {
                                if (core_1.Expression.parseTextExpression(newValue).isTrivialString()) {
                                    this.props.parent.onEditMappingHandler(this.props.attribute, {
                                        type: "value",
                                        value: newValue
                                    });
                                }
                                else {
                                    this.props.parent.onEditMappingHandler(this.props.attribute, {
                                        type: "text",
                                        table: textMapping.table,
                                        textExpression: newValue
                                    });
                                }
                            }
                            return true;
                        } }));
                }
                case "scale": {
                    const scaleMapping = mapping;
                    if (scaleMapping.scale) {
                        let scaleIcon = React.createElement("span", null, "f");
                        if (this.props.type == "color") {
                            scaleIcon = React.createElement(components_1.SVGImageIcon, { url: R.getSVGIcon("scale/color") });
                        }
                        return (React.createElement("span", { className: "el-mapping-scale", ref: e => (this.scaleMappingDisplay = e), onClick: () => {
                                globals.popupController.popupAt(context => (React.createElement(controllers_1.PopupView, { context: context },
                                    React.createElement(DataMappAndScaleEditor, { attribute: this.props.attribute, parent: this, defaultMapping: mapping, options: options, onClose: () => context.close() }))), { anchor: this.scaleMappingDisplay });
                            } },
                            React.createElement("span", { className: "el-mapping-scale-scale is-left" }, scaleIcon),
                            React.createElement("svg", { width: 6, height: 20 },
                                React.createElement("path", { d: "M3.2514,10A17.37314,17.37314,0,0,1,6,0H0V20H6A17.37342,17.37342,0,0,1,3.2514,10Z" })),
                            React.createElement("span", { className: "el-mapping-scale-column" }, scaleMapping.expression),
                            React.createElement("svg", { width: 6, height: 20 },
                                React.createElement("path", { d: "M2.7486,10A17.37314,17.37314,0,0,0,0,0H6V20H0A17.37342,17.37342,0,0,0,2.7486,10Z" }))));
                    }
                    else {
                        return (React.createElement("span", { className: "el-mapping-scale" },
                            React.createElement("span", { className: "el-mapping-scale-scale is-left" }, "="),
                            React.createElement("svg", { width: 6, height: 20 },
                                React.createElement("path", { d: "M3.2514,10A17.37314,17.37314,0,0,1,6,0H0V20H6A17.37342,17.37342,0,0,1,3.2514,10Z" })),
                            React.createElement("span", { className: "el-mapping-scale-column" }, scaleMapping.expression),
                            React.createElement("svg", { width: 6, height: 20 },
                                React.createElement("path", { d: "M2.7486,10A17.37314,17.37314,0,0,0,0,0H6V20H0A17.37342,17.37342,0,0,0,2.7486,10Z" }))));
                    }
                }
                default: {
                    return React.createElement("span", null, "(...)");
                }
            }
        }
    }
    render() {
        const parent = this.props.parent;
        const attribute = this.props.attribute;
        const options = this.props.options;
        const currentMapping = parent.getAttributeMapping(attribute);
        // If there is a mapping, also not having default or using auto
        let shouldShowEraser = currentMapping != null &&
            (currentMapping.type != "value" ||
                !options.defaultValue ||
                options.defaultAuto);
        shouldShowEraser = shouldShowEraser || this.state.showNoneAsValue;
        const shouldShowBindData = parent.onMapDataHandler != null;
        const isDataMapping = currentMapping != null && currentMapping.type == "scale";
        shouldShowEraser = isDataMapping;
        return (React.createElement(manager_1.DropZoneView, { filter: data => {
                if (!shouldShowBindData) {
                    return false;
                }
                if (data instanceof actions_1.DragData.DataExpression) {
                    return common_1.isKindAcceptable(data.metadata.kind, options.acceptKinds);
                }
                else {
                    return false;
                }
            }, onDrop: (data, point, modifiers) => {
                if (!options.hints) {
                    options.hints = {};
                }
                options.hints.newScale = modifiers.shiftKey;
                this.mapData(data, options.hints);
            }, className: "charticulator__widget-control-mapping-editor" }, parent.horizontal([1, 0], this.renderCurrentAttributeMapping(), React.createElement("span", null,
            shouldShowEraser ? (React.createElement(controls_1.Button, { icon: "general/eraser", active: false, title: "Remove", onClick: () => {
                    if (parent.getAttributeMapping(attribute)) {
                        this.clearMapping();
                    }
                    this.setState({
                        showNoneAsValue: false
                    });
                } })) : null,
            shouldShowBindData ? (React.createElement(controls_1.Button, { icon: "general/bind-data", title: "Bind data", ref: e => (this.mappingButton = ReactDOM.findDOMNode(e)), onClick: () => {
                    this.beginDataFieldSelection();
                }, active: isDataMapping })) : null))));
    }
}
exports.MappingEditor = MappingEditor;
class DataMappAndScaleEditor extends context_component_1.ContextedComponent {
    constructor() {
        super(...arguments);
        this.state = {
            currentMapping: this.props.defaultMapping
        };
    }
    componentDidMount() {
        this.tokens = [
            this.props.parent.updateEvents.addListener("update", () => {
                this.setState({
                    currentMapping: this.props.parent.props.parent.getAttributeMapping(this.props.attribute)
                });
            })
        ];
    }
    componentWillUnmount() {
        for (const t of this.tokens) {
            t.remove();
        }
    }
    renderScaleEditor() {
        const mapping = this.state.currentMapping;
        if (mapping && mapping.type == "scale") {
            const scaleMapping = mapping;
            if (scaleMapping.scale) {
                const scaleObject = core_1.getById(this.store.chart.scales, scaleMapping.scale);
                return (React.createElement(scale_editor_1.ScaleEditor, { scale: scaleObject, scaleMapping: scaleMapping, store: this.store }));
            }
        }
        return null;
    }
    renderDataPicker() {
        const options = this.props.options;
        let currentExpression = null;
        const mapping = this.state.currentMapping;
        if (mapping != null && mapping.type == "scale") {
            currentExpression = mapping.expression;
        }
        return (React.createElement("div", null,
            React.createElement(data_field_selector_1.DataFieldSelector, { table: mapping ? mapping.table : options.table, datasetStore: this.store, kinds: options.acceptKinds, useAggregation: true, defaultValue: currentExpression
                    ? { table: options.table, expression: currentExpression }
                    : null, nullDescription: "(none)", nullNotHighlightable: true, onChange: value => {
                    if (value != null) {
                        this.props.parent.mapData(new actions_1.DragData.DataExpression(this.store.getTable(value.table), value.expression, value.type, value.metadata), options.hints);
                    }
                    else {
                        this.props.parent.clearMapping();
                        this.props.onClose();
                    }
                } })));
    }
    render() {
        const scaleElement = this.renderScaleEditor();
        if (scaleElement) {
            return (React.createElement("div", { className: "charticulator__data-mapping-and-scale-editor" },
                React.createElement("div", { className: "el-data-picker" }, this.renderDataPicker()),
                React.createElement("div", { className: "el-scale-editor" }, scaleElement)));
        }
        else {
            return (React.createElement("div", { className: "charticulator__data-mapping-and-scale-editor" },
                React.createElement("div", { className: "el-data-picker" }, this.renderDataPicker())));
        }
    }
}
exports.DataMappAndScaleEditor = DataMappAndScaleEditor;
//# sourceMappingURL=mapping_editor.js.map