import * as Expression from "../expression";
import * as Graphics from "../graphics";
import { ConstraintSolver } from "../solver";
import * as Specification from "../specification";
import { ChartClass } from "./charts";
import { BoundingBox, Controls, DropZones, Handles, SnappingGuides } from "./common";
import { ObjectClass } from "./object";
import { ChartStateManager } from "./state";
export interface BuildConstraintsContext {
    rowContext?: Expression.Context;
    getExpressionValue?(expr: string, context: Expression.Context): Specification.AttributeValue;
    getGlyphAttributes?(glyph: string, table: string, rowIndices: number[]): {
        [name: string]: number;
    };
}
export declare abstract class ChartElementClass<PropertiesType extends Specification.AttributeMap = Specification.AttributeMap, AttributesType extends Specification.AttributeMap = Specification.AttributeMap> extends ObjectClass<PropertiesType, AttributesType> {
    readonly object: Specification.ChartElement<PropertiesType>;
    readonly state: Specification.ChartElementState<AttributesType>;
    readonly parent: ChartClass;
    /** Get intrinsic constraints between attributes (e.g., x2 - x1 = width for rectangles) */
    buildConstraints(solver: ConstraintSolver, context: BuildConstraintsContext): void;
    /** Get the graphics that represent this layout */
    getGraphics(manager: ChartStateManager): Graphics.Element;
    /** Get handles given current state */
    getHandles(): Handles.Description[];
    getBoundingBox(): BoundingBox.Description;
    getSnappingGuides(): SnappingGuides.Description[];
    getDropZones(): DropZones.Description[];
    /** Get controls given current state */
    getPopupEditor(manager: Controls.WidgetManager): Controls.PopupEditor;
    static createDefault(...args: any[]): Specification.ChartElement;
}
