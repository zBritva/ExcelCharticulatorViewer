"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("../../common");
const Graphics = require("../../graphics");
const solver_1 = require("../../solver");
const Specification = require("../../specification");
const emphasis_1 = require("./emphasis");
const nested_chart_attrs_1 = require("./nested_chart.attrs");
const dataset_1 = require("../../dataset");
class NestedChartElementClass extends emphasis_1.EmphasizableMarkClass {
    constructor() {
        super(...arguments);
        this.attributes = nested_chart_attrs_1.nestedChartAttributes;
        this.attributeNames = Object.keys(nested_chart_attrs_1.nestedChartAttributes);
    }
    // Initialize the state of an element so that everything has a valid value
    initializeState() {
        super.initializeState();
        const defaultWidth = 30;
        const defaultHeight = 50;
        const attrs = this.state.attributes;
        attrs.x1 = -defaultWidth / 2;
        attrs.y1 = -defaultHeight / 2;
        attrs.x2 = +defaultWidth / 2;
        attrs.y2 = +defaultHeight / 2;
        attrs.cx = 0;
        attrs.cy = 0;
        attrs.width = defaultWidth;
        attrs.height = defaultHeight;
        attrs.opacity = 1;
        attrs.visible = true;
    }
    getAttributePanelWidgets(manager) {
        let widgets = [
            manager.sectionHeader("Size & Shape"),
            manager.mappingEditor("Width", "width", {
                hints: { autoRange: true, startWithZero: "always" },
                acceptKinds: [Specification.DataKind.Numerical],
                defaultAuto: true
            }),
            manager.mappingEditor("Height", "height", {
                hints: { autoRange: true, startWithZero: "always" },
                acceptKinds: [Specification.DataKind.Numerical],
                defaultAuto: true
            })
        ];
        widgets = widgets.concat([
            manager.mappingEditor("Opacity", "opacity", {
                hints: { rangeNumber: [0, 1] },
                defaultValue: 1,
                numberOptions: { showSlider: true, minimum: 0, maximum: 1 }
            }),
            manager.mappingEditor("Visibility", "visible", {
                defaultValue: true
            })
        ]);
        widgets = widgets.concat([
            manager.nestedChartEditor({ property: "specification" }, {
                specification: this.object.properties.specification,
                dataset: this.getDataset(0),
                filterCondition: this.getFilterCondition(),
                width: this.state.attributes.width,
                height: this.state.attributes.height
            })
        ]);
        return widgets;
    }
    // Get intrinsic constraints between attributes (e.g., x2 - x1 = width for rectangles)
    buildConstraints(solver) {
        const [x1, y1, x2, y2, cx, cy, width, height] = solver.attrs(this.state.attributes, ["x1", "y1", "x2", "y2", "cx", "cy", "width", "height"]);
        solver.addLinear(solver_1.ConstraintStrength.HARD, 0, [[1, x2], [-1, x1]], [[1, width]]);
        solver.addLinear(solver_1.ConstraintStrength.HARD, 0, [[1, y2], [-1, y1]], [[1, height]]);
        solver.addLinear(solver_1.ConstraintStrength.HARD, 0, [[2, cx]], [[1, x1], [1, x2]]);
        solver.addLinear(solver_1.ConstraintStrength.HARD, 0, [[2, cy]], [[1, y1], [1, y2]]);
    }
    getFilterCondition() {
        const glyphIndex = 0;
        const manager = this.getChartClass().manager;
        const plotSegmentClass = this.getPlotSegmentClass();
        const table = common_1.getByName(manager.dataset.tables, plotSegmentClass.object.table);
        const rowIndex = plotSegmentClass.state.dataRowIndices[glyphIndex][0];
        const data = table.rows[rowIndex];
        return plotSegmentClass.object.groupBy
            ? {
                column: plotSegmentClass.object.groupBy.expression,
                value: data[plotSegmentClass.object.groupBy.expression]
            }
            : null;
    }
    getDataset(glyphIndex) {
        const manager = this.getChartClass().manager;
        const plotSegmentClass = this.getPlotSegmentClass();
        const table = common_1.getByName(manager.dataset.tables, plotSegmentClass.object.table);
        let columnNameMap = this.object.properties.columnNameMap;
        if (columnNameMap == null) {
            columnNameMap = {};
            for (const c of table.columns) {
                columnNameMap[c.name] = c.name;
            }
            this.object.properties.columnNameMap = columnNameMap;
        }
        const dataRowIndices = plotSegmentClass.state.dataRowIndices[glyphIndex];
        const allDataRowIndices = plotSegmentClass.state.dataRowIndices.flatMap(index => index);
        const mapToRows = (dataRowIndices) => dataRowIndices.map(i => {
            const data = table.rows[i];
            const r = { _id: data._id };
            for (const col in columnNameMap) {
                r[columnNameMap[col]] = data[col];
            }
            return r;
        });
        return {
            name: "NestedData",
            tables: [
                {
                    name: "MainTable",
                    displayName: "MainTable",
                    columns: table.columns.map(x => {
                        return {
                            name: columnNameMap[x.name],
                            displayName: columnNameMap[x.name],
                            type: x.type,
                            metadata: x.metadata
                        };
                    }),
                    rows: mapToRows(dataRowIndices),
                    type: dataset_1.TableType.Main
                },
                {
                    name: "MainParentTable",
                    displayName: "MainParentTable",
                    columns: table.columns.map(x => {
                        return {
                            name: columnNameMap[x.name],
                            displayName: columnNameMap[x.name],
                            type: x.type,
                            metadata: x.metadata
                        };
                    }),
                    rows: mapToRows(dataRowIndices),
                    type: dataset_1.TableType.Main
                },
                {
                    name: "MainParentTable",
                    displayName: "MainParentTable",
                    columns: table.columns.map(x => {
                        return {
                            name: columnNameMap[x.name],
                            displayName: columnNameMap[x.name],
                            type: x.type,
                            metadata: x.metadata
                        };
                    }),
                    rows: mapToRows(allDataRowIndices),
                    type: dataset_1.TableType.ParentMain
                }
            ]
        };
    }
    // Get the graphical element from the element
    getGraphics(cs, offset, glyphIndex = 0, manager, empasized) {
        const attrs = this.state.attributes;
        if (!attrs.visible || !this.object.properties.visible) {
            return null;
        }
        const g = Graphics.makeGroup([
            {
                type: "chart-container",
                dataset: this.getDataset(glyphIndex),
                chart: common_1.deepClone(this.object.properties.specification),
                selectable: {
                    plotSegment: this.getPlotSegmentClass().object,
                    glyphIndex,
                    rowIndices: this.getPlotSegmentClass().state.dataRowIndices[glyphIndex]
                },
                width: attrs.width,
                height: attrs.height
            }
        ]);
        g.transform = { angle: 0, x: -attrs.width / 2, y: attrs.height / 2 };
        const gContainer = Graphics.makeGroup([g]);
        gContainer.transform = cs.getLocalTransform(attrs.cx + offset.x, attrs.cy + offset.y);
        return gContainer;
    }
    // Get DropZones given current state
    getDropZones() {
        const attrs = this.state.attributes;
        const { x1, y1, x2, y2 } = attrs;
        return [
            {
                type: "line",
                p1: { x: x2, y: y1 },
                p2: { x: x1, y: y1 },
                title: "width",
                accept: { kind: Specification.DataKind.Numerical },
                dropAction: {
                    scaleInference: {
                        attribute: "width",
                        attributeType: Specification.AttributeType.Number,
                        hints: { autoRange: true, startWithZero: "always" }
                    }
                }
            },
            {
                type: "line",
                p1: { x: x1, y: y1 },
                p2: { x: x1, y: y2 },
                title: "height",
                accept: { kind: Specification.DataKind.Numerical },
                dropAction: {
                    scaleInference: {
                        attribute: "height",
                        attributeType: Specification.AttributeType.Number,
                        hints: { autoRange: true, startWithZero: "always" }
                    }
                }
            }
        ];
    }
    // Get bounding rectangle given current state
    getHandles() {
        const attrs = this.state.attributes;
        const { x1, y1, x2, y2 } = attrs;
        return [
            {
                type: "line",
                axis: "x",
                actions: [{ type: "attribute", attribute: "x1" }],
                value: x1,
                span: [y1, y2]
            },
            {
                type: "line",
                axis: "x",
                actions: [{ type: "attribute", attribute: "x2" }],
                value: x2,
                span: [y1, y2]
            },
            {
                type: "line",
                axis: "y",
                actions: [{ type: "attribute", attribute: "y1" }],
                value: y1,
                span: [x1, x2]
            },
            {
                type: "line",
                axis: "y",
                actions: [{ type: "attribute", attribute: "y2" }],
                value: y2,
                span: [x1, x2]
            },
            {
                type: "point",
                x: x1,
                y: y1,
                actions: [
                    { type: "attribute", source: "x", attribute: "x1" },
                    { type: "attribute", source: "y", attribute: "y1" }
                ]
            },
            {
                type: "point",
                x: x1,
                y: y2,
                actions: [
                    { type: "attribute", source: "x", attribute: "x1" },
                    { type: "attribute", source: "y", attribute: "y2" }
                ]
            },
            {
                type: "point",
                x: x2,
                y: y1,
                actions: [
                    { type: "attribute", source: "x", attribute: "x2" },
                    { type: "attribute", source: "y", attribute: "y1" }
                ]
            },
            {
                type: "point",
                x: x2,
                y: y2,
                actions: [
                    { type: "attribute", source: "x", attribute: "x2" },
                    { type: "attribute", source: "y", attribute: "y2" }
                ]
            }
        ];
    }
    getBoundingBox() {
        const attrs = this.state.attributes;
        const { x1, y1, x2, y2 } = attrs;
        return {
            type: "rectangle",
            cx: (x1 + x2) / 2,
            cy: (y1 + y2) / 2,
            width: Math.abs(x2 - x1),
            height: Math.abs(y2 - y1),
            rotation: 0
        };
    }
    getSnappingGuides() {
        const attrs = this.state.attributes;
        const { x1, y1, x2, y2, cx, cy } = attrs;
        return [
            { type: "x", value: x1, attribute: "x1" },
            { type: "x", value: x2, attribute: "x2" },
            { type: "x", value: cx, attribute: "cx" },
            { type: "y", value: y1, attribute: "y1" },
            { type: "y", value: y2, attribute: "y2" },
            { type: "y", value: cy, attribute: "cy" }
        ];
    }
    static createDefault(...args) {
        const obj = super.createDefault(...args);
        const myGlyphID = common_1.uniqueID();
        const tableName = "MainTable";
        obj.properties.specification = {
            _id: common_1.uniqueID(),
            classID: "chart.rectangle",
            properties: {
                name: "Chart",
                backgroundColor: null,
                backgroundOpacity: 1
            },
            mappings: {
                marginTop: { type: "value", value: 25 },
                marginBottom: {
                    type: "value",
                    value: 10
                },
                marginLeft: { type: "value", value: 10 },
                marginRight: { type: "value", value: 10 }
            },
            glyphs: [
                {
                    _id: myGlyphID,
                    classID: "glyph.rectangle",
                    properties: { name: "Glyph" },
                    table: tableName,
                    marks: [
                        {
                            _id: common_1.uniqueID(),
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
                }
            ],
            elements: [
                {
                    _id: common_1.uniqueID(),
                    classID: "plot-segment.cartesian",
                    glyph: myGlyphID,
                    table: tableName,
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
                            type: "dodge-x",
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
                            }
                        }
                    }
                },
                {
                    _id: common_1.uniqueID(),
                    classID: "mark.text",
                    properties: {
                        name: "Title",
                        visible: true,
                        alignment: { x: "middle", y: "top", xMargin: 0, yMargin: 5 },
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
                            value: "Nested Chart"
                        },
                        fontSize: {
                            type: "value",
                            value: 12
                        },
                        color: {
                            type: "value",
                            value: { r: 0, g: 0, b: 0 }
                        }
                    }
                }
            ],
            scales: [],
            scaleMappings: [],
            constraints: [],
            resources: []
        };
        return obj;
    }
    getTemplateParameters() {
        return {
            inferences: [
                {
                    objectID: this.object._id,
                    dataSource: {
                        table: this.getGlyphClass().object.table
                    },
                    nestedChart: {
                        columnNameMap: this.object.properties.columnNameMap
                    }
                }
            ]
        };
    }
}
NestedChartElementClass.classID = "mark.nested-chart";
NestedChartElementClass.type = "mark";
NestedChartElementClass.metadata = {
    displayName: "NestedChart",
    iconPath: "mark/nested-chart",
    creatingInteraction: {
        type: "rectangle",
        mapping: { xMin: "x1", yMin: "y1", xMax: "x2", yMax: "y2" }
    }
};
NestedChartElementClass.defaultProperties = {
    visible: true
};
NestedChartElementClass.defaultMappingValues = {
    opacity: 1,
    visible: true
};
exports.NestedChartElementClass = NestedChartElementClass;
//# sourceMappingURL=nested_chart.js.map