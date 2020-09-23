import { MarkClass } from "./mark";
import { Point } from "../../common";
import * as Graphics from "../../graphics";
import { ConstraintSolver } from "../../solver";
import { AttributeDescriptions, BoundingBox, BuildConstraintsContext, Controls, DropZones, Handles, ObjectClassMetadata, SnappingGuides, TemplateParameters } from "../common";
import { DataAxisAttributes, DataAxisProperties, DataAxisExpression } from "./data_axis.attrs";
export { DataAxisAttributes, DataAxisProperties };
export declare class DataAxisClass extends MarkClass<DataAxisProperties, DataAxisAttributes> {
    static classID: string;
    static type: string;
    static metadata: ObjectClassMetadata;
    static defaultProperties: Partial<DataAxisProperties>;
    getAttributeNames(expr: DataAxisExpression): string[];
    readonly attributeNames: string[];
    readonly attributes: AttributeDescriptions;
    buildConstraints(solver: ConstraintSolver, context: BuildConstraintsContext): void;
    initializeState(): void;
    getHandles(): Handles.Description[];
    getGraphics(cs: Graphics.CoordinateSystem, offset: Point, glyphIndex?: number): Graphics.Element;
    getSnappingGuides(): SnappingGuides.Description[];
    getBoundingBox(): BoundingBox.Description;
    getDropZones(): DropZones.Description[];
    getAttributePanelWidgets(manager: Controls.WidgetManager): Controls.Widget[];
    getTemplateParameters(): TemplateParameters;
}
