/// <reference types="react" />
import { ItemDescription } from "../../backend/abstract";
import { ContextedComponent } from "../../context_component";
export interface FileViewOpenState {
    chartList: ItemDescription[];
    chartCount: number;
}
export declare class FileViewOpen extends ContextedComponent<{
    onClose: () => void;
}, FileViewOpenState> {
    state: FileViewOpenState;
    componentDidMount(): void;
    updateChartList(): void;
    renderChartList(): JSX.Element;
    render(): JSX.Element;
}
