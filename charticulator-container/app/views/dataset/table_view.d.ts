import * as React from "react";
import { Dataset } from "../../../core";
export interface TableViewProps {
    table: Dataset.Table;
    maxRows?: number;
    onTypeChange?: (column: string, type: string) => void;
}
export declare class TableView extends React.Component<TableViewProps, {}> {
    render(): JSX.Element;
}
