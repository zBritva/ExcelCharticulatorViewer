import { Dataset } from "../../core";
export declare class ObjectType {
    classID: string;
    options: string;
    constructor(classID: string, options?: string);
}
export declare class ScaffoldType {
    type: string;
    constructor(type: string);
}
export declare class DropZoneData {
}
export declare class DataExpression extends DropZoneData {
    table: Dataset.Table;
    expression: string;
    valueType: Dataset.DataType;
    metadata: Dataset.ColumnMetadata;
    constructor(table: Dataset.Table, expression: string, valueType: Dataset.DataType, metadata?: Dataset.ColumnMetadata);
}
