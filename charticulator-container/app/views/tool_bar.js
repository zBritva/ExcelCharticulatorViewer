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
const utils_1 = require("../utils");
const link_creator_1 = require("./panels/link_creator");
const stores_1 = require("../stores");
class Toolbar extends context_component_1.ContextedComponent {
    componentDidMount() {
        this.token = this.store.addListener(stores_1.AppStore.EVENT_CURRENT_TOOL, () => {
            this.forceUpdate();
        });
    }
    componentWillUnmount() {
        this.token.remove();
    }
    render() {
        return (React.createElement("div", { className: "chartaccent__toolbar" },
            React.createElement("span", { className: "chartaccent__toolbar-label" }, "Marks"),
            React.createElement(MultiObjectButton, { tools: [
                    {
                        classID: "mark.rect",
                        title: "Rectangle",
                        icon: "mark/rect",
                        options: '{"shape":"rectangle"}'
                    },
                    {
                        classID: "mark.rect",
                        title: "Ellipse",
                        icon: "mark/ellipse",
                        options: '{"shape":"ellipse"}'
                    },
                    {
                        classID: "mark.rect",
                        title: "Triangle",
                        icon: "mark/triangle",
                        options: '{"shape":"triangle"}'
                    }
                ] }),
            React.createElement(ObjectButton, { classID: "mark.symbol", title: "Symbol", icon: "mark/symbol" }),
            React.createElement(ObjectButton, { classID: "mark.line", title: "Line", icon: "mark/line" }),
            React.createElement(MultiObjectButton, { tools: [
                    {
                        classID: "mark.text",
                        title: "Text",
                        icon: "mark/text"
                    },
                    {
                        classID: "mark.textbox",
                        title: "Textbox",
                        icon: "mark/textbox"
                    }
                ] }),
            React.createElement(MultiObjectButton, { tools: [
                    {
                        classID: "mark.icon",
                        title: "Icon",
                        icon: "mark/icon"
                    },
                    {
                        classID: "mark.image",
                        title: "Image",
                        icon: "mark/image"
                    }
                ] }),
            React.createElement("span", { className: "chartaccent__toolbar-separator" }),
            React.createElement(ObjectButton, { classID: "mark.data-axis", title: "Data Axis", icon: "mark/data-axis" }),
            React.createElement(ObjectButton, { classID: "mark.nested-chart", title: "Nested Chart", icon: "mark/nested-chart" }),
            React.createElement("span", { className: "chartaccent__toolbar-separator" }),
            React.createElement("span", { className: "chartaccent__toolbar-label" }, "Links"),
            React.createElement(LinkButton, null),
            React.createElement("span", { className: "chartaccent__toolbar-separator" }),
            React.createElement("span", { className: "chartaccent__toolbar-label" }, "Guides"),
            React.createElement(ObjectButton, { classID: "guide-y", title: "Guide Y", icon: "guide/x", noDragging: true }),
            React.createElement(ObjectButton, { classID: "guide-x", title: "Guide X", icon: "guide/y", noDragging: true }),
            React.createElement(ObjectButton, { classID: "guide-coordinator-y", title: "Guide Y", icon: "guide/coordinator-x", noDragging: true }),
            React.createElement(ObjectButton, { classID: "guide-coordinator-x", title: "Guide Y", icon: "guide/coordinator-y", noDragging: true }),
            React.createElement("span", { className: "chartaccent__toolbar-separator" }),
            React.createElement("span", { className: "chartaccent__toolbar-label" }, "Plot Segments"),
            React.createElement(ObjectButton, { classID: "plot-segment.cartesian", title: "2D Region", icon: "plot/region", noDragging: true }),
            React.createElement(ObjectButton, { classID: "plot-segment.line", title: "Line", icon: "plot/line", noDragging: true }),
            React.createElement("span", { className: "chartaccent__toolbar-separator" }),
            React.createElement("span", { className: "chartaccent__toolbar-label" }, "Scaffolds"),
            React.createElement(ScaffoldButton, { type: "cartesian-x", title: "Horizontal Line", icon: "scaffold/cartesian-x", currentTool: this.store.currentTool }),
            React.createElement(ScaffoldButton, { type: "cartesian-y", title: "Vertical Line", icon: "scaffold/cartesian-y", currentTool: this.store.currentTool }),
            React.createElement(ScaffoldButton, { type: "polar", title: "Polar", icon: "scaffold/circle", currentTool: this.store.currentTool }),
            React.createElement(ScaffoldButton, { type: "curve", title: "Custom Curve", icon: "scaffold/curve", currentTool: this.store.currentTool })));
    }
}
exports.Toolbar = Toolbar;
class ObjectButton extends context_component_1.ContextedComponent {
    getIsActive() {
        return (this.store.currentTool == this.props.classID &&
            this.store.currentToolOptions == this.props.options);
    }
    componentDidMount() {
        this.token = this.context.store.addListener(stores_1.AppStore.EVENT_CURRENT_TOOL, () => {
            this.forceUpdate();
        });
    }
    componentWillUnmount() {
        this.token.remove();
    }
    render() {
        return (React.createElement(components_1.ToolButton, { icon: R.getSVGIcon(this.props.icon), active: this.getIsActive(), title: this.props.title, onClick: () => {
                this.dispatch(new actions_1.Actions.SetCurrentTool(this.props.classID, this.props.options));
                if (this.props.onClick) {
                    this.props.onClick();
                }
            }, dragData: this.props.noDragging
                ? null
                : () => {
                    return new actions_1.DragData.ObjectType(this.props.classID, this.props.options);
                } }));
    }
}
exports.ObjectButton = ObjectButton;
class MultiObjectButton extends context_component_1.ContextedComponent {
    constructor() {
        super(...arguments);
        this.state = {
            currentSelection: {
                classID: this.props.tools[0].classID,
                options: this.props.tools[0].options
            }
        };
    }
    isActive() {
        const store = this.store;
        for (const item of this.props.tools) {
            if (item.classID == store.currentTool &&
                item.options == store.currentToolOptions) {
                return true;
            }
        }
        return false;
    }
    getSelectedTool() {
        for (const item of this.props.tools) {
            if (item.classID == this.state.currentSelection.classID &&
                item.options == this.state.currentSelection.options) {
                return item;
            }
        }
        return this.props.tools[0];
    }
    componentDidMount() {
        this.token = this.store.addListener(stores_1.AppStore.EVENT_CURRENT_TOOL, () => {
            for (const item of this.props.tools) {
                // If the tool is within the tools defined here, we update the current selection
                if (this.store.currentTool == item.classID &&
                    this.store.currentToolOptions == item.options) {
                    this.setState({
                        currentSelection: {
                            classID: item.classID,
                            options: item.options
                        }
                    });
                    break;
                }
            }
            this.forceUpdate();
        });
    }
    componentWillUnmount() {
        this.token.remove();
    }
    render() {
        return (React.createElement("div", { className: utils_1.classNames("charticulator__button-multi-tool", [
                "is-active",
                this.isActive()
            ]) },
            React.createElement(ObjectButton, Object.assign({ ref: e => (this.refButton = e) }, this.getSelectedTool())),
            React.createElement("span", { className: "el-dropdown", onClick: () => {
                    globals.popupController.popupAt(context => {
                        return (React.createElement(controllers_1.PopupView, { context: context }, this.props.tools.map((tool, index) => (React.createElement("div", { key: index, className: "charticulator__button-multi-tool-dropdown" },
                            React.createElement(ObjectButton, Object.assign({}, tool, { noDragging: true, onClick: () => context.close() })))))));
                    }, {
                        anchor: ReactDOM.findDOMNode(this.refButton),
                        alignX: "start-inner",
                        alignY: "end-outer"
                    });
                } },
                React.createElement(components_1.SVGImageIcon, { url: R.getSVGIcon("general/dropdown") }))));
    }
}
exports.MultiObjectButton = MultiObjectButton;
class ScaffoldButton extends context_component_1.ContextedComponent {
    render() {
        return (React.createElement(components_1.ToolButton, { icon: R.getSVGIcon(this.props.icon), active: this.props.currentTool == this.props.type, title: this.props.title, onClick: () => {
                // this.dispatch(new Actions.SetCurrentTool(this.props.type));
            }, dragData: () => {
                return new actions_1.DragData.ScaffoldType(this.props.type);
            } }));
    }
}
exports.ScaffoldButton = ScaffoldButton;
class LinkButton extends context_component_1.ContextedComponent {
    render() {
        return (React.createElement("span", { ref: e => (this.container = e) },
            React.createElement(components_1.ToolButton, { title: "Link", icon: R.getSVGIcon("link/tool"), active: this.store.currentTool == "link", onClick: () => {
                    globals.popupController.popupAt(context => (React.createElement(controllers_1.PopupView, { context: context },
                        React.createElement(link_creator_1.LinkCreationPanel, { onFinish: () => context.close() }))), { anchor: this.container });
                } })));
    }
}
exports.LinkButton = LinkButton;
class CheckboxButton extends React.Component {
    render() {
        return (React.createElement("span", { className: "chartaccent__toolbar-checkbox", onClick: () => {
                const nv = !this.props.value;
                if (this.props.onChange) {
                    this.props.onChange(nv);
                }
            } },
            React.createElement(components_1.SVGImageIcon, { url: R.getSVGIcon(this.props.value ? "checkbox/checked" : "checkbox/empty") }),
            React.createElement("span", { className: "el-label" }, this.props.text)));
    }
}
exports.CheckboxButton = CheckboxButton;
//# sourceMappingURL=tool_bar.js.map