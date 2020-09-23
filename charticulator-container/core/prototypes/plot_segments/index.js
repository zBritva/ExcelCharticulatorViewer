"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
Object.defineProperty(exports, "__esModule", { value: true });
const object_1 = require("../object");
const line_1 = require("./line");
const map_1 = require("./map");
const region_2d_1 = require("./region_2d");
var axis_1 = require("./axis");
exports.defaultAxisStyle = axis_1.defaultAxisStyle;
var region_2d_2 = require("./region_2d");
exports.CartesianPlotSegment = region_2d_2.CartesianPlotSegment;
exports.CurvePlotSegment = region_2d_2.CurvePlotSegment;
exports.PolarPlotSegment = region_2d_2.PolarPlotSegment;
var plot_segment_1 = require("./plot_segment");
exports.PlotSegmentClass = plot_segment_1.PlotSegmentClass;
function registerClasses() {
    object_1.ObjectClasses.Register(line_1.LineGuide);
    object_1.ObjectClasses.Register(map_1.MapPlotSegment);
    object_1.ObjectClasses.Register(region_2d_1.CartesianPlotSegment);
    object_1.ObjectClasses.Register(region_2d_1.CurvePlotSegment);
    object_1.ObjectClasses.Register(region_2d_1.PolarPlotSegment);
}
exports.registerClasses = registerClasses;
//# sourceMappingURL=index.js.map