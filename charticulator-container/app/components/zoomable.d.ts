/// <reference types="hammerjs" />
import * as React from "react";
import { Point, ZoomInfo } from "../../core";
export interface ZoomableCanvasProps {
    width: number;
    height: number;
    onZooming?: (zoom: ZoomInfo) => void;
}
export interface ZoomableCanvasState {
    zoom: ZoomInfo;
}
export declare class ZoomableCanvas extends React.Component<ZoomableCanvasProps, ZoomableCanvasState> {
    refs: {
        container: SVGGElement;
        handler: SVGRectElement;
    };
    hammer: HammerManager;
    constructor(props: ZoomableCanvasProps);
    setZooming(zoom: ZoomInfo): void;
    canvasToPixel(pt: Point): Point;
    pixelToCanvas(pt: Point): Point;
    getRelativePoint(point: Point): Point;
    componentDidMount(): void;
    componentWillUnmount(): void;
    render(): JSX.Element;
}
