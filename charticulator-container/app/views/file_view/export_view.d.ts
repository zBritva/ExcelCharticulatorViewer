import * as React from "react";
import { Specification } from "../../../core";
import { ContextedComponent } from "../../context_component";
import { ExportTemplateTarget } from "../../template";
export declare class InputGroup extends React.Component<{
    value: string;
    label: string;
    onChange: (newValue: string) => void;
}, {}> {
    private ref;
    render(): JSX.Element;
}
export declare class ExportImageView extends ContextedComponent<{}, {
    dpi: string;
}> {
    state: {
        dpi: string;
    };
    getScaler(): number;
    render(): JSX.Element;
}
export declare class ExportHTMLView extends ContextedComponent<{}, {}> {
    render(): JSX.Element;
}
export interface FileViewExportState {
    exportMode: string;
}
export declare class FileViewExport extends ContextedComponent<{
    onClose: () => void;
}, FileViewExportState> {
    state: FileViewExportState;
    renderExportView(mode: "image" | "html"): JSX.Element;
    renderExportTemplate(): JSX.Element;
    render(): JSX.Element;
}
export interface ExportTemplateViewState {
    template: Specification.Template.ChartTemplate;
    target: ExportTemplateTarget;
    targetProperties: {
        [name: string]: string;
    };
}
export declare class ExportTemplateView extends ContextedComponent<{
    exportKind: string;
}, {}> {
    state: ExportTemplateViewState;
    getDefaultState(kind: string): ExportTemplateViewState;
    componentWillReceiveProps(newProps: {
        exportKind: string;
    }): void;
    renderInput(label: string, type: string, value: any, defaultValue: any, onChange: (value: any) => void): JSX.Element;
    renderTargetProperties(): JSX.Element[];
    renderSlots(): JSX.Element | JSX.Element[];
    renderInferences(): JSX.Element | JSX.Element[];
    renderExposedProperties(): JSX.Element[];
    render(): JSX.Element;
}
