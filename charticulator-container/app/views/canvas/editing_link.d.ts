import * as React from "react";
import { Graphics, Point, Prototypes, Specification, ZoomInfo } from "../../../core";
import { AppStore } from "../../stores";
export interface EditingLinkProps {
    width: number;
    height: number;
    zoom: ZoomInfo;
    store: AppStore;
    link: Specification.Links;
}
export interface MarkAnchorDescription {
    mode: "begin" | "end";
    markID: string;
    anchor: Prototypes.LinkAnchor.Description;
    offsetX: number;
    offsetY: number;
    coordinateSystem: Graphics.CoordinateSystem;
}
export interface EditingLinkState {
    stage: "select-source" | "select-target";
    firstAnchor: MarkAnchorDescription;
    secondAnchor: MarkAnchorDescription;
    currentMouseLocation: Point;
}
export declare class EditingLink extends React.Component<EditingLinkProps, EditingLinkState> {
    refs: {
        container: SVGGElement;
        handler: SVGRectElement;
    };
    private markPlaceholders;
    private hammer;
    constructor(props: EditingLinkProps);
    private getMarkAtPoint;
    componentDidMount(): void;
    componentWillUnmount(): void;
    private renderAnchor;
    private renderMarkPlaceholders;
    getPointFromEvent(point: Point): Point;
    render(): JSX.Element;
}
