import { Dispatcher } from "../common";
import { Glyph, Element, PlotSegment } from "../specification";
import * as Specification from "../specification";
export declare function objectDigest(obj?: Specification.Object): string[];
export declare class Action {
    dispatch(dispatcher: Dispatcher<Action>): void;
    digest(): {
        name: string;
    };
}
export declare class SelectMark extends Action {
    plotSegment: PlotSegment;
    glyph: Glyph;
    mark: Element;
    glyphIndex: number;
    constructor(plotSegment: PlotSegment, glyph: Glyph, mark: Element, glyphIndex?: number);
    digest(): {
        name: string;
        plotSegment: string[];
        glyph: string[];
        mark: string[];
        glyphIndex: number;
    };
}
export declare class ClearSelection extends Action {
    digest(): {
        name: string;
    };
}
