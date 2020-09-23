"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
const React = require("react");
const ReactDOM = require("react-dom");
const globals = require("../globals");
const R = require("../resources");
const actions_1 = require("../actions");
const components_1 = require("../components");
const context_component_1 = require("../context_component");
const controllers_1 = require("../controllers");
const file_view_1 = require("./file_view");
const stores_1 = require("../stores");
class HelpButton extends React.Component {
    render() {
        return (React.createElement(components_1.MenuButton, { url: R.getSVGIcon("toolbar/help"), title: "Help", ref: "helpButton", onClick: () => {
                globals.popupController.popupAt(context => {
                    return (React.createElement(controllers_1.PopupView, { context: context, className: "charticulator__menu-popup" },
                        React.createElement("div", { className: "charticulator__menu-dropdown", onClick: () => context.close() },
                            React.createElement("div", { className: "el-item" },
                                React.createElement("a", { target: "_blank", href: "https://charticulator.com/docs/getting-started.html" }, "Getting Started")),
                            React.createElement("div", { className: "el-item" },
                                React.createElement("a", { target: "_blank", href: "https://charticulator.com/gallery/index.html" }, "Example Gallery")),
                            React.createElement("div", { className: "el-item" },
                                React.createElement("a", { target: "_blank", href: "https://github.com/Microsoft/charticulator/issues/new" }, "Report an Issue")),
                            React.createElement("div", { className: "el-item" },
                                React.createElement("a", { target: "_blank", href: "https://charticulator.com/" }, "Charticulator Home")),
                            React.createElement("div", { className: "el-item" },
                                React.createElement("a", { href: "mailto:charticulator@microsoft.com" }, "Contact Us")),
                            React.createElement("div", { className: "el-item-version" },
                                "Version: ",
                                CHARTICULATOR_PACKAGE.version))));
                }, {
                    anchor: ReactDOM.findDOMNode(this.refs.helpButton),
                    alignX: "end-inner"
                });
            } }));
    }
}
exports.HelpButton = HelpButton;
class MenuBar extends context_component_1.ContextedComponent {
    constructor() {
        super(...arguments);
        this.keyboardMap = {
            "ctrl-z": "undo",
            "ctrl-y": "redo",
            "ctrl-s": "save",
            "ctrl-shift-s": "export",
            "ctrl-n": "new",
            "ctrl-o": "open",
            backspace: "delete",
            delete: "delete",
            escape: "escape"
        };
        this.onKeyDown = (e) => {
            if (e.target == document.body) {
                let prefix = "";
                if (e.shiftKey) {
                    prefix = "shift-" + prefix;
                }
                if (e.ctrlKey || e.metaKey) {
                    prefix = "ctrl-" + prefix;
                }
                const name = `${prefix}${e.key}`.toLowerCase();
                if (this.keyboardMap[name]) {
                    const command = this.keyboardMap[name];
                    switch (command) {
                        case "new":
                            {
                                this.showFileModalWindow("open");
                            }
                            break;
                        case "open":
                            {
                                this.showFileModalWindow("open");
                            }
                            break;
                        case "save":
                            {
                                if (this.context.store.isNestedEditor) {
                                    this.context.store.emit(stores_1.AppStore.EVENT_NESTED_EDITOR_EDIT);
                                }
                                else {
                                    if (this.context.store.currentChartID) {
                                        this.dispatch(new actions_1.Actions.Save());
                                    }
                                    else {
                                        this.showFileModalWindow("save");
                                    }
                                }
                            }
                            break;
                        case "export":
                            {
                                this.showFileModalWindow("export");
                            }
                            break;
                        case "undo":
                            {
                                new actions_1.Actions.Undo().dispatch(this.context.store.dispatcher);
                            }
                            break;
                        case "redo":
                            {
                                new actions_1.Actions.Redo().dispatch(this.context.store.dispatcher);
                            }
                            break;
                        case "delete":
                            {
                                this.store.deleteSelection();
                            }
                            break;
                        case "escape":
                            {
                                this.store.handleEscapeKey();
                            }
                            break;
                    }
                    e.preventDefault();
                }
            }
        };
    }
    componentDidMount() {
        window.addEventListener("keydown", this.onKeyDown);
        this.subs = this.context.store.addListener(stores_1.AppStore.EVENT_IS_NESTED_EDITOR, () => this.forceUpdate());
    }
    componentWillUnmount() {
        window.removeEventListener("keydown", this.onKeyDown);
        this.subs.remove();
    }
    hideFileModalWindow(defaultTab = "open") {
        globals.popupController.reset();
    }
    showFileModalWindow(defaultTab = "open") {
        if (this.context.store.disableFileView) {
            return;
        }
        globals.popupController.showModal(context => {
            return (React.createElement(controllers_1.ModalView, { context: context },
                React.createElement(file_view_1.FileView, { backend: this.context.store.backend, defaultTab: defaultTab, store: this.context.store, onClose: () => context.close() })));
        }, { anchor: null });
    }
    renderSaveNested() {
        return (React.createElement(components_1.MenuButton, { url: R.getSVGIcon("toolbar/save"), text: "Save Nested Chart", title: "Save (Ctrl-S)", onClick: () => {
                this.context.store.emit(stores_1.AppStore.EVENT_NESTED_EDITOR_EDIT);
            } }));
    }
    renderNewOpenSave() {
        return (React.createElement(React.Fragment, null,
            React.createElement(components_1.MenuButton, { url: R.getSVGIcon("toolbar/new"), title: "New (Ctrl-N)", onClick: () => {
                    this.showFileModalWindow("new");
                } }),
            React.createElement(components_1.MenuButton, { url: R.getSVGIcon("toolbar/open"), title: "Open (Ctrl-O)", onClick: () => {
                    this.showFileModalWindow("open");
                } }),
            React.createElement(components_1.MenuButton, { url: R.getSVGIcon("toolbar/save"), title: "Save (Ctrl-S)", onClick: () => {
                    if (this.context.store.currentChartID) {
                        this.dispatch(new actions_1.Actions.Save());
                    }
                    else {
                        this.showFileModalWindow("save");
                    }
                } }),
            React.createElement(components_1.MenuButton, { url: R.getSVGIcon("toolbar/export"), title: "Export", onClick: () => {
                    this.showFileModalWindow("export");
                } })));
    }
    render() {
        return (React.createElement("section", { className: "charticulator__menu-bar" },
            React.createElement("div", { className: "charticulator__menu-bar-left" },
                React.createElement(components_1.AppButton, { onClick: () => this.showFileModalWindow("open") }),
                React.createElement("span", { className: "charticulator__menu-bar-separator" }),
                this.context.store.isNestedEditor
                    ? this.renderSaveNested()
                    : this.renderNewOpenSave(),
                React.createElement("span", { className: "charticulator__menu-bar-separator" }),
                React.createElement(components_1.MenuButton, { url: R.getSVGIcon("toolbar/undo"), title: "Undo (Ctrl-Z)", onClick: () => new actions_1.Actions.Undo().dispatch(this.context.store.dispatcher) }),
                React.createElement(components_1.MenuButton, { url: R.getSVGIcon("toolbar/redo"), title: "Redo (Ctrl-Y)", onClick: () => new actions_1.Actions.Redo().dispatch(this.context.store.dispatcher) }),
                React.createElement("span", { className: "charticulator__menu-bar-separator" }),
                React.createElement(components_1.MenuButton, { url: R.getSVGIcon("toolbar/trash"), title: "Reset", onClick: () => {
                        if (confirm("Are you really willing to reset the chart?")) {
                            new actions_1.Actions.Reset().dispatch(this.context.store.dispatcher);
                        }
                    } })),
            React.createElement("div", { className: "charticulator__menu-bar-right" },
                React.createElement(HelpButton, null))));
    }
}
exports.MenuBar = MenuBar;
//# sourceMappingURL=menubar.js.map