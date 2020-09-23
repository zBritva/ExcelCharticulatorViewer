"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("../../../core");
const actions_1 = require("../../actions");
const app_store_1 = require("../app_store");
const selection_1 = require("../selection");
function default_1(REG) {
    REG.add(actions_1.Actions.SelectChartElement, function (action) {
        const selection = new selection_1.ChartElementSelection(action.chartElement);
        if (core_1.Prototypes.isType(action.chartElement.classID, "plot-segment")) {
            const plotSegment = action.chartElement;
            if (action.glyphIndex != null) {
                this.setSelectedGlyphIndex(action.chartElement._id, action.glyphIndex);
            }
            this.currentGlyph = core_1.getById(this.chart.glyphs, plotSegment.glyph);
        }
        this.currentSelection = selection;
        this.emit(app_store_1.AppStore.EVENT_SELECTION);
    });
    REG.add(actions_1.Actions.SelectMark, function (action) {
        if (action.plotSegment == null) {
            action.plotSegment = this.findPlotSegmentForGlyph(action.glyph);
        }
        const selection = new selection_1.MarkSelection(action.plotSegment, action.glyph, action.mark);
        if (action.glyphIndex != null) {
            this.setSelectedGlyphIndex(action.plotSegment._id, action.glyphIndex);
        }
        this.currentGlyph = selection.glyph;
        this.currentSelection = selection;
        this.emit(app_store_1.AppStore.EVENT_SELECTION);
    });
    REG.add(actions_1.Actions.SelectGlyph, function (action) {
        if (action.plotSegment == null) {
            action.plotSegment = this.findPlotSegmentForGlyph(action.glyph);
        }
        const selection = new selection_1.GlyphSelection(action.plotSegment, action.glyph);
        if (action.glyphIndex != null) {
            this.setSelectedGlyphIndex(action.plotSegment._id, action.glyphIndex);
        }
        this.currentSelection = selection;
        this.currentGlyph = selection.glyph;
        this.emit(app_store_1.AppStore.EVENT_SELECTION);
    });
    REG.add(actions_1.Actions.ClearSelection, function (action) {
        this.currentSelection = null;
        this.emit(app_store_1.AppStore.EVENT_SELECTION);
    });
    REG.add(actions_1.Actions.SetCurrentTool, function (action) {
        this.currentTool = action.tool;
        this.currentToolOptions = action.options;
        this.emit(app_store_1.AppStore.EVENT_CURRENT_TOOL);
    });
}
exports.default = default_1;
//# sourceMappingURL=selection.js.map