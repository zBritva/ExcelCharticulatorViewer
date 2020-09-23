/// <reference types="hammerjs" />
import * as React from "react";
import { Point, ZoomInfo, Specification, Prototypes } from "../../../core";
import { SnappableGuide } from "./snapping";
export interface CreatingComponentProps {
    width: number;
    height: number;
    zoom: ZoomInfo;
    guides: Array<SnappableGuide<any>>;
    mode: string;
    onCreate: (...args: Array<[number, Specification.Mapping]>) => void;
    onCancel: () => void;
}
export interface CreatingComponentState {
    points?: Point[];
    draggingPoint?: Point;
    activeGuides: Array<SnappableGuide<any>>;
    hoverCandidateX: [number, Specification.Mapping];
    hoverCandidateY: [number, Specification.Mapping];
}
export interface SnappingElementMapping extends Specification.Mapping {
    type: "_element";
    element: string;
    attribute: string;
}
export declare class PointSnapping {
    threshold: number;
    guides: Array<SnappableGuide<any>>;
    snappedGuides: Set<SnappableGuide<any>>;
    constructor(guides: Array<SnappableGuide<any>>, threshold?: number);
    beginSnapping(): void;
    snapXValue(x: number): [number, Specification.Mapping];
    snapYValue(y: number): [number, Specification.Mapping];
    endSnapping(): Set<SnappableGuide<any>>;
}
export declare class CreatingComponent extends React.Component<CreatingComponentProps, CreatingComponentState> {
    refs: {
        handler: SVGRectElement;
    };
    hammer: HammerManager;
    constructor(props: CreatingComponentProps);
    getPointFromEvent(point: Point): Point;
    private isHammering;
    componentDidMount(): void;
    componentWillUnmount(): void;
    getPixelPoint(p: Point): Point;
    renderHint(): JSX.Element;
    renderSnappingGuides(): JSX.Element[];
    render(): JSX.Element;
}
export interface CreatingComponentFromCreatingInteractionProps {
    width: number;
    height: number;
    zoom: ZoomInfo;
    guides: Array<SnappableGuide<any>>;
    description: Prototypes.CreatingInteraction.Description;
    onCreate: (mappings: {
        [name: string]: [number, Specification.Mapping];
    }, attributes: {
        [name: string]: Specification.AttributeValue;
    }) => void;
    onCancel: () => void;
}
export declare class CreatingComponentFromCreatingInteraction extends React.Component<CreatingComponentFromCreatingInteractionProps, {}> {
    doCreate(inMappings: {
        [name: string]: [number, Specification.Mapping];
    }): void;
    render(): JSX.Element;
}
