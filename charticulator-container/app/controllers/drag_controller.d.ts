/// <reference types="hammerjs" />
import * as React from "react";
import { EventEmitter } from "../../core";
export interface Point {
    x: number;
    y: number;
}
export interface DragModifiers {
    shiftKey: boolean;
    ctrlKey: boolean;
}
export interface Draggable {
    onDragStart(): any;
    onDragEnd?(): void;
    renderDragElement(): [JSX.Element, Point];
}
export interface Droppable {
    onDragEnter?(context: DragContext): boolean;
    onDragStart?(context: DragContext): boolean;
}
export declare class DragContext {
    draggable: Draggable;
    data: any;
    onLeave(f: () => void): void;
    onOver(f: (point: Point, modifiers: DragModifiers) => void): void;
    onDrop(f: (point: Point, modifiers: DragModifiers) => void): void;
    _onleave: () => void;
    _onover: (point: Point, modifiers: DragModifiers) => void;
    _ondrop: (point: Point, modifiers: DragModifiers) => void;
    _state: number;
}
export declare class DragSession {
    parent: DragController;
    obj: Draggable;
    startPoint: Point;
    point: Point;
    data: any;
    candidates: Array<[Droppable, () => void]>;
    states: Map<Droppable, DragContext>;
    constructor(parent: DragController, draggable: Draggable, startPoint: Point);
    handlePan(point: Point, modifiers: DragModifiers): void;
    handleEnd(point: Point, modifiers: DragModifiers): void;
    pushCandidate(droppable: Droppable, remove: () => void): void;
    popCandidate(droppable: Droppable): void;
    removeCandidate(droppable: Droppable): void;
}
export interface DraggableInfo {
    hammer: HammerManager;
}
export interface DroppableInfo {
    remove: () => void;
}
export declare class DragController extends EventEmitter {
    private _draggables;
    private _droppables;
    private _element2Droppable;
    private _dragSession;
    getDroppableFromElement(element: Element): Droppable;
    registerDroppable(obj: Droppable, rootElement: Element): void;
    unregisterDroppable(obj: Droppable): void;
    registerDraggable(obj: Draggable, rootElement: Element, onTap?: () => void): void;
    unregisterDraggable(obj: Draggable): void;
    getSession(): DragSession;
}
export declare class DragStateView extends React.Component<{
    controller: DragController;
}, {}> {
    private token;
    onSession(): void;
    componentDidMount(): void;
    componentWillUnmount(): void;
    render(): JSX.Element;
}
