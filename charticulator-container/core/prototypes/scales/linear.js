"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("../../common");
const solver_1 = require("../../solver");
const Specification = require("../../specification");
const index_1 = require("./index");
class LinearScale extends index_1.ScaleClass {
    constructor() {
        super(...arguments);
        this.attributeNames = ["rangeMin", "rangeMax"];
        this.attributes = {
            rangeMin: {
                name: "rangeMin",
                type: Specification.AttributeType.Number,
                defaultValue: 0
            },
            rangeMax: {
                name: "rangeMax",
                type: Specification.AttributeType.Number
            }
        };
    }
    mapDataToAttribute(data) {
        const attrs = this.state.attributes;
        const props = this.object.properties;
        const x1 = props.domainMin;
        const x2 = props.domainMax;
        const y1 = attrs.rangeMin;
        const y2 = attrs.rangeMax;
        return ((data - x1) / (x2 - x1)) * (y2 - y1) + y1;
    }
    buildConstraint(data, target, solver) {
        const attrs = this.state.attributes;
        const props = this.object.properties;
        const x1 = props.domainMin;
        const x2 = props.domainMax;
        const k = (data - x1) / (x2 - x1);
        solver.addLinear(solver_1.ConstraintStrength.HARD, 0, [[1, target]], [
            [1 - k, solver.attr(attrs, "rangeMin")],
            [k, solver.attr(attrs, "rangeMax")]
        ]);
    }
    initializeState() {
        const attrs = this.state.attributes;
        attrs.rangeMin = 0;
        attrs.rangeMax = 100;
    }
    inferParameters(column, options = {}) {
        const attrs = this.state.attributes;
        const props = this.object.properties;
        const s = new common_1.Scale.LinearScale();
        const values = column.filter(x => typeof x == "number");
        s.inferParameters(values);
        s.adjustDomain(options);
        props.domainMin = s.domainMin;
        props.domainMax = s.domainMax;
        if (!options.reuseRange) {
            if (options.rangeNumber) {
                attrs.rangeMin = options.rangeNumber[0];
                attrs.rangeMax = options.rangeNumber[1];
            }
            else {
                attrs.rangeMin = 0;
                attrs.rangeMax = 100;
            }
            this.object.mappings.rangeMin = {
                type: "value",
                value: 0
            };
            if (!options.autoRange) {
                this.object.mappings.rangeMax = {
                    type: "value",
                    value: attrs.rangeMax
                };
            }
        }
    }
    getAttributePanelWidgets(manager) {
        return [
            manager.sectionHeader("Domain"),
            manager.row("Start", manager.inputNumber({ property: "domainMin" })),
            manager.row("End", manager.inputNumber({ property: "domainMax" })),
            manager.sectionHeader("Range"),
            manager.mappingEditor("Start", "rangeMin", { defaultValue: 0 }),
            manager.mappingEditor("End", "rangeMax", { defaultAuto: true })
        ];
    }
    getTemplateParameters() {
        const parameters = super.getTemplateParameters();
        if (!parameters.properties) {
            parameters.properties = [];
        }
        parameters.properties.push({
            objectID: this.object._id,
            target: {
                property: "domainMin"
            },
            type: Specification.AttributeType.Number
        });
        parameters.properties.push({
            objectID: this.object._id,
            target: {
                property: "domainMax"
            },
            type: Specification.AttributeType.Number
        });
        return parameters;
    }
}
LinearScale.classID = "scale.linear<number,number>";
LinearScale.type = "scale";
LinearScale.defaultMappingValues = {
    rangeMin: 0
};
exports.LinearScale = LinearScale;
function getDefaultGradient() {
    return {
        colorspace: "lab",
        colors: [{ r: 255, g: 255, b: 255 }, { r: 0, g: 0, b: 0 }]
    };
}
class LinearColorScale extends index_1.ScaleClass {
    constructor() {
        super(...arguments);
        this.attributeNames = [];
        this.attributes = {};
    }
    mapDataToAttribute(data) {
        const props = this.object.properties;
        const x1 = props.domainMin;
        const x2 = props.domainMax;
        const t = (data - x1) / (x2 - x1);
        const c = common_1.interpolateColors(props.range.colors, props.range.colorspace);
        return c(t);
    }
    buildConstraint(data, target, solver) { }
    initializeState() { }
    inferParameters(column, options = {}) {
        const props = this.object.properties;
        const s = new common_1.Scale.LinearScale();
        const values = column.filter(x => typeof x == "number");
        s.inferParameters(values);
        s.adjustDomain(options);
        props.domainMin = s.domainMin;
        props.domainMax = s.domainMax;
        if (!options.reuseRange) {
            props.range = getDefaultGradient();
        }
    }
    getAttributePanelWidgets(manager) {
        return [
            manager.sectionHeader("Domain"),
            manager.row("Start", manager.inputNumber({ property: "domainMin" })),
            manager.row("End", manager.inputNumber({ property: "domainMax" })),
            manager.sectionHeader("Gradient"),
            manager.inputColorGradient({ property: "range", noComputeLayout: true }, true)
        ];
    }
    getTemplateParameters() {
        const parameters = super.getTemplateParameters();
        if (!parameters.properties) {
            parameters.properties = [];
        }
        parameters.properties.push({
            objectID: this.object._id,
            target: {
                property: "domainMin"
            },
            type: Specification.AttributeType.Number
        });
        parameters.properties.push({
            objectID: this.object._id,
            target: {
                property: "domainMax"
            },
            type: Specification.AttributeType.Number
        });
        return parameters;
    }
}
LinearColorScale.classID = "scale.linear<number,color>";
LinearColorScale.type = "scale";
LinearColorScale.metadata = {
    displayName: "Scale",
    iconPath: "scale/color"
};
LinearColorScale.defaultMappingValues = {
    range: getDefaultGradient()
};
exports.LinearColorScale = LinearColorScale;
class LinearBooleanScale extends index_1.ScaleClass {
    constructor() {
        super(...arguments);
        this.attributeNames = [];
        this.attributes = {};
    }
    mapDataToAttribute(data) {
        const props = this.object.properties;
        const value = data;
        if (props.inclusive) {
            switch (props.mode) {
                case "greater":
                    return value >= props.min;
                case "less":
                    return value <= props.max;
                case "interval":
                    return value <= props.max && value >= props.min;
            }
        }
        else {
            switch (props.mode) {
                case "greater":
                    return value > props.min;
                case "less":
                    return value < props.max;
                case "interval":
                    return value < props.max && value > props.min;
            }
        }
    }
    buildConstraint(data, target, solver) { }
    initializeState() { }
    inferParameters(column, options = {}) {
        const props = this.object.properties;
        const s = new common_1.Scale.LinearScale();
        const values = column.filter(x => typeof x == "number");
        s.inferParameters(values);
        props.min = s.domainMin;
        props.max = s.domainMax;
        props.mode = "interval";
        props.inclusive = true;
    }
    getAttributePanelWidgets(manager) {
        const props = this.object.properties;
        const minMax = [];
        if (props.mode == "greater" || props.mode == "interval") {
            minMax.push(manager.row(props.inclusive ? ">=" : ">", manager.inputNumber({ property: "min" })));
        }
        if (props.mode == "less" || props.mode == "interval") {
            minMax.push(manager.row(props.inclusive ? "<=" : "<", manager.inputNumber({ property: "max" })));
        }
        return [
            manager.sectionHeader("Boolean"),
            manager.row("Mode", manager.inputSelect({ property: "mode" }, {
                type: "dropdown",
                options: ["greater", "less", "interval"],
                showLabel: true,
                labels: ["Greater", "Less", "Interval"]
            })),
            manager.row("Inclusive", manager.inputBoolean({ property: "inclusive" }, { type: "checkbox" })),
            ...minMax
        ];
    }
    getTemplateParameters() {
        const parameters = super.getTemplateParameters();
        if (!parameters.properties) {
            parameters.properties = [];
        }
        if (this.object.properties.mode === "interval") {
            parameters.properties.push({
                objectID: this.object._id,
                target: {
                    property: "min"
                },
                type: Specification.AttributeType.Number,
                default: this.object.properties.min
            });
            parameters.properties.push({
                objectID: this.object._id,
                target: {
                    property: "max"
                },
                type: Specification.AttributeType.Number,
                default: this.object.properties.max
            });
            parameters.properties.push({
                objectID: this.object._id,
                target: {
                    property: "inclusive"
                },
                type: Specification.AttributeType.Boolean,
                default: this.object.properties.inclusive
            });
        }
        if (this.object.properties.mode === "greater") {
            parameters.properties.push({
                objectID: this.object._id,
                target: {
                    property: "min"
                },
                type: Specification.AttributeType.Number,
                default: this.object.properties.min
            });
            parameters.properties.push({
                objectID: this.object._id,
                target: {
                    property: "inclusive"
                },
                type: Specification.AttributeType.Boolean,
                default: this.object.properties.inclusive
            });
        }
        if (this.object.properties.mode === "less") {
            parameters.properties.push({
                objectID: this.object._id,
                target: {
                    property: "max"
                },
                type: Specification.AttributeType.Number,
                default: this.object.properties.max
            });
            parameters.properties.push({
                objectID: this.object._id,
                target: {
                    property: "inclusive"
                },
                type: Specification.AttributeType.Boolean,
                default: this.object.properties.inclusive
            });
        }
        return parameters;
    }
}
LinearBooleanScale.classID = "scale.linear<number,boolean>";
LinearBooleanScale.type = "scale";
LinearBooleanScale.defaultMappingValues = {
    min: 0,
    max: 1,
    mode: "interval",
    inclusive: true
};
exports.LinearBooleanScale = LinearBooleanScale;
//# sourceMappingURL=linear.js.map