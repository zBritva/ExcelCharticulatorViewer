import * as React from "react";
import { Dataset } from "../../../core";
import { AppStore } from "../../stores";
export interface DataFieldSelectorProps {
    datasetStore: AppStore;
    /** Show fields only from a particular table */
    table?: string;
    /** Show fields only of certain kinds or types (categorical / numerical) */
    kinds?: Dataset.DataKind[];
    types?: Dataset.DataType[];
    /** Allow null selection and describe null as specified */
    nullDescription?: string;
    nullNotHighlightable?: boolean;
    /** Set a default value */
    defaultValue?: {
        table: string;
        expression?: string;
    };
    onChange?: (newValue: DataFieldSelectorValue) => void;
    useAggregation?: boolean;
}
export interface DataFieldSelectorValue {
    table: string;
    expression: string;
    /** Only available if the expression refers to exactly a column */
    columnName?: string;
    type: Dataset.DataType;
    metadata: Dataset.ColumnMetadata;
}
export interface DataFieldSelectorValueCandidate extends DataFieldSelectorValue {
    selectable: boolean;
    displayName: string;
    derived?: DataFieldSelectorValueCandidate[];
}
export interface DataFieldSelectorState {
    currentSelection: DataFieldSelectorValue;
    currentSelectionAggregation: string;
}
export declare class DataFieldSelector extends React.Component<DataFieldSelectorProps, DataFieldSelectorState> {
    constructor(props: DataFieldSelectorProps);
    protected getDefaultState(props: DataFieldSelectorProps): DataFieldSelectorState;
    readonly value: DataFieldSelectorValue;
    private getAllFields;
    private getFields;
    private isValueEqual;
    private selectItem;
    renderCandidate(item: DataFieldSelectorValueCandidate): JSX.Element;
    render(): JSX.Element;
}
