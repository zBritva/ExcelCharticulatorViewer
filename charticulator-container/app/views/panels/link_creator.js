"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
const React = require("react");
const R = require("../../resources");
const core_1 = require("../../../core");
const actions_1 = require("../../actions");
const components_1 = require("../../components");
const context_component_1 = require("../../context_component");
const utils_1 = require("../../utils");
const data_field_selector_1 = require("../dataset/data_field_selector");
const object_list_editor_1 = require("./object_list_editor");
class LinkCreationPanel extends context_component_1.ContextedComponent {
    constructor() {
        super(...arguments);
        this.state = this.getDefaultState();
    }
    getDefaultState() {
        let plotSegments = this.store.chart.elements;
        plotSegments = plotSegments.filter(x => core_1.Prototypes.isType(x.classID, "plot-segment"));
        const selectedPlotSegments = plotSegments.map(x => x._id);
        let linkMode = "link-through";
        if (selectedPlotSegments.length == 1) {
            linkMode = this.isLinkDataPresent() ? "link-table" : "link-through";
        }
        else {
            linkMode = "link-between";
        }
        return {
            linkType: "line",
            linkMode,
            plotSegments,
            selectedPlotSegments,
            errorReport: null
        };
    }
    isLinkDataPresent() {
        return this.store.dataset.tables.length > 1;
    }
    render() {
        return (React.createElement("div", { className: "charticulator__link-type-table" },
            React.createElement("div", { className: "el-row" },
                React.createElement("h2", null, "Link using:"),
                React.createElement(PanelRadioControl, { options: ["line", "band"], icons: ["link/line", "link/band"], labels: ["Line", "Band"], value: this.state.linkType, onChange: (newValue) => this.setState({ linkType: newValue }), showText: true })),
            this.state.plotSegments.length > 1 ? (React.createElement("div", { className: "el-row" },
                React.createElement("h2", null, "Plot Segment(s):"),
                React.createElement(PlotSegmentSelector, { items: this.state.plotSegments, defaultSelection: this.state.selectedPlotSegments, onChange: newSelection => {
                        let linkMode = this.state.linkMode;
                        if (newSelection.length == 1) {
                            linkMode = this.isLinkDataPresent()
                                ? "link-table"
                                : "link-through";
                        }
                        else {
                            linkMode = "link-between";
                        }
                        this.setState({
                            linkMode,
                            selectedPlotSegments: newSelection
                        });
                    } }))) : null,
            this.state.selectedPlotSegments.length == 1 &&
                this.isLinkDataPresent() ? (React.createElement("div", { className: "el-row" },
                React.createElement("h2", null, "Link Mode:"),
                React.createElement(PanelRadioControl, { options: ["link-through", "link-table"], icons: ["link/through", "link/table"], labels: ["Sequentially", "By Link Data"], value: this.state.linkMode, onChange: newValue => this.setState({ linkMode: newValue }), showText: true, asList: true }))) : null,
            this.state.linkMode == "link-through" ? (React.createElement("div", null,
                React.createElement("h2", null, "Connect by:"),
                React.createElement("div", { className: "el-row" },
                    React.createElement(data_field_selector_1.DataFieldSelector, { ref: e => (this.groupBySelector = e), kinds: [core_1.Specification.DataKind.Categorical], datasetStore: this.store, nullDescription: "(link all items)" })))) : null,
            React.createElement("div", { className: "el-row" },
                React.createElement(components_1.ButtonRaised, { text: "Create Links", onClick: () => {
                        const links = this.getLinkObject();
                        if (links != null) {
                            this.dispatch(new actions_1.Actions.AddLinks(links));
                            if (this.props.onFinish) {
                                this.props.onFinish();
                            }
                        }
                        else {
                            this.setState({
                                errorReport: "Cannot Create Link!"
                            });
                        }
                    } }),
                this.state.errorReport ? (React.createElement("span", null, this.state.errorReport)) : null)));
    }
    getDefaultAnchor(manager, linkMode, cs, glyph1, glyphState1, glyph2, glyphState2) {
        // Default color and opacity
        let color;
        let opacity;
        switch (this.state.linkType) {
            case "line":
                {
                    color = {
                        type: "value",
                        value: { r: 0, g: 0, b: 0 }
                    };
                    opacity = { type: "value", value: 1 };
                }
                break;
            case "band":
                {
                    color = {
                        type: "value",
                        value: { r: 0, g: 0, b: 0 }
                    };
                    opacity = { type: "value", value: 0.5 };
                }
                break;
        }
        // Get anchor candidates
        let candidates1 = [];
        let candidates2 = [];
        for (const mark of glyphState1.marks) {
            const c = manager.getMarkClass(mark);
            candidates1 = candidates1.concat(c.getLinkAnchors("begin"));
        }
        for (const mark of glyphState2.marks) {
            const c = manager.getMarkClass(mark);
            candidates2 = candidates2.concat(c.getLinkAnchors("end"));
        }
        // Filter based on link type
        switch (this.state.linkType) {
            case "line":
                {
                    candidates1 = candidates1.filter(x => x.points.length == 1);
                    candidates2 = candidates2.filter(x => x.points.length == 1);
                }
                break;
            case "band": {
                candidates1 = candidates1.filter(x => x.points.length == 2);
                candidates2 = candidates2.filter(x => x.points.length == 2);
            }
        }
        const glyphAttributes1 = glyphState1.attributes;
        const glyphAttributes2 = glyphState2.attributes;
        const determineRelationship = (a1, a2, b1, b2) => {
            // Make sure order is correct
            [a1, a2] = [Math.min(a1, a2), Math.max(a1, a2)];
            [b1, b2] = [Math.min(b1, b2), Math.max(b1, b2)];
            if (a2 <= b1) {
                return "after";
            }
            else if (a1 >= b2) {
                return "before";
            }
            else {
                return "overlap";
            }
        };
        // Determine relative position
        const xRelationship = determineRelationship(glyphAttributes1.x1, glyphAttributes1.x2, glyphAttributes2.x1, glyphAttributes2.x2);
        const yRelationship = determineRelationship(glyphAttributes1.y1, glyphAttributes1.y2, glyphAttributes2.y1, glyphAttributes2.y2);
        const meanPoint = (points) => {
            let x = 0, y = 0;
            for (const pt of points) {
                x += pt.x;
                y += pt.y;
            }
            return {
                x: x / points.length,
                y: y / points.length
            };
        };
        let c1 = null, c2 = null;
        if (xRelationship == "after") {
            if (linkMode == "link-table") {
                c1 = candidates1[core_1.argMin(candidates1, c => meanPoint(c.points).y)];
                c2 = candidates2[core_1.argMin(candidates2, c => meanPoint(c.points).y)];
            }
            else {
                c1 = candidates1[core_1.argMax(candidates1, c => meanPoint(c.points).x)];
                c2 = candidates2[core_1.argMin(candidates2, c => meanPoint(c.points).x)];
            }
        }
        else if (xRelationship == "before") {
            if (linkMode == "link-table") {
                c1 = candidates1[core_1.argMin(candidates1, c => meanPoint(c.points).y)];
                c2 = candidates2[core_1.argMin(candidates2, c => meanPoint(c.points).y)];
            }
            else {
                c1 = candidates1[core_1.argMin(candidates1, c => meanPoint(c.points).x)];
                c2 = candidates2[core_1.argMax(candidates2, c => meanPoint(c.points).x)];
            }
        }
        else {
            if (yRelationship == "after") {
                if (linkMode == "link-table") {
                    c1 = candidates1[core_1.argMin(candidates1, c => meanPoint(c.points).x)];
                    c2 = candidates2[core_1.argMin(candidates2, c => meanPoint(c.points).x)];
                }
                else {
                    c1 = candidates1[core_1.argMax(candidates1, c => meanPoint(c.points).y)];
                    c2 = candidates2[core_1.argMin(candidates2, c => meanPoint(c.points).y)];
                }
            }
            else if (yRelationship == "before") {
                if (linkMode == "link-table") {
                    c1 = candidates1[core_1.argMin(candidates1, c => meanPoint(c.points).x)];
                    c2 = candidates2[core_1.argMin(candidates2, c => meanPoint(c.points).x)];
                }
                else {
                    c1 = candidates1[core_1.argMin(candidates1, c => meanPoint(c.points).y)];
                    c2 = candidates2[core_1.argMax(candidates2, c => meanPoint(c.points).y)];
                }
            }
            else {
                c1 =
                    candidates1[core_1.argMin(candidates1, c => Math.abs(meanPoint(c.points).y))];
                c2 =
                    candidates2[core_1.argMin(candidates2, c => Math.abs(meanPoint(c.points).y))];
            }
        }
        switch (this.state.linkType) {
            case "line":
                {
                    if (c1 == null) {
                        c1 = {
                            element: null,
                            points: [
                                {
                                    xAttribute: "icx",
                                    yAttribute: "icy",
                                    x: 0,
                                    y: 0,
                                    direction: { x: 0, y: 0 }
                                }
                            ]
                        };
                    }
                    if (c2 == null) {
                        c2 = {
                            element: null,
                            points: [
                                {
                                    xAttribute: "icx",
                                    yAttribute: "icy",
                                    x: 0,
                                    y: 0,
                                    direction: { x: 0, y: 0 }
                                }
                            ]
                        };
                    }
                }
                break;
            case "band":
                {
                    if (c1 == null) {
                        c1 = {
                            element: null,
                            points: [
                                {
                                    xAttribute: "icx",
                                    yAttribute: "iy1",
                                    x: 0,
                                    y: 0,
                                    direction: { x: 1, y: 0 }
                                },
                                {
                                    xAttribute: "icx",
                                    yAttribute: "iy2",
                                    x: 0,
                                    y: 0,
                                    direction: { x: 1, y: 0 }
                                }
                            ]
                        };
                    }
                    if (c2 == null) {
                        c2 = {
                            element: null,
                            points: [
                                {
                                    xAttribute: "icx",
                                    yAttribute: "iy1",
                                    x: 0,
                                    y: 0,
                                    direction: { x: -1, y: 0 }
                                },
                                {
                                    xAttribute: "icx",
                                    yAttribute: "iy2",
                                    x: 0,
                                    y: 0,
                                    direction: { x: -1, y: 0 }
                                }
                            ]
                        };
                    }
                }
                break;
        }
        const anchor1 = c1.points.map(pt => {
            return {
                x: { element: c1.element, attribute: pt.xAttribute },
                y: { element: c1.element, attribute: pt.yAttribute },
                direction: pt.direction
            };
        });
        const anchor2 = c2.points.map(pt => {
            return {
                x: { element: c2.element, attribute: pt.xAttribute },
                y: { element: c2.element, attribute: pt.yAttribute },
                direction: pt.direction
            };
        });
        if (linkMode != "link-table") {
            if (c1.element != null) {
                const element1 = core_1.getById(glyph1.marks, c1.element);
                switch (element1.classID) {
                    case "mark.symbol":
                        {
                            if (element1.mappings.fill != null) {
                                color = element1.mappings.fill;
                            }
                        }
                        break;
                    case "mark.rect":
                        {
                            if (element1.mappings.fill != null) {
                                color = element1.mappings.fill;
                            }
                        }
                        break;
                }
            }
        }
        let interpolationType = "line";
        if (cs instanceof core_1.Graphics.PolarCoordinates) {
            interpolationType = "bezier";
        }
        else {
            interpolationType = "line";
        }
        // If directions are the same direction, switch line to circle.
        if (core_1.Geometry.vectorDot(anchor1[0].direction, anchor2[0].direction) > 0) {
            if (interpolationType == "line") {
                interpolationType = "circle";
            }
        }
        return {
            linkType: this.state.linkType,
            interpolationType,
            anchor1,
            anchor2,
            color,
            opacity
        };
    }
    getLinkObject() {
        const manager = this.store.chartManager;
        let defaultColor;
        let defaultOpacity;
        switch (this.state.linkType) {
            case "line":
                {
                    defaultColor = { type: "value", value: { r: 0, g: 0, b: 0 } };
                    defaultOpacity = { type: "value", value: 0.5 };
                }
                break;
            case "band":
                {
                    defaultColor = { type: "value", value: { r: 0, g: 0, b: 0 } };
                    defaultOpacity = { type: "value", value: 0.5 };
                }
                break;
        }
        const plotSegmentIDs = this.state.selectedPlotSegments;
        const plotSegmentClasses = plotSegmentIDs.map(x => manager.getClassById(x));
        const glyphs = plotSegmentClasses.map(c => manager.getObjectById(c.object.glyph));
        switch (this.state.linkMode) {
            case "link-through": {
                // Find the first pair of glyphs
                const plotSegmentClass = plotSegmentClasses[0];
                const glyph = glyphs[0];
                const facetBy = this.groupBySelector
                    ? this.groupBySelector.value
                        ? [this.groupBySelector.value.expression]
                        : []
                    : [];
                const facets = core_1.Prototypes.Links.facetRows(manager.dataflow.getTable(plotSegmentClass.object.table), plotSegmentClass.state.dataRowIndices, facetBy.map(x => manager.dataflow.cache.parse(x)));
                const layoutState = plotSegmentClass.state;
                const rowToMarkState = new Map();
                for (let i = 0; i < layoutState.dataRowIndices.length; i++) {
                    rowToMarkState.set(layoutState.dataRowIndices[i].join(","), layoutState.glyphs[i]);
                }
                const { linkType, interpolationType, anchor1, anchor2, color, opacity } = this.getDefaultAnchor(manager, "link-through", plotSegmentClass.getCoordinateSystem(), glyph, rowToMarkState.get(facets[0][0].join(",")), glyph, rowToMarkState.get(facets[0][1].join(",")));
                const links = {
                    _id: core_1.uniqueID(),
                    classID: "links.through",
                    mappings: {
                        color,
                        opacity
                    },
                    properties: {
                        name: "Link",
                        linkMarkType: "",
                        visible: true,
                        linkType,
                        interpolationType,
                        anchor1,
                        anchor2,
                        linkThrough: {
                            plotSegment: this.state.selectedPlotSegments[0],
                            facetExpressions: facetBy
                        },
                        curveness: 30
                    }
                };
                return links;
            }
            case "link-between": {
                // Find the first pair of glyphs
                const firstGlyphs = plotSegmentClasses.map(x => x.state.glyphs[0]);
                const { linkType, interpolationType, anchor1, anchor2, color, opacity } = this.getDefaultAnchor(manager, "link-between", new core_1.Graphics.CartesianCoordinates(), glyphs[0], firstGlyphs[0], glyphs[1], firstGlyphs[1]);
                const links = {
                    _id: core_1.uniqueID(),
                    classID: "links.between",
                    mappings: {
                        color,
                        opacity
                    },
                    properties: {
                        name: "Link",
                        linkMarkType: "",
                        visible: true,
                        linkType,
                        interpolationType,
                        anchor1,
                        anchor2,
                        linkBetween: {
                            plotSegments: plotSegmentIDs
                        },
                        curveness: 30
                    }
                };
                return links;
            }
            case "link-table": {
                // Find the first pair of glyphs
                const firstGlyphs = plotSegmentClasses[0].state.glyphs;
                const { linkType, interpolationType, anchor1, anchor2, color, opacity } = this.getDefaultAnchor(manager, "link-table", plotSegmentClasses[0].getCoordinateSystem(), glyphs[0], firstGlyphs[0], glyphs[0], firstGlyphs[1]);
                const links = {
                    _id: core_1.uniqueID(),
                    classID: "links.table",
                    mappings: {
                        color,
                        opacity
                    },
                    properties: {
                        name: "Link",
                        linkMarkType: "",
                        visible: true,
                        linkType,
                        interpolationType,
                        anchor1,
                        anchor2,
                        linkTable: {
                            table: this.store.dataset.tables[1].name,
                            plotSegments: [
                                plotSegmentClasses[0].object._id,
                                plotSegmentClasses[0].object._id
                            ]
                        },
                        curveness: 30
                    }
                };
                return links;
            }
        }
    }
}
exports.LinkCreationPanel = LinkCreationPanel;
class PlotSegmentSelector extends context_component_1.ContextedComponent {
    constructor() {
        super(...arguments);
        this.state = this.getInitialState();
    }
    getInitialState() {
        const plotSegments = this.props.items;
        return {
            order: plotSegments.map(x => x._id),
            selection: this.props.defaultSelection || plotSegments.map(x => x._id)
        };
    }
    notify() {
        if (this.props.onChange) {
            this.props.onChange(this.state.selection);
        }
    }
    render() {
        return (React.createElement("div", { className: "charticulator__plot-segment-selector charticulator-panel-list-view is-list" },
            React.createElement(object_list_editor_1.ReorderListView, { enabled: true, onReorder: (a, b) => {
                    const newOrder = this.state.order.slice();
                    object_list_editor_1.ReorderListView.ReorderArray(newOrder, a, b);
                    const newSelection = this.state.order.filter(x => this.state.selection.indexOf(x) >= 0);
                    this.setState({
                        order: newOrder,
                        selection: newSelection
                    }, () => this.notify());
                } }, this.state.order.map(id => {
                const item = core_1.getById(this.props.items, id);
                return (React.createElement("div", { key: id, className: utils_1.classNames("el-item", [
                        "is-active",
                        this.state.selection.indexOf(id) >= 0
                    ]), onClick: e => {
                        if (e.shiftKey) {
                            const newSelection = this.state.order.filter(x => x == id || this.state.selection.indexOf(x) >= 0);
                            this.setState({
                                selection: newSelection
                            }, () => this.notify());
                        }
                        else {
                            this.setState({
                                selection: [id]
                            }, () => this.notify());
                        }
                    } },
                    React.createElement(components_1.SVGImageIcon, { url: R.getSVGIcon(core_1.Prototypes.ObjectClasses.GetMetadata(item.classID).iconPath) }),
                    React.createElement("span", { className: "el-text" }, item.properties.name)));
            }))));
    }
}
exports.PlotSegmentSelector = PlotSegmentSelector;
class PanelRadioControl extends React.Component {
    render() {
        const mainClass = this.props.asList
            ? "charticulator-panel-list-view"
            : "charticulator-panel-list-view is-inline";
        return (React.createElement("span", { className: mainClass }, this.props.options.map((option, index) => {
            return (React.createElement("span", { className: utils_1.classNames("el-item", [
                    "is-active",
                    this.props.value == option
                ]), key: option, onClick: () => {
                    if (this.props) {
                        this.props.onChange(option);
                    }
                } },
                this.props.icons ? (React.createElement(components_1.SVGImageIcon, { url: R.getSVGIcon(this.props.icons[index]) })) : null,
                this.props.labels && this.props.showText ? (React.createElement("span", { className: "el-text" }, this.props.labels[index])) : null));
        })));
    }
}
exports.PanelRadioControl = PanelRadioControl;
//# sourceMappingURL=link_creator.js.map