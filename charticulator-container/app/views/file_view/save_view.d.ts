/// <reference types="react" />
import { ContextedComponent } from "../../context_component";
export interface FileViewSaveAsProps {
    onClose: () => void;
}
export interface FileViewSaveAsState {
    saving?: boolean;
    error?: string;
}
export declare class FileViewSaveAs extends ContextedComponent<FileViewSaveAsProps, FileViewSaveAsState> {
    state: FileViewSaveAsState;
    render(): JSX.Element;
}
