"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
Object.defineProperty(exports, "__esModule", { value: true });
/** Base class for selections */
class Selection {
}
exports.Selection = Selection;
/** ChartElement selection */
class ChartElementSelection extends Selection {
    constructor(chartElement) {
        super();
        this.chartElement = chartElement;
    }
}
exports.ChartElementSelection = ChartElementSelection;
/** Glyph selection */
class GlyphSelection extends Selection {
    constructor(plotSegment = null, glyph) {
        super();
        this.plotSegment = plotSegment;
        this.glyph = glyph;
    }
}
exports.GlyphSelection = GlyphSelection;
/** Mark selection */
class MarkSelection extends Selection {
    constructor(plotSegment, glyph, mark) {
        super();
        this.plotSegment = plotSegment;
        this.glyph = glyph;
        this.mark = mark;
    }
}
exports.MarkSelection = MarkSelection;
//# sourceMappingURL=selection.js.map