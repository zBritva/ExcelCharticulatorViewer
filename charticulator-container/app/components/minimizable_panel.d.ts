/// <reference types="hammerjs" />
import * as React from "react";
export declare class MinimizablePanelView extends React.Component<{}, {}> {
    render(): JSX.Element;
}
export interface MinimizablePaneProps {
    title: string;
    scroll?: boolean;
    height?: number;
    maxHeight?: number;
    hideHeader?: boolean;
    defaultMinimized?: boolean;
    onMaximize?: () => void;
}
export interface MinimizablePaneState {
    minimized: boolean;
}
export declare class MinimizablePane extends React.Component<MinimizablePaneProps, MinimizablePaneState> {
    constructor(props: MinimizablePaneProps);
    renderHeader(): JSX.Element;
    render(): JSX.Element;
}
export interface FloatingPanelProps {
    title: string;
    onClose?: () => void;
    width?: number;
    height?: number;
    peerGroup: string;
    scroll?: boolean;
}
export interface FloatingPanelState {
    x: number;
    y: number;
    width: number;
    height: number;
    focus: boolean;
    minimized: boolean;
}
export declare class FloatingPanel extends React.Component<FloatingPanelProps, FloatingPanelState> {
    protected refContainer: HTMLDivElement;
    protected refHeader: HTMLElement;
    protected refResizer: HTMLElement;
    state: FloatingPanelState;
    getInitialState(): FloatingPanelState;
    protected hammer: HammerManager;
    protected static peerGroups: Map<string, Set<FloatingPanel>>;
    componentDidMount(): void;
    focus(): void;
    componentWillUnmount(): void;
    render(): JSX.Element;
}
