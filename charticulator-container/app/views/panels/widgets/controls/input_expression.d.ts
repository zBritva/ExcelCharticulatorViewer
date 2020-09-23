import * as React from "react";
import { Expression } from "../../../../../core";
export interface InputExpressionProps {
    validate?: (value: string) => Expression.VerifyUserExpressionReport;
    defaultValue?: string;
    placeholder?: string;
    onEnter?: (value: string) => boolean;
    onCancel?: () => void;
    textExpression?: boolean;
    allowNull?: boolean;
}
export interface InputExpressionState {
    errorMessage?: string;
    errorIndicator: boolean;
    value?: string;
}
export declare class InputExpression extends React.Component<InputExpressionProps, InputExpressionState> {
    protected refInput: HTMLInputElement;
    state: InputExpressionState;
    componentWillReceiveProps(newProps: InputExpressionProps): void;
    protected doEnter(): void;
    protected doCancel(): void;
    render(): JSX.Element;
}
