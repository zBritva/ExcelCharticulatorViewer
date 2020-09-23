import { Point } from "../../../common";
import * as Graphics from "../../../graphics";
import { ConstraintSolver } from "../../../solver";
import * as Specification from "../../../specification";
import { AttributeDescription, BoundingBox, BuildConstraintsContext, Controls, DropZones, Handles, ObjectClassMetadata, SnappingGuides, TemplateParameters } from "../../common";
import { Region2DAttributes, Region2DConfiguration, Region2DConstraintBuilder, Region2DProperties } from "./base";
import { PlotSegmentClass } from "../plot_segment";
export declare type CurveAxisMode = "null" | "default" | "numerical" | "categorical";
export interface CurveAttributes extends Region2DAttributes {
    /** Cartesian plot segment region */
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    /**
     * The region in the curve coordinate system
     * tangent1, tangent2: the axis along the curve direction
     * normal1, normal2: the axis perpendicular to the curve direction (these won't be parallel to each other!)
     */
    tangent1: number;
    tangent2: number;
    normal1: number;
    normal2: number;
}
export interface CurveState extends Specification.PlotSegmentState {
    attributes: CurveAttributes;
}
export interface CurveProperties extends Region2DProperties {
    /** The bezier curve specification in relative proportions (-1, +1) => (x1, x2) */
    curve: Array<[Point, Point, Point, Point]>;
    normalStart: number;
    normalEnd: number;
}
export interface CurveObject extends Specification.PlotSegment {
    properties: CurveProperties;
}
export declare let curveTerminology: Region2DConfiguration["terminology"];
export declare class CurvePlotSegment extends PlotSegmentClass<CurveProperties, CurveAttributes> {
    static classID: string;
    static type: string;
    static metadata: ObjectClassMetadata;
    static defaultProperties: Specification.AttributeMap;
    readonly state: CurveState;
    readonly object: CurveObject;
    attributeNames: string[];
    attributes: {
        [name: string]: AttributeDescription;
    };
    initializeState(): void;
    createBuilder(solver?: ConstraintSolver, context?: BuildConstraintsContext): Region2DConstraintBuilder;
    getCurveArcLength(): number;
    buildConstraints(solver: ConstraintSolver, context: BuildConstraintsContext): void;
    buildGlyphConstraints(solver: ConstraintSolver, context: BuildConstraintsContext): void;
    getBoundingBox(): BoundingBox.Description;
    getSnappingGuides(): SnappingGuides.Description[];
    getGraphics(): Graphics.Group;
    getCoordinateSystem(): Graphics.CoordinateSystem;
    getDropZones(): DropZones.Description[];
    getAxisModes(): [CurveAxisMode, CurveAxisMode];
    getHandles(): Handles.Description[];
    getPopupEditor(manager: Controls.WidgetManager): Controls.PopupEditor;
    getAttributePanelWidgets(manager: Controls.WidgetManager): Controls.Widget[];
    getTemplateParameters(): TemplateParameters;
}
