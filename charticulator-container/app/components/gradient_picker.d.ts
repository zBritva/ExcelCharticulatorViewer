import * as React from "react";
import { ColorGradient } from "../../core";
export interface GradientPickerProps {
    defaultValue?: ColorGradient;
    onPick?: (gradient: ColorGradient) => void;
}
export interface GradientPickerState {
    currentTab: string;
    currentGradient: ColorGradient;
}
export declare class GradientPicker extends React.Component<GradientPickerProps, GradientPickerState> {
    static tabs: {
        name: string;
        label: string;
    }[];
    constructor(props: GradientPickerProps);
    selectGradient(gradient: ColorGradient, emit?: boolean): void;
    renderGradientPalettes(): JSX.Element;
    render(): JSX.Element;
}
export declare class GradientView extends React.PureComponent<{
    gradient: ColorGradient;
}, {}> {
    protected refCanvas: HTMLCanvasElement;
    componentDidMount(): void;
    componentDidUpdate(): void;
    render(): JSX.Element;
}
