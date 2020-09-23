import { AttributeDescriptions } from "../object";
import { Color } from "../../common";
import { AttributeMap } from "../../specification/index";
export declare const symbolTypes: string[];
export declare const symbolAttributes: AttributeDescriptions;
export interface SymbolElementAttributes extends AttributeMap {
    x: number;
    y: number;
    size: number;
    fill: Color;
    stroke: Color;
    strokeWidth: number;
    opacity: number;
    visible: boolean;
    symbol: string;
}
export interface SymbolElementProperties extends AttributeMap {
}
