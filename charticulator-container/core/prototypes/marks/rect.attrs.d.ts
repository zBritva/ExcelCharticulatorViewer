import { AttributeDescriptions } from "../object";
import { Color } from "../../common";
import { AttributeMap } from "../../specification/index";
export declare const rectAttributes: AttributeDescriptions;
export interface RectElementAttributes extends AttributeMap {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    cx: number;
    cy: number;
    width: number;
    height: number;
    stroke: Color;
    fill: Color;
    strokeWidth: number;
    opacity: number;
    visible: boolean;
}
export interface RectElementProperties extends AttributeMap {
    shape: "rectangle" | "ellipse" | "triangle";
}
