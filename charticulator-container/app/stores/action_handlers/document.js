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
const FileSaver = require("file-saver");
const file_saver_1 = require("file-saver");
const core_1 = require("../../../core");
const actions_1 = require("../../actions");
const utils_1 = require("../../utils");
const app_store_1 = require("../app_store");
const migrator_1 = require("../migrator");
const config_1 = require("../../config");
const data_types_1 = require("../../../core/dataset/data_types");
const dataset_1 = require("../../../core/dataset");
/** Handlers for document-level actions such as Load, Save, Import, Export, Undo/Redo, Reset */
function default_1(REG) {
    REG.add(actions_1.Actions.Export, function (action) {
        (() => __awaiter(this, void 0, void 0, function* () {
            // Export as vector graphics
            if (action.type == "svg") {
                const svg = yield this.renderLocalSVG();
                const blob = new Blob([svg], { type: "image/svg;charset=utf-8" });
                file_saver_1.saveAs(blob, "charticulator.svg", true);
            }
            // Export as bitmaps
            if (action.type == "png" || action.type == "jpeg") {
                const svgDataURL = utils_1.stringToDataURL("image/svg+xml", yield this.renderLocalSVG());
                utils_1.renderDataURLToPNG(svgDataURL, {
                    mode: "scale",
                    scale: action.options.scale || 2,
                    background: "#ffffff"
                }).then(png => {
                    png.toBlob(blob => {
                        file_saver_1.saveAs(blob, "charticulator." + (action.type == "png" ? "png" : "jpg"), true);
                    }, "image/" + action.type);
                });
            }
            // Export as interactive HTML
            if (action.type == "html") {
                const containerScriptText = yield (yield fetch(config_1.getConfig().ContainerURL)).text();
                const template = core_1.deepClone(this.buildChartTemplate());
                const htmlString = `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8" />
            <title>Charticulator HTML Export</title>
            <script type="text/javascript">${containerScriptText}</script>
            <style type="text/css">
              #container {
                display: block;
                position: absolute;
                left: 0; right: 0; top: 0; bottom: 0;
              }
            </style>
          </head>
          <body>
            <div id="container"></div>
            <script type="text/javascript">
              CharticulatorContainer.initialize().then(function() {
                const currentChart = ${JSON.stringify(this.chart)};
                const chartState = ${JSON.stringify(this.chartState)};
                const dataset = ${JSON.stringify(this.dataset)};
                const template = ${JSON.stringify(template)};
                const chartTemplate = new CharticulatorContainer.ChartTemplate(
                  template
                );
                chartTemplate.reset();

                const defaultTable = dataset.tables[0];
                const columns = defaultTable.columns;
                chartTemplate.assignTable(defaultTable.name, defaultTable.name);
                for (const column of columns) {
                  chartTemplate.assignColumn(
                    defaultTable.name,
                    column.name,
                    column.name
                  );
                }

                // links table
                const linksTable = dataset.tables[1];
                const links = linksTable && (linksTable.columns);
                if (links) {
                  chartTemplate.assignTable(linksTable.name, linksTable.name);
                  for (const column of links) {
                    chartTemplate.assignColumn(
                      linksTable.name,
                      column.name,
                      column.name
                    );
                  }
                }
                const instance = chartTemplate.instantiate(dataset);

                const { chart } = instance;

                for (const property of template.properties) {
                  if (property.target.attribute) {
                    CharticulatorContainer.ChartTemplate.SetChartAttributeMapping(
                      chart,
                      property.objectID,
                      property.target.attribute,
                      {
                        type: "value",
                        value: property.default,
                      }
                    );
                  }
                  
                }

                const container = new CharticulatorContainer.ChartContainer({ chart: chart }, dataset);
                const width = document.getElementById("container").getBoundingClientRect().width;
                const height = document.getElementById("container").getBoundingClientRect().height;
                container.mount("container", width, height);
                window.addEventListener("resize", function() {
                  container.resize(
                    document.getElementById("container").getBoundingClientRect().width,
                    document.getElementById("container").getBoundingClientRect().height
                  );
                });
              });
            </script>
          </body>
          </html>
        `;
                const blob = new Blob([htmlString]);
                file_saver_1.saveAs(blob, "charticulator.html", true);
            }
        }))();
    });
    REG.add(actions_1.Actions.ExportTemplate, function (action) {
        action.target.generate(action.properties).then(base64 => {
            const byteCharacters = atob(base64);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            const blob = new Blob([byteArray], {
                type: "application/x-binary"
            });
            FileSaver.saveAs(blob, action.target.getFileName
                ? action.target.getFileName(action.properties)
                : "charticulator." + action.target.getFileExtension(action.properties));
        });
    });
    REG.add(actions_1.Actions.Save, function (action) {
        this.backendSaveChart()
            .then(() => {
            if (action.onFinish) {
                action.onFinish();
            }
        })
            .catch((error) => {
            if (action.onFinish) {
                action.onFinish(error);
            }
        });
    });
    REG.add(actions_1.Actions.SaveAs, function (action) {
        this.backendSaveChartAs(action.saveAs)
            .then(() => {
            if (action.onFinish) {
                action.onFinish();
            }
        })
            .catch((error) => {
            if (action.onFinish) {
                action.onFinish(error);
            }
        });
    });
    REG.add(actions_1.Actions.Open, function (action) {
        this.backendOpenChart(action.id)
            .then(() => {
            if (action.onFinish) {
                action.onFinish();
            }
        })
            .catch((error) => {
            if (action.onFinish) {
                action.onFinish(error);
            }
        });
    });
    REG.add(actions_1.Actions.Load, function (action) {
        this.historyManager.clear();
        const state = new migrator_1.Migrator().migrate(action.projectData, CHARTICULATOR_PACKAGE.version);
        this.loadState(state);
    });
    REG.add(actions_1.Actions.ImportDataset, function (action) {
        this.currentChartID = null;
        this.dataset = action.dataset;
        this.originDataset = core_1.deepClone(this.dataset);
        this.historyManager.clear();
        this.newChartEmpty();
        this.emit(app_store_1.AppStore.EVENT_DATASET);
        this.solveConstraintsAndUpdateGraphics();
    });
    REG.add(actions_1.Actions.ImportChartAndDataset, function (action) {
        this.historyManager.clear();
        this.currentChartID = null;
        this.currentSelection = null;
        this.dataset = action.dataset;
        this.originDataset = core_1.deepClone(this.dataset);
        this.chart = action.specification;
        this.chartManager = new core_1.Prototypes.ChartStateManager(this.chart, this.dataset);
        this.chartState = this.chartManager.chartState;
        this.emit(app_store_1.AppStore.EVENT_DATASET);
        this.emit(app_store_1.AppStore.EVENT_SELECTION);
    });
    REG.add(actions_1.Actions.UpdatePlotSegments, function (action) {
        this.saveHistory();
        this.updatePlotSegments();
        this.solveConstraintsAndUpdateGraphics();
        this.emit(app_store_1.AppStore.EVENT_DATASET);
        this.emit(app_store_1.AppStore.EVENT_SELECTION);
    });
    REG.add(actions_1.Actions.ReplaceDataset, function (action) {
        this.saveHistory();
        this.currentChartID = null;
        this.currentSelection = null;
        this.dataset = action.dataset;
        this.originDataset = core_1.deepClone(this.dataset);
        this.chartManager = new core_1.Prototypes.ChartStateManager(this.chart, this.dataset);
        this.chartState = this.chartManager.chartState;
        this.updatePlotSegments();
        this.solveConstraintsAndUpdateGraphics();
        this.emit(app_store_1.AppStore.EVENT_DATASET);
        this.emit(app_store_1.AppStore.EVENT_SELECTION);
    });
    REG.add(actions_1.Actions.ConvertColumnDataType, function (action) {
        this.saveHistory();
        const table = this.dataset.tables.find(table => table.name === action.tableName);
        if (!table) {
            return;
        }
        const column = table.columns.find(column => column.name === action.column);
        if (!column) {
            return;
        }
        const applyConvertedValues = (table, columnName, convertedValues) => {
            table.rows.forEach((value, index) => {
                value[columnName] = convertedValues[index];
            });
        };
        const finalizeAction = () => {
            this.updatePlotSegments();
            this.solveConstraintsAndUpdateGraphics();
            this.emit(app_store_1.AppStore.EVENT_DATASET);
            this.emit(app_store_1.AppStore.EVENT_SELECTION);
        };
        const originTable = this.originDataset.tables.find(table => table.name === action.tableName);
        const originColumn = originTable.columns.find(column => column.name === action.column);
        let columnValues = originTable.rows.map(row => row[column.name]);
        const typeBeforeChange = column.type;
        column.type = action.type;
        // if target type matches with origin column, replace data from origin dataset
        if (originColumn.type === action.type) {
            columnValues = originTable.rows.map(row => row[column.name]);
            applyConvertedValues(table, column.name, columnValues);
            finalizeAction();
            return;
        }
        else 
        // if origin data type converts to string, convert all data to localte string
        if (originColumn.type === dataset_1.DataType.Date && action.type === dataset_1.DataType.String) {
            const convertedValues = columnValues.map(value => new Date(value).toLocaleString());
            applyConvertedValues(table, column.name, convertedValues);
            finalizeAction();
            return;
        }
        else {
            // convertColumn works with string input only
            columnValues = columnValues.map(value => value && value.toString() || "");
        }
        try {
            const convertedValues = data_types_1.convertColumn(action.type, columnValues);
            applyConvertedValues(table, column.name, convertedValues);
            finalizeAction();
            return;
        }
        catch (ex) {
            console.warn(`Converting column type from ${originColumn.type} to ${action.type} failed`);
            // rollback type
            column.type = typeBeforeChange;
            return;
        }
    });
    REG.add(actions_1.Actions.Undo, function (action) {
        const state = this.historyManager.undo(this.saveDecoupledState());
        if (state) {
            const ss = this.saveSelectionState();
            this.loadState(state);
            this.loadSelectionState(ss);
        }
    });
    REG.add(actions_1.Actions.Redo, function (action) {
        const state = this.historyManager.redo(this.saveDecoupledState());
        if (state) {
            const ss = this.saveSelectionState();
            this.loadState(state);
            this.loadSelectionState(ss);
        }
    });
    REG.add(actions_1.Actions.Reset, function (action) {
        this.saveHistory();
        this.currentSelection = null;
        this.currentTool = null;
        this.emit(app_store_1.AppStore.EVENT_SELECTION);
        this.emit(app_store_1.AppStore.EVENT_CURRENT_TOOL);
        this.newChartEmpty();
        this.solveConstraintsAndUpdateGraphics();
    });
}
exports.default = default_1;
//# sourceMappingURL=document.js.map