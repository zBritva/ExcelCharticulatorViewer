import * as React from "react";
import { Dataset, EventEmitter, Specification, EventSubscription, Prototypes } from "../core";
import { ChartComponent, DataSelection, GlyphEventHandler } from "./chart_component";
import { TemplateInstance } from "./chart_template";
export interface ChartContainerComponentProps {
    chart: Specification.Chart;
    dataset: Dataset.Dataset;
    defaultAttributes?: Prototypes.DefaultAttributes;
    defaultWidth: number;
    defaultHeight: number;
    onSelectionChange?: (data: {
        table: string;
        rowIndices: number[];
    }) => void;
    onMouseEnterGlyph?: (data: {
        table: string;
        rowIndices: number[];
    }) => void;
    onMouseLeaveGlyph?: (data: {
        table: string;
        rowIndices: number[];
    }) => void;
    onMouseContextMenuClickGlyph?: (data: {
        table: string;
        rowIndices: number[];
    }, modifiers: any) => void;
}
export interface ChartContainerComponentState {
    width: number;
    height: number;
    selection: {
        table: string;
        indices: Set<number>;
    } & DataSelection;
}
export declare class ChartContainerComponent extends React.Component<ChartContainerComponentProps, ChartContainerComponentState> {
    state: ChartContainerComponentState;
    component: ChartComponent;
    setSelection(table: string, rowIndices: number[], union?: boolean, emit?: boolean): void;
    clearSelection(emit?: boolean): void;
    resize(width: number, height: number): void;
    getProperty(objectID: string, property: Specification.Template.PropertyField): any;
    setProperty(objectID: string, property: Specification.Template.PropertyField, value: any): void;
    getAttributeMapping(objectID: string, attribute: string): Specification.Mapping;
    setAttributeMapping(objectID: string, attribute: string, mapping: Specification.Mapping): void;
    protected handleGlyphClick: GlyphEventHandler;
    protected handleGlyphContextMenuClick: GlyphEventHandler;
    protected handleGlyphMouseEnter: GlyphEventHandler;
    protected handleGlyphMouseLeave: GlyphEventHandler;
    render(): JSX.Element;
}
export declare enum ChartContainerEvent {
    Selection = "selection",
    MouseEnter = "mouseenter",
    MouseLeave = "mouseleave",
    ContextMenu = "contextmenu"
}
export declare class ChartContainer extends EventEmitter {
    readonly instance: TemplateInstance;
    readonly dataset: Dataset.Dataset;
    private chart;
    private defaultAttributes;
    constructor(instance: TemplateInstance, dataset: Dataset.Dataset);
    private container;
    private component;
    /** Resize the chart */
    resize(width: number, height: number): void;
    /** Listen to selection change */
    addSelectionListener(listener: (table: string, rowIndices: number[]) => void): EventSubscription;
    addContextMenuListener(listener: (table: string, rowIndices: number[], clientX: number, clientY: number) => void): EventSubscription;
    addMouseEnterListener(listener: (table: string, rowIndices: number[]) => void): EventSubscription;
    addMouseLeaveListener(listener: (table: string, rowIndices: number[], modifiers: any) => void): EventSubscription;
    /** Set data selection and update the chart */
    setSelection(table: string, rowIndices: number[]): void;
    /** Clear data selection and update the chart */
    clearSelection(): void;
    /** Get a property from the chart */
    getProperty(objectID: string, property: Specification.Template.PropertyField): any;
    /** Set a property to the chart */
    setProperty(objectID: string, property: Specification.Template.PropertyField, value: any): void;
    /** Get a attribute mapping */
    getAttributeMapping(objectID: string, attribute: string): Specification.Mapping;
    /** Set a attribute mapping */
    setAttributeMapping(objectID: string, attribute: string, mapping: Specification.Mapping): void;
    /** Mount the chart to a container element */
    mount(container: string | Element, width?: number, height?: number): void;
    /** Unmount the chart */
    unmount(): void;
}
