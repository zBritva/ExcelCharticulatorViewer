"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
Object.defineProperty(exports, "__esModule", { value: true });
const solver_1 = require("../../solver");
const Specification = require("../../specification");
const chart_element_1 = require("../chart_element");
const object_1 = require("../object");
class GuideClass extends chart_element_1.ChartElementClass {
    constructor() {
        super(...arguments);
        this.attributeNames = ["value", "value2"];
        this.attributes = {
            value: {
                name: "value",
                type: Specification.AttributeType.Number
            },
            value2: {
                name: "value2",
                type: Specification.AttributeType.Number
            }
        };
    }
    initializeState() {
        this.state.attributes.value = 0;
        this.state.attributes.value2 = 0;
    }
    getAxis() {
        return this.object.properties.axis;
    }
    buildConstraints(solver) {
        const [value, value2] = solver.attrs(this.state.attributes, [
            "value",
            "value2"
        ]);
        solver.addLinear(solver_1.ConstraintStrength.HARD, this.object.properties.gap, [
            [1, value],
            [-1, value2]
        ]);
    }
    /** Get handles given current state */
    getHandles() {
        const inf = [-1000, 1000];
        const r = [
            {
                type: "line",
                axis: this.getAxis(),
                actions: [{ type: "attribute", attribute: "value" }],
                value: this.state.attributes.value,
                span: inf
            }
        ];
        if (this.object.properties.gap > 0) {
            r.push({
                type: "line",
                axis: this.getAxis(),
                actions: [{ type: "attribute", attribute: "value2" }],
                value: this.state.attributes.value2,
                span: inf
            });
        }
        return r;
    }
    getSnappingGuides() {
        const r = [
            {
                type: this.getAxis(),
                value: this.state.attributes.value,
                attribute: "value",
                visible: true
            }
        ];
        if (this.object.properties.gap > 0) {
            r.push({
                type: this.getAxis(),
                value: this.state.attributes.value2,
                attribute: "value2",
                visible: true
            });
        }
        return r;
    }
    getAttributePanelWidgets(manager) {
        return [
            manager.sectionHeader("Guide"),
            manager.row("Split Gap", manager.inputNumber({ property: "gap" }, {}))
        ];
    }
    getTemplateParameters() {
        return {
            properties: [
                {
                    objectID: this.object._id,
                    target: {
                        attribute: "gap"
                    },
                    type: Specification.AttributeType.Number,
                    default: this.object.properties.gap
                },
                {
                    objectID: this.object._id,
                    target: {
                        attribute: "value"
                    },
                    type: Specification.AttributeType.Number,
                    default: this.state.attributes.value
                },
                {
                    objectID: this.object._id,
                    target: {
                        attribute: "value2"
                    },
                    type: Specification.AttributeType.Number,
                    default: this.state.attributes.value2
                }
            ]
        };
    }
}
GuideClass.classID = "guide.guide";
GuideClass.type = "guide";
GuideClass.metadata = {
    displayName: "Guide",
    iconPath: "guide/x"
};
GuideClass.defaultProperties = {
    gap: 0,
    value: 0,
    value2: 0
};
exports.GuideClass = GuideClass;
class GuideCoordinatorClass extends chart_element_1.ChartElementClass {
    buildConstraints(solver) {
        const attrs = this.state.attributes;
        let t1, t2;
        if (this.getAxis() == "x") {
            t1 = solver.attr(attrs, "x1");
            t2 = solver.attr(attrs, "x2");
        }
        else {
            t1 = solver.attr(attrs, "y1");
            t2 = solver.attr(attrs, "y2");
        }
        const length = this.object.properties.count;
        this.getValueNames().map((name, index) => {
            const t = (1 + index) / (length + 1);
            solver.addLinear(solver_1.ConstraintStrength.HARD, 0, [[1 - t, t1], [t, t2]], [[1, solver.attr(attrs, name)]]);
        });
    }
    getValueNames() {
        const attrs = [];
        for (let i = 0; i < this.object.properties.count; i++) {
            const name = `value${i}`;
            attrs.push(name);
            if (this.state) {
                if (this.state.attributes[name] == null) {
                    this.state.attributes[name] = 0;
                }
            }
        }
        return attrs;
    }
    get attributeNames() {
        return ["x1", "y1", "x2", "y2"].concat(this.getValueNames());
    }
    get attributes() {
        const r = {
            x1: {
                name: "x1",
                type: Specification.AttributeType.Number
            },
            y1: {
                name: "y1",
                type: Specification.AttributeType.Number
            },
            x2: {
                name: "x2",
                type: Specification.AttributeType.Number
            },
            y2: {
                name: "y2",
                type: Specification.AttributeType.Number
            }
        };
        for (let i = 0; i < this.object.properties.count; i++) {
            const name = `value${i}`;
            r[name] = {
                name,
                type: Specification.AttributeType.Number
            };
        }
        return r;
    }
    initializeState() {
        const v = this.attributeNames;
        this.state.attributes.x1 = -100;
        this.state.attributes.y1 = -100;
        this.state.attributes.x2 = 100;
        this.state.attributes.y2 = 100;
        for (const name of this.getValueNames()) {
            if (this.state.attributes[name] == null) {
                this.state.attributes[name] = 0;
            }
        }
    }
    getAxis() {
        return this.object.properties.axis;
    }
    /** Get handles given current state */
    getHandles() {
        const attrs = this.state.attributes;
        const { x1, y1, x2, y2 } = attrs;
        const axis = this.getAxis();
        return [
            {
                type: "point",
                x: x1,
                y: y1,
                actions: [
                    { type: "attribute", source: "x", attribute: "x1" },
                    { type: "attribute", source: "y", attribute: "y1" }
                ]
            },
            {
                type: "point",
                x: axis == "y" ? x1 : x2,
                y: axis == "x" ? y1 : y2,
                actions: [
                    {
                        type: "attribute",
                        source: "x",
                        attribute: axis == "y" ? "x1" : "x2"
                    },
                    {
                        type: "attribute",
                        source: "y",
                        attribute: axis == "x" ? "y1" : "y2"
                    }
                ]
            }
        ];
    }
    getBoundingBox() {
        const attrs = this.state.attributes;
        const { x1, y1 } = attrs;
        let { x2, y2 } = attrs;
        if (this.getAxis() == "x") {
            y2 = y1;
        }
        else {
            x2 = x1;
        }
        return {
            type: "line",
            visible: true,
            morphing: true,
            x1,
            y1,
            x2,
            y2
        };
    }
    getSnappingGuides() {
        return this.getValueNames().map(name => {
            return {
                type: this.getAxis(),
                value: this.state.attributes[name],
                attribute: name,
                visible: true
            };
        });
    }
    /** Get controls given current state */
    getAttributePanelWidgets(manager) {
        return [
            manager.sectionHeader("Guide Coordinator"),
            manager.row("Count", manager.inputNumber({ property: "count" }, {
                showUpdown: true,
                updownTick: 1,
                updownRange: [1, 100],
                minimum: 1,
                maximum: 100
            }))
        ];
    }
}
GuideCoordinatorClass.classID = "guide.guide-coordinator";
GuideCoordinatorClass.type = "guide";
GuideCoordinatorClass.metadata = {
    displayName: "GuideCoordinator",
    iconPath: "guide/coordinator-x"
};
GuideCoordinatorClass.defaultAttributes = {
    axis: "x",
    count: 4
};
exports.GuideCoordinatorClass = GuideCoordinatorClass;
function registerClasses() {
    object_1.ObjectClasses.Register(GuideClass);
    object_1.ObjectClasses.Register(GuideCoordinatorClass);
}
exports.registerClasses = registerClasses;
//# sourceMappingURL=index.js.map