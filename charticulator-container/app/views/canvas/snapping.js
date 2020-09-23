"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const actions_1 = require("../../actions");
class SnappingSession {
    constructor(guides, handle, threshold) {
        this.handle = handle;
        this.threshold = threshold;
        this.candidates = [];
        this.currentCandidates = null;
        switch (handle.type) {
            case "line":
                {
                    const lineHandle = handle;
                    // Get all guides
                    this.candidates = guides.filter(g => {
                        return g.guide.type == lineHandle.axis;
                    });
                }
                break;
            case "point":
                {
                    // Get all guides
                    this.candidates = guides.filter(g => {
                        return g.guide.type == "x" || g.guide.type == "y";
                    });
                }
                break;
        }
    }
    handleDrag(e) {
        const EPSILON = 1e-5;
        switch (this.handle.type) {
            case "line":
                {
                    let minGuide = null;
                    let minDistance = null;
                    for (const g of this.candidates) {
                        const guide = g.guide;
                        const d = Math.abs(guide.value - e.value);
                        if (d < this.threshold &&
                            (minDistance == null || d < minDistance - EPSILON)) {
                            minDistance = d;
                            minGuide = g;
                        }
                    }
                    if (minGuide) {
                        this.currentCandidates = [minGuide];
                    }
                    else {
                        this.currentCandidates = null;
                    }
                }
                break;
            case "point":
                {
                    let minXGuide = null;
                    let minXDistance = null;
                    let minYGuide = null;
                    let minYDistance = null;
                    for (const g of this.candidates) {
                        const guide = g.guide;
                        if (guide.type == "x") {
                            const d = Math.abs(guide.value - e.x);
                            if (d < this.threshold &&
                                (minXDistance == null || d < minXDistance - EPSILON)) {
                                minXDistance = d;
                                minXGuide = g;
                            }
                        }
                        if (guide.type == "y") {
                            const d = Math.abs(guide.value - e.y);
                            if (d < this.threshold &&
                                (minYDistance == null || d < minYDistance - EPSILON)) {
                                minYDistance = d;
                                minYGuide = g;
                            }
                        }
                    }
                    this.currentCandidates = [];
                    if (minXGuide) {
                        this.currentCandidates.push(minXGuide);
                    }
                    if (minYGuide) {
                        this.currentCandidates.push(minYGuide);
                    }
                }
                break;
        }
    }
    handleEnd(e) {
        const result = [];
        for (const action of this.handle.actions) {
            const source = action.source || "value";
            if (e[source] === undefined) {
                continue;
            }
            let value = e[source];
            if (action.minimum != null) {
                value = Math.max(action.minimum, value);
            }
            if (action.maximum != null) {
                value = Math.min(action.maximum, value);
            }
            switch (action.type) {
                case "attribute-value-mapping":
                    {
                        result.push({
                            type: "value-mapping",
                            attribute: action.attribute,
                            value
                        });
                    }
                    break;
                case "property":
                    {
                        result.push({
                            type: "property",
                            property: action.property,
                            field: action.field,
                            value
                        });
                    }
                    break;
                case "attribute":
                    {
                        let didSnap = false;
                        if (source == "value") {
                            if (this.currentCandidates &&
                                this.currentCandidates.length == 1) {
                                const candidate = this.currentCandidates[0];
                                result.push({
                                    type: "snap",
                                    attribute: action.attribute,
                                    snapElement: candidate.element,
                                    snapAttribute: candidate.guide
                                        .attribute
                                });
                                didSnap = true;
                            }
                        }
                        if (source == "x" || source == "y") {
                            for (const candidate of this.currentCandidates) {
                                if (source ==
                                    candidate.guide.type) {
                                    result.push({
                                        type: "snap",
                                        attribute: action.attribute,
                                        snapElement: candidate.element,
                                        snapAttribute: candidate.guide
                                            .attribute
                                    });
                                    didSnap = true;
                                }
                            }
                        }
                        if (!didSnap) {
                            result.push({
                                type: "move",
                                attribute: action.attribute,
                                value
                            });
                        }
                    }
                    break;
            }
        }
        // switch (this.handle.type) {
        //     case "line": {
        //         let lineBound = this.handle as Prototypes.Handles.Line;
        //         if (this.currentCandidates && this.currentCandidates.length == 1) {
        //             let candidate = this.currentCandidates[0];
        //             result.push({
        //                 type: "snap",
        //                 attribute: lineBound.attribute,
        //                 snapElement: candidate.element,
        //                 snapAttribute: (candidate.guide as Prototypes.SnappingGuides.Axis).attribute
        //             });
        //         } else {
        //             result.push({
        //                 type: "move",
        //                 attribute: lineBound.attribute,
        //                 value: e.newValue
        //             });
        //         }
        //     } break;
        //     case "relative-line": {
        //         let relativeLine = this.handle as Prototypes.Handles.RelativeLine;
        //         result.push({
        //             type: "move",
        //             attribute: relativeLine.attribute,
        //             value: e.newValue
        //         });
        //     } break;
        //     case "point": {
        //         let pointBound = this.handle as Prototypes.Handles.Point;
        //         let didX: boolean = false;
        //         let didY: boolean = false;
        //         if (this.currentCandidates) {
        //             for (let candidate of this.currentCandidates) {
        //                 let attr: string;
        //                 switch ((candidate.guide as Prototypes.SnappingGuides.Axis).type) {
        //                     case "x": {
        //                         didX = true;
        //                         attr = pointBound.xAttribute;
        //                     } break;
        //                     case "y": {
        //                         didY = true;
        //                         attr = pointBound.yAttribute;
        //                     } break;
        //                 }
        //                 result.push({
        //                     type: "snap",
        //                     attribute: attr,
        //                     snapElement: candidate.element,
        //                     snapAttribute: (candidate.guide as Prototypes.SnappingGuides.Axis).attribute
        //                 });
        //             }
        //             if (!didX) {
        //                 result.push({
        //                     type: "move",
        //                     attribute: pointBound.xAttribute,
        //                     value: e.newXValue
        //                 });
        //             }
        //             if (!didY) {
        //                 result.push({
        //                     type: "move",
        //                     attribute: pointBound.yAttribute,
        //                     value: e.newYValue
        //                 });
        //             }
        //         }
        //     } break;
        // }
        return result;
    }
    getCurrentCandidates() {
        return this.currentCandidates;
    }
}
exports.SnappingSession = SnappingSession;
class MoveSnappingSession extends SnappingSession {
    constructor(handle) {
        super([], handle, 10);
    }
    getUpdates(actions) {
        const updates = {};
        for (const action of actions) {
            updates[action.attribute] = action.value;
        }
        return updates;
    }
}
exports.MoveSnappingSession = MoveSnappingSession;
class MarkSnappingSession extends SnappingSession {
    constructor(guides, mark, element, elementState, bound, threshold) {
        super(guides.filter(x => x.element != element), bound, threshold);
        this.mark = mark;
        this.element = element;
    }
    getActions(actions) {
        const g = new actions_1.Actions.MarkActionGroup();
        const updates = {};
        let hasUpdates = false;
        for (const action of actions) {
            switch (action.type) {
                case "snap":
                    {
                        if (action.snapElement == null) {
                            g.add(new actions_1.Actions.SetMarkAttribute(this.mark, this.element, action.attribute, {
                                type: "parent",
                                parentAttribute: action.snapAttribute
                            }));
                        }
                        else {
                            g.add(new actions_1.Actions.SnapMarks(this.mark, this.element, action.attribute, action.snapElement, action.snapAttribute));
                        }
                    }
                    break;
                case "move":
                    {
                        updates[action.attribute] = action.value;
                        hasUpdates = true;
                    }
                    break;
                case "property":
                    {
                        g.add(new actions_1.Actions.SetObjectProperty(this.element, action.property, action.field, action.value));
                    }
                    break;
                case "value-mapping":
                    {
                        g.add(new actions_1.Actions.SetMarkAttribute(this.mark, this.element, action.attribute, {
                            type: "value",
                            value: action.value
                        }));
                    }
                    break;
            }
        }
        if (hasUpdates) {
            g.add(new actions_1.Actions.UpdateMarkAttribute(this.mark, this.element, updates));
        }
        // console.log(g);
        return g;
    }
}
exports.MarkSnappingSession = MarkSnappingSession;
class ChartSnappingSession extends SnappingSession {
    constructor(guides, markLayout, bound, threshold) {
        super(guides.filter(x => x.element != markLayout), bound, threshold);
        this.markLayout = markLayout;
    }
    getActions(actions) {
        const result = [];
        for (const action of actions) {
            switch (action.type) {
                case "snap":
                    {
                        if (action.snapElement == null) {
                            result.push(new actions_1.Actions.SetChartElementMapping(this.markLayout, action.attribute, {
                                type: "parent",
                                parentAttribute: action.snapAttribute
                            }));
                        }
                        else {
                            result.push(new actions_1.Actions.SnapChartElements(this.markLayout, action.attribute, action.snapElement, action.snapAttribute));
                        }
                    }
                    break;
                case "move":
                    {
                        const updates = {};
                        updates[action.attribute] = action.value;
                        result.push(new actions_1.Actions.UpdateChartElementAttribute(this.markLayout, updates));
                    }
                    break;
                case "property":
                    {
                        result.push(new actions_1.Actions.SetObjectProperty(this.markLayout, action.property, action.field, action.value));
                    }
                    break;
                case "value-mapping":
                    {
                        result.push(new actions_1.Actions.SetChartElementMapping(this.markLayout, action.attribute, {
                            type: "value",
                            value: action.value
                        }));
                    }
                    break;
            }
        }
        return result;
    }
}
exports.ChartSnappingSession = ChartSnappingSession;
//# sourceMappingURL=snapping.js.map