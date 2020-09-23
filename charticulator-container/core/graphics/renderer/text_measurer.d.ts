export interface TextMeasurement {
    width: number;
    fontSize: number;
    ideographicBaseline: number;
    hangingBaseline: number;
    alphabeticBaseline: number;
    middle: number;
}
export declare class TextMeasurer {
    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D;
    fontFamily: string;
    fontSize: number;
    static parameters: {
        hangingBaseline: number[];
        ideographicBaseline: number[];
        alphabeticBaseline: number[];
        middle: number[];
    };
    constructor();
    setFontFamily(family: string): void;
    setFontSize(size: number): void;
    measure(text: string): TextMeasurement;
    private static globalInstance;
    static GetGlobalInstance(): TextMeasurer;
    static Measure(text: string, family: string, size: number): TextMeasurement;
    static ComputeTextPosition(x: number, y: number, metrics: TextMeasurement, alignX?: "left" | "middle" | "right", alignY?: "top" | "middle" | "bottom", xMargin?: number, yMargin?: number): [number, number];
}
