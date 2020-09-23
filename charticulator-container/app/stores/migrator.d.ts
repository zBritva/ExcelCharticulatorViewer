import { AppStoreState } from "./app_store";
import { Specification } from "../../core";
/** Upgrade old versions of chart spec and state to newer version */
export declare class Migrator {
    migrate(state: AppStoreState, targetVersion: string): AppStoreState;
    addOriginDataSet(state: AppStoreState): AppStoreState;
    addScaleMappings(state: AppStoreState): AppStoreState;
    addTableTypes(state: AppStoreState): AppStoreState;
    fixDataRowIndices(state: AppStoreState): AppStoreState;
    addAggregationToExpression(expr: string, valueType: string): string;
    fixAxisDataMapping(mapping: Specification.Types.AxisDataBinding, table: string): void;
    fixDataMappingExpressions(state: AppStoreState): AppStoreState;
    fixLinkOrder_v130(state: AppStoreState): AppStoreState;
}
