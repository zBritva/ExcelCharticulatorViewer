import * as Specification from "../specification";
import { ChartElementClass } from "./chart_element";
import { ObjectClass } from "./object";
import * as Charts from "./charts";
import * as Glyphs from "./glyphs";
import * as Marks from "./marks/mark";
import * as PlotSegments from "./plot_segments";
import * as Scales from "./scales";
export declare class ObjectClassCache {
    private cache;
    /** Clear the cache */
    clear(): void;
    hasClass(state: Specification.ObjectState): boolean;
    getMarkClass(state: Specification.MarkState): Marks.MarkClass;
    getGlyphClass(state: Specification.GlyphState): Glyphs.GlyphClass;
    getPlotSegmentClass(state: Specification.PlotSegmentState): PlotSegments.PlotSegmentClass;
    getChartElementClass(state: Specification.ChartElementState): ChartElementClass;
    getScaleClass(state: Specification.ScaleState): Scales.ScaleClass;
    getChartClass(state: Specification.ChartState): Charts.ChartClass;
    getClass(state: Specification.ObjectState): ObjectClass;
    createMarkClass(parent: Glyphs.GlyphClass, object: Specification.Element, state: Specification.MarkState): Marks.MarkClass;
    createGlyphClass(parent: PlotSegments.PlotSegmentClass, object: Specification.Glyph, state: Specification.GlyphState): Glyphs.GlyphClass;
    createPlotSegmentClass(parent: Charts.ChartClass, object: Specification.PlotSegment, state: Specification.PlotSegmentState): PlotSegments.PlotSegmentClass;
    createChartElementClass(parent: Charts.ChartClass, object: Specification.ChartElement, state: Specification.ChartElementState): ChartElementClass;
    createScaleClass(parent: Charts.ChartClass, object: Specification.Scale, state: Specification.ScaleState): Scales.ScaleClass;
    createChartClass(parent: ObjectClass, object: Specification.Chart, state: Specification.ChartState): Charts.ChartClass;
    createClass(parent: ObjectClass, object: Specification.Object, state: Specification.ObjectState): ObjectClass;
}
