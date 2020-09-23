import * as React from "react";
import { Point } from "../../core";
export interface DraggableElementProps {
    className?: string;
    onTap?: () => void;
    onDragStart?: () => void;
    onDragEnd?: () => void;
    dragData: () => any;
    renderDragElement?: () => [JSX.Element, Point];
}
export interface DraggableElementState {
    dragging: boolean;
}
export declare class DraggableElement extends React.Component<DraggableElementProps, DraggableElementState> {
    refs: {
        draggableContainer: Element;
    };
    constructor(props: DraggableElementProps);
    componentDidMount(): void;
    componentWillUnmount(): void;
    onDragStart(): any;
    onDragEnd(): void;
    renderDragElement(): [JSX.Element, Point];
    render(): JSX.Element;
}
export interface ClickableSVGElementProps {
    onClick?: () => void;
}
export declare class ClickableSVGElement extends React.Component<ClickableSVGElementProps, {}> {
    refs: {
        container: SVGGElement;
    };
    private hammer;
    componentDidMount(): void;
    componentWillUnmount(): void;
    render(): JSX.Element;
}
