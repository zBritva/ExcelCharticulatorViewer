"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
const React = require("react");
const R = require("../../resources");
const core_1 = require("../../../core");
const actions_1 = require("../../actions");
const components_1 = require("../../components");
const stores_1 = require("../../stores");
const manager_1 = require("./widgets/manager");
function getObjectIcon(classID) {
    return R.getSVGIcon(core_1.Prototypes.ObjectClasses.GetMetadata(classID).iconPath || "object");
}
class AttributePanel extends React.Component {
    constructor() {
        super(...arguments);
        this.tokens = [];
    }
    componentDidMount() {
        this.tokens.push(this.props.store.addListener(stores_1.AppStore.EVENT_GRAPHICS, () => {
            this.forceUpdate();
        }));
        this.tokens.push(this.props.store.addListener(stores_1.AppStore.EVENT_SELECTION, () => {
            this.forceUpdate();
        }));
    }
    componentWillUnmount() {
        this.tokens.forEach(token => token.remove());
        this.tokens = [];
    }
    renderUnexpectedState(message) {
        return (React.createElement("div", { className: "attribute-editor charticulator__widget-container" },
            React.createElement("div", { className: "attribute-editor-unexpected" }, message)));
    }
    render() {
        const selection = this.props.store.currentSelection;
        let object;
        let objectClass;
        let manager;
        if (selection) {
            if (selection instanceof stores_1.GlyphSelection) {
                if (!selection.plotSegment) {
                    return this.renderUnexpectedState("To edit this glyph, please create a plot segment with it.");
                }
                const glyph = selection.glyph;
                object = glyph;
                objectClass = this.props.store.chartManager.getGlyphClass(this.props.store.chartManager.findGlyphState(selection.plotSegment, selection.glyph, this.props.store.getSelectedGlyphIndex(selection.plotSegment._id)));
                manager = new manager_1.WidgetManager(this.props.store, objectClass);
                manager.onEditMappingHandler = (attribute, mapping) => {
                    new actions_1.Actions.SetGlyphAttribute(glyph, attribute, mapping).dispatch(this.props.store.dispatcher);
                };
            }
            if (selection instanceof stores_1.MarkSelection) {
                if (!selection.plotSegment) {
                    return this.renderUnexpectedState("To edit this glyph, please create a plot segment with it.");
                }
                const glyph = selection.glyph;
                const mark = selection.mark;
                object = mark;
                objectClass = this.props.store.chartManager.getMarkClass(this.props.store.chartManager.findMarkState(selection.plotSegment, selection.glyph, selection.mark, this.props.store.getSelectedGlyphIndex(selection.plotSegment._id)));
                manager = new manager_1.WidgetManager(this.props.store, objectClass);
                manager.onEditMappingHandler = (attribute, mapping) => {
                    new actions_1.Actions.SetMarkAttribute(glyph, mark, attribute, mapping).dispatch(this.props.store.dispatcher);
                };
                manager.onMapDataHandler = (attribute, data, hints) => {
                    new actions_1.Actions.MapDataToMarkAttribute(glyph, mark, attribute, objectClass.attributes[attribute].type, data.expression, data.valueType, data.metadata, hints).dispatch(this.props.store.dispatcher);
                };
            }
            if (selection instanceof stores_1.ChartElementSelection) {
                const markLayout = selection.chartElement;
                const layoutClass = this.props.store.chartManager.getClassById(markLayout._id);
                object = markLayout;
                objectClass = layoutClass;
                manager = new manager_1.WidgetManager(this.props.store, objectClass);
                manager.onEditMappingHandler = (attribute, mapping) => {
                    new actions_1.Actions.SetChartElementMapping(markLayout, attribute, mapping).dispatch(this.props.store.dispatcher);
                };
                manager.onMapDataHandler = (attribute, data, hints) => {
                    new actions_1.Actions.MapDataToChartElementAttribute(markLayout, attribute, objectClass.attributes[attribute].type, data.table.name, data.expression, data.valueType, data.metadata, hints).dispatch(this.props.store.dispatcher);
                };
            }
        }
        else {
            const chart = this.props.store.chart;
            const boundClass = this.props.store.chartManager.getChartClass(this.props.store.chartState);
            object = chart;
            objectClass = boundClass;
            manager = new manager_1.WidgetManager(this.props.store, objectClass);
            manager.onEditMappingHandler = (attribute, mapping) => {
                new actions_1.Actions.SetChartAttribute(attribute, mapping).dispatch(this.props.store.dispatcher);
            };
        }
        if (manager) {
            return (React.createElement("div", { className: "attribute-editor charticulator__widget-container" },
                React.createElement("section", { className: "attribute-editor-element", key: object._id },
                    React.createElement("div", { className: "header" },
                        React.createElement(components_1.SVGImageIcon, { url: getObjectIcon(object.classID) }),
                        React.createElement(components_1.EditableTextView, { text: object.properties.name, onEdit: newValue => {
                                new actions_1.Actions.SetObjectProperty(object, "name", null, newValue, true).dispatch(this.props.store.dispatcher);
                            } })),
                    manager.vertical(...objectClass.getAttributePanelWidgets(manager)))));
        }
    }
}
exports.AttributePanel = AttributePanel;
//# sourceMappingURL=attribute_panel.js.map