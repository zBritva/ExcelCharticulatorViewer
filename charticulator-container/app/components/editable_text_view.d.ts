import * as React from "react";
export interface EditableTextViewProps {
    text: string;
    autofocus?: boolean;
    onEdit?: (newText: string) => void;
}
export interface EditableTextViewState {
    editing: boolean;
    currentText: string;
}
export declare class EditableTextView extends React.Component<EditableTextViewProps, EditableTextViewState> {
    refs: {
        input: HTMLInputElement;
    };
    constructor(props: EditableTextViewProps);
    confirmEdit(): void;
    cancelEdit(): void;
    startEdit(): void;
    componentDidMount(): void;
    componentDidUpdate(prevProps: EditableTextViewProps, prevState: EditableTextViewState): void;
    render(): JSX.Element;
}
