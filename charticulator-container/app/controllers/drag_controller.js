"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
const React = require("react");
const Hammer = require("hammerjs");
const core_1 = require("../../core");
class DragContext {
    constructor() {
        this._onleave = null;
        this._onover = null;
        this._ondrop = null;
    }
    // Set drag event handlers
    onLeave(f) {
        this._onleave = f;
    }
    onOver(f) {
        this._onover = f;
    }
    onDrop(f) {
        this._ondrop = f;
    }
}
exports.DragContext = DragContext;
class DragSession {
    constructor(parent, draggable, startPoint) {
        this.candidates = [];
        this.states = new Map();
        this.parent = parent;
        this.obj = draggable;
        this.startPoint = startPoint;
        this.point = startPoint;
        this.data = draggable.onDragStart();
    }
    handlePan(point, modifiers) {
        this.point = point;
        let element = document.elementFromPoint(point.x, point.y);
        const withins = new Set();
        while (element != null) {
            const droppable = this.parent.getDroppableFromElement(element);
            if (droppable) {
                withins.add(droppable);
            }
            element = element.parentElement;
        }
        // states:
        // 0: undefined
        // -1: ignored (onDragEnter returned false)
        // 1: drag entered
        withins.forEach(droppable => {
            let ctx = this.states.get(droppable);
            if (!ctx) {
                ctx = new DragContext();
                ctx.draggable = this.obj;
                ctx.data = this.data;
                ctx._state = 0;
                this.states.set(droppable, ctx);
            }
            if (ctx._state == 0) {
                let r = false;
                try {
                    r = droppable.onDragEnter ? droppable.onDragEnter(ctx) : false;
                }
                catch (e) {
                    console.trace(e);
                }
                if (r) {
                    ctx._state = 1;
                }
                else {
                    ctx._state = -1;
                }
            }
            else if (ctx._state == 1) {
                if (ctx._onover) {
                    ctx._onover(point, modifiers);
                }
            }
        });
        this.states.forEach((context, droppable) => {
            if (!withins.has(droppable)) {
                if (context._state == 1) {
                    if (context._onleave) {
                        context._onleave();
                    }
                    context._state = 0;
                    context._onover = null;
                    context._onleave = null;
                    context._ondrop = null;
                }
            }
        });
        this.parent.emit("session");
    }
    handleEnd(point, modifiers) {
        this.states.forEach((context, droppable) => {
            if (context._state == 1) {
                if (context._ondrop) {
                    try {
                        context._ondrop(point, modifiers);
                    }
                    catch (e) {
                        console.trace(e);
                    }
                }
            }
        });
        this.states.forEach((context, droppable) => {
            if (context._state == 1) {
                if (context._onleave) {
                    try {
                        context._onleave();
                    }
                    catch (e) {
                        console.trace(e);
                    }
                }
            }
        });
        this.states.clear();
        if (this.obj.onDragEnd) {
            try {
                this.obj.onDragEnd();
            }
            catch (e) {
                console.trace(e);
            }
        }
    }
    pushCandidate(droppable, remove) {
        this.candidates.push([droppable, remove]);
    }
    popCandidate(droppable) {
        this.candidates = this.candidates.filter(([obj, remove]) => {
            if (obj === droppable) {
                remove();
                return false;
            }
            else {
                return true;
            }
        });
    }
    removeCandidate(droppable) {
        this.states.delete(droppable);
    }
}
exports.DragSession = DragSession;
class DragController extends core_1.EventEmitter {
    constructor() {
        super(...arguments);
        this._draggables = new WeakMap();
        this._droppables = new WeakMap();
        this._element2Droppable = new WeakMap();
        this._dragSession = null;
    }
    getDroppableFromElement(element) {
        return this._element2Droppable.get(element);
    }
    registerDroppable(obj, rootElement) {
        // Remove any existing stuff
        this.unregisterDroppable(obj);
        this._element2Droppable.set(rootElement, obj);
        this._droppables.set(obj, {
            remove: () => {
                this._element2Droppable.delete(rootElement);
            }
        });
    }
    unregisterDroppable(obj) {
        if (this._droppables.has(obj)) {
            this._droppables.get(obj).remove();
            this._droppables.delete(obj);
        }
        if (this._dragSession) {
            this._dragSession.removeCandidate(obj);
        }
    }
    registerDraggable(obj, rootElement, onTap) {
        // Remove any existing stuff
        this.unregisterDraggable(obj);
        // Create hammer object and setup handlers
        const hammer = new Hammer.Manager(rootElement);
        hammer.add(new Hammer.Pan());
        hammer.on("panstart", e => {
            try {
                this._dragSession = new DragSession(this, obj, {
                    x: e.center.x,
                    y: e.center.y
                });
            }
            catch (e) {
                console.trace(e);
                return;
            }
            this.emit("sessionstart");
            this.emit("session");
        });
        hammer.on("pan", e => {
            if (this._dragSession != null) {
                const modifiers = {
                    shiftKey: e.srcEvent.shiftKey,
                    ctrlKey: e.srcEvent.ctrlKey
                };
                this._dragSession.handlePan({ x: e.center.x, y: e.center.y }, modifiers);
            }
        });
        hammer.on("panend", e => {
            if (this._dragSession != null) {
                const modifiers = {
                    shiftKey: e.srcEvent.shiftKey,
                    ctrlKey: e.srcEvent.ctrlKey
                };
                this._dragSession.handleEnd({ x: e.center.x, y: e.center.y }, modifiers);
                this._dragSession = null;
                this.emit("session");
                this.emit("sessionend");
            }
        });
        if (onTap) {
            hammer.add(new Hammer.Tap());
            hammer.on("tap", onTap);
        }
        this._draggables.set(obj, {
            hammer
        });
    }
    unregisterDraggable(obj) {
        if (this._draggables.has(obj)) {
            const info = this._draggables.get(obj);
            info.hammer.destroy();
            this._draggables.delete(obj);
        }
    }
    getSession() {
        return this._dragSession;
    }
}
exports.DragController = DragController;
class DragStateView extends React.Component {
    onSession() {
        this.forceUpdate();
    }
    componentDidMount() {
        this.token = this.props.controller.addListener("session", this.onSession.bind(this));
    }
    componentWillUnmount() {
        this.token.remove();
    }
    render() {
        const session = this.props.controller.getSession();
        if (!session) {
            return React.createElement("div", null);
        }
        const [element, offset] = session.obj.renderDragElement();
        return (React.createElement("div", { className: "drag-state-view", style: {
                position: "fixed",
                left: 0,
                right: 0,
                top: 0,
                bottom: 0,
                pointerEvents: "none"
            } },
            React.createElement("div", { style: {
                    position: "absolute",
                    left: session.point.x + offset.x + "px",
                    top: session.point.y + offset.y + "px"
                } }, element)));
    }
}
exports.DragStateView = DragStateView;
//# sourceMappingURL=drag_controller.js.map