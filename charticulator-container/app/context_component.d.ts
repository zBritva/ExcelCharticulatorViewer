import * as React from "react";
import { AppStore } from "./stores";
import { Action } from "./actions/actions";
export interface MainContext {
    store: AppStore;
}
export declare let MainContextTypes: {
    store: (props: any, propName: string, componentName: string) => Error;
};
export declare class ContextedComponent<TProps, TState> extends React.Component<TProps, TState> {
    context: MainContext;
    constructor(props: TProps, context: MainContext);
    static contextTypes: {
        store: (props: any, propName: string, componentName: string) => Error;
    };
    dispatch(action: Action): void;
    readonly store: AppStore;
}
