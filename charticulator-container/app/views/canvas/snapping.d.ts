import { Specification, Prototypes } from "../../../core";
import { HandlesDragEvent } from "./handles";
import { Actions } from "../../actions";
export interface SnappableGuide<ElementType> {
    element: ElementType;
    guide: Prototypes.SnappingGuides.Description;
}
export interface SnappingAction<ElementType> {
    type: "snap" | "move" | "property" | "value-mapping";
    attribute?: string;
    property?: string;
    field?: string | string[];
    value?: Specification.AttributeValue;
    snapElement?: ElementType;
    snapAttribute?: string;
}
export declare class SnappingSession<ElementType> {
    candidates: Array<SnappableGuide<ElementType>>;
    handle: Prototypes.Handles.Description;
    threshold: number;
    currentCandidates: Array<SnappableGuide<ElementType>>;
    constructor(guides: Array<SnappableGuide<ElementType>>, handle: Prototypes.Handles.Description, threshold: number);
    handleDrag(e: HandlesDragEvent): void;
    handleEnd(e: HandlesDragEvent): Array<SnappingAction<ElementType>>;
    getCurrentCandidates(): Array<SnappableGuide<ElementType>>;
}
export declare class MoveSnappingSession extends SnappingSession<void> {
    constructor(handle: Prototypes.Handles.Description);
    getUpdates(actions: Array<SnappingAction<void>>): {
        [name: string]: Specification.AttributeValue;
    };
}
export declare type MarkSnappableGuide = SnappableGuide<Specification.Element>;
export declare class MarkSnappingSession extends SnappingSession<Specification.Element> {
    mark: Specification.Glyph;
    element: Specification.Element;
    constructor(guides: Array<SnappableGuide<Specification.Element>>, mark: Specification.Glyph, element: Specification.Element, elementState: Specification.MarkState, bound: Prototypes.Handles.Description, threshold: number);
    getActions(actions: Array<SnappingAction<Specification.Element>>): Actions.Action;
}
export declare type ChartSnappableGuide = SnappableGuide<Specification.ChartElement>;
export declare class ChartSnappingSession extends SnappingSession<Specification.ChartElement> {
    markLayout: Specification.ChartElement;
    constructor(guides: Array<SnappableGuide<Specification.ChartElement>>, markLayout: Specification.ChartElement, bound: Prototypes.Handles.Description, threshold: number);
    getActions(actions: Array<SnappingAction<Specification.ChartElement>>): Actions.Action[];
}
