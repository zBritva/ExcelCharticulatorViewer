import { Point } from "../../common";
import * as Graphics from "../../graphics";
import { ConstraintSolver } from "../../solver";
import * as Specification from "../../specification";
import { ChartClass } from "../charts";
import { BoundingBox, BuildConstraintsContext, DropZones, Handles, LinkAnchor, ObjectClass, SnappingGuides } from "../common";
import { GlyphClass } from "../glyphs";
import { PlotSegmentClass } from "../plot_segments";
import { ChartStateManager } from "../state";
export interface CreationParameters {
    dropPoint: Point;
}
export declare abstract class MarkClass<PropertiesType extends Specification.AttributeMap = Specification.AttributeMap, AttributesType extends Specification.AttributeMap = Specification.AttributeMap> extends ObjectClass<PropertiesType, AttributesType> {
    readonly object: Specification.Element<PropertiesType>;
    readonly state: Specification.MarkState<AttributesType>;
    /** Fill the default state */
    initializeState(): void;
    /** Get intrinsic constraints between attributes (e.g., x2 - x1 = width for rectangles) */
    buildConstraints(solver: ConstraintSolver, context: BuildConstraintsContext): void;
    /** Get the graphical element from the element */
    getGraphics(coordinateSystem: Graphics.CoordinateSystem, offset: Point, glyphIndex: number, manager: ChartStateManager, emphasized?: boolean): Graphics.Element;
    /** Get DropZones given current state */
    getDropZones(): DropZones.Description[];
    /** Get link anchors for this mark */
    getLinkAnchors(mode: "begin" | "end"): LinkAnchor.Description[];
    /** Get handles given current state */
    getHandles(): Handles.Description[];
    /** Get bounding box */
    getBoundingBox(): BoundingBox.Description;
    /** Get alignment guides */
    getSnappingGuides(): SnappingGuides.Description[];
    getGlyphClass(): GlyphClass;
    getPlotSegmentClass(): PlotSegmentClass<Specification.AttributeMap, Specification.AttributeMap>;
    getChartClass(): ChartClass;
}
