"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const R = require("../../resources");
const globals = require("../../globals");
const core_1 = require("../../../core");
const actions_1 = require("../../actions");
const renderer_1 = require("../../renderer");
const stores_1 = require("../../stores");
const controls_1 = require("../panels/widgets/controls");
const manager_1 = require("../panels/widgets/manager");
const bounding_box_1 = require("./bounding_box");
const creating_component_1 = require("./creating_component");
const dropzone_1 = require("./dropzone");
const editing_link_1 = require("./editing_link");
const handles_1 = require("./handles");
const snapping_1 = require("./snapping");
class ChartEditorView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            zoom: {
                centerX: 50,
                centerY: 50,
                scale: 1
            },
            snappingCandidates: null,
            graphics: this.getGraphics(),
            currentCreation: null,
            currentSelection: this.props.store.currentSelection,
            dropZoneData: false,
            viewWidth: 100,
            viewHeight: 100,
            isSolving: false
        };
        this.tokens = [];
    }
    getRelativePoint(point) {
        const r = this.refs.canvas.getBoundingClientRect();
        return {
            x: point.x - r.left,
            y: point.y - r.top
        };
    }
    getFitViewZoom(width, height) {
        const chartState = this.props.store.chartState;
        const x1 = chartState.attributes.x1;
        const y1 = chartState.attributes.y1;
        const x2 = chartState.attributes.x2;
        const y2 = chartState.attributes.y2;
        const cx = (x1 + x2) / 2;
        const cy = (y1 + y2) / 2;
        const overshoot = 0.4;
        const scale1 = width / (Math.abs(x2 - x1) * (1 + overshoot));
        const scale2 = height / (Math.abs(y2 - y1) * (1 + overshoot));
        const zoom = {
            centerX: width / 2,
            centerY: height / 2,
            scale: Math.min(scale1, scale2)
        };
        return zoom;
    }
    componentDidMount() {
        this.hammer = new Hammer(this.refs.canvasInteraction);
        this.hammer.add(new Hammer.Tap());
        const pan = new Hammer.Pan();
        const pinch = new Hammer.Pinch();
        pinch.recognizeWith(pan);
        this.hammer.add([pinch]);
        this.hammer.on("tap", () => {
            new actions_1.Actions.ClearSelection().dispatch(this.props.store.dispatcher);
        });
        let cX = null, cY = 0, cScale = 0;
        let dX0, dY0;
        let fixPoint = null;
        let lastDeltaX, lastDeltaY;
        let lastEventScale = 1;
        this.hammer.on("pinchstart panstart", e => {
            fixPoint = core_1.Geometry.unapplyZoom(this.state.zoom, this.getRelativePoint({ x: e.center.x, y: e.center.y }));
            cX = this.state.zoom.centerX;
            cY = this.state.zoom.centerY;
            cScale = this.state.zoom.scale;
            dX0 = 0;
            dY0 = 0;
            lastDeltaX = 0;
            lastDeltaY = 0;
            lastEventScale = 1;
        });
        this.hammer.on("pinch pan", e => {
            if (e.type == "pan") {
                e.scale = lastEventScale;
            }
            lastEventScale = e.scale;
            let newScale = cScale * e.scale;
            newScale = Math.min(20, Math.max(0.05, newScale));
            this.setState({
                zoom: {
                    centerX: cX + e.deltaX - dX0 + (cScale - newScale) * fixPoint.x,
                    centerY: cY + e.deltaY - dY0 + (cScale - newScale) * fixPoint.y,
                    scale: newScale
                }
            });
            lastDeltaX = e.deltaX;
            lastDeltaY = e.deltaY;
        });
        this.refs.canvas.onwheel = e => {
            const fixPoint = core_1.Geometry.unapplyZoom(this.state.zoom, this.getRelativePoint({ x: e.pageX, y: e.pageY }));
            const { centerX, centerY, scale } = this.state.zoom;
            let delta = -e.deltaY;
            if (e.deltaMode == e.DOM_DELTA_LINE) {
                delta *= 33.3;
            }
            let newScale = scale * Math.exp(delta / 1000);
            newScale = Math.min(20, Math.max(0.05, newScale));
            this.setState({
                zoom: {
                    centerX: centerX + (scale - newScale) * fixPoint.x,
                    centerY: centerY + (scale - newScale) * fixPoint.y,
                    scale: newScale
                }
            });
            cX = this.state.zoom.centerX;
            cY = this.state.zoom.centerY;
            dX0 = lastDeltaX;
            dY0 = lastDeltaY;
            cScale = this.state.zoom.scale;
            e.stopPropagation();
            e.preventDefault();
        };
        globals.dragController.registerDroppable(this, this.refs.canvas);
        this.tokens.push(this.props.store.addListener(stores_1.AppStore.EVENT_GRAPHICS, this.updateGraphics.bind(this)));
        this.tokens.push(this.props.store.addListener(stores_1.AppStore.EVENT_SELECTION, this.updateSelection.bind(this)));
        this.tokens.push(this.props.store.addListener(stores_1.AppStore.EVENT_CURRENT_TOOL, () => {
            this.setState({
                currentCreation: this.props.store.currentTool,
                currentCreationOptions: this.props.store.currentToolOptions
            });
        }));
        // We display the working icon after 200ms.
        let newStateTimer = null;
        this.tokens.push(this.props.store.addListener(stores_1.AppStore.EVENT_SOLVER_STATUS, () => {
            const newState = this.props.store.solverStatus.solving;
            if (newState) {
                if (!newStateTimer) {
                    newStateTimer = setTimeout(() => {
                        this.setState({ isSolving: true });
                    }, 500);
                }
            }
            else {
                if (newStateTimer) {
                    clearTimeout(newStateTimer);
                    newStateTimer = null;
                }
                this.setState({ isSolving: false });
            }
        }));
        const doResize = () => {
            const rect = this.refs.canvasContainer.getBoundingClientRect();
            const width = rect.width;
            const height = rect.height;
            this.setState({
                viewWidth: width,
                viewHeight: height,
                zoom: this.getFitViewZoom(width, height)
            });
        };
        globals.resizeListeners.addListener(this.refs.canvasContainer, doResize);
        doResize();
        this.tokens.push(globals.dragController.addListener("sessionstart", () => {
            const session = globals.dragController.getSession();
            if (session && session.data instanceof actions_1.DragData.DropZoneData) {
                this.setState({
                    dropZoneData: { data: session.data }
                });
            }
        }));
        this.tokens.push(globals.dragController.addListener("sessionend", () => {
            this.setState({
                dropZoneData: false
            });
        }));
    }
    componentWillUnmount() {
        this.hammer.destroy();
        this.tokens.forEach(t => t.remove());
        globals.dragController.unregisterDroppable(this);
    }
    onDragEnter(ctx) {
        new actions_1.Actions.SetCurrentTool(null).dispatch(this.props.store.dispatcher);
        const data = ctx.data;
        if (data instanceof actions_1.DragData.ScaffoldType) {
            this.setState({
                dropZoneData: { layout: data }
            });
            ctx.onLeave(() => {
                this.setState({
                    dropZoneData: false
                });
            });
            return true;
        }
        return false;
    }
    getGraphics() {
        const renderer = new core_1.Graphics.ChartRenderer(this.props.store.chartManager);
        return renderer.render();
    }
    updateSelection() {
        this.setState({ currentSelection: this.props.store.currentSelection });
    }
    updateGraphics() {
        this.setState({ graphics: this.getGraphics() });
    }
    renderGraphics() {
        return React.createElement(renderer_1.GraphicalElementDisplay, { element: this.state.graphics });
    }
    renderEditingLink() {
        const store = this.props.store;
        if (store.currentSelection instanceof stores_1.ChartElementSelection) {
            const element = store.currentSelection.chartElement;
            if (core_1.Prototypes.isType(element.classID, "links")) {
                return (React.createElement(editing_link_1.EditingLink, { width: this.state.viewWidth, height: this.state.viewHeight, zoom: this.state.zoom, store: store, link: element }));
            }
        }
        return null;
    }
    renderCreatingComponent() {
        if (this.state.currentCreation == null) {
            return null;
        }
        const metadata = core_1.Prototypes.ObjectClasses.GetMetadata(this.state.currentCreation);
        if (metadata && metadata.creatingInteraction) {
            const classID = this.state.currentCreation;
            const options = this.state.currentCreationOptions;
            return (React.createElement(creating_component_1.CreatingComponentFromCreatingInteraction, { width: this.state.viewWidth, height: this.state.viewHeight, zoom: this.state.zoom, guides: this.getSnappingGuides(), description: metadata.creatingInteraction, onCreate: (mappings, attributes) => {
                    new actions_1.Actions.SetCurrentTool(null).dispatch(this.props.store.dispatcher);
                    const opt = JSON.parse(options);
                    for (const key in opt) {
                        if (opt.hasOwnProperty(key)) {
                            attributes[key] = opt[key];
                        }
                    }
                    new actions_1.Actions.AddChartElement(classID, mappings, attributes).dispatch(this.props.store.dispatcher);
                }, onCancel: () => {
                    new actions_1.Actions.SetCurrentTool(null).dispatch(this.props.store.dispatcher);
                } }));
        }
        else {
            let onCreate = null;
            let mode = "point";
            // Make sure a < b:
            function autoSwap(a, b) {
                if (a[0] < b[0]) {
                    return [a, b];
                }
                else {
                    return [b, a];
                }
            }
            switch (this.state.currentCreation) {
                case "guide-x":
                    {
                        mode = "vline";
                        onCreate = x => {
                            new actions_1.Actions.AddChartElement("guide.guide", { value: x }, { axis: "x" }).dispatch(this.props.store.dispatcher);
                        };
                    }
                    break;
                case "guide-y":
                    {
                        mode = "hline";
                        onCreate = y => {
                            new actions_1.Actions.AddChartElement("guide.guide", { value: y }, { axis: "y" }).dispatch(this.props.store.dispatcher);
                        };
                    }
                    break;
                case "guide-coordinator-x":
                    {
                        mode = "line";
                        onCreate = (x1, y1, x2, y2) => {
                            new actions_1.Actions.AddChartElement("guide.guide-coordinator", { x1, y1, x2, y2 }, { axis: "x", count: 4 }).dispatch(this.props.store.dispatcher);
                        };
                    }
                    break;
                case "guide-coordinator-y":
                    {
                        mode = "line";
                        onCreate = (x1, y1, x2, y2) => {
                            new actions_1.Actions.AddChartElement("guide.guide-coordinator", { x1, y1, x2, y2 }, { axis: "y", count: 4 }).dispatch(this.props.store.dispatcher);
                        };
                    }
                    break;
            }
            return (React.createElement(creating_component_1.CreatingComponent, { width: this.state.viewWidth, height: this.state.viewHeight, zoom: this.state.zoom, mode: mode, key: mode, guides: this.getSnappingGuides(), onCreate: (...args) => {
                    new actions_1.Actions.SetCurrentTool(null).dispatch(this.props.store.dispatcher);
                    // let newArgs = args.map(([value, mapping]) => {
                    //     return [value, mapping || { type: "value", value: value } as Specification.ValueMapping]
                    // }) as [number, Specification.Mapping][];
                    if (onCreate) {
                        onCreate(...args);
                    }
                }, onCancel: () => {
                    new actions_1.Actions.SetCurrentTool(null).dispatch(this.props.store.dispatcher);
                } }));
        }
    }
    renderBoundsGuides() {
        // let chartClass = this.props.store.chartManager.getChartClass(this.props.store.chartState);
        // let boundsGuides = chartClass.getSnappingGuides();
        return this.getSnappingGuides().map((info, idx) => {
            const theGuide = info.guide;
            if (theGuide.visible) {
                if (theGuide.type == "x") {
                    const guide = theGuide;
                    return (React.createElement("line", { className: "mark-guide", key: `k${idx}`, x1: guide.value * this.state.zoom.scale + this.state.zoom.centerX, x2: guide.value * this.state.zoom.scale + this.state.zoom.centerX, y1: 0, y2: this.state.viewHeight }));
                }
                if (theGuide.type == "y") {
                    const guide = theGuide;
                    return (React.createElement("line", { className: "mark-guide", key: `k${idx}`, x1: 0, x2: this.state.viewWidth, y1: -guide.value * this.state.zoom.scale + this.state.zoom.centerY, y2: -guide.value * this.state.zoom.scale + this.state.zoom.centerY }));
                }
            }
        });
    }
    getSnappingGuides() {
        const chartClass = this.props.store.chartManager.getChartClass(this.props.store.chartState);
        const boundsGuides = chartClass.getSnappingGuides();
        let chartGuides = boundsGuides.map(bounds => {
            return {
                element: null,
                guide: bounds
            };
        });
        const elements = this.props.store.chart.elements;
        const elementStates = this.props.store.chartState.elements;
        core_1.zipArray(elements, elementStates).forEach(([layout, layoutState], index) => {
            const layoutClass = this.props.store.chartManager.getChartElementClass(layoutState);
            chartGuides = chartGuides.concat(layoutClass.getSnappingGuides().map(bounds => {
                return {
                    element: layout,
                    guide: bounds
                };
            }));
        });
        return chartGuides;
    }
    renderChartHandles() {
        const chartClass = this.props.store.chartManager.getChartClass(this.props.store.chartState);
        const handles = chartClass.getHandles();
        return handles.map((handle, index) => {
            return (React.createElement(handles_1.HandlesView, { key: `m${index}`, handles: handles, zoom: this.state.zoom, active: false, onDragStart: (bound, ctx) => {
                    const session = new snapping_1.MoveSnappingSession(bound);
                    ctx.onDrag(e => {
                        session.handleDrag(e);
                    });
                    ctx.onEnd(e => {
                        const updates = session.getUpdates(session.handleEnd(e));
                        if (updates) {
                            for (const name in updates) {
                                if (!updates.hasOwnProperty(name)) {
                                    continue;
                                }
                                new actions_1.Actions.SetChartAttribute(name, {
                                    type: "value",
                                    value: updates[name]
                                }).dispatch(this.props.store.dispatcher);
                            }
                        }
                    });
                } }));
        });
    }
    renderMarkHandlesInPlotSegment(plotSegment, plotSegmentState) {
        const bboxViews = [];
        const cs = this.props.store.chartManager
            .getPlotSegmentClass(plotSegmentState)
            .getCoordinateSystem();
        const glyph = core_1.getById(this.props.store.chart.glyphs, plotSegment.glyph);
        plotSegmentState.glyphs.forEach((glyphState, glyphIndex) => {
            const offsetX = glyphState.attributes.x;
            const offsetY = glyphState.attributes.y;
            glyphState.marks.forEach((markState, markIndex) => {
                const mark = glyph.marks[markIndex];
                const markClass = this.props.store.chartManager.getMarkClass(markState);
                const bbox = markClass.getBoundingBox();
                let isMarkSelected = false;
                if (this.props.store.currentSelection instanceof stores_1.MarkSelection) {
                    if (this.props.store.currentSelection.plotSegment == plotSegment &&
                        this.props.store.currentSelection.glyph == glyph &&
                        this.props.store.currentSelection.mark == mark) {
                        if (glyphIndex ==
                            this.props.store.getSelectedGlyphIndex(plotSegment._id)) {
                            isMarkSelected = true;
                        }
                    }
                }
                if (bbox) {
                    bboxViews.push(React.createElement(bounding_box_1.BoundingBoxView, { key: glyphIndex + "/" + markIndex, boundingBox: bbox, coordinateSystem: cs, offset: { x: offsetX, y: offsetY }, zoom: this.state.zoom, active: isMarkSelected, onClick: () => {
                            new actions_1.Actions.SelectMark(plotSegment, glyph, mark, glyphIndex).dispatch(this.props.store.dispatcher);
                        } }));
                }
            });
        });
        return React.createElement("g", null, bboxViews);
    }
    renderLayoutHandles() {
        const elements = this.props.store.chart.elements;
        const elementStates = this.props.store.chartState.elements;
        // if (this.props.store.currentSelection instanceof MarkSelection) {
        //     return (
        //         <g>
        //             {zipArray(elements, elementStates).map(([element, elementState]) => {
        //                 if (Prototypes.isType(element.classID, "plot-segment")) {
        //                     return <g key={element._id}>{this.renderMarkHandlesInPlotSegment(element as Specification.PlotSegment, elementState as Specification.PlotSegmentState)}</g>;
        //                 } else {
        //                     return null;
        //                 }
        //             })}
        //         </g>
        //     );
        // }
        return core_1.stableSortBy(core_1.zipArray(elements, elementStates), x => {
            const [layout, layoutState] = x;
            const shouldRenderHandles = this.state.currentSelection instanceof stores_1.ChartElementSelection &&
                this.state.currentSelection.chartElement == layout;
            return shouldRenderHandles ? 1 : 0;
        }).map(([layout, layoutState], index) => {
            const layoutClass = this.props.store.chartManager.getChartElementClass(layoutState);
            // Render handles if the chart element is selected
            const shouldRenderHandles = this.state.currentSelection instanceof stores_1.ChartElementSelection &&
                this.state.currentSelection.chartElement == layout;
            const bbox = layoutClass.getBoundingBox();
            if (!shouldRenderHandles) {
                if (bbox) {
                    const bboxView = (React.createElement(bounding_box_1.BoundingBoxView, { key: layout._id, boundingBox: bbox, zoom: this.state.zoom, onClick: () => {
                            new actions_1.Actions.SelectChartElement(layout, null).dispatch(this.props.store.dispatcher);
                        } }));
                    if (core_1.Prototypes.isType(layout.classID, "plot-segment")) {
                        return (React.createElement("g", { key: layout._id },
                            this.renderMarkHandlesInPlotSegment(layout, layoutState),
                            bboxView));
                    }
                    else {
                        return bboxView;
                    }
                }
            }
            const handles = layoutClass.getHandles();
            return (React.createElement("g", { key: `m${layout._id}` },
                bbox ? (React.createElement(bounding_box_1.BoundingBoxView, { zoom: this.state.zoom, boundingBox: bbox, active: true })) : null,
                core_1.Prototypes.isType(layout.classID, "plot-segment")
                    ? this.renderMarkHandlesInPlotSegment(layout, layoutState)
                    : null,
                React.createElement(handles_1.HandlesView, { handles: handles, zoom: this.state.zoom, active: false, visible: shouldRenderHandles, isAttributeSnapped: attribute => {
                        if (layout.mappings[attribute] != null) {
                            return true;
                        }
                        for (const constraint of this.props.store.chart.constraints) {
                            if (constraint.type == "snap") {
                                if (constraint.attributes.element == layout._id &&
                                    constraint.attributes.attribute == attribute) {
                                    return true;
                                }
                                if (constraint.attributes.targetElement == layout._id &&
                                    constraint.attributes.targetAttribute == attribute) {
                                    return true;
                                }
                            }
                        }
                        return false;
                    }, onDragStart: (handle, ctx) => {
                        const guides = this.getSnappingGuides();
                        const session = new snapping_1.ChartSnappingSession(guides, layout, handle, 10 / this.state.zoom.scale);
                        ctx.onDrag(e => {
                            session.handleDrag(e);
                            this.setState({
                                snappingCandidates: session.getCurrentCandidates()
                            });
                        });
                        ctx.onEnd(e => {
                            this.setState({
                                snappingCandidates: null
                            });
                            const action = session.getActions(session.handleEnd(e));
                            if (action) {
                                action.forEach(a => a.dispatch(this.props.store.dispatcher));
                            }
                        });
                    } })));
        });
    }
    renderHandles() {
        return (React.createElement("g", null,
            this.renderChartHandles(),
            this.renderLayoutHandles()));
    }
    renderControls() {
        const elements = this.props.store.chart.elements;
        const elementStates = this.props.store.chartState.elements;
        return (React.createElement("div", { className: "canvas-popups" }, core_1.zipArray(elements, elementStates)
            .filter(([element, elementState]) => core_1.Prototypes.isType(element.classID, "plot-segment"))
            .map(([layout, layoutState], index) => {
            if (this.state.currentSelection instanceof stores_1.ChartElementSelection &&
                this.state.currentSelection.chartElement == layout) {
                const layoutClass = this.props.store.chartManager.getPlotSegmentClass(layoutState);
                const manager = new manager_1.WidgetManager(this.props.store, layoutClass);
                const controls = layoutClass.getPopupEditor(manager);
                if (!controls) {
                    return null;
                }
                const pt = core_1.Geometry.applyZoom(this.state.zoom, {
                    x: controls.anchor.x,
                    y: -controls.anchor.y
                });
                return (React.createElement("div", { className: "charticulator__canvas-popup", key: `m${index}`, style: {
                        left: pt.x.toFixed(0) + "px",
                        bottom: (this.state.viewHeight - pt.y + 5).toFixed(0) + "px"
                    } }, manager.horizontal(controls.widgets.map(x => 0), ...controls.widgets)));
            }
        })));
    }
    renderSnappingGuides() {
        const guides = this.state.snappingCandidates;
        if (!guides || guides.length == 0) {
            return null;
        }
        return guides.map((guide, idx) => {
            const key = `m${idx}`;
            switch (guide.guide.type) {
                case "x": {
                    const axisGuide = guide.guide;
                    return (React.createElement("line", { key: key, className: "snapping-guide", x1: axisGuide.value * this.state.zoom.scale +
                            this.state.zoom.centerX, x2: axisGuide.value * this.state.zoom.scale +
                            this.state.zoom.centerX, y1: 0, y2: this.state.viewHeight }));
                }
                case "y": {
                    const axisGuide = guide.guide;
                    return (React.createElement("line", { key: key, className: "snapping-guide", y1: -axisGuide.value * this.state.zoom.scale +
                            this.state.zoom.centerY, y2: -axisGuide.value * this.state.zoom.scale +
                            this.state.zoom.centerY, x1: 0, x2: this.state.viewWidth }));
                }
            }
        });
    }
    renderChartCanvas() {
        const chartState = this.props.store.chartState;
        const p1 = {
            x: -chartState.attributes.width / 2,
            y: -chartState.attributes.height / 2
        };
        const p2 = {
            x: +chartState.attributes.width / 2,
            y: +chartState.attributes.height / 2
        };
        const p1t = core_1.Geometry.applyZoom(this.state.zoom, p1);
        const p2t = core_1.Geometry.applyZoom(this.state.zoom, p2);
        return (React.createElement("g", null,
            React.createElement("rect", { className: "canvas-region-outer2", x: Math.min(p1t.x, p2t.x) - 3, y: Math.min(p1t.y, p2t.y) - 3, width: Math.abs(p2t.x - p1t.x) + 6, height: Math.abs(p2t.y - p1t.y) + 6 }),
            React.createElement("rect", { className: "canvas-region-outer", x: Math.min(p1t.x, p2t.x) - 1, y: Math.min(p1t.y, p2t.y) - 1, width: Math.abs(p2t.x - p1t.x) + 2, height: Math.abs(p2t.y - p1t.y) + 2 }),
            React.createElement("rect", { className: "canvas-region", x: Math.min(p1t.x, p2t.x), y: Math.min(p1t.y, p2t.y), width: Math.abs(p2t.x - p1t.x), height: Math.abs(p2t.y - p1t.y) }),
            React.createElement(handles_1.ResizeHandleView, { zoom: this.state.zoom, cx: (p1.x + p2.x) / 2, cy: (p1.y + p2.y) / 2, width: Math.abs(p2.x - p1.x), height: Math.abs(p2.y - p1.y), onResize: (newWidth, newHeight) => {
                    new actions_1.Actions.SetChartSize(newWidth, newHeight).dispatch(this.props.store.dispatcher);
                } })));
    }
    renderDropZoneForMarkLayout(layout, state) {
        const cls = this.props.store.chartManager.getPlotSegmentClass(state);
        return cls
            .getDropZones()
            .filter(zone => {
            // We don't allow scale data mapping right now
            if (zone.dropAction.scaleInference) {
                return false;
            }
            if (this.state.dropZoneData) {
                // Process dropzone filter
                if (zone.accept) {
                    if (zone.accept.table != null) {
                        if (this.state.dropZoneData.data instanceof actions_1.DragData.DataExpression) {
                            const data = this.state.dropZoneData
                                .data;
                            if (data.table.name != zone.accept.table) {
                                return false;
                            }
                        }
                        else {
                            return false;
                        }
                    }
                    if (zone.accept.kind != null) {
                    }
                    if (zone.accept.scaffolds) {
                        if (this.state.dropZoneData.layout) {
                            return (zone.accept.scaffolds.indexOf(this.state.dropZoneData.layout.type) >= 0);
                        }
                        else {
                            return false;
                        }
                    }
                    return true;
                }
                else {
                    return (this.state.dropZoneData.data instanceof actions_1.DragData.DataExpression);
                }
            }
            else {
                return false;
            }
        })
            .map((zone, idx) => (React.createElement(dropzone_1.DropZoneView, { key: `m${idx}`, onDragEnter: (data) => {
                const dropAction = zone.dropAction;
                if (dropAction.axisInference) {
                    return (point) => {
                        new actions_1.Actions.BindDataToAxis(layout, dropAction.axisInference.property, dropAction.axisInference.appendToProperty, data).dispatch(this.props.store.dispatcher);
                        return true;
                    };
                }
                if (dropAction.extendPlotSegment) {
                    return (point) => {
                        new actions_1.Actions.ExtendPlotSegment(layout, data.type).dispatch(this.props.store.dispatcher);
                        return true;
                    };
                }
            }, zone: zone, zoom: this.state.zoom })));
    }
    renderDropZones() {
        const { chart, chartState } = this.props.store;
        if (!this.state.dropZoneData) {
            return null;
        }
        return (React.createElement("g", null, core_1.zipArray(chart.elements, chartState.elements)
            .filter(([e, eS]) => core_1.Prototypes.isType(e.classID, "plot-segment"))
            .map(([layout, layoutState]) => {
            return (React.createElement("g", { key: `m${layout._id}` }, this.renderDropZoneForMarkLayout(layout, layoutState)));
        })));
    }
    render() {
        const { store } = this.props;
        const width = this.state.viewWidth;
        const height = this.state.viewHeight;
        const transform = `translate(${this.state.zoom.centerX},${this.state.zoom.centerY}) scale(${this.state.zoom.scale})`;
        return (React.createElement("div", { className: "chart-editor-view" },
            React.createElement("div", { className: "chart-editor-canvas-view", ref: "canvasContainer" },
                React.createElement("svg", { className: "canvas-view", ref: "canvas", x: 0, y: 0, width: width, height: height },
                    React.createElement("rect", { className: "interaction-handler", ref: "canvasInteraction", x: 0, y: 0, width: width, height: height }),
                    this.renderChartCanvas(),
                    this.renderBoundsGuides(),
                    React.createElement("g", { className: "graphics", transform: transform }, this.renderGraphics()),
                    this.renderSnappingGuides(),
                    this.renderHandles(),
                    this.renderDropZones(),
                    this.renderEditingLink(),
                    this.renderCreatingComponent()),
                this.renderControls()),
            React.createElement("div", { className: "canvas-controls" },
                React.createElement("div", { className: "canvas-controls-left" }),
                React.createElement("div", { className: "canvas-controls-right" },
                    React.createElement(controls_1.Button, { icon: "general/zoom-in", onClick: () => {
                            const { scale, centerX, centerY } = this.state.zoom;
                            const fixPoint = core_1.Geometry.unapplyZoom(this.state.zoom, {
                                x: this.state.viewWidth / 2,
                                y: this.state.viewHeight / 2
                            });
                            let newScale = scale * 1.1;
                            newScale = Math.min(20, Math.max(0.05, newScale));
                            this.setState({
                                zoom: {
                                    centerX: centerX + (scale - newScale) * fixPoint.x,
                                    centerY: centerY + (scale - newScale) * fixPoint.y,
                                    scale: newScale
                                }
                            });
                        } }),
                    React.createElement(controls_1.Button, { icon: "general/zoom-out", onClick: () => {
                            const { scale, centerX, centerY } = this.state.zoom;
                            const fixPoint = core_1.Geometry.unapplyZoom(this.state.zoom, {
                                x: this.state.viewWidth / 2,
                                y: this.state.viewHeight / 2
                            });
                            let newScale = scale / 1.1;
                            newScale = Math.min(20, Math.max(0.05, newScale));
                            this.setState({
                                zoom: {
                                    centerX: centerX + (scale - newScale) * fixPoint.x,
                                    centerY: centerY + (scale - newScale) * fixPoint.y,
                                    scale: newScale
                                }
                            });
                        } }),
                    React.createElement(controls_1.Button, { icon: "general/zoom-auto", onClick: () => {
                            const newZoom = this.getFitViewZoom(this.state.viewWidth, this.state.viewHeight);
                            if (!newZoom) {
                                return;
                            }
                            this.setState({
                                zoom: newZoom
                            });
                        } }))),
            this.state.isSolving ? (React.createElement("div", { className: "solving-hint" },
                React.createElement("div", { className: "el-box" },
                    React.createElement("img", { src: R.getSVGIcon("loading") }),
                    "Working..."))) : null));
    }
}
exports.ChartEditorView = ChartEditorView;
//# sourceMappingURL=chart_editor.js.map