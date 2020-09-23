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
const stores_1 = require("../../stores");
const utils_1 = require("../../utils");
const controls_1 = require("./widgets/controls");
class ObjectListEditor extends context_component_1.ContextedComponent {
    componentDidMount() {
        this.tokens = [];
        this.tokens.push(this.store.addListener(stores_1.AppStore.EVENT_GRAPHICS, () => this.forceUpdate()));
        this.tokens.push(this.store.addListener(stores_1.AppStore.EVENT_SELECTION, () => this.forceUpdate()));
    }
    componentWillUnmount() {
        for (const token of this.tokens) {
            token.remove();
        }
    }
    renderChart() {
        const chart = this.store.chart;
        const sel = this.store.currentSelection;
        return (React.createElement("div", null,
            React.createElement("div", { className: utils_1.classNames("el-object-item", ["is-active", sel == null]), onClick: () => {
                    this.dispatch(new actions_1.Actions.ClearSelection());
                } },
                React.createElement(components_1.SVGImageIcon, { url: R.getSVGIcon(core_1.Prototypes.ObjectClasses.GetMetadata(chart.classID).iconPath) }),
                React.createElement("span", { className: "el-text" }, chart.properties.name)),
            React.createElement(ReorderListView, { enabled: true, onReorder: (a, b) => {
                    this.dispatch(new actions_1.Actions.ReorderChartElement(a, b));
                } }, chart.elements.map(element => {
                return (React.createElement("div", { className: utils_1.classNames("el-object-item", [
                        "is-active",
                        sel instanceof stores_1.ChartElementSelection &&
                            sel.chartElement == element
                    ]), onClick: () => {
                        this.dispatch(new actions_1.Actions.SelectChartElement(element));
                    }, key: element._id },
                    React.createElement(components_1.SVGImageIcon, { url: R.getSVGIcon(core_1.Prototypes.ObjectClasses.GetMetadata(element.classID)
                            .iconPath) }),
                    React.createElement("span", { className: "el-text" }, element.properties.name),
                    React.createElement(controls_1.Button, { icon: element.properties.visible
                            ? "general/eye"
                            : "general/eye-faded", title: "Toggle visibility", active: false, onClick: () => {
                            this.dispatch(new actions_1.Actions.SetObjectProperty(element, "visible", null, !element.properties.visible, true));
                        } }),
                    React.createElement(controls_1.Button, { icon: "general/eraser", title: "Remove", active: false, onClick: () => {
                            this.dispatch(new actions_1.Actions.DeleteChartElement(element));
                        } })));
            }))));
    }
    renderGlyph(glyph) {
        const sel = this.store.currentSelection;
        return (React.createElement("div", { key: glyph._id },
            React.createElement("div", { className: utils_1.classNames("el-object-item", [
                    "is-active",
                    sel instanceof stores_1.GlyphSelection && sel.glyph == glyph
                ]), onClick: () => {
                    this.dispatch(new actions_1.Actions.SelectGlyph(null, glyph));
                } },
                React.createElement(components_1.SVGImageIcon, { url: R.getSVGIcon(core_1.Prototypes.ObjectClasses.GetMetadata(glyph.classID).iconPath) }),
                React.createElement("span", { className: "el-text" }, glyph.properties.name)),
            React.createElement(ReorderListView, { enabled: true, onReorder: (a, b) => {
                    this.dispatch(new actions_1.Actions.ReorderGlyphMark(glyph, a + 1, b + 1));
                } }, glyph.marks
                .filter(x => x.classID != "mark.anchor")
                .map(mark => {
                return (React.createElement("div", { className: utils_1.classNames("el-object-item", [
                        "is-active",
                        sel instanceof stores_1.MarkSelection &&
                            sel.glyph == glyph &&
                            sel.mark == mark
                    ]), key: mark._id, onClick: () => {
                        this.dispatch(new actions_1.Actions.SelectMark(null, glyph, mark));
                    } },
                    React.createElement(components_1.SVGImageIcon, { url: R.getSVGIcon(core_1.Prototypes.ObjectClasses.GetMetadata(mark.classID)
                            .iconPath) }),
                    React.createElement("span", { className: "el-text" }, mark.properties.name),
                    React.createElement(controls_1.Button, { icon: mark.properties.visible
                            ? "general/eye"
                            : "general/eye-faded", title: "Toggle visibility", active: false, onClick: () => {
                            this.dispatch(new actions_1.Actions.SetObjectProperty(mark, "visible", null, !mark.properties.visible, true));
                        } }),
                    React.createElement(controls_1.Button, { icon: "general/eraser", active: false, title: "Remove", onClick: () => {
                            this.dispatch(new actions_1.Actions.RemoveMarkFromGlyph(glyph, mark));
                        } })));
            }))));
    }
    render() {
        const chart = this.store.chart;
        return (React.createElement("div", { className: "charticulator__object-list-editor" },
            this.renderChart(),
            chart.glyphs.map(glyph => this.renderGlyph(glyph))));
    }
}
exports.ObjectListEditor = ObjectListEditor;
class ReorderListView extends React.Component {
    constructor(props) {
        super(props);
        this.container2Index = new WeakMap();
        this.index2Container = new Map();
        this.state = {
            reordering: false,
            dragIndex: null,
            dropIndex: null
        };
    }
    getItemAtPoint(x, y) {
        let el = document.elementFromPoint(x, y);
        while (el) {
            if (this.container2Index.has(el)) {
                const bbox = el.getBoundingClientRect();
                const ratio = (y - bbox.top) / bbox.height;
                return [this.container2Index.get(el), ratio];
            }
            el = el.parentElement;
        }
        // Couldn't find
        let minY = null, maxY = null, minIndex = null, maxIndex = null;
        for (const [index, element] of this.index2Container.entries()) {
            const bbox = element.getBoundingClientRect();
            if (minY == null || minY > bbox.top) {
                minY = bbox.top;
                minIndex = index;
            }
            if (maxY == null || maxY < bbox.top + bbox.height) {
                maxY = bbox.top + bbox.height;
                maxIndex = index;
            }
        }
        if (y < minY) {
            return [minIndex, 0];
        }
        if (y > maxY) {
            return [maxIndex, 1];
        }
        return null;
    }
    componentDidMount() {
        if (!this.props.enabled) {
            return;
        }
        const hammer = new Hammer(this.container);
        this.hammer = hammer;
        hammer.add(new Hammer.Pan());
        hammer.on("panstart", e => {
            const cx = e.center.x - e.deltaX;
            const cy = e.center.y - e.deltaY;
            const item = this.getItemAtPoint(cx, cy);
            if (item != null) {
                this.setState({
                    reordering: true,
                    dragIndex: item[0],
                    dropIndex: item
                });
            }
        });
        hammer.on("pan", e => {
            const cx = e.center.x;
            const cy = e.center.y;
            const item = this.getItemAtPoint(cx, cy);
            this.setState({
                reordering: true,
                dropIndex: item
            });
        });
        hammer.on("panend", e => {
            if (!this.state.reordering || !this.state.dropIndex) {
                return;
            }
            const from = this.state.dragIndex;
            const to = this.state.dropIndex[0] + (this.state.dropIndex[1] > 0.5 ? 1 : 0);
            this.setState({
                reordering: false,
                dragIndex: null,
                dropIndex: null
            });
            this.props.onReorder(from, to);
        });
    }
    componentWillUnmount() {
        if (this.hammer) {
            this.hammer.destroy();
        }
    }
    render() {
        return (React.createElement("div", { className: "charticulator__reorder-list-view", ref: e => (this.container = e) }, React.Children.map(this.props.children, (item, index) => {
            return (React.createElement("div", { className: "charticulator__reorder-list-view-item", ref: e => {
                    if (e) {
                        this.container2Index.set(e, index);
                        this.index2Container.set(index, e);
                    }
                    else {
                        this.index2Container.delete(index);
                    }
                } },
                item,
                this.state.reordering &&
                    this.state.dropIndex &&
                    this.state.dropIndex[0] == index ? (React.createElement("div", { className: utils_1.classNames("charticulator__reorder-list-view-item-hint", ["is-top", this.state.dropIndex[1] < 0.5]) })) : null,
                this.state.reordering && this.state.dragIndex == index ? (React.createElement("div", { className: "charticulator__reorder-list-view-item-drag-hint" })) : null));
        })));
    }
    static ReorderArray(array, dragIndex, dropIndex) {
        const x = array.splice(dragIndex, 1)[0];
        if (dragIndex < dropIndex) {
            array.splice(dropIndex - 1, 0, x);
        }
        else {
            array.splice(dropIndex, 0, x);
        }
    }
}
exports.ReorderListView = ReorderListView;
//# sourceMappingURL=object_list_editor.js.map