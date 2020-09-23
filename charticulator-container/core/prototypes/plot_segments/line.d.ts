import * as Graphics from "../../graphics";
import { ConstraintSolver } from "../../solver";
import * as Specification from "../../specification";
import { AttributeDescription, BoundingBox, Controls, DropZones, Handles, ObjectClassMetadata, TemplateParameters } from "../common";
import { PlotSegmentClass } from "./plot_segment";
export interface LineGuideAttributes extends Specification.AttributeMap {
    x1?: number;
    y1?: number;
    x2?: number;
    y2?: number;
    x?: number;
    y?: number;
}
export interface LineGuideState extends Specification.PlotSegmentState {
    attributes: LineGuideAttributes;
}
export interface LineGuideProperties extends Specification.AttributeMap {
    axis?: Specification.Types.AxisDataBinding;
}
export interface LineGuideObject extends Specification.PlotSegment {
    properties: LineGuideProperties;
}
export declare class LineGuide extends PlotSegmentClass {
    static classID: string;
    static type: string;
    static metadata: ObjectClassMetadata;
    static defaultProperties: Specification.AttributeMap;
    readonly state: LineGuideState;
    readonly object: LineGuideObject;
    attributeNames: string[];
    attributes: {
        [name: string]: AttributeDescription;
    };
    initializeState(): void;
    buildGlyphConstraints(solver: ConstraintSolver): void;
    getDropZones(): DropZones.Description[];
    getHandles(): Handles.Description[];
    getBoundingBox(): BoundingBox.Description;
    getGraphics(): Graphics.Element;
    getAttributePanelWidgets(manager: Controls.WidgetManager): Controls.Widget[];
    getTemplateParameters(): TemplateParameters;
}
