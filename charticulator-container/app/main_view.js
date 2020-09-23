"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
const React = require("react");
const globals = require("./globals");
const components_1 = require("./components");
const controllers_1 = require("./controllers");
const stores_1 = require("./stores");
const views_1 = require("./views");
const menubar_1 = require("./views/menubar");
const object_list_editor_1 = require("./views/panels/object_list_editor");
const tool_bar_1 = require("./views/tool_bar");
const scales_panel_1 = require("./views/panels/scales_panel");
class MainView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            glyphViewMaximized: false,
            layersViewMaximized: false,
            attributeViewMaximized: false,
            scaleViewMaximized: false
        };
    }
    getChildContext() {
        return {
            store: this.props.store
        };
    }
    render() {
        return (React.createElement("div", { className: "charticulator__application", onDragOver: e => e.preventDefault(), onDrop: e => e.preventDefault() },
            React.createElement(menubar_1.MenuBar, { ref: e => (this.refMenuBar = e) }),
            React.createElement("section", { className: "charticulator__panel-container" },
                React.createElement("div", { className: "charticulator__panel charticulator__panel-dataset" },
                    React.createElement(components_1.MinimizablePanelView, null,
                        React.createElement(components_1.MinimizablePane, { title: "Dataset", scroll: true, hideHeader: true },
                            React.createElement(components_1.ErrorBoundary, null,
                                React.createElement(views_1.DatasetView, { store: this.props.store }))),
                        this.state.scaleViewMaximized ? null : (React.createElement(components_1.MinimizablePane, { title: "Scales", scroll: true, onMaximize: () => this.setState({ scaleViewMaximized: true }) },
                            React.createElement(components_1.ErrorBoundary, null,
                                React.createElement(scales_panel_1.ScalesPanel, { store: this.props.store })))))),
                React.createElement("div", { className: "charticulator__panel charticulator__panel-editor" },
                    React.createElement("div", { className: "charticulator__panel-editor-toolbar" },
                        React.createElement(tool_bar_1.Toolbar, null)),
                    React.createElement("div", { className: "charticulator__panel-editor-panel-container" },
                        React.createElement("div", { className: "charticulator__panel-editor-panel charticulator__panel-editor-panel-panes", style: {
                                display: this.state.glyphViewMaximized &&
                                    this.state.attributeViewMaximized &&
                                    this.state.scaleViewMaximized &&
                                    this.state.layersViewMaximized
                                    ? "none"
                                    : undefined
                            } },
                            React.createElement(components_1.MinimizablePanelView, null,
                                this.state.glyphViewMaximized ? null : (React.createElement(components_1.MinimizablePane, { title: "Glyph", scroll: false, onMaximize: () => this.setState({ glyphViewMaximized: true }) },
                                    React.createElement(components_1.ErrorBoundary, null,
                                        React.createElement(views_1.MarkEditorView, { height: 300 })))),
                                this.state.layersViewMaximized ? null : (React.createElement(components_1.MinimizablePane, { title: "Layers", scroll: true, maxHeight: 200, onMaximize: () => this.setState({ layersViewMaximized: true }) },
                                    React.createElement(components_1.ErrorBoundary, null,
                                        React.createElement(object_list_editor_1.ObjectListEditor, null)))),
                                this.state.attributeViewMaximized ? null : (React.createElement(components_1.MinimizablePane, { title: "Attributes", scroll: true, onMaximize: () => this.setState({ attributeViewMaximized: true }) },
                                    React.createElement(components_1.ErrorBoundary, null,
                                        React.createElement(views_1.AttributePanel, { store: this.props.store })))))),
                        React.createElement("div", { className: "charticulator__panel-editor-panel charticulator__panel-editor-panel-chart" },
                            React.createElement(components_1.ErrorBoundary, null,
                                React.createElement(views_1.ChartEditorView, { store: this.props.store })))))),
            React.createElement("div", { className: "charticulator__floating-panels" },
                this.state.glyphViewMaximized ? (React.createElement(components_1.FloatingPanel, { peerGroup: "panels", title: "Glyph", onClose: () => this.setState({ glyphViewMaximized: false }) },
                    React.createElement(components_1.ErrorBoundary, null,
                        React.createElement(views_1.MarkEditorView, null)))) : null,
                this.state.layersViewMaximized ? (React.createElement(components_1.FloatingPanel, { scroll: true, peerGroup: "panels", title: "Layers", onClose: () => this.setState({ layersViewMaximized: false }) },
                    React.createElement(components_1.ErrorBoundary, null,
                        React.createElement(object_list_editor_1.ObjectListEditor, null)))) : null,
                this.state.attributeViewMaximized ? (React.createElement(components_1.FloatingPanel, { scroll: true, peerGroup: "panels", title: "Attributes", onClose: () => this.setState({ attributeViewMaximized: false }) },
                    React.createElement(components_1.ErrorBoundary, null,
                        React.createElement(views_1.AttributePanel, { store: this.props.store })))) : null,
                this.state.scaleViewMaximized ? (React.createElement(components_1.FloatingPanel, { scroll: true, peerGroup: "panels", title: "Scales", onClose: () => this.setState({ scaleViewMaximized: false }) },
                    React.createElement(components_1.ErrorBoundary, null,
                        React.createElement(scales_panel_1.ScalesPanel, { store: this.props.store })))) : null),
            React.createElement(controllers_1.PopupContainer, { controller: globals.popupController }),
            React.createElement(controllers_1.DragStateView, { controller: globals.dragController })));
    }
}
MainView.childContextTypes = {
    store: (s) => s instanceof stores_1.AppStore
};
exports.MainView = MainView;
//# sourceMappingURL=main_view.js.map