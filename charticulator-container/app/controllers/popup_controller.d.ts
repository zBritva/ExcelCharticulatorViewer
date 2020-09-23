import * as React from "react";
import { EventEmitter, EventSubscription } from "../../core";
export interface PopupOptions {
    parent?: PopupContext;
    anchor: Element;
    alignX?: "inner" | "outer" | "start-inner" | "start-outer" | "end-inner" | "end-outer";
    alignY?: "inner" | "outer" | "start-inner" | "start-outer" | "end-inner" | "end-outer";
}
export interface PopupResult {
}
export declare class PopupContext extends EventEmitter {
    readonly id: string;
    element: JSX.Element;
    readonly options: PopupOptions;
    isClosed: boolean;
    parent: PopupContext;
    children: PopupContext[];
    constructor(id: string, renderElement: (context: PopupContext) => JSX.Element, options: PopupOptions);
    close(): void;
    traverse(visitor: (p: PopupContext) => void): void;
}
export declare class PopupController extends EventEmitter {
    private currentID;
    rootPopup: PopupContext;
    currentModal: PopupContext;
    traverse(visitor: (p: PopupContext) => void): void;
    popupAt(renderElement: (context: PopupContext) => JSX.Element, options: PopupOptions): void;
    showModal(renderElement: (context: PopupContext) => JSX.Element, options: PopupOptions): void;
    reset(): void;
    resetPopups(): void;
}
export interface PopupViewProps {
    controller: PopupController;
}
export declare class PopupContainer extends React.Component<PopupViewProps, {}> {
    token: EventSubscription;
    constructor(props: PopupViewProps);
    onKeyDown(e: KeyboardEvent): void;
    componentDidMount(): void;
    componentWillUnmount(): void;
    render(): JSX.Element;
    renderPopups(): JSX.Element;
}
export declare class PopupView extends React.Component<{
    context: PopupContext;
    className?: string;
    width?: number;
}, {}> {
    render(): JSX.Element;
}
export declare class ModalView extends React.Component<{
    context: PopupContext;
    type?: string;
}, {}> {
    render(): JSX.Element;
}
