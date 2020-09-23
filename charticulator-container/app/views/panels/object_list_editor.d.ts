import * as React from "react";
import { Specification } from "../../../core";
import { ContextedComponent } from "../../context_component";
export declare class ObjectListEditor extends ContextedComponent<{}, {}> {
    private tokens;
    componentDidMount(): void;
    componentWillUnmount(): void;
    renderChart(): JSX.Element;
    renderGlyph(glyph: Specification.Glyph): JSX.Element;
    render(): JSX.Element;
}
export interface ReorderListViewProps {
    enabled: boolean;
    onReorder: (dragIndex: number, dropIndex: number) => void;
}
export interface ReorderListViewState {
    reordering: boolean;
    dragIndex: number;
    dropIndex: [number, number];
}
export declare class ReorderListView extends React.Component<ReorderListViewProps, ReorderListViewState> {
    private container;
    private container2Index;
    private index2Container;
    private hammer;
    constructor(props: ReorderListViewProps);
    getItemAtPoint(x: number, y: number): [number, number];
    componentDidMount(): void;
    componentWillUnmount(): void;
    render(): JSX.Element;
    static ReorderArray<T>(array: T[], dragIndex: number, dropIndex: number): void;
}
