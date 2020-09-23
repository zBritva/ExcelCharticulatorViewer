import * as React from "react";
import { EventSubscription, Specification } from "../../../core";
import { AppStore } from "../../stores";
export interface ScaleEditorProps {
    scale: Specification.Scale;
    scaleMapping: Specification.ScaleMapping;
    store: AppStore;
}
export interface ScaleEditorState {
}
export declare class ScaleEditor extends React.Component<ScaleEditorProps, ScaleEditorState> {
    token: EventSubscription;
    componentDidMount(): void;
    componentWillUnmount(): void;
    render(): JSX.Element;
}
