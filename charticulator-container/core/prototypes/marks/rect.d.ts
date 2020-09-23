import { Point } from "../../common";
import * as Graphics from "../../graphics";
import { ConstraintSolver } from "../../solver";
import { BoundingBox, Controls, DropZones, Handles, LinkAnchor, ObjectClassMetadata, SnappingGuides, TemplateParameters } from "../common";
import { ChartStateManager } from "../state";
import { EmphasizableMarkClass } from "./emphasis";
import { RectElementAttributes, RectElementProperties } from "./rect.attrs";
export { RectElementAttributes, RectElementProperties };
export declare class RectElementClass extends EmphasizableMarkClass<RectElementProperties, RectElementAttributes> {
    static classID: string;
    static type: string;
    static metadata: ObjectClassMetadata;
    static defaultProperties: Partial<RectElementProperties>;
    static defaultMappingValues: Partial<RectElementAttributes>;
    attributes: import("../object").AttributeDescriptions;
    attributeNames: string[];
    initializeState(): void;
    getTemplateParameters(): TemplateParameters;
    getAttributePanelWidgets(manager: Controls.WidgetManager): Controls.Widget[];
    buildConstraints(solver: ConstraintSolver): void;
    getGraphics(cs: Graphics.CoordinateSystem, offset: Point, glyphIndex: number, manager: ChartStateManager, empasized?: boolean): Graphics.Element;
    /** Get link anchors for this mark */
    getLinkAnchors(): LinkAnchor.Description[];
    getDropZones(): DropZones.Description[];
    getHandles(): Handles.Description[];
    getBoundingBox(): BoundingBox.Description;
    getSnappingGuides(): SnappingGuides.Description[];
}
