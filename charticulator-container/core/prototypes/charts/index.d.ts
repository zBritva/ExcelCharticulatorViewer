import { ConstraintSolver } from "../../solver";
import * as Specification from "../../specification";
import { DataflowManager } from "../dataflow";
import * as Expression from "../../expression";
import * as Graphics from "../../graphics";
import { Handles, ObjectClass, ObjectClassMetadata, SnappingGuides } from "../common";
import { ChartStateManager } from "../state";
export declare abstract class ChartClass extends ObjectClass {
    readonly object: Specification.Chart;
    readonly state: Specification.ChartState;
    dataflow: DataflowManager;
    manager: ChartStateManager;
    static metadata: ObjectClassMetadata;
    setDataflow(dataflow: DataflowManager): void;
    setManager(manager: ChartStateManager): void;
    getBackgroundGraphics(): Graphics.Element;
    resolveMapping<ValueType>(mapping: Specification.Mapping, defaultValue: Specification.AttributeValue): (row: Expression.Context) => Specification.AttributeValue;
    abstract initializeState(): void;
    abstract buildIntrinsicConstraints(solver: ConstraintSolver): void;
    abstract getSnappingGuides(): SnappingGuides.Description[];
    abstract getHandles(): Handles.Description[];
}
export declare function registerClasses(): void;
