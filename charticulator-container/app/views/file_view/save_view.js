"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const R = require("../../resources");
const _1 = require(".");
const components_1 = require("../../components");
const context_component_1 = require("../../context_component");
const actions_1 = require("../../actions");
class FileViewSaveAs extends context_component_1.ContextedComponent {
    constructor() {
        super(...arguments);
        this.state = {};
    }
    render() {
        let inputSaveChartName;
        return (React.createElement("section", { className: "charticulator__file-view-content is-fix-width" },
            React.createElement("h1", null, "Save As"),
            React.createElement("section", null,
                React.createElement(_1.CurrentChartView, { store: this.store }),
                React.createElement("div", { className: "form-group" },
                    React.createElement("input", { ref: e => (inputSaveChartName = e), type: "text", required: true, defaultValue: this.store.dataset.name }),
                    React.createElement("label", null, "Chart Name"),
                    React.createElement("i", { className: "bar" })),
                React.createElement("div", { className: "buttons" },
                    React.createElement("span", { className: "el-progress" }, this.state.saving ? (React.createElement(components_1.SVGImageIcon, { url: R.getSVGIcon("loading") })) : null),
                    React.createElement(components_1.ButtonRaised, { url: R.getSVGIcon("toolbar/save"), text: "Save to My Charts", onClick: () => {
                            const name = inputSaveChartName.value.trim();
                            this.setState({
                                saving: true
                            }, () => {
                                this.dispatch(new actions_1.Actions.SaveAs(name, error => {
                                    if (error) {
                                        this.setState({
                                            saving: true,
                                            error: error.message
                                        });
                                    }
                                    else {
                                        this.props.onClose();
                                    }
                                }));
                            });
                        } })),
                this.state.error ? (React.createElement("div", { className: "error" }, this.state.error)) : null)));
    }
}
exports.FileViewSaveAs = FileViewSaveAs;
//# sourceMappingURL=save_view.js.map