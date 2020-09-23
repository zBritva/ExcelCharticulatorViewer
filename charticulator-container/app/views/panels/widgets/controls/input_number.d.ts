import * as React from "react";
export interface InputNumberProps {
    defaultValue?: number;
    placeholder?: string;
    onEnter?: (value: number) => boolean;
    digits?: number;
    minimum?: number;
    maximum?: number;
    percentage?: boolean;
    showSlider?: boolean;
    sliderRange?: [number, number];
    sliderFunction?: "linear" | "sqrt";
    showUpdown?: boolean;
    updownTick?: number;
    updownRange?: [number, number];
    updownStyle?: "normal" | "font";
}
export declare class InputNumber extends React.Component<InputNumberProps, {}> {
    private textInput;
    private formatNumber;
    private parseNumber;
    private reportValue;
    renderSlider(): JSX.Element;
    renderUpdown(): JSX.Element | JSX.Element[];
    render(): JSX.Element;
}
