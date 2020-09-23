import { AttributeDescriptions } from "../object";
import { AttributeMap, Types } from "../../specification/index";
export declare const iconAttributes: AttributeDescriptions;
export interface IconElementAttributes extends AttributeMap {
    x: number;
    y: number;
    size: number;
    opacity: number;
    visible: boolean;
    image: Types.Image;
}
export interface IconElementProperties extends AttributeMap {
    alignment: Types.TextAlignment;
    rotation: number;
}
