import { Specification } from "../../core";
/** Base class for selections */
export declare abstract class Selection {
}
/** ChartElement selection */
export declare class ChartElementSelection extends Selection {
    chartElement: Specification.ChartElement;
    constructor(chartElement: Specification.ChartElement);
}
/** Glyph selection */
export declare class GlyphSelection extends Selection {
    plotSegment: Specification.PlotSegment;
    glyph: Specification.Glyph;
    constructor(plotSegment: Specification.PlotSegment, glyph: Specification.Glyph);
}
/** Mark selection */
export declare class MarkSelection extends Selection {
    plotSegment: Specification.PlotSegment;
    glyph: Specification.Glyph;
    mark: Specification.Element;
    constructor(plotSegment: Specification.PlotSegment, glyph: Specification.Glyph, mark: Specification.Element);
}
