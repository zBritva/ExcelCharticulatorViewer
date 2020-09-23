import * as React from "react";
import { Prototypes, Specification } from "../../../../core";
import { WidgetManager } from "./manager";
export interface GroupByEditorProps {
    manager: WidgetManager;
    options: Prototypes.Controls.GroupByEditorOptions;
    value: Specification.Types.GroupBy;
}
export interface GroupByEditorState {
    type: string;
    currentValue: Specification.Types.GroupBy;
}
export declare class GroupByEditor extends React.Component<GroupByEditorProps, GroupByEditorState> {
    state: GroupByEditorState;
    getDefaultState(value: Specification.Types.Filter): GroupByEditorState;
    emitUpdateGroupBy(newValue: Specification.Types.Filter): void;
    render(): JSX.Element;
}
