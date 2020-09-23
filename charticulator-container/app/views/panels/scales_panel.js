"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
const React = require("react");
const R = require("../../resources");
const core_1 = require("../../../core");
const components_1 = require("../../components");
const stores_1 = require("../../stores");
const object_list_editor_1 = require("./object_list_editor");
const context_component_1 = require("../../context_component");
function getObjectIcon(classID) {
    return R.getSVGIcon(core_1.Prototypes.ObjectClasses.GetMetadata(classID).iconPath || "object");
}
class ScalesPanel extends context_component_1.ContextedComponent {
    componentDidMount() {
        this.tokens = [
            this.store.addListener(stores_1.AppStore.EVENT_GRAPHICS, () => this.forceUpdate()),
            this.store.addListener(stores_1.AppStore.EVENT_SELECTION, () => this.forceUpdate()),
            this.store.addListener(stores_1.AppStore.EVENT_SAVECHART, () => this.forceUpdate())
        ];
    }
    componentWillUnmount() {
        this.tokens.forEach(token => token.remove());
        this.tokens = [];
    }
    renderUnexpectedState(message) {
        return (React.createElement("div", { className: "attribute-editor charticulator__widget-container" },
            React.createElement("div", { className: "attribute-editor-unexpected" }, message)));
    }
    getPropertyDisplayName(name) {
        return name[0].toUpperCase() + name.slice(1);
    }
    render() {
        const store = this.props.store;
        let scales = store.chart.scales;
        const elementFilterPredicate = (scaleID) => (element) => {
            return (Object.keys(element.mappings).find(key => {
                const mapping = element.mappings[key];
                return (mapping.type === "scale" &&
                    mapping.scale === scaleID);
            }) != undefined);
        };
        const elementFilterList = (scaleID, element) => {
            return Object.keys(element.mappings).filter(key => {
                const mapping = element.mappings[key];
                return (mapping.type === "scale" &&
                    mapping.scale === scaleID);
            });
        };
        const mapToUI = (scaleID) => (element) => (key) => {
            return (React.createElement("div", { className: "el-object-item", key: scaleID + "_" + element._id + "_" + key },
                React.createElement(components_1.SVGImageIcon, { url: R.getSVGIcon(core_1.Prototypes.ObjectClasses.GetMetadata(element.classID).iconPath) }),
                React.createElement("span", { className: "el-text" }, `${element.properties.name}.${this.getPropertyDisplayName(key)}`)));
        };
        scales = scales.sort((a, b) => {
            const lengthA = store.chart.elements.filter(elementFilterPredicate(a._id)).length +
                store.chart.glyphs
                    .flatMap((glyph) => glyph.marks)
                    .filter(elementFilterPredicate(a._id)).length;
            const lengthB = store.chart.elements.filter(elementFilterPredicate(b._id)).length +
                store.chart.glyphs
                    .flatMap((glyph) => glyph.marks)
                    .filter(elementFilterPredicate(b._id)).length;
            return lengthA > lengthB ? -1 : lengthB > lengthA ? 1 : 0;
        });
        return (React.createElement("div", { className: "charticulator__object-list-editor" }, scales.map(scale => {
            return (React.createElement("div", { key: scale._id },
                React.createElement("div", { key: scale._id, className: "el-object-item" },
                    React.createElement(components_1.SVGImageIcon, { url: R.getSVGIcon(core_1.Prototypes.ObjectClasses.GetMetadata(scale.classID).iconPath) }),
                    React.createElement("span", { className: "el-text" }, scale.properties.name)),
                React.createElement(object_list_editor_1.ReorderListView, { enabled: true, onReorder: (a, b) => { } },
                    store.chart.elements
                        .filter(elementFilterPredicate(scale._id))
                        .flatMap((element) => {
                        return elementFilterList(scale._id, element).map(mapToUI(scale._id)(element));
                    }),
                    store.chart.glyphs
                        .flatMap((glyph) => glyph.marks)
                        .filter(elementFilterPredicate(scale._id))
                        .flatMap((element) => {
                        return elementFilterList(scale._id, element).map(mapToUI(scale._id)(element));
                    }))));
        })));
    }
}
exports.ScalesPanel = ScalesPanel;
//# sourceMappingURL=scales_panel.js.map