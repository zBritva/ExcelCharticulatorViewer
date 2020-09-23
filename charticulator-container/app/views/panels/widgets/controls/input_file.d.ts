import * as React from "react";
export interface InputFileProps {
    fileName?: string;
    accept: string[];
    outputType: "data-url" | "text" | "array-buffer";
    onOpenFile: (fileName: string, data: any) => void;
}
export declare class InputFile extends React.Component<InputFileProps, {}> {
    inputElement: HTMLInputElement;
    constructor(props: InputFileProps);
    private doOpenFile;
    private onFileSelected;
    render(): JSX.Element;
}
