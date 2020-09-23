import { DataMappingHints } from ".";
import { Point } from "../common";
import * as Specification from "../specification";
import * as Dataset from "../dataset";
export declare type Widget = any;
export interface Property {
    property: string;
    field?: string | number | Array<string | number>;
    noUpdateState?: boolean;
    noComputeLayout?: boolean;
}
export interface InputSelectOptions {
    type: "radio" | "dropdown";
    showLabel?: boolean;
    options: string[];
    icons?: string[];
    labels?: string[];
}
export interface InputBooleanOptions {
    type: "checkbox" | "highlight" | "checkbox-fill-width";
    icon?: string;
    label?: string;
}
export interface RowOptions {
    dropzone?: {
        type: "axis-data-binding";
        prompt?: string;
        property?: string;
    };
}
export interface DropTargetOptions {
    type: "order";
    property: Property;
    label: string;
}
export interface OrderWidgetOptions {
    table: string;
}
export interface MappingEditorOptions {
    /** Hints for creating data mapping */
    hints?: DataMappingHints;
    /** When no mapping is specified, show the default value */
    defaultValue?: Specification.AttributeValue;
    /** When no mapping is specified, and no default value, show auto (true) or none (false). */
    defaultAuto?: boolean;
    /** Only allow mapping from one table */
    table?: string;
    acceptKinds?: Specification.DataKind[];
    numberOptions?: InputNumberOptions;
}
export interface InputNumberOptions {
    digits?: number;
    minimum?: number;
    maximum?: number;
    percentage?: boolean;
    showSlider?: boolean;
    sliderRange?: [number, number];
    sliderFunction?: "linear" | "sqrt";
    showUpdown?: boolean;
    updownTick?: number;
    updownRange?: [number, number];
    updownStyle?: "normal" | "font";
}
export interface InputDateOptions {
    defaultValue?: number | Date;
    placeholder?: string;
    onEnter?: (value: number) => boolean;
}
export interface InputColorOptions {
    allowNull?: boolean;
}
export interface TableOptions {
}
export interface FilterEditorOptions {
    table: string;
    target: {
        plotSegment?: Specification.PlotSegment;
        property?: Property;
    };
    value: Specification.Types.Filter;
    mode: "button" | "panel";
}
export interface GroupByEditorOptions {
    table: string;
    target: {
        plotSegment?: Specification.PlotSegment;
        property?: Property;
    };
    value: Specification.Types.GroupBy;
    mode: "button" | "panel";
}
export interface NestedChartEditorOptions {
    specification: Specification.Chart;
    dataset: Dataset.Dataset;
    filterCondition?: {
        column: string;
        value: any;
    };
    width: number;
    height: number;
}
export interface ArrayWidgetOptions {
    allowReorder?: boolean;
    allowDelete?: boolean;
}
export interface ScrollListOptions {
    height?: number;
    maxHeight?: number;
}
export interface InputExpressionOptions {
    table?: string;
}
export interface WidgetManager {
    mappingEditor(name: string, attribute: string, options: MappingEditorOptions): Widget;
    inputNumber(property: Property, options?: InputNumberOptions): Widget;
    inputDate(property: Property, options?: InputDateOptions): Widget;
    inputText(property: Property, placeholder?: string): Widget;
    inputComboBox(property: Property, values: string[], valuesOnly?: boolean): Widget;
    inputFontFamily(property: Property): Widget;
    inputSelect(property: Property, options: InputSelectOptions): Widget;
    inputBoolean(property: Property, options: InputBooleanOptions): Widget;
    inputExpression(property: Property, options?: InputExpressionOptions): Widget;
    inputImage(property: Property): Widget;
    inputImageProperty(property: Property): Widget;
    inputColor(property: Property, options?: InputColorOptions): Widget;
    inputColorGradient(property: Property, inline?: boolean): Widget;
    clearButton(property: Property, icon?: string): Widget;
    setButton(property: Property, value: Specification.AttributeValue, icon?: string, text?: string): Widget;
    orderByWidget(property: Property, options: OrderWidgetOptions): Widget;
    reorderWidget(property: Property): Widget;
    arrayWidget(property: Property, item: (item: Property) => Widget, options?: ArrayWidgetOptions): Widget;
    dropTarget(options: DropTargetOptions, widget: Widget): Widget;
    icon(icon: string): Widget;
    label(title: string): Widget;
    text(text: string, align?: "left" | "center" | "right"): Widget;
    sep(): Widget;
    sectionHeader(title: string, widget?: Widget, options?: RowOptions): Widget;
    row(title?: string, widget?: Widget, options?: RowOptions): Widget;
    detailsButton(...widgets: Widget[]): Widget;
    horizontal(cols: number[], ...widgets: Widget[]): Widget;
    vertical(...widgets: Widget[]): Widget;
    table(rows: Widget[][], options?: TableOptions): Widget;
    scrollList(widgets: Widget[], options?: ScrollListOptions): Widget;
    filterEditor(options: FilterEditorOptions): Widget;
    groupByEditor(options: GroupByEditorOptions): Widget;
    nestedChartEditor(property: Property, options: NestedChartEditorOptions): Widget;
}
export interface PopupEditor {
    anchor: Point;
    widgets: Widget[];
}
