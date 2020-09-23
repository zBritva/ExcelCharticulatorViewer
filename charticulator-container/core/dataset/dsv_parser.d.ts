import { Table } from "./dataset";
export declare function parseHints(hints: string): {
    [name: string]: string;
};
export declare function getLocalListSeparator(): string;
export declare function parseDataset(fileName: string, content: string, type: "csv" | "tsv"): Table;
