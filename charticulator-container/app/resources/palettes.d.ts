import { Color } from "../../core";
/** A color scheme is a source of colors for categorical/ordinal/numerical scales */
export interface ColorPalette {
    name: string;
    colors: Color[][];
    type: "sequential" | "diverging" | "qualitative" | "palette";
}
export declare let predefinedPalettes: ColorPalette[];
export declare function addPalette(name: string, type: "sequential" | "diverging" | "qualitative" | "palette", ...colors: string[][]): void;
