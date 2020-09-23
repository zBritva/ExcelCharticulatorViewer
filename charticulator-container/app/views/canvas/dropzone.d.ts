import * as React from "react";
import { Point, Prototypes, ZoomInfo } from "../../../core";
import { DragContext, DragModifiers, Droppable } from "../../controllers";
export interface DropZoneViewProps {
    zone: Prototypes.DropZones.Description;
    zoom: ZoomInfo;
    onDragEnter: (data: any) => ((point: Point, modifiers: DragModifiers) => boolean);
}
export interface DropZoneViewState {
    active: boolean;
}
export declare class DropZoneView extends React.Component<DropZoneViewProps, DropZoneViewState> implements Droppable {
    refs: {
        container: SVGGElement;
    };
    constructor(props: DropZoneViewProps);
    componentDidMount(): void;
    componentWillUnmount(): void;
    onDragEnter(ctx: DragContext): boolean;
    makeClosePath(...points: Point[]): string;
    makeDashedLine(p1: Point, p2: Point): JSX.Element;
    makeLine(p1: Point, p2: Point, arrow1?: number, arrow2?: number): JSX.Element;
    makeTextAtCenter(p1: Point, p2: Point, text: string, dx?: number, dy?: number): JSX.Element;
    renderElement(z: Prototypes.DropZones.Description): JSX.Element;
    render(): JSX.Element;
}
