import { Point } from "../../common";
import { ConstraintSolver } from "../../solver";
import { LineElementAttributes, LineElementProperties } from "./line.attrs";
import { BoundingBox, Controls, DropZones, Handles, ObjectClassMetadata, SnappingGuides, TemplateParameters } from "../common";
import * as Graphics from "../../graphics";
import { EmphasizableMarkClass } from "./emphasis";
import { ChartStateManager } from "../state";
export { LineElementAttributes, LineElementProperties };
export declare class LineElementClass extends EmphasizableMarkClass<LineElementProperties, LineElementAttributes> {
    static classID: string;
    static type: string;
    static metadata: ObjectClassMetadata;
    static defaultProperties: Partial<LineElementProperties>;
    static defaultMappingValues: Partial<LineElementAttributes>;
    attributes: import("../object").AttributeDescriptions;
    attributeNames: string[];
    initializeState(): void;
    buildConstraints(solver: ConstraintSolver): void;
    getGraphics(cs: Graphics.CoordinateSystem, offset: Point, glyphIndex: number, manager: ChartStateManager, emphasize?: boolean): Graphics.Element;
    getDropZones(): DropZones.Description[];
    getHandles(): Handles.Description[];
    getBoundingBox(): BoundingBox.Description;
    getSnappingGuides(): SnappingGuides.Description[];
    getAttributePanelWidgets(manager: Controls.WidgetManager): Controls.Widget[];
    getTemplateParameters(): TemplateParameters;
}
