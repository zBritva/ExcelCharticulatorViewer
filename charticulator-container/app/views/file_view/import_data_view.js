"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
const React = require("react");
const R = require("../../resources");
const globals = require("../../globals");
const config_1 = require("../../config");
const core_1 = require("../../../core");
const utils_1 = require("../../utils");
const index_1 = require("../../components/index");
const icons_1 = require("../../components/icons");
const table_view_1 = require("../dataset/table_view");
const controllers_1 = require("../../controllers");
const dataset_1 = require("../../../core/dataset");
class FileUploader extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            draggingOver: false,
            filename: props.filename
        };
    }
    reset() {
        this.inputElement.value = null;
        this.setState({
            filename: null
        });
    }
    onInputChange() {
        if (this.inputElement.files.length == 1) {
            this.setState({
                filename: this.inputElement.files[0].name
            });
            if (this.props.onChange) {
                this.props.onChange(this.inputElement.files[0]);
            }
        }
    }
    showOpenFile() {
        this.reset();
        this.inputElement.click();
    }
    isDataTransferValid(dt) {
        if (dt && dt.items.length == 1) {
            if (dt.items[0].kind == "file") {
                return true;
            }
        }
        return false;
    }
    getFileFromDataTransfer(dt) {
        if (dt && dt.items.length == 1) {
            if (dt.items[0].kind == "file") {
                const file = dt.items[0].getAsFile();
                const ext = utils_1.getExtensionFromFileName(file.name);
                if (this.props.extensions.indexOf(ext) >= 0) {
                    return file;
                }
                else {
                    return null;
                }
            }
        }
        if (dt && dt.files.length == 1) {
            return dt.files[0];
        }
        return null;
    }
    render() {
        return (React.createElement("div", { className: utils_1.classNames("charticulator__file-uploader", ["is-dragging-over", this.state.draggingOver], ["is-active", this.state.filename != null]), onClick: () => this.showOpenFile(), onDragOver: e => {
                e.preventDefault();
                if (this.isDataTransferValid(e.dataTransfer)) {
                    this.setState({
                        draggingOver: true
                    });
                }
            }, onDragLeave: e => {
                this.setState({
                    draggingOver: false
                });
            }, onDragExit: e => {
                this.setState({
                    draggingOver: false
                });
            }, onDrop: e => {
                e.preventDefault();
                this.setState({
                    draggingOver: false
                });
                const file = this.getFileFromDataTransfer(e.dataTransfer);
                if (file != null) {
                    this.setState({
                        filename: file.name
                    });
                    if (this.props.onChange) {
                        this.props.onChange(file);
                    }
                }
            } },
            React.createElement("input", { style: { display: "none" }, accept: this.props.extensions.map(x => "." + x).join(","), ref: e => (this.inputElement = e), type: "file", onChange: () => this.onInputChange() }),
            this.state.filename == null ? (React.createElement("span", { className: "charticulator__file-uploader-prompt" },
                React.createElement(icons_1.SVGImageIcon, { url: R.getSVGIcon("toolbar/import") }),
                "Open or Drop File")) : (React.createElement("span", { className: "charticulator__file-uploader-filename" }, this.state.filename))));
    }
}
exports.FileUploader = FileUploader;
class ImportDataView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dataTable: null,
            linkTable: null
        };
    }
    loadFileAsTable(file) {
        return utils_1.readFileAsString(file).then(contents => {
            const ext = utils_1.getExtensionFromFileName(file.name);
            const filename = utils_1.getFileNameWithoutExtension(file.name);
            const loader = new core_1.Dataset.DatasetLoader();
            switch (ext) {
                case "csv": {
                    return loader.loadCSVFromContents(filename, contents);
                }
                case "tsv": {
                    return loader.loadTSVFromContents(filename, contents);
                }
            }
        });
    }
    renderTable(table, onTypeChange) {
        return React.createElement(table_view_1.TableView, { table: table, maxRows: 5, onTypeChange: onTypeChange });
    }
    render() {
        let sampleDatasetDiv;
        const sampleDatasets = config_1.getConfig().SampleDatasets;
        return (React.createElement("div", { className: "charticulator__import-data-view" },
            sampleDatasets != null ? (React.createElement("div", { ref: e => (sampleDatasetDiv = e) },
                React.createElement(index_1.ButtonRaised, { text: "Load Sample Dataset...", onClick: () => {
                        globals.popupController.popupAt(context => {
                            return (React.createElement(controllers_1.PopupView, { context: context },
                                React.createElement("div", { className: "charticulator__sample-dataset-list" }, sampleDatasets.map(dataset => {
                                    return (React.createElement("div", { className: "charticulator__sample-dataset-list-item", key: dataset.name, onClick: () => {
                                            Promise.all(dataset.tables.map(table => {
                                                const loader = new core_1.Dataset.DatasetLoader();
                                                return loader
                                                    .loadCSVFromURL(table.url)
                                                    .then(r => {
                                                    r.name = table.name;
                                                    return r;
                                                });
                                            })).then(tables => {
                                                context.close();
                                                const ds = {
                                                    name: dataset.name,
                                                    tables
                                                };
                                                this.props.onConfirmImport(ds);
                                            });
                                        } },
                                        React.createElement("div", { className: "el-title" }, dataset.name),
                                        React.createElement("div", { className: "el-description" }, dataset.description)));
                                }))));
                        }, { anchor: sampleDatasetDiv });
                    } }))) : null,
            React.createElement("h2", null,
                "Data",
                this.state.dataTable ? ": " + this.state.dataTable.name : null),
            this.state.dataTable ? (React.createElement("div", { className: "charticulator__import-data-view-table" },
                this.renderTable(this.state.dataTable, () => {
                    this.setState({
                        dataTable: this.state.dataTable
                    });
                }),
                React.createElement(index_1.ButtonRaised, { text: "Remove", url: R.getSVGIcon("general/cross"), title: "Remove this table", onClick: () => {
                        this.setState({
                            dataTable: null
                        });
                    } }))) : (React.createElement(FileUploader, { extensions: ["csv", "tsv"], onChange: file => {
                    this.loadFileAsTable(file).then(table => {
                        table.type = dataset_1.TableType.Main;
                        this.setState({
                            dataTable: table
                        });
                    });
                } })),
            React.createElement("h2", null,
                "Links",
                this.state.linkTable ? ": " + this.state.linkTable.name : null),
            this.state.linkTable ? (React.createElement("div", { className: "charticulator__import-data-view-table" },
                this.renderTable(this.state.linkTable, () => {
                    this.setState({
                        linkTable: this.state.linkTable
                    });
                }),
                React.createElement(index_1.ButtonRaised, { text: "Remove", url: R.getSVGIcon("general/cross"), title: "Remove this table", onClick: () => {
                        this.setState({
                            linkTable: null
                        });
                    } }))) : (React.createElement(FileUploader, { extensions: ["csv", "tsv"], onChange: file => {
                    this.loadFileAsTable(file).then(table => {
                        table.type = dataset_1.TableType.Links;
                        this.setState({
                            linkTable: table
                        });
                    });
                } })),
            React.createElement("div", { className: "el-actions" },
                React.createElement(index_1.ButtonRaised, { text: "Done", url: R.getSVGIcon("general/confirm"), title: "Finish importing data", disabled: this.state.dataTable == null, onClick: () => {
                        if (this.state.dataTable != null) {
                            const dataset = {
                                name: this.state.dataTable.name,
                                tables: [this.state.dataTable]
                            };
                            if (this.state.linkTable != null) {
                                dataset.tables.push(this.state.linkTable);
                            }
                            this.props.onConfirmImport(dataset);
                        }
                    } })),
            React.createElement("div", { className: "charticulator__credits" },
                React.createElement("p", { dangerouslySetInnerHTML: {
                        __html: config_1.getConfig().LegalNotices.privacyStatementHTML
                    } }))));
    }
}
exports.ImportDataView = ImportDataView;
//# sourceMappingURL=import_data_view.js.map