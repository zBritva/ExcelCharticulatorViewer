/// <reference types="react" />
import { EventSubscription, Point, Specification, ZoomInfo } from "../../../core";
import { DragData } from "../../actions";
import { ZoomableCanvas } from "../../components";
import { DragContext, Droppable } from "../../controllers";
import { MarkSnappableGuide } from "./snapping";
import { ContextedComponent } from "../../context_component";
export interface MarkEditorViewProps {
    height?: number;
}
export interface MarkEditorViewState {
    currentCreation?: string;
    currentCreationOptions?: string;
    width: number;
    height: number;
}
export declare class MarkEditorView extends ContextedComponent<MarkEditorViewProps, MarkEditorViewState> {
    protected refContainer: HTMLDivElement;
    protected refSingleMarkView: SingleMarkView;
    protected resizeListenerHandle: number;
    subs: EventSubscription[];
    state: MarkEditorViewState;
    resize: () => void;
    componentDidMount(): void;
    componentWillUnmount(): void;
    getGlyphState(glyph: Specification.Glyph): Specification.GlyphState<Specification.AttributeMap>;
    render(): JSX.Element;
    getCurrentCreation(): string;
    getCurrentCreationOptions(): string;
}
export interface SingleMarkViewProps {
    parent: MarkEditorView;
    glyph: Specification.Glyph;
    glyphState: Specification.GlyphState;
    width: number;
    height: number;
}
export interface SingleMarkViewState {
    dataForDropZones: DragData.DropZoneData | false;
    selectedElement: Specification.Element;
    showIndicator: boolean;
    showIndicatorActive: boolean;
    snappingCandidates: MarkSnappableGuide[] | null;
    zoom: ZoomInfo;
}
export declare class SingleMarkView extends ContextedComponent<SingleMarkViewProps, SingleMarkViewState> implements Droppable {
    refs: {
        canvas: SVGElement;
        canvasInteraction: SVGRectElement;
        zoomable: ZoomableCanvas;
    };
    state: SingleMarkViewState;
    getDefaultState(): SingleMarkViewState;
    doZoom(factor: number): void;
    doZoomAuto(): void;
    getFitViewZoom(width: number, height: number): ZoomInfo;
    doAutoFit(): void;
    scheduleAutoFit(): void;
    getRelativePoint(point: Point): Point;
    onDragEnter(ctx: DragContext): boolean;
    private tokens;
    private hammer;
    componentDidMount(): void;
    componentWillUnmount(): void;
    renderElement(element: Specification.Element, elementState: Specification.MarkState): JSX.Element;
    renderDropIndicator(): JSX.Element;
    getSnappingGuides(): MarkSnappableGuide[];
    renderHandles(): JSX.Element;
    renderBoundsGuides(): JSX.Element[];
    renderMarkHandles(): JSX.Element[];
    renderAnchorHandles(): JSX.Element[];
    renderElementHandles(): JSX.Element[];
    renderDropZoneForElement(data: any, element: Specification.Element, state: Specification.MarkState): JSX.Element[];
    renderSnappingGuidesLabels(): JSX.Element;
    renderSnappingGuides(): JSX.Element[];
    renderMarkGuides(): JSX.Element[];
    renderAnchor(): JSX.Element;
    renderCreatingComponent(): JSX.Element;
    render(): JSX.Element;
}
