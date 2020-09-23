/** Color in RGB */
export interface Color {
    r: number;
    g: number;
    b: number;
}
/** Color gradient */
export interface ColorGradient {
    colorspace: "hcl" | "lab";
    colors: Color[];
}
/** Get Color from HTML color string */
export declare function colorFromHTMLColor(html: string): Color;
export declare function colorToHTMLColor(color: Color): string;
export declare function colorToHTMLColorHEX(color: Color): string;
export declare type ColorConverter = (a: number, b: number, c: number) => [number, number, number] | [number, number, number, boolean];
export declare function getColorConverter(from: string, to: string): ColorConverter;
export declare type ColorInterpolation = (t: number) => Color;
export declare function interpolateColor(from: Color, to: Color, colorspace?: string): ColorInterpolation;
export declare function interpolateColors(colors: Color[], colorspace?: string): ColorInterpolation;
export declare function getDefaultColorPalette(count: number): Color[];
