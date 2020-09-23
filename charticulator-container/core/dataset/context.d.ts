import { Context } from "../expression";
import { Dataset, Row, Table } from "./dataset";
export declare class DatasetContext implements Context {
    dataset: Dataset;
    fields: {
        [name: string]: Row[];
    };
    constructor(dataset: Dataset);
    getTableContext(table: Table): TableContext;
    getVariable(name: string): Row[];
}
export declare class TableContext {
    parent: DatasetContext;
    table: Table;
    fields: {
        [name: string]: Row[];
    };
    constructor(parent: DatasetContext, table: Table);
    getRowContext(row: Row): RowContext;
    getVariable(name: string): Row[];
}
export declare class RowContext {
    parent: TableContext;
    row: Row;
    constructor(parent: TableContext, row: Row);
    getVariable(name: string): string | number | boolean | Row[];
}
