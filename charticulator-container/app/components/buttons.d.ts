import * as React from "react";
export interface ToolButtonProps {
    icon?: string;
    text?: string;
    title?: string;
    onClick?: () => void;
    dragData?: () => any;
    active?: boolean;
}
export declare class ToolButton extends React.Component<ToolButtonProps, {
    dragging: boolean;
}> {
    constructor(props: ToolButtonProps);
    render(): JSX.Element;
}
export interface ButtonProps {
    onClick?: () => void;
    stopPropagation?: boolean;
    disabled?: boolean;
}
export declare abstract class BaseButton<Props extends ButtonProps> extends React.PureComponent<Props, {}> {
    private doClick;
    protected _doClick: any;
}
export declare class AppButton extends BaseButton<ButtonProps> {
    render(): JSX.Element;
}
export interface IconButtonProps extends ButtonProps {
    url?: string;
    title?: string;
    text?: string;
}
export declare class MenuButton extends BaseButton<IconButtonProps> {
    render(): JSX.Element;
}
export declare class ButtonFlat extends BaseButton<IconButtonProps> {
    render(): JSX.Element;
}
export declare class ButtonFlatPanel extends BaseButton<IconButtonProps> {
    render(): JSX.Element;
}
export declare class ButtonRaised extends BaseButton<IconButtonProps> {
    render(): JSX.Element;
}
