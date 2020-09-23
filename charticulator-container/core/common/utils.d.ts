import { Color } from "./color";
/** zip two arrays, return an iterator */
export declare function zip<T1, T2>(a: T1[], b: T2[]): IterableIterator<[T1, T2]>;
/** zip two arrays, return a new array */
export declare function zipArray<T1, T2>(a: T1[], b: T2[]): Array<[T1, T2]>;
/** Transpose a matrix r[i][j] = matrix[j][i] */
export declare function transpose<T>(matrix: T[][]): T[][];
/** Generate a range of integers: [start, end) */
export declare function makeRange(start: number, end: number): number[];
/** Deep clone an object. The object must be JSON-serializable */
export declare function deepClone<T>(obj: T): T;
export declare function shallowClone<T>(obj: T): T;
export declare function max<T>(array: T[], accessor: (val: T, index: number, array: T[]) => number): number;
export declare function argMax<T>(array: T[], accessor: (val: T, index: number, array: T[]) => number): number;
export declare function min<T>(array: T[], accessor: (val: T, index: number, array: T[]) => number): number;
export declare function argMin<T>(array: T[], accessor: (val: T, index: number, array: T[]) => number): number;
export declare type FieldType = string | number | Array<string | number>;
export declare function setField<ObjectType, ValueType>(obj: ObjectType, field: FieldType, value: ValueType): ObjectType;
export declare function getField<ObjectType, ValueType>(obj: ObjectType, field: FieldType): ObjectType;
/** Fill default values into an object */
export declare function fillDefaults<T extends {}>(obj: Partial<T>, defaults: T): T;
/** Find the index of the first element that satisfies the predicate, return -1 if not found */
export declare function indexOf<T>(array: T[], predicate: (item: T, idx: number) => boolean): number;
/** Get the first element with element._id == id, return null if not found */
export declare function getById<T extends {
    _id: string;
}>(array: T[], id: string): T;
/** Get the index of the first element with element._id == id, return -1 if not found */
export declare function getIndexById<T extends {
    _id: string;
}>(array: T[], id: string): number;
/** Get the first element with element.name == name, return null if not found */
export declare function getByName<T extends {
    name: string;
}>(array: T[], name: string): T;
/** Get the index of the first element with element.name == name, return -1 if not found */
export declare function getIndexByName<T extends {
    name: string;
}>(array: T[], name: string): number;
export declare function gather<T>(array: T[], keyFunction: (item: T, index: number) => string): T[][];
/**
 * Sort an array with compare function, make sure when compare(a, b) == 0,
 * a and b are still in the original order (i.e., stable)
 */
export declare function stableSort<T>(array: T[], compare: (a: T, b: T) => number): T[];
/** Sort an array by key given by keyFunction */
export declare function sortBy<T>(array: T[], keyFunction: (a: T) => number | string, reverse?: boolean): T[];
/** Stable sort an array by key given by keyFunction */
export declare function stableSortBy<T>(array: T[], keyFunction: (a: T) => number | string, reverse?: boolean): T[];
/** Map object that maps (Object, string) into ValueType */
export declare class KeyNameMap<KeyType, ValueType> {
    private mapping;
    /** Add a new entry to the map */
    add(key: KeyType, name: string, value: ValueType): void;
    /** Delete an entry (do nothing if not exist) */
    delete(key: KeyType, name: string): void;
    /** Determine if the map has an entry */
    has(key: KeyType, name: string): boolean;
    /** Get the value corresponding to an entry, return null if not found */
    get(key: KeyType, name: string): ValueType;
    forEach(callback: (value: ValueType, key: KeyType, name: string) => void): void;
}
export declare abstract class HashMap<KeyType, ValueType> {
    private map;
    /** Implement this hash function in your map */
    protected abstract hash(key: KeyType): string;
    set(key: KeyType, value: ValueType): void;
    get(key: KeyType): ValueType;
    has(key: KeyType): boolean;
    delete(key: KeyType): void;
    clear(): void;
    values(): IterableIterator<ValueType>;
}
export declare class MultistringHashMap<ValueType> extends HashMap<string[], ValueType> {
    protected separator: string;
    protected hash(key: string[]): string;
}
/** Parsed semver version number */
export interface ParsedVersion {
    major: number;
    minor: number;
    patch: number;
}
/** Parse semver version string into a ParsedVersion */
export declare function parseVersion(version: string): {
    major: number;
    minor: number;
    patch: number;
};
/**
 * Compare two version strings
 * @param version1 version number 1
 * @param version2 version number 2
 * @returns negative if version1 < version2, zero if version1 == version2, positive if version1 > version2
 */
export declare function compareVersion(version1: string, version2: string): number;
/**
 * Converts Color object to Hex
 * @param color Color object
 * @returns Hex representation of color
 */
export declare function rgbToHex(color: Color): string;
/**
 * Converts Hex to Color object
 * @param color Color object
 * @returns Hex representation of color
 */
export declare function hexToRgb(hex: string): Color;
