import * as React from "react";
import { EventSubscription } from "../../../core";
import { AppStore } from "../../stores";
export declare class AttributePanel extends React.Component<{
    store: AppStore;
}, {}> {
    tokens: EventSubscription[];
    componentDidMount(): void;
    componentWillUnmount(): void;
    renderUnexpectedState(message: string): JSX.Element;
    render(): JSX.Element;
}
