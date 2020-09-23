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
const dataset_1 = require("./dataset");
const dsv_parser_1 = require("./dsv_parser");
class DatasetLoader {
    loadTextData(url) {
        return fetch(url).then(resp => resp.text());
    }
    loadCSVFromURL(url) {
        return this.loadTextData(url).then(data => {
            return dsv_parser_1.parseDataset(url, data, "csv");
        });
    }
    loadTSVFromURL(url) {
        return this.loadTextData(url).then(data => {
            return dsv_parser_1.parseDataset(url, data, "tsv");
        });
    }
    loadCSVFromContents(filename, contents) {
        return dsv_parser_1.parseDataset(filename, contents, "csv");
    }
    loadTSVFromContents(filename, contents) {
        return dsv_parser_1.parseDataset(filename, contents, "csv");
    }
    loadTableFromSourceSpecification(spec) {
        return __awaiter(this, void 0, void 0, function* () {
            if (spec.url) {
                const tableContent = yield this.loadTextData(spec.url);
                let format = "csv";
                if (spec.url.toLowerCase().endsWith(".tsv")) {
                    format = "tsv";
                }
                const table = dsv_parser_1.parseDataset(spec.url.split("/").pop(), tableContent, format);
                if (spec.name) {
                    table.name = spec.name;
                }
                return table;
            }
            else if (spec.content) {
                const table = dsv_parser_1.parseDataset(spec.name, spec.content, spec.format);
                table.name = spec.name;
                return table;
            }
            else {
                throw new Error("invalid table specification, url or content must be specified");
            }
        });
    }
    loadDatasetFromSourceSpecification(spec) {
        return __awaiter(this, void 0, void 0, function* () {
            // Load all tables
            const tables = yield Promise.all(spec.tables.map(table => this.loadTableFromSourceSpecification(table)));
            tables[0].type = dataset_1.TableType.Main;
            if (tables[1]) {
                tables[1].type = dataset_1.TableType.Links;
            }
            // Make dataset struct
            const dataset = { name: spec.name, tables };
            if (!spec.name && tables.length > 0) {
                dataset.name = tables[0].name;
            }
            return dataset;
        });
    }
}
exports.DatasetLoader = DatasetLoader;
//# sourceMappingURL=loader.js.map