import { Color } from "../../common";
import { AttributeMap, Types } from "../../specification";
import { AttributeDescriptions } from "../object";
export declare const textAttributes: AttributeDescriptions;
export interface TextElementAttributes extends AttributeMap {
    x: number;
    y: number;
    text: string;
    fontFamily: string;
    fontSize: number;
    color: Color;
    outline: Color;
    opacity: number;
    visible: boolean;
}
export interface TextElementProperties extends AttributeMap {
    alignment: Types.TextAlignment;
    rotation: number;
}
