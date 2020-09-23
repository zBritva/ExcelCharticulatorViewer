import { Point } from "../../common";
import * as Graphics from "../../graphics";
import { BoundingBox, Controls, DropZones, Handles, LinkAnchor, ObjectClassMetadata, SnappingGuides, TemplateParameters, AttributeDescriptions } from "../common";
import { ChartStateManager } from "../state";
import { EmphasizableMarkClass } from "./emphasis";
import { SymbolElementAttributes, SymbolElementProperties } from "./symbol.attrs";
export declare const symbolTypesList: string[];
export { SymbolElementAttributes, SymbolElementProperties };
export declare class SymbolElementClass extends EmphasizableMarkClass<SymbolElementProperties, SymbolElementAttributes> {
    static classID: string;
    static type: string;
    static metadata: ObjectClassMetadata;
    static defaultProperties: Partial<SymbolElementProperties>;
    static defaultMappingValues: Partial<SymbolElementAttributes>;
    attributes: AttributeDescriptions;
    attributeNames: string[];
    initializeState(): void;
    /** Get link anchors for this mark */
    getLinkAnchors(mode: "begin" | "end"): LinkAnchor.Description[];
    getGraphics(cs: Graphics.CoordinateSystem, offset: Point, glyphIndex: number, manager: ChartStateManager, emphasize?: boolean): Graphics.Element;
    getDropZones(): DropZones.Description[];
    getHandles(): Handles.Description[];
    getBoundingBox(): BoundingBox.Description;
    getSnappingGuides(): SnappingGuides.Description[];
    getAttributePanelWidgets(manager: Controls.WidgetManager): Controls.Widget[];
    getTemplateParameters(): TemplateParameters;
}
