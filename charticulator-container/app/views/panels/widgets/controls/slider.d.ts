/// <reference types="hammerjs" />
import * as React from "react";
export interface SliderProps {
    width: number;
    defaultValue?: number;
    min: number;
    max: number;
    mapping?: "linear" | "sqrt";
    onChange?: (value: number, final: boolean) => void;
}
export interface SliderState {
    currentValue: number;
    dragging: boolean;
}
export declare class Slider extends React.Component<SliderProps, SliderState> {
    refs: {
        svg: SVGElement;
    };
    constructor(props: SliderProps);
    hammer: HammerManager;
    componentWillReceiveProps(props: SliderProps): void;
    niceValue(v: number): number;
    valueToRatio(v: number): number;
    ratioToValue(r: number): number;
    componentDidMount(): void;
    componentWillUnmount(): void;
    render(): JSX.Element;
}
