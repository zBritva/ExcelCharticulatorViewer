import * as Specification from "../../specification";
import { ConstraintSolver } from "../../solver";
import { Handles, ObjectClass, ObjectClassMetadata, SnappingGuides } from "../common";
export declare abstract class GlyphClass extends ObjectClass {
    readonly object: Specification.Glyph;
    readonly state: Specification.GlyphState;
    static metadata: ObjectClassMetadata;
    abstract initializeState(): void;
    abstract buildIntrinsicConstraints(solver: ConstraintSolver): void;
    abstract getAlignmentGuides(): SnappingGuides.Description[];
    abstract getHandles(): Handles.Description[];
    static createDefault(table: string): Specification.Glyph;
}
export interface RectangleGlyphAttributes extends Specification.AttributeMap {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    x: number;
    y: number;
    width: number;
    height: number;
    ix1: number;
    iy1: number;
    ix2: number;
    iy2: number;
    icx: number;
    icy: number;
}
export interface RectangleGlyphState extends Specification.GlyphState {
    attributes: RectangleGlyphAttributes;
}
export declare function registerClasses(): void;
