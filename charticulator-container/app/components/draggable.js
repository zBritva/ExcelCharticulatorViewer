"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
const React = require("react");
const globals = require("../globals");
const utils_1 = require("../utils");
const Hammer = require("hammerjs");
class DraggableElement extends React.Component {
    constructor(props) {
        super(props);
        this.state = { dragging: false };
    }
    componentDidMount() {
        globals.dragController.registerDraggable(this, this.refs.draggableContainer, this.props.onTap);
    }
    componentWillUnmount() {
        globals.dragController.unregisterDraggable(this);
    }
    onDragStart() {
        this.setState({ dragging: true });
        if (this.props.onDragStart) {
            this.props.onDragStart();
        }
        return this.props.dragData();
    }
    onDragEnd() {
        this.setState({ dragging: false });
        if (this.props.onDragEnd) {
            this.props.onDragEnd();
        }
    }
    renderDragElement() {
        if (this.props.renderDragElement) {
            return this.props.renderDragElement();
        }
        else {
            return [React.createElement("span", null, this.props.children), { x: 0, y: 0 }];
        }
    }
    render() {
        const additional_classes = this.state.dragging
            ? "draggable dragging"
            : "draggable";
        return (React.createElement("span", { ref: "draggableContainer", className: utils_1.classNames(this.props.className, "draggable", [
                "dragging",
                this.state.dragging
            ]), style: { display: "inline-block", cursor: "pointer" } }, this.props.children));
    }
}
exports.DraggableElement = DraggableElement;
class ClickableSVGElement extends React.Component {
    componentDidMount() {
        this.hammer = new Hammer(this.refs.container);
        this.hammer.add(new Hammer.Tap());
        this.hammer.on("tap", () => {
            if (this.props.onClick) {
                this.props.onClick();
            }
        });
    }
    componentWillUnmount() {
        this.hammer.destroy();
        this.hammer = null;
    }
    render() {
        return (React.createElement("g", { ref: "container", style: { cursor: "pointer" } }, this.props.children));
    }
}
exports.ClickableSVGElement = ClickableSVGElement;
//# sourceMappingURL=draggable.js.map