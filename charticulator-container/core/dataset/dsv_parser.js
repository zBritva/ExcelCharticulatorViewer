"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
const d3_dsv_1 = require("d3-dsv");
const data_types_1 = require("./data_types");
function parseHints(hints) {
    const items = hints.match(/ *\*(.*)/);
    if (items) {
        const entries = items[1]
            .trim()
            .split(";")
            .map(x => x.trim())
            .filter(x => x != "");
        const result = {};
        for (const entry of entries) {
            const items = entry.split(":").map(x => x.trim());
            if (items.length == 2) {
                result[items[0]] = items[1];
            }
            else if (items.length == 1) {
                result[items[0]] = "true";
            }
        }
        return result;
    }
    else {
        return {};
    }
}
exports.parseHints = parseHints;
function getLocalListSeparator() {
    return ["", ""].toLocaleString();
}
exports.getLocalListSeparator = getLocalListSeparator;
function parseDataset(fileName, content, type) {
    let rows;
    switch (type) {
        case "csv":
            {
                rows = d3_dsv_1.dsvFormat(getLocalListSeparator()).parseRows(content);
            }
            break;
        case "tsv":
            {
                rows = d3_dsv_1.tsvParseRows(content);
            }
            break;
        default:
            {
                rows = [[]];
            }
            break;
    }
    // Remove empty rows if any
    rows = rows.filter(row => row.length > 0);
    if (rows.length > 0) {
        const header = rows[0];
        let columnHints;
        let data = rows.slice(1);
        if (data.length > 0 && data[0].every(x => /^ *\*/.test(x))) {
            columnHints = data[0].map(parseHints);
            data = data.slice(1);
        }
        else {
            columnHints = header.map(x => ({}));
        }
        const columnValues = header.map((name, index) => {
            const values = data.map(row => row[index]);
            return data_types_1.inferAndConvertColumn(values);
        });
        const outRows = data.map((row, rindex) => {
            const out = { _id: rindex.toString() };
            columnValues.forEach((column, cindex) => {
                out[header[cindex]] = columnValues[cindex].values[rindex];
            });
            return out;
        });
        const columns = columnValues.map((x, i) => ({
            name: header[i],
            displayName: header[i],
            type: x.type,
            metadata: x.metadata
        }));
        return {
            name: fileName,
            displayName: fileName,
            columns,
            rows: outRows,
            type: null
        };
    }
    else {
        return null;
    }
}
exports.parseDataset = parseDataset;
//# sourceMappingURL=dsv_parser.js.map