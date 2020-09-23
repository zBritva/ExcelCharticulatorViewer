import * as React from "react";
import { EventSubscription } from "../../core";
import { ContextedComponent } from "../context_component";
export declare class Toolbar extends ContextedComponent<{}, {}> {
    token: EventSubscription;
    componentDidMount(): void;
    componentWillUnmount(): void;
    render(): JSX.Element;
}
export interface ObjectButtonProps {
    title: string;
    classID: string;
    icon: string;
    options?: string;
    noDragging?: boolean;
    onClick?: () => void;
}
export declare class ObjectButton extends ContextedComponent<ObjectButtonProps, {}> {
    token: EventSubscription;
    getIsActive(): boolean;
    componentDidMount(): void;
    componentWillUnmount(): void;
    render(): JSX.Element;
}
export declare class MultiObjectButton extends ContextedComponent<{
    tools: ObjectButtonProps[];
}, {
    currentSelection: {
        classID: string;
        options: string;
    };
}> {
    state: {
        currentSelection: {
            classID: string;
            options: string;
        };
    };
    private refButton;
    token: EventSubscription;
    isActive(): boolean;
    getSelectedTool(): ObjectButtonProps;
    componentDidMount(): void;
    componentWillUnmount(): void;
    render(): JSX.Element;
}
export declare class ScaffoldButton extends ContextedComponent<{
    currentTool: string;
    title: string;
    type: string;
    icon: string;
}, {}> {
    render(): JSX.Element;
}
export declare class LinkButton extends ContextedComponent<{}, {}> {
    container: HTMLSpanElement;
    render(): JSX.Element;
}
export declare class CheckboxButton extends React.Component<{
    value: boolean;
    text?: string;
    onChange?: (v: boolean) => void;
}, {}> {
    render(): JSX.Element;
}
