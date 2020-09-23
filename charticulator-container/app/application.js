"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
const React = require("react");
const ReactDOM = require("react-dom");
const main_view_1 = require("./main_view");
const stores_1 = require("./stores");
const core_1 = require("../core");
const worker_1 = require("../worker");
const utils_1 = require("./utils");
const actions_1 = require("./actions");
const dataset_1 = require("../core/dataset");
function makeDefaultDataset() {
    const rows = [];
    const months = "Jan,Feb,Mar,Apr,May,Jun,Jul,Aug,Sep,Oct,Nov,Dec".split(",");
    let monthIndex = 0;
    for (const month of months) {
        let cityIndex = 0;
        for (const city of ["City1", "City2", "City3"]) {
            const value = 50 +
                30 *
                    Math.sin(((monthIndex + 0.5) * Math.PI) / 12 + (cityIndex * Math.PI) / 2);
            rows.push({
                _id: "ID" + rows.length,
                Month: month,
                City: city,
                Value: +value.toFixed(1)
            });
            cityIndex += 1;
        }
        monthIndex += 1;
    }
    return {
        tables: [
            {
                name: "Temperature",
                displayName: "Temperature",
                columns: [
                    {
                        name: "Month",
                        displayName: "Month",
                        type: core_1.Dataset.DataType.String,
                        metadata: {
                            kind: core_1.Dataset.DataKind.Categorical,
                            order: months
                        }
                    },
                    {
                        name: "City",
                        displayName: "City",
                        type: core_1.Dataset.DataType.String,
                        metadata: { kind: core_1.Dataset.DataKind.Categorical }
                    },
                    {
                        name: "Value",
                        displayName: "Value",
                        type: core_1.Dataset.DataType.Number,
                        metadata: { kind: core_1.Dataset.DataKind.Numerical, format: ".1f" }
                    }
                ],
                rows,
                type: dataset_1.TableType.Main
            }
        ],
        name: "demo"
    };
}
class ApplicationExtensionContext {
    constructor(app) {
        this.app = app;
    }
    getGlobalDispatcher() {
        return this.app.appStore.dispatcher;
    }
    /** Get the store */
    getAppStore() {
        return this.app.appStore;
    }
    getApplication() {
        return this.app;
    }
}
exports.ApplicationExtensionContext = ApplicationExtensionContext;
class Application {
    initialize(config, containerID, workerScriptURL) {
        return __awaiter(this, void 0, void 0, function* () {
            yield core_1.initialize(config);
            this.worker = new worker_1.CharticulatorWorker(workerScriptURL);
            yield this.worker.initialize(config);
            this.appStore = new stores_1.AppStore(this.worker, makeDefaultDataset());
            window.mainStore = this.appStore;
            ReactDOM.render(React.createElement(main_view_1.MainView, { store: this.appStore, ref: e => (this.mainView = e) }), document.getElementById(containerID));
            this.extensionContext = new ApplicationExtensionContext(this);
            // Load extensions if any
            if (config.Extensions) {
                config.Extensions.forEach(ext => {
                    const scriptTag = document.createElement("script");
                    if (typeof ext.script == "string") {
                        scriptTag.src = ext.script;
                    }
                    else {
                        scriptTag.integrity = ext.script.integrity;
                        scriptTag.src = ext.script.src + "?sha256=" + ext.script.sha256;
                    }
                    scriptTag.onload = () => {
                        // tslint:disable-next-line no-eval
                        eval("(function() { return function(application) { " +
                            ext.initialize +
                            " } })()")(this);
                    };
                    document.body.appendChild(scriptTag);
                });
            }
            yield this.processHashString();
        });
    }
    setupNestedEditor(id) {
        window.addEventListener("message", (e) => {
            if (e.origin != document.location.origin || e.data.id != id) {
                return;
            }
            const info = e.data;
            info.specification.mappings.width = {
                type: "value",
                value: info.width
            };
            info.specification.mappings.height = {
                type: "value",
                value: info.height
            };
            this.appStore.dispatcher.dispatch(new actions_1.Actions.ImportChartAndDataset(info.specification, info.dataset, {
                filterCondition: info.filterCondition
            }));
            this.appStore.setupNestedEditor(newSpecification => {
                window.opener.postMessage({
                    id,
                    type: "save",
                    specification: newSpecification
                }, document.location.origin);
            });
        });
        window.opener.postMessage({
            id,
            type: "initialized"
        }, document.location.origin);
    }
    processHashString() {
        return __awaiter(this, void 0, void 0, function* () {
            // Load saved state or data from hash
            const hashParsed = utils_1.parseHashString(document.location.hash);
            if (hashParsed.nestedEditor) {
                document.title = "Nested Chart | Charticulator";
                this.setupNestedEditor(hashParsed.nestedEditor);
            }
            else if (hashParsed.loadDataset) {
                // Load from a dataset specification json format
                const spec = JSON.parse(hashParsed.dataset);
                const loader = new core_1.Dataset.DatasetLoader();
                const dataset = yield loader.loadDatasetFromSourceSpecification(spec);
                this.appStore.dispatcher.dispatch(new actions_1.Actions.ImportDataset(dataset));
            }
            else if (hashParsed.loadCSV) {
                // Quick load from one or two CSV files
                const spec = {
                    tables: hashParsed.loadCSV.split("|").map(x => ({ url: x }))
                };
                const loader = new core_1.Dataset.DatasetLoader();
                const dataset = yield loader.loadDatasetFromSourceSpecification(spec);
                this.appStore.dispatcher.dispatch(new actions_1.Actions.ImportDataset(dataset));
            }
            else if (hashParsed.load) {
                // Load a saved state
                const value = yield fetch(hashParsed.load);
                const json = yield value.json();
                this.appStore.dispatcher.dispatch(new actions_1.Actions.Load(json.state));
            }
            else {
                this.mainView.refMenuBar.showFileModalWindow("new");
            }
        });
    }
    addExtension(extension) {
        extension.activate(this.extensionContext);
    }
    registerExportTemplateTarget(name, ctor) {
        this.appStore.registerExportTemplateTarget(name, ctor);
    }
    unregisterExportTemplateTarget(name) {
        this.appStore.unregisterExportTemplateTarget(name);
    }
}
exports.Application = Application;
//# sourceMappingURL=application.js.map