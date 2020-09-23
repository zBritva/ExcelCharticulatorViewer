import * as React from "react";
export interface ComboBoxOptionProps {
    onClick: () => void;
    selected: boolean;
}
export interface ComboBoxProps {
    defaultValue: string;
    options?: string[];
    renderOptionItem?: (option: string, props: ComboBoxOptionProps) => JSX.Element;
    optionsOnly?: boolean;
    onEnter?: (value: string) => boolean;
    onCancel?: () => void;
}
export interface ComboBoxState {
    value: string;
}
export declare class ComboBox extends React.Component<ComboBoxProps, ComboBoxState> {
    protected refContainer: HTMLSpanElement;
    protected refInput: HTMLInputElement;
    state: ComboBoxState;
    componentWillReceiveProps(newProps: ComboBoxProps): void;
    protected tryEmitValue(val: string): void;
    protected reset(): void;
    protected handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    protected handleFocus: (e: React.FocusEvent<HTMLInputElement>) => void;
    protected handleBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
    protected handleKeydown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    protected renderOptions(onSelect: () => void): JSX.Element;
    render(): JSX.Element;
}
export interface ComboBoxFontFamilyProps {
    defaultValue: string;
    onEnter?: (value: string) => boolean;
    onCancel?: () => void;
}
export declare class ComboBoxFontFamily extends React.Component<ComboBoxFontFamilyProps, {}> {
    render(): JSX.Element;
}
