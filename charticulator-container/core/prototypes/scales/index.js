"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
const scale_1 = require("./scale");
exports.ScaleClass = scale_1.ScaleClass;
const specification_1 = require("../../specification");
const object_1 = require("../object");
const categorical_1 = require("./categorical");
const linear_1 = require("./linear");
const inferScaleTypeRules = [
    {
        input: {
            type: [specification_1.DataType.Number, specification_1.DataType.Date],
            kind: [specification_1.DataKind.Numerical, specification_1.DataKind.Temporal]
        },
        output: specification_1.AttributeType.Number,
        scale: "scale.linear<number,number>",
        priority: 1
    },
    {
        input: {
            type: [specification_1.DataType.Number, specification_1.DataType.Date],
            kind: [specification_1.DataKind.Numerical, specification_1.DataKind.Temporal]
        },
        output: specification_1.AttributeType.Color,
        scale: "scale.linear<number,color>",
        priority: 1
    },
    {
        input: {
            type: [specification_1.DataType.Number, specification_1.DataType.Date],
            kind: [specification_1.DataKind.Numerical, specification_1.DataKind.Temporal]
        },
        output: specification_1.AttributeType.Boolean,
        scale: "scale.linear<number,boolean>",
        priority: 1
    },
    {
        input: {
            type: [specification_1.DataType.String, specification_1.DataType.Boolean],
            kind: [specification_1.DataKind.Categorical, specification_1.DataKind.Ordinal]
        },
        output: specification_1.AttributeType.Color,
        scale: "scale.categorical<string,color>",
        priority: 1
    },
    {
        input: {
            type: [specification_1.DataType.String, specification_1.DataType.Boolean],
            kind: [specification_1.DataKind.Categorical, specification_1.DataKind.Ordinal]
        },
        output: specification_1.AttributeType.Image,
        scale: "scale.categorical<string,image>",
        priority: 1
    },
    {
        input: {
            type: [specification_1.DataType.String, specification_1.DataType.Boolean],
            kind: [specification_1.DataKind.Categorical, specification_1.DataKind.Ordinal]
        },
        output: specification_1.AttributeType.Enum,
        scale: "scale.categorical<string,enum>",
        priority: 1
    },
    {
        input: {
            type: [specification_1.DataType.String, specification_1.DataType.Boolean],
            kind: [specification_1.DataKind.Categorical, specification_1.DataKind.Ordinal]
        },
        output: specification_1.AttributeType.Boolean,
        scale: "scale.categorical<string,boolean>",
        priority: 1
    },
    {
        input: { type: specification_1.DataType.String, kind: [specification_1.DataKind.Ordinal] },
        output: specification_1.AttributeType.Number,
        scale: "scale.categorical<string,number>",
        priority: 1
    }
];
function match(test, input) {
    if (test instanceof Array) {
        return test.indexOf(input) >= 0;
    }
    else {
        return test == input;
    }
}
// Return the scale class by matching dataType and attrType
function inferScaleType(dataType, dataKind, attrType) {
    // Match scale inference rules, find the matched one with top priority.
    let candidate = null;
    for (const rule of inferScaleTypeRules) {
        // Filter non-matches
        if (!match(rule.input.type, dataType)) {
            continue;
        }
        if (!match(rule.output, attrType)) {
            continue;
        }
        if (!candidate || candidate.priority < rule.priority) {
            candidate = rule;
        }
    }
    if (candidate) {
        return candidate.scale;
    }
    else {
        return null;
    }
}
exports.inferScaleType = inferScaleType;
function registerClasses() {
    object_1.ObjectClasses.Register(categorical_1.CategoricalScaleNumber);
    object_1.ObjectClasses.Register(categorical_1.CategoricalScaleColor);
    object_1.ObjectClasses.Register(categorical_1.CategoricalScaleBoolean);
    object_1.ObjectClasses.Register(categorical_1.CategoricalScaleEnum);
    object_1.ObjectClasses.Register(categorical_1.CategoricalScaleImage);
    object_1.ObjectClasses.Register(linear_1.LinearScale);
    object_1.ObjectClasses.Register(linear_1.LinearColorScale);
    object_1.ObjectClasses.Register(linear_1.LinearBooleanScale);
}
exports.registerClasses = registerClasses;
//# sourceMappingURL=index.js.map