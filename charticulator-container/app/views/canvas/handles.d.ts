/// <reference types="hammerjs" />
import * as React from "react";
import { EventEmitter, EventSubscription } from "../../../core";
import { Specification, Prototypes, Point, ZoomInfo } from "../../../core";
export interface HandlesDragEvent {
    [name: string]: Specification.AttributeValue;
}
export declare class HandlesDragContext extends EventEmitter {
    onDrag(listener: (e: HandlesDragEvent) => void): EventSubscription;
    onEnd(listener: (e: HandlesDragEvent) => void): EventSubscription;
}
export interface HandlesViewProps {
    zoom: ZoomInfo;
    active?: boolean;
    visible?: boolean;
    handles: Prototypes.Handles.Description[];
    isAttributeSnapped?: (attribute: string) => boolean;
    onDragStart?: (handle: Prototypes.Handles.Description, ctx: HandlesDragContext) => void;
}
export interface HandlesViewState {
}
export declare class HandlesView extends React.Component<HandlesViewProps, HandlesViewState> {
    renderHandle(handle: Prototypes.Handles.Description): JSX.Element;
    render(): JSX.Element;
}
export interface HandleViewProps {
    zoom: ZoomInfo;
    active?: boolean;
    visible?: boolean;
    snapped?: boolean;
    onDragStart?: (handle: Prototypes.Handles.Description, ctx: HandlesDragContext) => void;
}
export interface PointHandleViewProps extends HandleViewProps {
    handle: Prototypes.Handles.Point;
}
export interface PointHandleViewState {
    dragging: boolean;
    newXValue: number;
    newYValue: number;
}
export declare class PointHandleView extends React.Component<PointHandleViewProps, PointHandleViewState> {
    refs: {
        circle: SVGCircleElement;
    };
    hammer: HammerManager;
    constructor(props: PointHandleViewProps);
    componentDidMount(): void;
    componentWillUnmount(): void;
    render(): JSX.Element;
}
export interface LineHandleViewProps extends HandleViewProps {
    handle: Prototypes.Handles.Line;
}
export interface LineHandleViewState {
    dragging: boolean;
    newValue: number;
}
export declare class LineHandleView extends React.Component<LineHandleViewProps, LineHandleViewState> {
    refs: {
        line: SVGLineElement;
    };
    hammer: HammerManager;
    constructor(props: LineHandleViewProps);
    componentDidMount(): void;
    componentWillUnmount(): void;
    render(): JSX.Element;
}
export interface RelativeLineHandleViewProps extends HandleViewProps {
    handle: Prototypes.Handles.RelativeLine;
}
export interface RelativeLineHandleViewState {
    dragging: boolean;
    newValue: number;
}
export declare class RelativeLineHandleView extends React.Component<RelativeLineHandleViewProps, RelativeLineHandleViewState> {
    refs: {
        line: SVGLineElement;
    };
    hammer: HammerManager;
    constructor(props: RelativeLineHandleViewProps);
    componentDidMount(): void;
    componentWillUnmount(): void;
    render(): JSX.Element;
}
export interface RelativeLineRatioHandleViewProps extends HandleViewProps {
    handle: Prototypes.Handles.GapRatio;
}
export interface RelativeLineRatioHandleViewState {
    dragging: boolean;
    newValue: number;
}
export declare class GapRatioHandleView extends React.Component<RelativeLineRatioHandleViewProps, RelativeLineRatioHandleViewState> {
    refs: {
        cOrigin: SVGCircleElement;
        line: SVGLineElement;
    };
    hammer: HammerManager;
    constructor(props: RelativeLineRatioHandleViewProps);
    componentDidMount(): void;
    componentWillUnmount(): void;
    render(): JSX.Element;
    renderPolar(): JSX.Element;
    renderCartesian(): JSX.Element;
}
export interface MarginHandleViewProps extends HandleViewProps {
    handle: Prototypes.Handles.Margin;
}
export interface MarginHandleViewState {
    dragging: boolean;
    newValue: number;
}
export declare class MarginHandleView extends React.Component<MarginHandleViewProps, MarginHandleViewState> {
    refs: {
        margin: SVGGElement;
    };
    hammer: HammerManager;
    constructor(props: MarginHandleViewProps);
    componentDidMount(): void;
    componentWillUnmount(): void;
    render(): JSX.Element;
}
export interface AngleHandleViewProps extends HandleViewProps {
    handle: Prototypes.Handles.Angle;
}
export interface AngleHandleViewState {
    dragging: boolean;
    newValue: number;
}
export declare class AngleHandleView extends React.Component<AngleHandleViewProps, AngleHandleViewState> {
    refs: {
        margin: SVGGElement;
        centerCircle: SVGCircleElement;
    };
    hammer: HammerManager;
    constructor(props: AngleHandleViewProps);
    clipAngle(v: number): number;
    componentDidMount(): void;
    componentWillUnmount(): void;
    static shapeCircle: (r: number) => string;
    static shapeRight: (r: number) => string;
    static shapeLeft: (r: number) => string;
    render(): JSX.Element;
}
export interface DistanceRatioHandleViewProps extends HandleViewProps {
    handle: Prototypes.Handles.DistanceRatio;
}
export interface DistanceRatioHandleViewState {
    dragging: boolean;
    newValue: number;
}
export declare class DistanceRatioHandleView extends React.Component<DistanceRatioHandleViewProps, DistanceRatioHandleViewState> {
    refs: {
        margin: SVGGElement;
        centerCircle: SVGCircleElement;
    };
    hammer: HammerManager;
    constructor(props: DistanceRatioHandleViewProps);
    clip(v: number): number;
    componentDidMount(): void;
    componentWillUnmount(): void;
    render(): JSX.Element;
}
export interface TextAlignmentHandleViewProps extends HandleViewProps {
    handle: Prototypes.Handles.TextAlignment;
}
export interface TextAlignmentHandleViewState {
    dragging: boolean;
    newAlignment: Specification.Types.TextAlignment;
    newRotation: number;
}
export declare class TextAlignmentHandleView extends React.Component<TextAlignmentHandleViewProps, TextAlignmentHandleViewState> {
    private container;
    private anchorCircle;
    private rotationCircle;
    private hammer;
    constructor(props: TextAlignmentHandleViewProps);
    getRelativePoint(px: number, py: number): {
        x: number;
        y: number;
    };
    componentDidMount(): void;
    componentWillUnmount(): void;
    handleClick(): void;
    getRectFromAlignment(alignment: Specification.Types.TextAlignment, rotation: number): {
        cx: number;
        cy: number;
        fx: number;
        fy: number;
        width: number;
        height: number;
        rotation: number;
    };
    renderDragging(): JSX.Element;
    render(): JSX.Element;
}
export interface ResizeHandleViewProps {
    width: number;
    height: number;
    cx: number;
    cy: number;
    zoom: ZoomInfo;
    onResize: (width: number, height: number) => void;
}
export interface ResizeHandleViewState {
    dragging: boolean;
    newX1: number;
    newY1: number;
    newX2: number;
    newY2: number;
}
export declare class ResizeHandleView extends React.Component<ResizeHandleViewProps, ResizeHandleViewState> {
    refs: {
        container: SVGGElement;
        lineX1: SVGLineElement;
        lineX2: SVGLineElement;
        lineY1: SVGLineElement;
        lineY2: SVGLineElement;
        cornerX1Y1: SVGCircleElement;
        cornerX1Y2: SVGCircleElement;
        cornerX2Y1: SVGCircleElement;
        cornerX2Y2: SVGCircleElement;
    };
    state: ResizeHandleViewState;
    hammer: HammerManager;
    componentDidMount(): void;
    componentWillUnmount(): void;
    render(): JSX.Element;
}
export interface InputCurveHandleViewProps extends HandleViewProps {
    handle: Prototypes.Handles.InputCurve;
}
export interface InputCurveHandleViewState {
    enabled: boolean;
    drawing: boolean;
    points: Point[];
}
export declare class InputCurveHandleView extends React.Component<InputCurveHandleViewProps, InputCurveHandleViewState> {
    refs: {
        interaction: SVGRectElement;
    };
    state: InputCurveHandleViewState;
    hammer: HammerManager;
    getPoint(x: number, y: number): Point;
    getBezierCurvesFromMousePoints(points: Point[]): Point[][];
    componentDidMount(): void;
    componentWillUnmount(): void;
    renderDrawing(): JSX.Element;
    renderButton(x: number, y: number): JSX.Element;
    renderSpiralButton(x: number, y: number): JSX.Element;
    render(): JSX.Element;
}
