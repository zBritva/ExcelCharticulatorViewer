import { Table, Dataset } from "./dataset";
export interface TableSourceSpecification {
    /** Name of the table, if empty, use the basename of the url without extension */
    name?: string;
    /** Table format, if empty, infer from the url's extension */
    format?: "csv" | "tsv";
    /** Option 1: Specify the url to load the table from */
    url?: string;
    /** Option 2: Specify the table content, in this case format and name must be specified */
    content?: string;
}
export interface DatasetSourceSpecification {
    name?: string;
    tables: TableSourceSpecification[];
}
export declare class DatasetLoader {
    loadTextData(url: string): Promise<string>;
    loadCSVFromURL(url: string): Promise<Table>;
    loadTSVFromURL(url: string): Promise<Table>;
    loadCSVFromContents(filename: string, contents: string): Table;
    loadTSVFromContents(filename: string, contents: string): Table;
    loadTableFromSourceSpecification(spec: TableSourceSpecification): Promise<Table>;
    loadDatasetFromSourceSpecification(spec: DatasetSourceSpecification): Promise<Dataset>;
}
