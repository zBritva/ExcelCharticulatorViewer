import * as Graphics from "../../../graphics";
import { ConstraintSolver } from "../../../solver";
import * as Specification from "../../../specification";
import { AttributeDescription, BoundingBox, BuildConstraintsContext, Controls, DropZones, Handles, ObjectClassMetadata, SnappingGuides, TemplateParameters } from "../../common";
import { Region2DAttributes, Region2DConfiguration, Region2DConstraintBuilder, Region2DProperties } from "./base";
import { PlotSegmentClass } from "../plot_segment";
export declare type PolarAxisMode = "null" | "default" | "numerical" | "categorical";
export interface PolarAttributes extends Region2DAttributes {
    /** Cartesian plot segment region */
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    angle1: number;
    angle2: number;
    radial1: number;
    radial2: number;
}
export interface PolarState extends Specification.PlotSegmentState {
    attributes: PolarAttributes;
}
export interface PolarProperties extends Region2DProperties {
    startAngle: number;
    endAngle: number;
    innerRatio: number;
    outerRatio: number;
    equalizeArea: boolean;
}
export interface PolarObject extends Specification.PlotSegment {
    properties: PolarProperties;
}
export declare let polarTerminology: Region2DConfiguration["terminology"];
export declare class PolarPlotSegment extends PlotSegmentClass<PolarProperties, PolarAttributes> {
    static classID: string;
    static type: string;
    static metadata: ObjectClassMetadata;
    static defaultProperties: Specification.AttributeMap;
    readonly state: PolarState;
    readonly object: PolarObject;
    attributeNames: string[];
    attributes: {
        [name: string]: AttributeDescription;
    };
    initializeState(): void;
    createBuilder(solver?: ConstraintSolver, context?: BuildConstraintsContext): Region2DConstraintBuilder;
    buildConstraints(solver: ConstraintSolver, context: BuildConstraintsContext): void;
    buildGlyphConstraints(solver: ConstraintSolver, context: BuildConstraintsContext): void;
    getBoundingBox(): BoundingBox.Description;
    getSnappingGuides(): SnappingGuides.Description[];
    getGraphics(): Graphics.Group;
    getCoordinateSystem(): Graphics.CoordinateSystem;
    getDropZones(): DropZones.Description[];
    getAxisModes(): [PolarAxisMode, PolarAxisMode];
    getHandles(): Handles.Description[];
    getPopupEditor(manager: Controls.WidgetManager): Controls.PopupEditor;
    getAttributePanelWidgets(manager: Controls.WidgetManager): Controls.Widget[];
    getTemplateParameters(): TemplateParameters;
}
