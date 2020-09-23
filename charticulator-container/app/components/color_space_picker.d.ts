import * as React from "react";
import { Color } from "../../core";
export interface ColorSpaceDescription {
    name: string;
    description: string;
    dimension1: {
        name: string;
        range: [number, number];
    };
    dimension2: {
        name: string;
        range: [number, number];
    };
    dimension3: {
        name: string;
        range: [number, number];
    };
    toRGB: (x1: number, x2: number, x3: number) => [number, number, number, boolean];
    fromRGB: (r: number, g: number, b: number) => [number, number, number];
}
export interface ColorSpacePickerProps {
    defaultValue: Color;
    onChange?: (newValue: Color) => void;
    colorSpaces: ColorSpaceDescription[];
}
export interface ColorSpacePickerState {
    desc: ColorSpaceDescription;
    x1: number;
    x2: number;
    x3: number;
}
export declare class ColorSpacePicker extends React.Component<ColorSpacePickerProps, ColorSpacePickerState> {
    pickerSize: number;
    constructor(props: ColorSpacePickerProps);
    componentWillUpdate(): void;
    reset(): void;
    raiseChange(): void;
    renderZ(): JSX.Element;
    renderXY(): JSX.Element;
    render(): JSX.Element;
}
export interface InputFieldProps {
    defaultValue?: string;
    onEnter?: (value: string) => boolean;
}
export declare class InputField extends React.Component<InputFieldProps, {}> {
    inputElement: HTMLInputElement;
    componentWillUpdate(newProps: InputFieldProps): void;
    doEnter(): void;
    doCancel(): void;
    value: string;
    render(): JSX.Element;
}
