import { ChartStateManager } from "..";
import * as Graphics from "../../graphics";
import { ConstraintSolver } from "../../solver";
import * as Specification from "../../specification";
import { BuildConstraintsContext, ChartElementClass } from "../chart_element";
import { BoundingBox, Controls, DropZones, Handles } from "../common";
export declare abstract class PlotSegmentClass<PropertiesType extends Specification.AttributeMap = Specification.AttributeMap, AttributesType extends Specification.AttributeMap = Specification.AttributeMap> extends ChartElementClass<PropertiesType, AttributesType> {
    readonly object: Specification.PlotSegment<PropertiesType>;
    readonly state: Specification.PlotSegmentState<AttributesType>;
    /** Fill the layout's default state */
    initializeState(): void;
    /** Build intrinsic constraints between attributes (e.g., x2 - x1 = width for rectangles) */
    buildConstraints(solver: ConstraintSolver, context: BuildConstraintsContext): void;
    /** Build constraints for glyphs within */
    buildGlyphConstraints(solver: ConstraintSolver, context: BuildConstraintsContext): void;
    /** Get the graphics that represent this layout */
    getPlotSegmentGraphics(glyphGraphics: Graphics.Element, manager: ChartStateManager): Graphics.Element;
    getCoordinateSystem(): Graphics.CoordinateSystem;
    /** Get DropZones given current state */
    getDropZones(): DropZones.Description[];
    /** Get handles given current state */
    getHandles(): Handles.Description[];
    getBoundingBox(): BoundingBox.Description;
    getAttributePanelWidgets(manager: Controls.WidgetManager): Controls.Widget[];
    static createDefault(glyph: Specification.Glyph): Specification.PlotSegment;
}
