"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const object_1 = require("./object");
class ChartElementClass extends object_1.ObjectClass {
    /** Get intrinsic constraints between attributes (e.g., x2 - x1 = width for rectangles) */
    buildConstraints(solver, context) { }
    /** Get the graphics that represent this layout */
    getGraphics(manager) {
        return null;
    }
    /** Get handles given current state */
    getHandles() {
        return [];
    }
    getBoundingBox() {
        return null;
    }
    getSnappingGuides() {
        return [];
    }
    getDropZones() {
        return [];
    }
    /** Get controls given current state */
    getPopupEditor(manager) {
        return null;
    }
    static createDefault(...args) {
        const element = super.createDefault(...args);
        return element;
    }
}
exports.ChartElementClass = ChartElementClass;
//# sourceMappingURL=chart_element.js.map