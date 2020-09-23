import * as React from "react";
import { Specification, Dataset, Prototypes, Graphics } from "../core";
import { RenderGraphicalElementSVGOptions, DataSelection, GraphicalElementEventHandler } from "../app/renderer";
export { DataSelection };
export declare type GlyphEventHandler = (data: {
    table: string;
    rowIndices: number[];
}, modifiers: {
    ctrlKey: boolean;
    shiftKey: boolean;
    metaKey: boolean;
}) => void;
export interface ChartComponentProps {
    chart: Specification.Chart;
    dataset: Dataset.Dataset;
    width: number;
    height: number;
    rootElement: "svg" | "g";
    className?: string;
    defaultAttributes?: Prototypes.DefaultAttributes;
    /** Additional options for the SVG renderer */
    rendererOptions?: RenderGraphicalElementSVGOptions;
    /** Render the chart synchronously */
    sync?: boolean;
    selection?: DataSelection;
    onGlyphClick?: GlyphEventHandler;
    onGlyphMouseEnter?: GlyphEventHandler;
    onGlyphMouseLeave?: GlyphEventHandler;
    onGlyphContextMenuClick?: GlyphEventHandler;
}
export interface ChartComponentState {
    working: boolean;
    graphics: Graphics.Element;
}
/** A React component that manages a sub-chart */
export declare class ChartComponent extends React.Component<ChartComponentProps, ChartComponentState> {
    protected manager: Prototypes.ChartStateManager;
    protected renderer: Graphics.ChartRenderer;
    constructor(props: ChartComponentProps);
    applySelection(selection: DataSelection): void;
    componentWillReceiveProps(newProps: ChartComponentProps): void;
    isEqual<T>(a: T, b: T): boolean;
    updateWithNewProps(newProps: ChartComponentProps): boolean;
    protected recreateManager(props: ChartComponentProps): void;
    protected timer: any;
    protected scheduleUpdate(): void;
    getProperty(objectID: string, property: Specification.Template.PropertyField): Specification.AttributeValue;
    setProperty(objectID: string, property: Specification.Template.PropertyField, value: Specification.AttributeValue): void;
    getAttributeMapping(objectID: string, attribute: string): Specification.Mapping;
    setAttributeMapping(objectID: string, attribute: string, mapping: Specification.Mapping): void;
    convertGlyphEventHandler(handler: GlyphEventHandler): GraphicalElementEventHandler;
    render(): JSX.Element;
}
