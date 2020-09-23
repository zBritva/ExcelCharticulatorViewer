import * as Graphics from "../../../graphics";
import { ConstraintSolver } from "../../../solver";
import * as Specification from "../../../specification";
import { AttributeDescription, BoundingBox, Controls, DropZones, Handles, ObjectClassMetadata, SnappingGuides } from "../../common";
import { PlotSegmentClass } from "../plot_segment";
import { StaticMapService } from "./map_service";
export declare type CartesianAxisMode = "null" | "default" | "numerical" | "categorical";
export interface MapAttributes extends Specification.AttributeMap {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
}
export interface MapState extends Specification.PlotSegmentState {
    attributes: MapAttributes;
}
export interface MapProperties extends Specification.AttributeMap {
    longitudeData: Specification.Types.AxisDataBinding;
    latitudeData: Specification.Types.AxisDataBinding;
    mapType: "roadmap" | "satellite" | "hybrid" | "terrain";
}
export interface MapObject extends Specification.PlotSegment {
    properties: MapProperties;
}
export declare class MapPlotSegment extends PlotSegmentClass {
    static classID: string;
    static type: string;
    static metadata: ObjectClassMetadata;
    static defaultMappingValues: Specification.AttributeMap;
    static defaultProperties: Specification.AttributeMap;
    readonly state: MapState;
    readonly object: MapObject;
    attributeNames: string[];
    attributes: {
        [name: string]: AttributeDescription;
    };
    mapService: StaticMapService;
    initializeState(): void;
    buildGlyphConstraints(solver: ConstraintSolver): void;
    getBoundingBox(): BoundingBox.Description;
    getSnappingGuides(): SnappingGuides.Description[];
    mercatorProjection(lat: number, lng: number): [number, number];
    getProjectedPoints(points: Array<[number, number]>): Array<[number, number]>;
    getCenterZoom(): [number, number, number];
    getPlotSegmentGraphics(glyphGraphics: Graphics.Element): Graphics.Group;
    getDropZones(): DropZones.Description[];
    getHandles(): Handles.Description[];
    getAttributePanelWidgets(m: Controls.WidgetManager): Controls.Widget[];
}
