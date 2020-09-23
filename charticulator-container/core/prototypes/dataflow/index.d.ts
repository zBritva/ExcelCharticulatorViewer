import * as Dataset from "../../dataset";
import * as Expression from "../../expression";
import * as Specification from "../../specification";
export declare class DataflowTableGroupedContext implements Expression.Context {
    protected table: DataflowTable;
    protected indices: number[];
    constructor(table: DataflowTable, indices: number[]);
    getTable(): DataflowTable;
    getVariable(name: string): DataflowTable | Specification.DataRow[] | Dataset.DataValue[] | Specification.Template.Column[];
}
export declare class DataflowTable implements Expression.Context {
    parent: DataflowManager;
    name: string;
    rows: Specification.DataRow[];
    columns: Specification.Template.Column[];
    options?: {
        displayName: string;
    };
    constructor(parent: DataflowManager, name: string, rows: Specification.DataRow[], columns: Specification.Template.Column[], options?: {
        displayName: string;
    });
    /** Implements Expression.Context */
    getVariable(name: string): DataflowTable | Specification.DataRow[] | Specification.Template.Column[];
    /** Get a row with index */
    getRow(index: number): Specification.DataRow;
    /** Get a row context with index */
    getRowContext(index: number): Expression.Context;
    getGroupedContext(rowIndices: number[]): Expression.Context;
}
export declare class DataflowManager implements Expression.Context {
    private tables;
    readonly context: Dataset.DatasetContext;
    readonly cache: Expression.ExpressionCache;
    constructor(dataset: Dataset.Dataset);
    /** Get a table by name (either original table or derived table) */
    getTable(name: string): DataflowTable;
    /** Implements Expression.Context */
    getVariable(name: string): DataflowTable;
}
