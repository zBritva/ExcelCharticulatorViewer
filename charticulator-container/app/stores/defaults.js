"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("../../core");
/** Create a default glyph */
function createDefaultGlyph(tableName) {
    return {
        _id: core_1.uniqueID(),
        classID: "glyph.rectangle",
        properties: { name: "Glyph" },
        table: tableName,
        marks: [
            {
                _id: core_1.uniqueID(),
                classID: "mark.anchor",
                properties: { name: "Anchor" },
                mappings: {
                    x: {
                        type: "parent",
                        parentAttribute: "icx"
                    },
                    y: {
                        type: "parent",
                        parentAttribute: "icy"
                    }
                }
            }
        ],
        mappings: {},
        constraints: []
    };
}
exports.createDefaultGlyph = createDefaultGlyph;
/** Create a default plot segment */
function createDefaultPlotSegment(table, glyph) {
    return {
        _id: core_1.uniqueID(),
        classID: "plot-segment.cartesian",
        glyph: glyph._id,
        table: table.name,
        filter: null,
        mappings: {
            x1: {
                type: "parent",
                parentAttribute: "x1"
            },
            y1: {
                type: "parent",
                parentAttribute: "y1"
            },
            x2: {
                type: "parent",
                parentAttribute: "x2"
            },
            y2: {
                type: "parent",
                parentAttribute: "y2"
            }
        },
        properties: {
            name: "PlotSegment1",
            visible: true,
            marginX1: 0,
            marginY1: 0,
            marginX2: 0,
            marginY2: 0,
            sublayout: {
                type: table.rows.length >= 100 ? "grid" : "dodge-x",
                order: null,
                ratioX: 0.1,
                ratioY: 0.1,
                align: {
                    x: "start",
                    y: "start"
                },
                grid: {
                    direction: "x",
                    xCount: null,
                    yCount: null
                },
                packing: {
                    gravityX: 0.1,
                    gravityY: 0.1
                }
            }
        }
    };
}
exports.createDefaultPlotSegment = createDefaultPlotSegment;
/** Create a default chart title */
function createDefaultTitle(dataset) {
    return {
        _id: core_1.uniqueID(),
        classID: "mark.text",
        properties: {
            name: "Title",
            visible: true,
            alignment: { x: "middle", y: "top", xMargin: 0, yMargin: 30 },
            rotation: 0
        },
        mappings: {
            x: {
                type: "parent",
                parentAttribute: "cx"
            },
            y: {
                type: "parent",
                parentAttribute: "oy2"
            },
            text: {
                type: "value",
                value: dataset.name
            },
            fontSize: {
                type: "value",
                value: 24
            },
            color: {
                type: "value",
                value: { r: 0, g: 0, b: 0 }
            }
        }
    };
}
exports.createDefaultTitle = createDefaultTitle;
/** Create a default chart */
function createDefaultChart(dataset) {
    const table = dataset.tables[0];
    const glyph = createDefaultGlyph(table.name);
    return {
        _id: core_1.uniqueID(),
        classID: "chart.rectangle",
        properties: {
            name: "Chart",
            backgroundColor: null,
            backgroundOpacity: 1
        },
        mappings: {
            marginTop: { type: "value", value: 80 }
        },
        glyphs: [glyph],
        elements: [
            createDefaultPlotSegment(table, glyph),
            createDefaultTitle(dataset)
        ],
        scales: [],
        scaleMappings: [],
        constraints: [],
        resources: []
    };
}
exports.createDefaultChart = createDefaultChart;
//# sourceMappingURL=defaults.js.map