"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
Object.defineProperty(exports, "__esModule", { value: true });
const object_1 = require("../object");
const mark_1 = require("./mark");
exports.MarkClass = mark_1.MarkClass;
const anchor_1 = require("./anchor");
const data_axis_1 = require("./data_axis");
const image_1 = require("./image");
const line_1 = require("./line");
const nested_chart_1 = require("./nested_chart");
const rect_1 = require("./rect");
const symbol_1 = require("./symbol");
exports.symbolTypesList = symbol_1.symbolTypesList;
const text_1 = require("./text");
const icon_1 = require("./icon");
const textbox_1 = require("./textbox");
function registerClasses() {
    object_1.ObjectClasses.Register(anchor_1.AnchorElement);
    object_1.ObjectClasses.Register(rect_1.RectElementClass);
    object_1.ObjectClasses.Register(line_1.LineElementClass);
    object_1.ObjectClasses.Register(symbol_1.SymbolElementClass);
    object_1.ObjectClasses.Register(text_1.TextElementClass);
    object_1.ObjectClasses.Register(textbox_1.TextboxElementClass);
    object_1.ObjectClasses.Register(image_1.ImageElementClass);
    object_1.ObjectClasses.Register(icon_1.IconElementClass);
    object_1.ObjectClasses.Register(nested_chart_1.NestedChartElementClass);
    object_1.ObjectClasses.Register(data_axis_1.DataAxisClass);
}
exports.registerClasses = registerClasses;
//# sourceMappingURL=index.js.map