import { ScaleClass } from "./scale";
import { AttributeType, DataKind, DataType } from "../../specification";
export { ScaleClass };
export declare function inferScaleType(dataType: DataType, dataKind: DataKind, attrType: AttributeType): string;
export declare function registerClasses(): void;
