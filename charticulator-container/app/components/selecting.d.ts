/// <reference types="hammerjs" />
import * as React from "react";
export interface MarqueeSelection {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
}
export interface SelectionViewProps {
    x: number;
    y: number;
    width: number;
    height: number;
    onTap?: () => void;
    onMarqueeSelect?: (selection: MarqueeSelection) => void;
}
export interface SelectionViewState {
    marquee?: MarqueeSelection;
}
export declare class SelectionView extends React.Component<SelectionViewProps, SelectionViewState> {
    refs: {
        handler: SVGRectElement;
    };
    constructor(props: SelectionViewProps);
    hammer: HammerManager;
    getDefaultState(): SelectionViewState;
    componentDidMount(): void;
    render(): JSX.Element;
}
