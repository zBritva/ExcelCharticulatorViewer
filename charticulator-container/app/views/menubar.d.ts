import * as React from "react";
import { EventSubscription } from "../../core";
import { ContextedComponent } from "../context_component";
export declare class HelpButton extends React.Component<{}, {}> {
    render(): JSX.Element;
}
export declare class MenuBar extends ContextedComponent<{}, {}> {
    protected subs: EventSubscription;
    componentDidMount(): void;
    componentWillUnmount(): void;
    keyboardMap: {
        [name: string]: string;
    };
    onKeyDown: (e: KeyboardEvent) => void;
    hideFileModalWindow(defaultTab?: string): void;
    showFileModalWindow(defaultTab?: string): void;
    renderSaveNested(): JSX.Element;
    renderNewOpenSave(): JSX.Element;
    render(): JSX.Element;
}
