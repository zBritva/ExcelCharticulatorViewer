import { Dataset } from "../../../core";
export declare const kind2Icon: {
    [name in Dataset.DataKind]: string;
};
export declare const kind2CompatibleKinds: {
    [name in Dataset.DataKind]: Dataset.DataKind[];
};
/** Determine if kind is acceptable, considering compatible kinds */
export declare function isKindAcceptable(kind: Dataset.DataKind, acceptKinds?: Dataset.DataKind[]): boolean;
export interface DerivedColumnDescription {
    name: string;
    type: Dataset.DataType;
    function: string;
    metadata: Dataset.ColumnMetadata;
}
export declare const type2DerivedColumns: {
    [name in Dataset.DataType]: DerivedColumnDescription[];
};
