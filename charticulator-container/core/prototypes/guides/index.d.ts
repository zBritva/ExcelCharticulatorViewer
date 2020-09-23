import { ConstraintSolver } from "../../solver";
import * as Specification from "../../specification";
import { ChartElementClass } from "../chart_element";
import { AttributeDescription, Handles, SnappingGuides, BoundingBox, Controls, TemplateParameters } from "../common";
import { ObjectClassMetadata } from "../index";
export interface GuideAttributes extends Specification.AttributeMap {
    value: number;
}
export interface GuideProperties extends Specification.AttributeMap {
    axis: "x" | "y";
    gap: number;
    value: number;
    value2: number;
}
export declare class GuideClass extends ChartElementClass<GuideProperties, GuideAttributes> {
    static classID: string;
    static type: string;
    static metadata: ObjectClassMetadata;
    static defaultProperties: Partial<GuideProperties>;
    attributeNames: string[];
    attributes: {
        [name: string]: AttributeDescription;
    };
    initializeState(): void;
    private getAxis;
    buildConstraints(solver: ConstraintSolver): void;
    /** Get handles given current state */
    getHandles(): Handles.Description[];
    getSnappingGuides(): SnappingGuides.Description[];
    getAttributePanelWidgets(manager: Controls.WidgetManager): Controls.Widget[];
    getTemplateParameters(): TemplateParameters;
}
export interface GuideCoordinatorAttributes extends Specification.AttributeMap {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
}
export interface GuideCoordinatorProperties extends Specification.AttributeMap {
    axis: "x" | "y";
}
export declare class GuideCoordinatorClass extends ChartElementClass<GuideCoordinatorProperties, GuideCoordinatorAttributes> {
    static classID: string;
    static type: string;
    static metadata: ObjectClassMetadata;
    static defaultAttributes: Partial<GuideCoordinatorAttributes>;
    buildConstraints(solver: ConstraintSolver): void;
    getValueNames(): string[];
    readonly attributeNames: string[];
    readonly attributes: {
        [name: string]: AttributeDescription;
    };
    initializeState(): void;
    private getAxis;
    /** Get handles given current state */
    getHandles(): Handles.Description[];
    getBoundingBox(): BoundingBox.Description;
    getSnappingGuides(): SnappingGuides.Description[];
    /** Get controls given current state */
    getAttributePanelWidgets(manager: Controls.WidgetManager): Controls.Widget[];
}
export declare function registerClasses(): void;
