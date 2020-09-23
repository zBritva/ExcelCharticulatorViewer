import * as React from "react";
import { Prototypes, ZoomInfo, Graphics, Point } from "../../../core";
export interface BoundingBoxViewProps {
    boundingBox: Prototypes.BoundingBox.Description;
    zoom: ZoomInfo;
    active?: boolean;
    onClick?: () => void;
    onMouseEnter?: () => void;
    onMouseLeave?: () => void;
    coordinateSystem?: Graphics.CoordinateSystem;
    offset?: Point;
}
export declare class BoundingBoxView extends React.Component<BoundingBoxViewProps, {}> {
    constructor(props: BoundingBoxViewProps);
    private handleClick;
    private handleMouseEnter;
    private handleMouseLeave;
    render(): JSX.Element;
}
