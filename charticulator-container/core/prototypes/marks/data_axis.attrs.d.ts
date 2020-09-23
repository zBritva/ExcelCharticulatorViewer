import { AttributeMap, Types, ObjectProperties } from "../../specification";
export interface DataAxisAttributes extends AttributeMap {
    [name: string]: number;
    x1: number;
    y1: number;
    x2: number;
    y2: number;
}
export interface DataAxisExpression extends AttributeMap {
    name: string;
    expression: string;
}
export interface DataAxisProperties extends ObjectProperties {
    axis: Types.AxisDataBinding;
    dataExpressions: DataAxisExpression[];
    visibleOn: "all" | "first" | "last";
}
