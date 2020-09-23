import { Color } from "../../common";
import * as Graphics from "../../graphics";
import * as Specification from "../../specification";
import { ChartElementClass } from "../chart_element";
import { AttributeDescription, BoundingBox, Controls, Handles, ObjectClassMetadata, TemplateParameters } from "../common";
export interface LegendAttributes extends Specification.AttributeMap {
    x: number;
    y: number;
}
export interface LegendProperties extends Specification.AttributeMap {
    scale: string;
    alignX: string;
    alignY: string;
    fontFamily: string;
    fontSize: number;
    textColor: Color;
}
export interface LegendState extends Specification.ObjectState {
    attributes: LegendAttributes;
}
export interface LegendObject extends Specification.Object {
    properties: LegendProperties;
}
export declare abstract class LegendClass extends ChartElementClass {
    readonly object: LegendObject;
    readonly state: LegendState;
    static metadata: ObjectClassMetadata;
    static defaultProperties: {
        visible: boolean;
        alignX: string;
        alignY: string;
        fontFamily: string;
        fontSize: number;
        textColor: {
            r: number;
            g: number;
            b: number;
        };
    };
    attributeNames: string[];
    attributes: {
        [name: string]: AttributeDescription;
    };
    initializeState(): void;
    getLayoutBox(): {
        x1: number;
        y1: number;
        x2: number;
        y2: number;
    };
    getBoundingBox(): BoundingBox.Description;
    getHandles(): Handles.Description[];
    getScale(): [Specification.Scale, Specification.ScaleState];
    getLegendSize(): [number, number];
    getAttributePanelWidgets(manager: Controls.WidgetManager): Controls.Widget[];
    getTemplateParameters(): TemplateParameters;
}
export interface CategoricalLegendItem {
    type: "number" | "color" | "boolean";
    label: string;
    value: number | Color | boolean;
}
export declare class CategoricalLegendClass extends LegendClass {
    static classID: string;
    static type: string;
    private textMeasure;
    getLegendItems(): CategoricalLegendItem[];
    getLineHeight(): number;
    getLegendSize(): [number, number];
    getGraphics(): Graphics.Element;
}
export declare class NumericalColorLegendClass extends LegendClass {
    static classID: string;
    static type: string;
    getLegendSize(): [number, number];
    getGraphics(): Graphics.Element;
}
export interface NumericalNumberLegendAttributes extends Specification.AttributeMap {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
}
export interface NumericalNumberLegendProperties extends Specification.AttributeMap {
    axis: {
        visible: boolean;
        side: string;
        style: Specification.Types.AxisRenderingStyle;
    };
}
export declare class NumericalNumberLegendClass extends ChartElementClass<NumericalNumberLegendProperties, NumericalNumberLegendAttributes> {
    static classID: string;
    static type: string;
    static metadata: ObjectClassMetadata;
    static defaultProperties: {
        visible: boolean;
        axis: {
            side: string;
            visible: boolean;
            style: Specification.Types.AxisRenderingStyle;
        };
    };
    attributeNames: string[];
    attributes: {
        [name: string]: AttributeDescription;
    };
    initializeState(): void;
    getScale(): [Specification.Scale, Specification.ScaleState];
    getBoundingBox(): BoundingBox.Description;
    getHandles(): Handles.Description[];
    getGraphics(): Graphics.Element;
    getAttributePanelWidgets(manager: Controls.WidgetManager): Controls.Widget[];
}
export declare function registerClasses(): void;
