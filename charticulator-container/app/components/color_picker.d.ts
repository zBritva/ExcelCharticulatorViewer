import * as React from "react";
import { Color } from "../../core";
import { ColorPalette } from "../resources";
import { ColorSpaceDescription } from "./color_space_picker";
export declare function colorToCSS(color: Color): string;
export declare class HSVColorPicker extends React.Component<{
    defaultValue: Color;
    onChange?: (newValue: Color) => void;
}, {}> {
    static colorSpaces: ColorSpaceDescription[];
    render(): JSX.Element;
}
export declare class HCLColorPicker extends React.Component<{
    defaultValue: Color;
    onChange?: (newValue: Color) => void;
}, {}> {
    static colorSpaces: ColorSpaceDescription[];
    render(): JSX.Element;
}
export interface ColorPickerProps {
    defaultValue?: Color;
    allowNull?: boolean;
    onPick?: (color: Color) => void;
}
export interface ColorPickerState {
    currentPalette?: ColorPalette;
    currentPicker?: string;
    currentColor?: Color;
}
export interface ColorGridProps {
    defaultValue?: Color;
    colors: Color[][];
    onClick?: (color: Color) => void;
}
export declare class ColorGrid extends React.PureComponent<ColorGridProps, {}> {
    render(): JSX.Element;
}
export interface PaletteListProps {
    selected: ColorPalette;
    palettes: ColorPalette[];
    onClick?: (palette: ColorPalette) => void;
}
export declare class PaletteList extends React.PureComponent<PaletteListProps, {}> {
    render(): JSX.Element;
}
export declare class ColorPicker extends React.Component<ColorPickerProps, ColorPickerState> {
    constructor(props: ColorPickerProps);
    render(): JSX.Element;
}
