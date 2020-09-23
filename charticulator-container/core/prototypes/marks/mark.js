"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("../common");
class MarkClass extends common_1.ObjectClass {
    /** Fill the default state */
    initializeState() { }
    /** Get intrinsic constraints between attributes (e.g., x2 - x1 = width for rectangles) */
    buildConstraints(solver, context) { }
    /** Get the graphical element from the element */
    getGraphics(coordinateSystem, offset, glyphIndex, manager, emphasized) {
        return null;
    }
    /** Get DropZones given current state */
    getDropZones() {
        return [];
    }
    /** Get link anchors for this mark */
    getLinkAnchors(mode) {
        return [];
    }
    /** Get handles given current state */
    getHandles() {
        return [];
    }
    /** Get bounding box */
    getBoundingBox() {
        return null;
    }
    /** Get alignment guides */
    getSnappingGuides() {
        return [];
    }
    getGlyphClass() {
        return this.parent;
    }
    getPlotSegmentClass() {
        return this.parent.parent;
    }
    getChartClass() {
        return this.parent.parent.parent;
    }
}
exports.MarkClass = MarkClass;
//# sourceMappingURL=mark.js.map