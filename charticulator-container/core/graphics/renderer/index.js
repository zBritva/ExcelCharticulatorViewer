"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("../../common");
const Prototypes = require("../../prototypes");
const coordinate_system_1 = require("../coordinate_system");
const elements_1 = require("../elements");
function facetRows(rows, indices, columns) {
    if (columns == null) {
        return [indices];
    }
    else {
        const facets = new common_1.MultistringHashMap();
        for (const index of indices) {
            const row = rows[index];
            const facetValues = columns.map(c => row[c]);
            if (facets.has(facetValues)) {
                facets.get(facetValues).push(index);
            }
            else {
                facets.set(facetValues, [index]);
            }
        }
        return Array.from(facets.values());
    }
}
exports.facetRows = facetRows;
class ChartRenderer {
    constructor(manager) {
        this.manager = manager;
    }
    /**
     * Render marks in a glyph
     * @returns an array of groups with the same size as glyph.marks
     */
    renderGlyphMarks(plotSegment, plotSegmentState, coordinateSystem, offset, glyph, state, index) {
        return common_1.zipArray(glyph.marks, state.marks).map(([mark, markState]) => {
            if (!mark.properties.visible) {
                return null;
            }
            const g = this.manager
                .getMarkClass(markState)
                .getGraphics(coordinateSystem, offset, index, this.manager, state.emphasized);
            if (g != null) {
                g.selectable = {
                    plotSegment,
                    glyphIndex: index,
                    rowIndices: plotSegmentState.dataRowIndices[index]
                };
                return elements_1.makeGroup([g]);
            }
            else {
                return null;
            }
        });
    }
    renderChart(dataset, chart, chartState) {
        const graphics = [];
        // Chart background
        const bg = this.manager.getChartClass(chartState).getBackgroundGraphics();
        if (bg) {
            graphics.push(bg);
        }
        const linkGroup = elements_1.makeGroup([]);
        graphics.push(linkGroup);
        const elementsAndStates = common_1.zipArray(chart.elements, chartState.elements);
        // Render layout graphics
        for (const [element, elementState] of elementsAndStates) {
            if (!element.properties.visible) {
                continue;
            }
            // Render marks if this is a plot segment
            if (Prototypes.isType(element.classID, "plot-segment")) {
                const plotSegment = element;
                const plotSegmentState = elementState;
                const mark = common_1.getById(chart.glyphs, plotSegment.glyph);
                const plotSegmentClass = this.manager.getPlotSegmentClass(plotSegmentState);
                const coordinateSystem = plotSegmentClass.getCoordinateSystem();
                // Render glyphs
                const glyphArrays = [];
                for (const [glyphIndex, glyphState] of plotSegmentState.glyphs.entries()) {
                    const anchorX = glyphState.marks[0].attributes.x;
                    const anchorY = glyphState.marks[0].attributes.y;
                    const offsetX = glyphState.attributes.x - anchorX;
                    const offsetY = glyphState.attributes.y - anchorY;
                    const g = this.renderGlyphMarks(plotSegment, plotSegmentState, coordinateSystem, { x: offsetX, y: offsetY }, mark, glyphState, glyphIndex);
                    glyphArrays.push(g);
                }
                // Transpose glyphArrays so each mark is in a layer
                const glyphElements = common_1.transpose(glyphArrays).map(x => elements_1.makeGroup(x));
                const gGlyphs = elements_1.makeGroup(glyphElements);
                gGlyphs.transform = coordinateSystem.getBaseTransform();
                const gElement = elements_1.makeGroup([]);
                const g = plotSegmentClass.getPlotSegmentGraphics(gGlyphs, this.manager);
                gElement.elements.push(g);
                gElement.key = element._id;
                graphics.push(gElement);
            }
            else if (Prototypes.isType(element.classID, "mark")) {
                const cs = new coordinate_system_1.CartesianCoordinates({ x: 0, y: 0 });
                const gElement = elements_1.makeGroup([]);
                const elementClass = this.manager.getMarkClass(elementState);
                const g = elementClass.getGraphics(cs, { x: 0, y: 0 }, null, this.manager);
                gElement.elements.push(g);
                gElement.key = element._id;
                graphics.push(gElement);
            }
            else {
                const gElement = elements_1.makeGroup([]);
                const elementClass = this.manager.getChartElementClass(elementState);
                const g = elementClass.getGraphics(this.manager);
                gElement.elements.push(g);
                gElement.key = element._id;
                graphics.push(gElement);
            }
        }
        return elements_1.makeGroup(graphics);
    }
    render() {
        return this.renderChart(this.manager.dataset, this.manager.chart, this.manager.chartState);
    }
}
exports.ChartRenderer = ChartRenderer;
__export(require("./text_measurer"));
//# sourceMappingURL=index.js.map