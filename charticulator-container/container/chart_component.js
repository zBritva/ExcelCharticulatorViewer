"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
const React = require("react");
const core_1 = require("../core");
const renderer_1 = require("../app/renderer");
/** A React component that manages a sub-chart */
class ChartComponent extends React.Component {
    constructor(props) {
        super(props);
        this.recreateManager(props);
        this.updateWithNewProps(props);
        if (props.sync) {
            this.manager.solveConstraints();
            this.state = {
                working: false,
                graphics: this.renderer.render()
            };
        }
        else {
            this.state = {
                working: true,
                graphics: null
            };
            this.scheduleUpdate();
        }
    }
    applySelection(selection) {
        this.manager.enumeratePlotSegments(cls => {
            for (const [rowIndices, glyphState] of core_1.zip(cls.state.dataRowIndices, cls.state.glyphs)) {
                if (selection == null) {
                    glyphState.emphasized = true;
                }
                else {
                    glyphState.emphasized = selection.isSelected(cls.object.table, rowIndices);
                }
            }
        });
    }
    componentWillReceiveProps(newProps) {
        if (this.updateWithNewProps(newProps)) {
            this.setState({ working: true });
            this.scheduleUpdate();
        }
        else if (newProps.selection != this.props.selection) {
            this.applySelection(newProps.selection);
            this.setState({
                graphics: this.renderer.render()
            });
        }
    }
    isEqual(a, b) {
        if (a == b) {
            return true;
        }
        return JSON.stringify(a) == JSON.stringify(b);
    }
    updateWithNewProps(newProps) {
        let changed = false;
        if (!this.isEqual(newProps.chart, this.props.chart)) {
            this.recreateManager(newProps);
            changed = true;
        }
        else if (!this.isEqual(newProps.dataset, this.props.dataset)) {
            this.manager.setDataset(newProps.dataset);
            changed = true;
        }
        else if (!this.isEqual(newProps.defaultAttributes, this.props.defaultAttributes)) {
            this.recreateManager(newProps);
            changed = true;
        }
        if (!this.manager.chart.mappings.width ||
            newProps.width !=
                this.manager.chart.mappings.width.value) {
            this.manager.chart.mappings.width = {
                type: "value",
                value: newProps.width
            };
            changed = true;
        }
        if (!this.manager.chart.mappings.height ||
            newProps.height !=
                this.manager.chart.mappings.height.value) {
            this.manager.chart.mappings.height = {
                type: "value",
                value: newProps.height
            };
            changed = true;
        }
        return changed;
    }
    recreateManager(props) {
        this.manager = new core_1.Prototypes.ChartStateManager(core_1.deepClone(props.chart), props.dataset, null, props.defaultAttributes);
        this.renderer = new core_1.Graphics.ChartRenderer(this.manager);
    }
    scheduleUpdate() {
        if (this.timer) {
            clearTimeout(this.timer);
        }
        this.timer = setTimeout(() => {
            this.timer = null;
            this.manager.solveConstraints();
            this.applySelection(this.props.selection);
            this.setState({
                working: false,
                graphics: this.renderer.render()
            });
        }, 10);
    }
    getProperty(objectID, property) {
        const obj = core_1.Prototypes.findObjectById(this.manager.chart, objectID);
        if (!obj) {
            return null;
        }
        return core_1.Prototypes.getProperty(obj, property);
    }
    setProperty(objectID, property, value) {
        const obj = core_1.Prototypes.findObjectById(this.manager.chart, objectID);
        if (!obj) {
            return;
        }
        if (!this.isEqual(core_1.Prototypes.getProperty(obj, property), value)) {
            core_1.Prototypes.setProperty(obj, property, core_1.deepClone(value));
            this.setState({ working: true });
            this.scheduleUpdate();
        }
    }
    getAttributeMapping(objectID, attribute) {
        const obj = core_1.Prototypes.findObjectById(this.manager.chart, objectID);
        if (!obj) {
            return null;
        }
        return obj.mappings[attribute];
    }
    setAttributeMapping(objectID, attribute, mapping) {
        const obj = core_1.Prototypes.findObjectById(this.manager.chart, objectID);
        if (!obj) {
            return;
        }
        if (!this.isEqual(obj.mappings[attribute], mapping)) {
            obj.mappings[attribute] = core_1.deepClone(mapping);
            this.setState({ working: true });
            this.scheduleUpdate();
        }
    }
    convertGlyphEventHandler(handler) {
        if (handler == null) {
            return null;
        }
        return (element, event) => {
            const rowIndices = element.rowIndices;
            const modifiers = {
                ctrlKey: event.ctrlKey,
                shiftKey: event.shiftKey,
                metaKey: event.metaKey,
                clientX: event.clientX,
                clientY: event.clientY,
                event
            };
            handler({ table: element.plotSegment.table, rowIndices }, modifiers);
        };
    }
    render() {
        const renderOptions = Object.assign({}, this.props.rendererOptions);
        renderOptions.onClick = this.convertGlyphEventHandler(this.props.onGlyphClick);
        renderOptions.onMouseEnter = this.convertGlyphEventHandler(this.props.onGlyphMouseEnter);
        renderOptions.onMouseLeave = this.convertGlyphEventHandler(this.props.onGlyphMouseLeave);
        renderOptions.onContextMenu = this.convertGlyphEventHandler(this.props.onGlyphContextMenuClick);
        renderOptions.selection = this.props.selection;
        const gfx = renderer_1.renderGraphicalElementSVG(this.state.graphics, renderOptions);
        const inner = (React.createElement("g", { transform: `translate(${this.props.width / 2}, ${this.props.height /
                2})` },
            this.props.onGlyphClick ? (React.createElement("rect", { x: -this.props.width / 2, y: -this.props.height / 2, width: this.props.width, height: this.props.height, style: {
                    fill: "none",
                    pointerEvents: "all",
                    stroke: "none"
                }, onClick: () => {
                    this.props.onGlyphClick(null, null);
                } })) : null,
            gfx,
            this.state.working ? (React.createElement("rect", { x: -this.props.width / 2, y: -this.props.height / 2, width: this.props.width, height: this.props.height, style: {
                    fill: "rgba(0, 0, 0, 0.1)",
                    stroke: "none"
                } })) : null));
        switch (this.props.rootElement) {
            case "svg": {
                return (React.createElement("svg", { x: 0, y: 0, width: this.props.width, height: this.props.height, className: this.props.className, style: {
                        userSelect: "none"
                    } }, inner));
            }
            case "g": {
                return React.createElement("g", { className: this.props.className }, inner);
            }
        }
    }
}
exports.ChartComponent = ChartComponent;
//# sourceMappingURL=chart_component.js.map