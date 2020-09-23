import { Point } from "../../common";
import * as Graphics from "../../graphics";
import { ConstraintSolver } from "../../solver";
import * as Specification from "../../specification";
import { BoundingBox, Controls, DropZones, Handles, LinkAnchor, ObjectClassMetadata, SnappingGuides, TemplateParameters } from "../common";
import { ChartStateManager } from "../state";
import { EmphasizableMarkClass } from "./emphasis";
import { ImageElementAttributes, ImageElementProperties } from "./image.attrs";
export declare const imagePlaceholder: Specification.Types.Image;
export { ImageElementAttributes, ImageElementProperties };
export declare class ImageElementClass extends EmphasizableMarkClass<ImageElementProperties, ImageElementAttributes> {
    static classID: string;
    static type: string;
    static metadata: ObjectClassMetadata;
    static defaultProperties: Partial<ImageElementProperties>;
    static defaultMappingValues: Partial<ImageElementAttributes>;
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
