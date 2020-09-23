import { AttributeDescriptions, AttributeDescription } from "./object";
import { AttributeType } from "../specification";
export declare class AttrBuilder {
    static attr(name: string, type: AttributeType, options?: Partial<AttributeDescription>): AttributeDescriptions;
    static number(name: string, solvable?: boolean, options?: Partial<AttributeDescription>): AttributeDescriptions;
    static color(name: string, options?: Partial<AttributeDescription>): AttributeDescriptions;
    static boolean(name: string, options?: Partial<AttributeDescription>): AttributeDescriptions;
    static enum(name: string, options?: Partial<AttributeDescription>): AttributeDescriptions;
    static line(): AttributeDescriptions;
    static point(): AttributeDescriptions;
    static center(): AttributeDescriptions;
    static size(): AttributeDescriptions;
    static dXdY(): AttributeDescriptions;
    static opacity(): AttributeDescriptions;
    static visible(): AttributeDescriptions;
    static image(): AttributeDescriptions;
    static style(options?: {
        fill?: boolean;
    }): AttributeDescriptions;
}
