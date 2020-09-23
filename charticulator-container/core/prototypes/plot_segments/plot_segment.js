"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Graphics = require("../../graphics");
const chart_element_1 = require("../chart_element");
class PlotSegmentClass extends chart_element_1.ChartElementClass {
    /** Fill the layout's default state */
    initializeState() { }
    /** Build intrinsic constraints between attributes (e.g., x2 - x1 = width for rectangles) */
    buildConstraints(solver, context) { }
    /** Build constraints for glyphs within */
    buildGlyphConstraints(solver, context) { }
    /** Get the graphics that represent this layout */
    getPlotSegmentGraphics(glyphGraphics, manager) {
        return Graphics.makeGroup([glyphGraphics, this.getGraphics(manager)]);
    }
    getCoordinateSystem() {
        return new Graphics.CartesianCoordinates();
    }
    /** Get DropZones given current state */
    getDropZones() {
        return [];
    }
    /** Get handles given current state */
    getHandles() {
        return null;
    }
    getBoundingBox() {
        return null;
    }
    getAttributePanelWidgets(manager) {
        return [
            manager.row("Data", manager.horizontal([0, 1], manager.filterEditor({
                table: this.object.table,
                target: { plotSegment: this.object },
                value: this.object.filter,
                mode: "button"
            }), manager.groupByEditor({
                table: this.object.table,
                target: { plotSegment: this.object },
                value: this.object.groupBy,
                mode: "button"
            })))
        ];
    }
    static createDefault(glyph) {
        const plotSegment = super.createDefault();
        plotSegment.glyph = glyph._id;
        plotSegment.table = glyph.table;
        return plotSegment;
    }
}
exports.PlotSegmentClass = PlotSegmentClass;
//# sourceMappingURL=plot_segment.js.map