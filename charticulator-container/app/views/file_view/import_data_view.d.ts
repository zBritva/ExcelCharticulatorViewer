import * as React from "react";
import { Dataset } from "../../../core";
export interface FileUploaderProps {
    onChange: (file: File) => void;
    extensions: string[];
    filename?: string;
}
export interface FileUploaderState {
    filename: string;
    draggingOver: boolean;
}
export declare class FileUploader extends React.Component<FileUploaderProps, FileUploaderState> {
    private inputElement;
    constructor(props: FileUploaderProps);
    reset(): void;
    private onInputChange;
    private showOpenFile;
    private isDataTransferValid;
    private getFileFromDataTransfer;
    render(): JSX.Element;
}
export interface ImportDataViewProps {
    onConfirmImport?: (dataset: Dataset.Dataset) => void;
    onCancel?: () => void;
    showCancel?: boolean;
}
export interface ImportDataViewState {
    dataTable: Dataset.Table;
    linkTable: Dataset.Table;
}
export declare class ImportDataView extends React.Component<ImportDataViewProps, ImportDataViewState> {
    constructor(props: ImportDataViewProps);
    private loadFileAsTable;
    renderTable(table: Dataset.Table, onTypeChange: (column: string, type: string) => void): JSX.Element;
    render(): JSX.Element;
}
