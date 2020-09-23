import { DataValue, DataType, ColumnMetadata } from "./dataset";
export interface DataTypeDescription {
    test: (v: string) => boolean;
    convert: (v: string) => DataValue;
}
export declare let dataTypes: {
    [name in DataType]: DataTypeDescription;
};
/** Infer column type from a set of strings (not null) */
export declare function inferColumnType(values: string[]): DataType;
/** Convert strings to value type, null & non-convertibles are set as null */
export declare function convertColumn(type: DataType, values: string[]): DataValue[];
/** Get distinct values from a non-null array of basic types */
export declare function getDistinctValues(values: DataValue[]): DataValue[];
/** Infer column metadata and update type if necessary */
export declare function inferAndConvertColumn(values: string[], hints?: {
    [name: string]: string;
}): {
    values: DataValue[];
    type: DataType;
    metadata: ColumnMetadata;
};
export declare function convertColumnType(values: any[], type: DataType): DataValue[];
