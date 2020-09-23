import { Point } from "../../common";
import * as Graphics from "../../graphics";
import { ConstraintSolver } from "../../solver";
import { BoundingBox, Controls, DropZones, Handles, LinkAnchor, ObjectClassMetadata, SnappingGuides, TemplateParameters } from "../common";
import { ChartStateManager } from "../state";
import { EmphasizableMarkClass } from "./emphasis";
import { TextboxElementAttributes, TextboxElementProperties } from "./textbox.attrs";
export { TextboxElementAttributes, TextboxElementProperties };
export declare class TextboxElementClass extends EmphasizableMarkClass<TextboxElementProperties, TextboxElementAttributes> {
    static classID: string;
    static type: string;
    static metadata: ObjectClassMetadata;
    static defaultProperties: Partial<TextboxElementProperties>;
    static defaultMappingValues: Partial<TextboxElementAttributes>;
    attributes: import("../object").AttributeDescriptions;
    attributeNames: string[];
    initializeState(): void;
    getAttributePanelWidgets(manager: Controls.WidgetManager): Controls.Widget[];
    buildConstraints(solver: ConstraintSolver): void;
    getGraphics(cs: Graphics.CoordinateSystem, offset: Point, glyphIndex: number, manager: ChartStateManager): Graphics.Element;
    /** Get link anchors for this mark */
    getLinkAnchors(): LinkAnchor.Description[];
    getDropZones(): DropZones.Description[];
    getHandles(): Handles.Description[];
    getBoundingBox(): BoundingBox.Description;
    getSnappingGuides(): SnappingGuides.Description[];
    getTemplateParameters(): TemplateParameters;
}
