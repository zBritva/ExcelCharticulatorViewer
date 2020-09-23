import * as React from "react";
import { Prototypes, Specification } from "../../../../core";
import { WidgetManager } from "./manager";
export interface FilterEditorProps {
    manager: WidgetManager;
    options: Prototypes.Controls.FilterEditorOptions;
    value: Specification.Types.Filter;
}
export interface FilterEditorState {
    type: string;
    currentValue: Specification.Types.Filter;
}
export declare class FilterEditor extends React.Component<FilterEditorProps, FilterEditorState> {
    state: FilterEditorState;
    getDefaultState(value: Specification.Types.Filter): FilterEditorState;
    emitUpdateFilter(newValue: Specification.Types.Filter): void;
    render(): JSX.Element;
}
