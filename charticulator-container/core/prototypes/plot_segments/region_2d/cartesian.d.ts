import { ChartStateManager } from "../..";
import * as Graphics from "../../../graphics";
import { ConstraintSolver } from "../../../solver";
import * as Specification from "../../../specification";
import { BuildConstraintsContext } from "../../chart_element";
import { AttributeDescription, BoundingBox, Controls, DropZones, Handles, ObjectClassMetadata, SnappingGuides, TemplateParameters } from "../../common";
import { Region2DAttributes, Region2DConfiguration, Region2DConstraintBuilder, Region2DProperties } from "./base";
import { PlotSegmentClass } from "../plot_segment";
export declare type CartesianAxisMode = "null" | "default" | "numerical" | "categorical";
export interface CartesianProperties extends Region2DProperties {
}
export interface CartesianAttributes extends Region2DAttributes {
    /** Cartesian plot segment region */
    x1: number;
    y1: number;
    x2: number;
    y2: number;
}
export interface CartesianState extends Specification.PlotSegmentState {
    attributes: CartesianAttributes;
}
export declare let cartesianTerminology: Region2DConfiguration;
export declare class CartesianPlotSegment extends PlotSegmentClass<CartesianProperties, CartesianAttributes> {
    static classID: string;
    static type: string;
    static metadata: ObjectClassMetadata;
    static defaultMappingValues: Specification.AttributeMap;
    static defaultProperties: Specification.AttributeMap;
    readonly state: CartesianState;
    attributeNames: string[];
    attributes: {
        [name: string]: AttributeDescription;
    };
    initializeState(): void;
    createBuilder(solver?: ConstraintSolver, context?: BuildConstraintsContext): Region2DConstraintBuilder;
    buildGlyphConstraints(solver: ConstraintSolver, context: BuildConstraintsContext): void;
    getBoundingBox(): BoundingBox.Description;
    getSnappingGuides(): SnappingGuides.Description[];
    getAttributePanelWidgets(manager: Controls.WidgetManager): Controls.Widget[];
    getPopupEditor(manager: Controls.WidgetManager): Controls.PopupEditor;
    getGraphics(manager: ChartStateManager): Graphics.Group;
    getDropZones(): DropZones.Description[];
    getAxisModes(): [CartesianAxisMode, CartesianAxisMode];
    getHandles(): Handles.Description[];
    getTemplateParameters(): TemplateParameters;
}
