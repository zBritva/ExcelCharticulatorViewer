import * as Specification from "../specification";
import { ExpressionCache, Context } from "../expression";
export declare class CompiledFilter {
    constructor(filter: Specification.Types.Filter, cache: ExpressionCache);
    filter: (context: Context) => boolean;
}
