import { Color } from "../../common";
import { ConstraintSolver, Variable } from "../../solver";
import { DataValue, AttributeValue, AttributeMap } from "../../specification";
import { AttributeDescription, Controls } from "../common";
import { ScaleClass } from "./index";
import { AttributeDescriptions } from "../object";
import { InferParametersOptions } from "./scale";
export interface CategoricalScaleProperties<ValueType extends AttributeValue> extends AttributeMap {
    mapping: {
        [name: string]: ValueType;
    };
    defaultRange?: ValueType[];
}
export interface CategoricalScaleNumberAttributes extends AttributeMap {
    rangeScale?: number;
}
export declare class CategoricalScaleNumber extends ScaleClass<CategoricalScaleProperties<number>, CategoricalScaleNumberAttributes> {
    static classID: string;
    static type: string;
    attributeNames: string[];
    attributes: {
        [name: string]: AttributeDescription;
    };
    mapDataToAttribute(data: DataValue): AttributeValue;
    buildConstraint(data: DataValue, target: Variable, solver: ConstraintSolver): void;
    initializeState(): void;
    inferParameters(column: DataValue[], options?: InferParametersOptions): void;
    getAttributePanelWidgets(manager: Controls.WidgetManager): Controls.Widget[];
}
export declare class CategoricalScaleColor extends ScaleClass<CategoricalScaleProperties<Color>, {}> {
    static classID: string;
    static type: string;
    attributeNames: string[];
    attributes: AttributeDescriptions;
    mapDataToAttribute(data: DataValue): AttributeValue;
    initializeState(): void;
    inferParameters(column: DataValue[], options?: InferParametersOptions): void;
    getAttributePanelWidgets(manager: Controls.WidgetManager): Controls.Widget[];
}
export declare class CategoricalScaleEnum extends ScaleClass<CategoricalScaleProperties<string>, {}> {
    static classID: string;
    static type: string;
    attributeNames: string[];
    attributes: {
        [name: string]: AttributeDescription;
    };
    mapDataToAttribute(data: DataValue): AttributeValue;
    initializeState(): void;
    inferParameters(column: DataValue[], options?: InferParametersOptions): void;
    getAttributePanelWidgets(manager: Controls.WidgetManager): Controls.Widget[];
}
export declare class CategoricalScaleBoolean extends ScaleClass<CategoricalScaleProperties<boolean>, {}> {
    static classID: string;
    static type: string;
    attributeNames: string[];
    attributes: {
        [name: string]: AttributeDescription;
    };
    mapDataToAttribute(data: DataValue): AttributeValue;
    initializeState(): void;
    inferParameters(column: DataValue[], options?: InferParametersOptions): void;
    getAttributePanelWidgets(manager: Controls.WidgetManager): Controls.Widget[];
}
export declare class CategoricalScaleImage extends ScaleClass<CategoricalScaleProperties<string>, {}> {
    static classID: string;
    static type: string;
    attributeNames: string[];
    attributes: {
        [name: string]: AttributeDescription;
    };
    mapDataToAttribute(data: DataValue): AttributeValue;
    initializeState(): void;
    inferParameters(column: DataValue[], options?: InferParametersOptions): void;
    getAttributePanelWidgets(manager: Controls.WidgetManager): Controls.Widget[];
}
