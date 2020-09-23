import { ZoomInfo } from "../../core";
import { DataType, DataKind } from "../../core/specification";
export declare function classNames(...args: Array<string | [string, boolean]>): string;
export declare function toSVGNumber(x: number): string;
export declare function toSVGZoom(zoom: ZoomInfo): string;
export declare function parseHashString(value: string): {
    [key: string]: string;
};
export interface RenderDataURLToPNGOptions {
    mode: "scale" | "thumbnail";
    scale?: number;
    thumbnail?: [number, number];
    background?: string;
}
export declare function renderDataURLToPNG(dataurl: string, options: RenderDataURLToPNGOptions): Promise<HTMLCanvasElement>;
export declare function readFileAsString(file: File): Promise<string>;
export declare function readFileAsDataUrl(file: File): Promise<string>;
export declare function getExtensionFromFileName(filename: string): string;
export declare function getFileNameWithoutExtension(filename: string): string;
export declare function showOpenFileDialog(accept?: string[]): Promise<File>;
export declare function b64EncodeUnicode(str: string): string;
export declare function stringToDataURL(mimeType: string, content: string): string;
export declare function getConvertableDataKind(type: DataType, dataSample?: Array<string | boolean | Date | number>): DataKind[];
export declare function getConvertableTypes(type: DataType, dataSample?: Array<string | boolean | Date | number>): DataType[];
