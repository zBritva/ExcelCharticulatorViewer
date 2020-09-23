import { Point } from "../../common";
import * as Graphics from "../../graphics";
import { ConstraintSolver } from "../../solver";
import { BoundingBox, Controls, DropZones, Handles, ObjectClassMetadata, SnappingGuides, TemplateParameters } from "../common";
import { ChartStateManager } from "../state";
import { EmphasizableMarkClass } from "./emphasis";
import { TextElementAttributes, TextElementProperties } from "./text.attrs";
export { TextElementAttributes, TextElementProperties };
export declare class TextElementClass extends EmphasizableMarkClass<TextElementProperties, TextElementAttributes> {
    static classID: string;
    static type: string;
    static metadata: ObjectClassMetadata;
    static defaultMappingValues: Partial<TextElementAttributes>;
    static defaultProperties: Partial<TextElementProperties>;
    attributes: import("../object").AttributeDescriptions;
    attributeNames: string[];
    initializeState(): void;
    buildConstraints(solver: ConstraintSolver): void;
    getGraphics(cs: Graphics.CoordinateSystem, offset: Point, glyphIndex: number, manager: ChartStateManager, empasized?: boolean): Graphics.Element;
    getDropZones(): DropZones.Description[];
    getHandles(): Handles.Description[];
    getBoundingRectangle(): {
        cx: number;
        cy: number;
        width: number;
        height: number;
        rotation: number;
    };
    getBoundingBox(): BoundingBox.Description;
    getSnappingGuides(): SnappingGuides.Description[];
    getAttributePanelWidgets(manager: Controls.WidgetManager): Controls.Widget[];
    getTemplateParameters(): TemplateParameters;
}
