"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
const React = require("react");
const actions_1 = require("../../actions");
const context_component_1 = require("../../context_component");
const import_data_view_1 = require("./import_data_view");
class FileViewNew extends context_component_1.ContextedComponent {
    render() {
        return (React.createElement("section", { className: "charticulator__file-view-content" },
            React.createElement("h1", null, "New"),
            React.createElement(import_data_view_1.ImportDataView, { onConfirmImport: dataset => {
                    this.dispatch(new actions_1.Actions.ImportDataset(dataset));
                    this.props.onClose();
                } })));
    }
}
exports.FileViewNew = FileViewNew;
//# sourceMappingURL=new_view.js.map