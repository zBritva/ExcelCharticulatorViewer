import * as React from "react";
import { AppStore } from "./stores";
import { MenuBar } from "./views/menubar";
export interface MainViewProps {
    store: AppStore;
}
export interface MainViewState {
    glyphViewMaximized: boolean;
    layersViewMaximized: boolean;
    attributeViewMaximized: boolean;
    scaleViewMaximized: boolean;
}
export declare class MainView extends React.Component<MainViewProps, MainViewState> {
    refMenuBar: MenuBar;
    constructor(props: MainViewProps);
    static childContextTypes: {
        store: (s: AppStore) => boolean;
    };
    getChildContext(): {
        store: AppStore;
    };
    render(): JSX.Element;
}
