import { Color, Point } from "../../common";
import * as Expression from "../../expression";
import * as Graphics from "../../graphics";
import * as Specification from "../../specification";
import { ChartElementClass } from "../chart_element";
import { Controls, ObjectClassMetadata, TemplateParameters } from "../common";
import { DataflowTable } from "../dataflow";
import { ChartStateManager } from "../state";
import { AttributeDescription } from "../object";
import { PlotSegmentClass } from "../plot_segments";
export declare type LinkType = "line" | "band";
export declare type InterpolationType = "line" | "bezier" | "circle";
export declare type LinkMarkType = "" | "4" | "1 4";
export declare const linkMarkTypes: string[];
export interface LinksProperties extends Specification.AttributeMap {
    linkType: LinkType;
    linkMarkType?: LinkMarkType;
    interpolationType: InterpolationType;
    /** Start anchor */
    anchor1: Specification.Types.LinkAnchorPoint[];
    /** End anchor */
    anchor2: Specification.Types.LinkAnchorPoint[];
    /** Filter the data before linking */
    filter?: Specification.Expression;
    /** Order the data before linking */
    order?: Specification.Expression;
    /** Link through a data series on a single plot segment */
    linkThrough?: {
        /** The MarkLayout to draw marks from */
        plotSegment: string;
        /** Facet the data by a set of expressions */
        facetExpressions?: string[];
    };
    /** Link between (2) plot segments */
    linkBetween?: {
        /** The MarkLayouts to draw marks from */
        plotSegments: string[];
    };
    /** Link using a link table, from one plot segment to another */
    linkTable?: {
        table: string;
        plotSegments: string[];
    };
    curveness: number;
}
export interface LinksObject extends Specification.Links {
    properties: LinksProperties;
}
export declare function facetRows(table: DataflowTable, indices: number[][], columns?: Expression.Expression[]): number[][][];
export interface ResolvedLinkAnchorPoint {
    anchorIndex: number;
    x: {
        element: number;
        attribute: string;
    };
    y: {
        element: number;
        attribute: string;
    };
    direction: Point;
}
export interface AnchorCoordinates {
    points: Graphics.PointDirection[];
    curveness: number;
    coordinateSystem: Graphics.CoordinateSystem;
}
export interface AnchorAttributes extends AnchorCoordinates {
    color: Color;
    opacity: number;
    strokeWidth: number;
}
export interface RenderState {
    colorFunction: (row: Expression.Context) => Specification.AttributeValue;
    opacityFunction: (row: Expression.Context) => Specification.AttributeValue;
    strokeWidthFunction: (row: Expression.Context) => Specification.AttributeValue;
}
export declare abstract class LinksClass extends ChartElementClass {
    readonly object: LinksObject;
    readonly state: Specification.ObjectState;
    static metadata: ObjectClassMetadata;
    attributeNames: string[];
    attributes: {
        [name: string]: AttributeDescription;
    };
    protected resolveLinkAnchorPoints(anchorPoints: Specification.Types.LinkAnchorPoint[], glyph: Specification.Glyph): ResolvedLinkAnchorPoint[];
    protected getAnchorPoints(renderState: RenderState, anchorPoints: ResolvedLinkAnchorPoint[], plotSegmentClass: PlotSegmentClass, glyphState: Specification.GlyphState, row: Expression.Context): AnchorAttributes;
    static BandPath(path: Graphics.PathMaker, anchor: AnchorCoordinates, reversed?: boolean, newPath?: boolean): void;
    static ConnectionPath(path: Graphics.PathMaker, interpType: InterpolationType, p1: Point, d1: Point, curveness1: number, p2: Point, d2: Point, curveness2: number, newPath?: boolean): void;
    static LinkPath(path: Graphics.PathMaker, linkType: LinkType, interpType: InterpolationType, anchor1: AnchorCoordinates, anchor2: AnchorCoordinates): void;
    protected renderLinks(linkGraphics: LinkType, lineType: InterpolationType, anchorGroups: AnchorAttributes[][][], strokeDashArray?: LinkMarkType): Graphics.Group;
    /** Get the graphics that represent this layout */
    getGraphics(manager: ChartStateManager): Graphics.Element;
    getAttributePanelWidgets(manager: Controls.WidgetManager): Controls.Widget[];
    getTemplateParameters(): TemplateParameters;
}
export declare class SeriesLinksClass extends LinksClass {
    static classID: string;
    static type: string;
    static defaultProperties: Specification.AttributeMap;
    /** Get the graphics that represent this layout */
    getGraphics(manager: ChartStateManager): Graphics.Element;
}
export declare class LayoutsLinksClass extends LinksClass {
    static classID: string;
    static type: string;
    static defaultProperties: Specification.AttributeMap;
    /** Get the graphics that represent this layout */
    getGraphics(manager: ChartStateManager): Graphics.Element;
}
export declare class TableLinksClass extends LinksClass {
    static classID: string;
    static type: string;
    static defaultProperties: Specification.AttributeMap;
    /** Get the graphics that represent this layout */
    getGraphics(manager: ChartStateManager): Graphics.Element;
}
export declare function registerClasses(): void;
