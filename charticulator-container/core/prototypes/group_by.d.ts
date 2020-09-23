import * as Specification from "../specification";
import { ExpressionCache } from "../expression";
import { DataflowTable } from "./dataflow";
export declare class CompiledGroupBy {
    constructor(groupBy: Specification.Types.GroupBy, cache: ExpressionCache);
    groupBy: (table: DataflowTable) => number[][];
}
