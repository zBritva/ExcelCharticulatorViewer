import * as React from "react";
import { Dataset } from "../../../core";
import { AppStore } from "../../stores";
export interface DatasetViewProps {
    store: AppStore;
}
export interface DatasetViewState {
}
export declare class DatasetView extends React.Component<DatasetViewProps, DatasetViewState> {
    componentDidMount(): void;
    render(): JSX.Element;
    onImportConnections(): void;
}
export interface ColumnsViewProps {
    store: AppStore;
    table: Dataset.Table;
}
export interface ColumnsViewState {
    selectedColumn: string;
}
export declare class ColumnsView extends React.Component<ColumnsViewProps, ColumnsViewState> {
    constructor(props: ColumnsViewProps);
    render(): JSX.Element;
}
export declare class ColumnViewProps {
    store: AppStore;
    table: Dataset.Table;
    column: Dataset.Column;
}
export declare class ColumnViewState {
    isSelected: string;
    isExpanded: boolean;
}
export declare class ColumnView extends React.Component<ColumnViewProps, ColumnViewState> {
    constructor(props: ColumnViewProps);
    renderDerivedColumns(): JSX.Element;
    applyAggregation(expr: string, type: string): string;
    renderColumnControl(label: string, icon: string, expr: string, lambdaExpr: string, type: Dataset.DataType, additionalElement: JSX.Element, metadata: Dataset.ColumnMetadata, onColumnKindChanged?: (column: string, type: string) => void): JSX.Element;
    render(): JSX.Element;
}
