import { Point } from "../common";
import * as Graphics from "../graphics";
import * as Specification from "../specification";
import * as Controls from "./controls";
export * from "./chart_element";
export * from "./object";
export { Controls };
export interface OrderDescriptionItem extends Specification.AttributeMap {
    column: string;
    order: "ascending" | "descending";
}
export declare type OrderDescription = OrderDescriptionItem[];
export interface DataMappingHints {
    rangeNumber?: [number, number];
    startWithZero?: "default" | "never" | "always";
    autoRange?: boolean;
    rangeEnum?: string[];
    rangeImage?: string[];
    newScale?: boolean;
}
export interface TemplateParameters {
    properties?: Specification.Template.Property[];
    inferences?: Specification.Template.Inference[];
}
export declare namespace DropZones {
    interface Description {
        type: string;
        /** If set, restrict the data that can be dropped */
        accept?: DropFilter;
        /** Action to perform after drop */
        dropAction: DropAction;
    }
    interface DropFilter {
        /** Only accept data from a certain table */
        table?: string;
        /** Only accept data with a certain kind */
        kind?: Specification.DataKind;
        /** Only accept certain scaffolds */
        scaffolds?: string[];
    }
    interface DropAction {
        /** Map data using inferred scale */
        scaleInference?: {
            attribute: string;
            attributeType: Specification.AttributeType;
            hints?: DataMappingHints;
        };
        /** Set AxisDataBinding to property */
        axisInference?: {
            property: string;
            /** If set, extend instead of replace the axis */
            appendToProperty?: string;
        };
        /** Extend a plot segment */
        extendPlotSegment?: {};
    }
    interface Line extends Description {
        type: "line";
        p1: Point;
        p2: Point;
        title: string;
    }
    interface Arc extends Description {
        type: "arc";
        center: Point;
        radius: number;
        angleStart: number;
        angleEnd: number;
        title: string;
    }
    interface Region extends Description {
        type: "region";
        p1: Point;
        p2: Point;
        title: string;
    }
    interface Rectangle extends Description {
        type: "rectangle";
        cx: number;
        cy: number;
        width: number;
        height: number;
        rotation: number;
        title: string;
    }
}
export declare namespace Handles {
    interface Description {
        type: string;
        visible?: boolean;
        actions: HandleAction[];
    }
    interface HandleAction {
        type: "property" | "attribute" | "attribute-value-mapping";
        source?: string;
        property?: string;
        field?: string | string[];
        attribute?: string;
        minimum?: number;
        maximum?: number;
    }
    /** A point with x, y coordinates */
    interface Point extends Description {
        type: "point";
        x: number;
        y: number;
    }
    /** A line with a x or y coordiante, and a span on the other */
    interface Line extends Description {
        type: "line";
        axis: "x" | "y";
        value: number;
        span: [number, number];
    }
    interface RelativeLine extends Description {
        type: "relative-line";
        axis: "x" | "y";
        reference: number;
        value: number;
        sign: number;
        span: [number, number];
    }
    /** A x or y gap */
    interface GapRatio extends Description {
        type: "gap-ratio";
        axis: "x" | "y";
        reference: number;
        value: number;
        scale: number;
        span: [number, number];
        range: [number, number];
        coordinateSystem: Graphics.CoordinateSystem;
    }
    /** A x or y margin */
    interface Margin extends Description {
        type: "margin";
        axis: "x" | "y";
        value: number;
        total?: number;
        range?: [number, number];
        sign: number;
        x: number;
        y: number;
    }
    interface Angle extends Description {
        type: "angle";
        cx: number;
        cy: number;
        radius: number;
        value: number;
        clipAngles: [number, number];
        icon: ">" | "<" | "o";
    }
    interface DistanceRatio extends Description {
        type: "distance-ratio";
        cx: number;
        cy: number;
        startAngle: number;
        endAngle: number;
        value: number;
        startDistance: number;
        endDistance: number;
        clipRange: [number, number];
    }
    interface InputCurve extends Description {
        type: "input-curve";
        x1: number;
        y1: number;
        x2: number;
        y2: number;
    }
    interface TextAlignment extends Description {
        type: "text-alignment";
        text: string;
        alignment: Specification.Types.TextAlignment;
        rotation: number;
        anchorX: number;
        anchorY: number;
        textWidth: number;
        textHeight: number;
    }
}
export declare namespace BoundingBox {
    interface Description {
        type: string;
        visible?: boolean;
    }
    interface Rectangle extends Description {
        type: "rectangle";
        cx: number;
        cy: number;
        width: number;
        height: number;
    }
    interface AnchoredRectangle extends Description {
        type: "anchored-rectangle";
        cx: number;
        cy: number;
        width: number;
        height: number;
        rotation: number;
        anchorX: number;
        anchorY: number;
    }
    interface Circle extends Description {
        type: "circle";
        cx: number;
        cy: number;
        radius: number;
    }
    interface Line extends Description {
        type: "line";
        x1: number;
        y1: number;
        x2: number;
        y2: number;
        morphing?: boolean;
    }
}
export declare namespace SnappingGuides {
    interface Description {
        type: string;
        visible: boolean;
    }
    interface Axis extends Description {
        type: "x" | "y";
        value: number;
        attribute: string;
    }
    interface Label extends Description {
        type: "label";
        x: number;
        y: number;
        text: string;
    }
}
export declare namespace LinkAnchor {
    interface Description {
        element: string;
        points: Array<{
            x: number;
            y: number;
            xAttribute: string;
            yAttribute: string;
            direction?: {
                x: number;
                y: number;
            };
        }>;
    }
}
export declare namespace CreatingInteraction {
    interface Description {
        type: string;
        mapping: {
            [name: string]: string;
        };
        valueMappings?: {
            [name: string]: Specification.AttributeValue;
        };
        attributes?: {
            [name: string]: Specification.AttributeValue;
        };
    }
    interface Point extends Description {
        type: "point";
    }
    interface Rectangle extends Description {
        type: "rectangle";
    }
    interface LineSegment extends Description {
        type: "line-segment";
    }
    interface HLine extends Description {
        type: "hline";
    }
    interface HLineSegment extends Description {
        type: "hline-segment";
    }
    interface VLine extends Description {
        type: "vline";
    }
    interface VLineSegment extends Description {
        type: "vline-segment";
    }
}
export declare namespace TemplateMetadata {
    interface ChartMetadata {
        dataSlots: DataSlot[];
        inference: Array<{
            id: string;
            infer: Inference;
        }>;
        mappings: Array<{
            id: string;
            attribute: string;
            slot: string;
        }>;
    }
    interface DataSlot {
        name: string;
        kind: "numerical" | "categorical";
    }
    interface Inference {
        type: string;
        defaultLabel: string;
    }
    /** Infer axis parameter, set to axis property */
    interface Axis extends Inference {
        type: "axis";
        property: string;
        field?: string[];
        dataExpression: string;
        kind: "numerical" | "categorical";
    }
    /** Infer scale parameter, set to scale's domain property */
    interface Scale extends Inference {
        type: "scale";
        kind: "numerical" | "categorical";
        target: "number" | "color";
        properties: {
            min?: string;
            max?: string;
            mapping?: string;
        };
    }
    /** Infer order parameter, set to orderBy */
    interface Order extends Inference {
        type: "order";
        property: string;
        field?: string[];
        dataExpression: string;
    }
}
export declare function findObjectById(spec: Specification.Chart, id: string): Specification.Object;
export interface ObjectItem {
    kind: "chart" | "chart-element" | "glyph" | "mark" | "scale";
    object: Specification.Object;
    chartElement?: Specification.ChartElement;
    glyph?: Specification.Glyph;
    mark?: Specification.Element;
    scale?: Specification.Scale;
}
export declare function forEachObject(chart: Specification.Chart): Iterable<ObjectItem>;
export declare function forEachMapping(mappings: Specification.Mappings): Iterable<[string, Specification.Mapping]>;
export declare function setProperty(object: Specification.Object, property: Specification.Template.PropertyField, value: any): void;
export declare function getProperty(object: Specification.Object, property: Specification.Template.PropertyField): Specification.AttributeValue;
