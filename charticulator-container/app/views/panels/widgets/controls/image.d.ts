import * as React from "react";
import { ContextedComponent } from "../../../../context_component";
export interface ImageDescription {
    src: string;
    width: number;
    height: number;
    name?: string;
}
export interface InputImageProps {
    value?: ImageDescription;
    onChange?: (value: ImageDescription) => boolean;
}
export declare class InputImage extends ContextedComponent<InputImageProps, {
    dragOver: boolean;
}> {
    state: {
        dragOver: boolean;
    };
    element: HTMLSpanElement;
    resolveImage(value: ImageDescription): ImageDescription;
    emitOnChange(images: ImageUploaderItem[]): void;
    startChooseImage: () => void;
    protected handleDragEnter: (e: React.DragEvent<HTMLDivElement>) => void;
    protected handleDragLeave: (e: React.DragEvent<HTMLDivElement>) => void;
    protected handleDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
    protected handleDrop: (e: React.DragEvent<HTMLDivElement>) => void;
    render(): JSX.Element;
}
export interface ImageChooserProps {
    value?: ImageDescription;
    onChoose?: (value: ImageDescription) => void;
}
export declare class ImageChooser extends ContextedComponent<ImageChooserProps, {}> {
    render(): JSX.Element;
}
export interface ImageUploaderProps {
    placeholder?: string;
    focusOnMount: boolean;
    onUpload?: (images: ImageUploaderItem[]) => void;
    onClear?: () => void;
}
export interface ImageUploaderState {
    dragOver: boolean;
}
export interface ImageUploaderItem {
    name: string;
    width: number;
    height: number;
    dataURL: string;
}
export declare class ImageUploader extends React.Component<ImageUploaderProps, ImageUploaderState> {
    state: ImageUploaderState;
    protected refContainer: HTMLDivElement;
    protected refInput: HTMLInputElement;
    componentDidMount(): void;
    componentWillUnmount(): void;
    static ReadFileAsImage(name: string, file: File | Blob): Promise<ImageUploaderItem>;
    static ParseFiles(files: FileList): Promise<ImageUploaderItem[]>;
    static ParseURIs(uris: string[]): Promise<ImageUploaderItem[]>;
    protected handleDragEnter: (e: React.DragEvent<HTMLDivElement>) => void;
    protected handleDragLeave: (e: React.DragEvent<HTMLDivElement>) => void;
    protected handleDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
    protected handleDrop: (e: React.DragEvent<HTMLDivElement>) => void;
    protected handlePaste: (e: React.ClipboardEvent<HTMLInputElement>) => void;
    protected handleOpenFile: () => void;
    protected handleClearFile: () => void;
    protected showError(error: any): void;
    protected emitOnUpload(result: ImageUploaderItem[]): void;
    render(): JSX.Element;
}
export declare class InputImageProperty extends InputImage {
    render(): JSX.Element;
}
