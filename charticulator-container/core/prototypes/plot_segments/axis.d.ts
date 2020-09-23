import { CoordinateSystem, Group } from "../../graphics";
import { Specification } from "../../index";
import { Controls } from "../common";
export declare let defaultAxisStyle: Specification.Types.AxisRenderingStyle;
export interface TickDescription {
    position: number;
    label: string;
}
export declare class AxisRenderer {
    ticks: TickDescription[];
    style: Specification.Types.AxisRenderingStyle;
    rangeMin: number;
    rangeMax: number;
    valueToPosition: (value: any) => number;
    oppositeSide: boolean;
    private static textMeasurer;
    setStyle(style?: Partial<Specification.Types.AxisRenderingStyle>): this;
    setAxisDataBinding(data: Specification.Types.AxisDataBinding, rangeMin: number, rangeMax: number, enablePrePostGap: boolean, reverse: boolean): this;
    ticksData: Array<{
        tick: any;
        value: any;
    }>;
    setTicksByData(ticks: Array<{
        tick: any;
        value: any;
    }>): void;
    getTickFormat(tickFormat: string, defaultFormat: (d: number) => string): (d: number) => string;
    setLinearScale(domainMin: number, domainMax: number, rangeMin: number, rangeMax: number, tickFormat: string): this;
    setLogarithmicScale(domainMin: number, domainMax: number, rangeMin: number, rangeMax: number, tickFormat: string): this;
    setTemporalScale(domainMin: number, domainMax: number, rangeMin: number, rangeMax: number, tickFormatString: string): this;
    setCategoricalScale(domain: string[], range: Array<[number, number]>, rangeMin: number, rangeMax: number): this;
    renderLine(x: number, y: number, angle: number, side: number): Group;
    renderCartesian(x: number, y: number, axis: "x" | "y"): Group;
    renderPolar(cx: number, cy: number, radius: number, side: number): Group;
    renderCurve(coordinateSystem: CoordinateSystem, y: number, side: number): Group;
}
export declare function getCategoricalAxis(data: Specification.Types.AxisDataBinding, enablePrePostGap: boolean, reverse: boolean): {
    gap: number;
    preGap: number;
    postGap: number;
    gapScale: number;
    ranges: [number, number][];
};
export declare function getNumericalInterpolate(data: Specification.Types.AxisDataBinding): (x: number) => number;
export declare function buildAxisAppearanceWidgets(isVisible: boolean, axisProperty: string, m: Controls.WidgetManager): any;
export declare function buildAxisWidgets(data: Specification.Types.AxisDataBinding, axisProperty: string, m: Controls.WidgetManager, axisName: string): Controls.Widget[];
export declare function buildAxisInference(plotSegment: Specification.PlotSegment, property: string): Specification.Template.Inference;
export declare function buildAxisProperties(plotSegment: Specification.PlotSegment, property: string): Specification.Template.Property[];
