import * as Specification from "../../specification";
import { AttributeDescription, Controls, Handles, ObjectClassMetadata } from "../common";
import { MarkClass } from "./mark";
export interface AnchorElementAttributes extends Specification.AttributeMap {
    x: number;
    y: number;
}
export interface AnchorElementState extends Specification.MarkState {
    attributes: AnchorElementAttributes;
}
export declare class AnchorElement extends MarkClass {
    static classID: string;
    static type: string;
    static metadata: ObjectClassMetadata;
    readonly state: AnchorElementState;
    attributeNames: string[];
    attributes: {
        [name: string]: AttributeDescription;
    };
    initializeState(): void;
    getHandles(): Handles.Description[];
    static createDefault(glyph: Specification.Glyph): Specification.Element;
    getAttributePanelWidgets(manager: Controls.WidgetManager): Controls.Widget[];
}
