import { AttributeDescriptions } from "../object";
import { AttributeMap, ObjectProperties } from "../../specification";
import { Color } from "../../common";
export declare const textboxAttributes: AttributeDescriptions;
export interface TextboxElementAttributes extends AttributeMap {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    cx: number;
    cy: number;
    width: number;
    height: number;
    color: Color;
    outline: Color;
    opacity: number;
    visible: boolean;
    text: string;
    fontFamily: string;
    fontSize: number;
}
export interface TextboxElementProperties extends ObjectProperties {
    paddingX: number;
    paddingY: number;
    alignX: "start" | "middle" | "end";
    alignY: "start" | "middle" | "end";
}
