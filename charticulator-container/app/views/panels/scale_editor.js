"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
const React = require("react");
const R = require("../../resources");
const actions_1 = require("../../actions");
const components_1 = require("../../components");
const stores_1 = require("../../stores");
const manager_1 = require("./widgets/manager");
class ScaleEditor extends React.Component {
    componentDidMount() {
        this.token = this.props.store.addListener(stores_1.AppStore.EVENT_GRAPHICS, () => {
            this.forceUpdate();
        });
    }
    componentWillUnmount() {
        this.token.remove();
    }
    render() {
        const { scale, store } = this.props;
        const scaleClass = store.chartManager.getClassById(scale._id);
        const manager = new manager_1.WidgetManager(this.props.store, scaleClass);
        manager.onEditMappingHandler = (attribute, mapping) => {
            new actions_1.Actions.SetScaleAttribute(scale, attribute, mapping).dispatch(store.dispatcher);
        };
        let canAddLegend = true;
        if (scale.classID.startsWith("scale.format")) {
            canAddLegend = false;
        }
        return (React.createElement("div", { className: "scale-editor-view", style: { width: "400px", padding: "10px" } },
            React.createElement("div", { className: "attribute-editor" },
                React.createElement("section", { className: "attribute-editor-element" },
                    React.createElement("div", { className: "header" },
                        React.createElement(components_1.EditableTextView, { text: scale.properties.name, onEdit: newText => {
                                new actions_1.Actions.SetObjectProperty(scale, "name", null, newText, true).dispatch(store.dispatcher);
                            } })),
                    manager.vertical(...scaleClass.getAttributePanelWidgets(manager)),
                    canAddLegend ? (React.createElement("div", { className: "action-buttons" },
                        React.createElement(components_1.ButtonRaised, { url: R.getSVGIcon("legend/legend"), text: store.isLegendExistForScale(scale._id)
                                ? "Remove Legend"
                                : "Add Legend", onClick: () => {
                                new actions_1.Actions.ToggleLegendForScale(scale._id).dispatch(store.dispatcher);
                            } }))) : null))));
    }
}
exports.ScaleEditor = ScaleEditor;
//# sourceMappingURL=scale_editor.js.map