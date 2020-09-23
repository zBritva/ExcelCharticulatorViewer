"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("../../../core");
const actions_1 = require("../../actions");
const registry_1 = require("./registry");
function default_1(REG) {
    // Internal registry of mark-level action handlers
    const MR = new registry_1.ActionHandlerRegistry();
    MR.add(actions_1.Actions.UpdateMarkAttribute, function (action) {
        for (const key in action.updates) {
            if (!action.updates.hasOwnProperty(key)) {
                continue;
            }
            delete action.mark.mappings[key];
            action.glyph.constraints = action.glyph.constraints.filter(c => {
                if (c.type == "snap") {
                    if (c.attributes.element == action.mark._id &&
                        c.attributes.attribute == key) {
                        return false;
                    }
                }
                return true;
            });
        }
        this.forAllGlyph(action.glyph, glyphState => {
            for (const [mark, markState] of core_1.zipArray(action.glyph.marks, glyphState.marks)) {
                if (mark == action.mark) {
                    for (const key in action.updates) {
                        if (!action.updates.hasOwnProperty(key)) {
                            continue;
                        }
                        markState.attributes[key] = action.updates[key];
                        this.addPresolveValue(core_1.Solver.ConstraintStrength.WEAK, markState.attributes, key, action.updates[key]);
                    }
                }
            }
        });
    });
    MR.add(actions_1.Actions.SetObjectProperty, function (action) {
        if (action.field == null) {
            action.object.properties[action.property] = action.value;
        }
        else {
            const obj = action.object.properties[action.property];
            action.object.properties[action.property] = core_1.setField(obj, action.field, action.value);
        }
    });
    MR.add(actions_1.Actions.SetMarkAttribute, function (action) {
        if (action.mapping == null) {
            delete action.mark.mappings[action.attribute];
        }
        else {
            action.mark.mappings[action.attribute] = action.mapping;
            action.glyph.constraints = action.glyph.constraints.filter(c => {
                if (c.type == "snap") {
                    if (c.attributes.element == action.mark._id &&
                        c.attributes.attribute == action.attribute) {
                        return false;
                    }
                }
                return true;
            });
        }
    });
    MR.add(actions_1.Actions.UnmapMarkAttribute, function (action) {
        delete action.mark.mappings[action.attribute];
    });
    MR.add(actions_1.Actions.SnapMarks, function (action) {
        const idx1 = action.glyph.marks.indexOf(action.mark);
        if (idx1 < 0) {
            return;
        }
        // let elementState = this.markState.elements[idx1];
        const idx2 = action.glyph.marks.indexOf(action.targetMark);
        if (idx2 < 0) {
            return;
        }
        // let targetElementState = this.markState.elements[idx2];
        // elementState.attributes[action.attribute] = targetElementState.attributes[action.targetAttribute];
        // Remove any existing attribute mapping
        delete action.mark.mappings[action.attribute];
        // Remove any existing snapping
        action.glyph.constraints = action.glyph.constraints.filter(c => {
            if (c.type == "snap") {
                if (c.attributes.element == action.mark._id &&
                    c.attributes.attribute == action.attribute) {
                    return false;
                }
            }
            return true;
        });
        action.glyph.constraints.push({
            type: "snap",
            attributes: {
                element: action.mark._id,
                attribute: action.attribute,
                targetElement: action.targetMark._id,
                targetAttribute: action.targetAttribute,
                gap: 0
            }
        });
        // Force the states to be equal
        this.forAllGlyph(action.glyph, glyphState => {
            const elementState = glyphState.marks[idx1];
            const targetElementState = glyphState.marks[idx2];
            elementState.attributes[action.attribute] =
                targetElementState.attributes[action.targetAttribute];
            this.addPresolveValue(core_1.Solver.ConstraintStrength.STRONG, elementState.attributes, action.attribute, targetElementState.attributes[action.targetAttribute]);
        });
    });
    MR.add(actions_1.Actions.MarkActionGroup, function (action) {
        for (const item of action.actions) {
            // Recursively handle group actions
            MR.handleAction(this, item);
        }
    });
    // The entry point for mark actions
    REG.add(actions_1.Actions.MarkAction, function (mainAction) {
        this.saveHistory();
        MR.handleAction(this, mainAction);
        // Solve constraints only after all actions are processed
        this.solveConstraintsAndUpdateGraphics();
    });
    REG.add(actions_1.Actions.MapDataToMarkAttribute, function (action) {
        this.saveHistory();
        const attr = core_1.Prototypes.ObjectClasses.Create(null, action.mark, null)
            .attributes[action.attribute];
        const table = this.getTable(action.glyph.table);
        debugger;
        const inferred = this.scaleInference({ glyph: action.glyph }, action.expression, action.valueType, action.valueMetadata.kind, action.attributeType, action.hints, action.attribute);
        if (inferred != null) {
            action.mark.mappings[action.attribute] = {
                type: "scale",
                table: action.glyph.table,
                expression: action.expression,
                valueType: action.valueType,
                scale: inferred,
                attribute: action.attribute
            };
            if (!this.chart.scaleMappings.find(scaleMapping => scaleMapping.scale === inferred)) {
                this.chart.scaleMappings.push(Object.assign({}, action.mark.mappings[action.attribute], { attribute: action.attribute }));
            }
        }
        else {
            if ((action.valueType == core_1.Specification.DataType.String ||
                action.valueType == core_1.Specification.DataType.Number) &&
                action.attributeType == core_1.Specification.AttributeType.Text) {
                // If the valueType is a number, use a format
                const format = action.valueType == core_1.Specification.DataType.Number ? ".1f" : undefined;
                action.mark.mappings[action.attribute] = {
                    type: "text",
                    table: action.glyph.table,
                    textExpression: new core_1.Expression.TextExpression([
                        { expression: core_1.Expression.parse(action.expression), format }
                    ]).toString()
                };
            }
        }
        this.solveConstraintsAndUpdateGraphics();
    });
}
exports.default = default_1;
//# sourceMappingURL=mark.js.map