import * as Dataset from "../../dataset";
import * as Prototypes from "../../prototypes";
import { Group } from "../elements";
export declare function facetRows(rows: Dataset.Row[], indices: number[], columns?: string[]): number[][];
export declare class ChartRenderer {
    private manager;
    constructor(manager: Prototypes.ChartStateManager);
    /**
     * Render marks in a glyph
     * @returns an array of groups with the same size as glyph.marks
     */
    private renderGlyphMarks;
    private renderChart;
    render(): Group;
}
export * from "./text_measurer";
