import * as React from "react";
import { AbstractBackend } from "../../backend/abstract";
import { AppStore } from "../../stores";
export declare class CurrentChartView extends React.PureComponent<{
    store: AppStore;
}, {
    svgDataURL: string;
}> {
    constructor(props: {
        store: AppStore;
    });
    renderImage(): Promise<void>;
    render(): JSX.Element;
}
export interface FileViewProps {
    store: AppStore;
    backend: AbstractBackend;
    defaultTab?: string;
    onClose: () => void;
}
export interface FileViewState {
    currentTab: string;
}
export declare class FileView extends React.Component<FileViewProps, FileViewState> {
    refs: {
        inputSaveChartName: HTMLInputElement;
    };
    constructor(props: FileViewProps);
    switchTab(name: string): void;
    renderContent(): JSX.Element;
    render(): JSX.Element;
}
