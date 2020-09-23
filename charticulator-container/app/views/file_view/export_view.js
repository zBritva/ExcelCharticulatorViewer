"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const _1 = require(".");
const core_1 = require("../../../core");
const prototypes_1 = require("../../../core/prototypes");
const actions_1 = require("../../actions");
const components_1 = require("../../components");
const context_component_1 = require("../../context_component");
const R = require("../../resources");
const utils_1 = require("../../utils");
const controls_1 = require("../panels/widgets/controls");
class InputGroup extends React.Component {
    render() {
        return (React.createElement("div", { className: "form-group" },
            React.createElement("input", { ref: e => (this.ref = e), type: "text", required: true, value: this.props.value || "", onChange: e => {
                    this.props.onChange(this.ref.value);
                } }),
            React.createElement("label", null, this.props.label),
            React.createElement("i", { className: "bar" })));
    }
}
exports.InputGroup = InputGroup;
class ExportImageView extends context_component_1.ContextedComponent {
    constructor() {
        super(...arguments);
        this.state = { dpi: "144" };
    }
    getScaler() {
        let dpi = +this.state.dpi;
        if (dpi < 1 || dpi != dpi) {
            dpi = 144;
        }
        dpi = Math.max(Math.min(dpi, 1200), 36);
        return dpi / 72;
    }
    render() {
        return (React.createElement("div", { className: "el-horizontal-layout-item is-fix-width" },
            React.createElement(_1.CurrentChartView, { store: this.store }),
            React.createElement(InputGroup, { label: "DPI (for PNG/JPEG)", value: this.state.dpi, onChange: newValue => {
                    this.setState({
                        dpi: newValue
                    });
                } }),
            React.createElement("div", { className: "buttons" },
                React.createElement(components_1.ButtonRaised, { text: "PNG", url: R.getSVGIcon("toolbar/export"), onClick: () => {
                        this.dispatch(new actions_1.Actions.Export("png", { scale: this.getScaler() }));
                    } }),
                " ",
                React.createElement(components_1.ButtonRaised, { text: "JPEG", url: R.getSVGIcon("toolbar/export"), onClick: () => {
                        this.dispatch(new actions_1.Actions.Export("jpeg", { scale: this.getScaler() }));
                    } }),
                " ",
                React.createElement(components_1.ButtonRaised, { text: "SVG", url: R.getSVGIcon("toolbar/export"), onClick: () => {
                        this.dispatch(new actions_1.Actions.Export("svg"));
                    } }))));
    }
}
exports.ExportImageView = ExportImageView;
class ExportHTMLView extends context_component_1.ContextedComponent {
    render() {
        return (React.createElement("div", { className: "el-horizontal-layout-item is-fix-width" },
            React.createElement(_1.CurrentChartView, { store: this.store }),
            React.createElement("div", { className: "buttons" },
                React.createElement(components_1.ButtonRaised, { text: "HTML", url: R.getSVGIcon("toolbar/export"), onClick: () => {
                        this.dispatch(new actions_1.Actions.Export("html"));
                    } }))));
    }
}
exports.ExportHTMLView = ExportHTMLView;
class FileViewExport extends context_component_1.ContextedComponent {
    constructor() {
        super(...arguments);
        this.state = {
            exportMode: "image"
        };
    }
    renderExportView(mode) {
        if (mode == "image") {
            return React.createElement(ExportImageView, null);
        }
        if (mode == "html") {
            return React.createElement(ExportHTMLView, null);
        }
    }
    renderExportTemplate() {
        return (React.createElement("div", { className: "el-horizontal-layout-item is-fix-width" },
            React.createElement(_1.CurrentChartView, { store: this.store }),
            React.createElement(ExportTemplateView, { exportKind: this.state.exportMode })));
    }
    render() {
        return (React.createElement("div", { className: "charticulator__file-view-content" },
            React.createElement("h1", null, "Export"),
            React.createElement("div", { className: "el-horizontal-layout" },
                React.createElement("div", { className: "el-horizontal-layout-item" },
                    React.createElement("div", { className: "charticulator__list-view" },
                        React.createElement("div", { className: utils_1.classNames("el-item", [
                                "is-active",
                                this.state.exportMode == "image"
                            ]), onClick: () => this.setState({ exportMode: "image" }) },
                            React.createElement(components_1.SVGImageIcon, { url: R.getSVGIcon("toolbar/export") }),
                            React.createElement("span", { className: "el-text" }, "Export as Image")),
                        React.createElement("div", { className: utils_1.classNames("el-item", [
                                "is-active",
                                this.state.exportMode == "html"
                            ]), onClick: () => this.setState({ exportMode: "html" }) },
                            React.createElement(components_1.SVGImageIcon, { url: R.getSVGIcon("toolbar/export") }),
                            React.createElement("span", { className: "el-text" }, "Export as HTML")),
                        this.store.listExportTemplateTargets().map(name => (React.createElement("div", { key: name, className: utils_1.classNames("el-item", [
                                "is-active",
                                this.state.exportMode == name
                            ]), onClick: () => this.setState({ exportMode: name }) },
                            React.createElement(components_1.SVGImageIcon, { url: R.getSVGIcon("toolbar/export") }),
                            React.createElement("span", { className: "el-text" }, name)))))),
                React.createElement(components_1.ErrorBoundary, { maxWidth: 300 }, this.state.exportMode == "image" || this.state.exportMode == "html"
                    ? this.renderExportView(this.state.exportMode)
                    : this.renderExportTemplate()))));
    }
}
exports.FileViewExport = FileViewExport;
class ExportTemplateView extends context_component_1.ContextedComponent {
    constructor() {
        super(...arguments);
        this.state = this.getDefaultState(this.props.exportKind);
    }
    getDefaultState(kind) {
        const template = core_1.deepClone(this.store.buildChartTemplate());
        const target = this.store.createExportTemplateTarget(kind, template);
        const targetProperties = {};
        for (const property of target.getProperties()) {
            targetProperties[property.name] =
                this.store.getPropertyExportName(property.name) || property.default;
        }
        return {
            template,
            target,
            targetProperties
        };
    }
    componentWillReceiveProps(newProps) {
        this.setState(this.getDefaultState(newProps.exportKind));
    }
    renderInput(label, type, value, defaultValue, onChange) {
        let ref;
        switch (type) {
            case "string":
                return (React.createElement("div", { className: "form-group" },
                    React.createElement("input", { ref: e => (ref = e), type: "text", required: true, value: value || "", onChange: e => {
                            onChange(ref.value);
                        } }),
                    React.createElement("label", null, label),
                    React.createElement("i", { className: "bar" })));
            case "boolean":
                const currentValue = value ? true : false;
                return (React.createElement("div", { className: "el-inference-item", onClick: () => {
                        onChange(!currentValue);
                    } },
                    React.createElement(components_1.SVGImageIcon, { url: currentValue
                            ? R.getSVGIcon("checkbox/checked")
                            : R.getSVGIcon("checkbox/empty") }),
                    React.createElement("span", { className: "el-text" }, label)));
            case "file":
                return (React.createElement("div", { className: "form-group-file" },
                    React.createElement("label", null, label),
                    React.createElement("div", { style: {
                            display: "flex",
                            flexDirection: "row"
                        } },
                        React.createElement(controls_1.InputImageProperty, { value: value, onChange: (image) => {
                                onChange(image);
                                return true;
                            } }),
                        React.createElement(controls_1.Button, { icon: "general/eraser", onClick: () => {
                                onChange(defaultValue);
                            } })),
                    React.createElement("i", { className: "bar" })));
        }
    }
    renderTargetProperties() {
        return this.state.target.getProperties().map(property => {
            const displayName = this.store.getPropertyExportName(property.name);
            const targetProperties = this.state.targetProperties;
            return (React.createElement("div", { key: property.name }, this.renderInput(property.displayName, property.type, displayName || targetProperties[property.name], property.default, value => {
                this.store.setPropertyExportName(property.name, value);
                this.setState({
                    targetProperties: Object.assign({}, targetProperties, { [property.name]: value })
                });
            })));
        });
    }
    renderSlots() {
        if (this.state.template.tables.length == 0) {
            return React.createElement("p", null, "(none)");
        }
        return this.state.template.tables.map(table => (React.createElement("div", { key: table.name }, table.columns.map(column => (React.createElement("div", { key: column.name }, this.renderInput(column.name, "string", column.displayName, null, value => {
            column.displayName = value;
            this.setState({
                template: this.state.template
            });
        })))))));
    }
    renderInferences() {
        const template = this.state.template;
        if (template.inference.length == 0) {
            return React.createElement("p", null, "(none)");
        }
        return (template.inference
            // Only show axis and scale inferences
            .filter(inference => inference.axis || inference.scale)
            .map((inference, index) => {
            let descriptionMin = inference.description;
            let descriptionMax = inference.description;
            if (!descriptionMin) {
                if (inference.scale) {
                    const scaleName = prototypes_1.findObjectById(template.specification, inference.objectID).properties.name;
                    descriptionMin = `Auto min domain and range for ${scaleName}`;
                    descriptionMax = `Auto max domain and range for ${scaleName}`;
                }
                if (inference.axis) {
                    const objectName = prototypes_1.findObjectById(template.specification, inference.objectID).properties.name;
                    descriptionMin = `Auto axis min range for ${objectName}/${inference.axis.property.toString()}`;
                    descriptionMax = `Auto axis max range for ${objectName}/${inference.axis.property.toString()}`;
                }
            }
            if (inference.disableAuto === undefined) {
                inference.disableAuto = false;
            }
            return (React.createElement(React.Fragment, null,
                React.createElement("div", { key: index, className: "el-inference-item", onClick: () => {
                        inference.disableAutoMin = !inference.disableAutoMin;
                        this.setState({ template });
                    } },
                    React.createElement(components_1.SVGImageIcon, { url: inference.disableAutoMin
                            ? R.getSVGIcon("checkbox/empty")
                            : R.getSVGIcon("checkbox/checked") }),
                    React.createElement("span", { className: "el-text" }, descriptionMin)),
                React.createElement("div", { key: index, className: "el-inference-item", onClick: () => {
                        inference.disableAutoMax = !inference.disableAutoMax;
                        this.setState({ template });
                    } },
                    React.createElement(components_1.SVGImageIcon, { url: inference.disableAutoMax
                            ? R.getSVGIcon("checkbox/empty")
                            : R.getSVGIcon("checkbox/checked") }),
                    React.createElement("span", { className: "el-text" }, descriptionMax))));
        }));
    }
    renderExposedProperties() {
        const template = this.state.template;
        const result = [];
        const templateObjects = new Map();
        for (const p of this.state.template.properties) {
            const id = p.objectID;
            const object = prototypes_1.findObjectById(this.state.template.specification, id);
            if (object && (p.target.attribute || p.target.property)) {
                if (object.exposed == undefined) {
                    object.exposed = true;
                }
                templateObjects.set(id, object);
            }
        }
        for (const [key, object] of templateObjects) {
            if (core_1.Prototypes.isType(object.classID, "guide")) {
                continue;
            }
            result.push(React.createElement("div", { key: key, className: "el-inference-item", onClick: () => {
                    object.exposed = !object.exposed;
                    this.setState({ template });
                } },
                React.createElement(components_1.SVGImageIcon, { url: !object.exposed
                        ? R.getSVGIcon("checkbox/empty")
                        : R.getSVGIcon("checkbox/checked") }),
                React.createElement(components_1.SVGImageIcon, { url: R.getSVGIcon(core_1.Prototypes.ObjectClasses.GetMetadata(object.classID).iconPath) }),
                React.createElement("span", { className: "el-text" }, object.properties.name)));
        }
        return result;
    }
    render() {
        return (React.createElement("div", { className: "charticulator__export-template-view" },
            React.createElement("h2", null, "Data Mapping Slots"),
            this.renderSlots(),
            React.createElement("h2", null, "Axes and Scales"),
            this.renderInferences(),
            React.createElement("h2", null, "Exposed Objects"),
            this.renderExposedProperties(),
            React.createElement("h2", null,
                this.props.exportKind,
                " Properties"),
            this.renderTargetProperties(),
            React.createElement("div", { className: "buttons" },
                React.createElement(components_1.ButtonRaised, { text: this.props.exportKind, url: R.getSVGIcon("toolbar/export"), onClick: () => {
                        this.dispatch(new actions_1.Actions.ExportTemplate(this.props.exportKind, this.state.target, this.state.targetProperties));
                    } }))));
    }
}
exports.ExportTemplateView = ExportTemplateView;
//# sourceMappingURL=export_view.js.map