"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
const classes_1 = require("./classes");
var classes_2 = require("./classes");
exports.Expression = classes_2.Expression;
exports.TextExpression = classes_2.TextExpression;
exports.ShadowContext = classes_2.ShadowContext;
exports.LambdaFunction = classes_2.LambdaFunction;
exports.SimpleContext = classes_2.SimpleContext;
exports.FieldAccess = classes_2.FieldAccess;
exports.FunctionCall = classes_2.FunctionCall;
exports.Variable = classes_2.Variable;
exports.Value = classes_2.Value;
exports.NumberValue = classes_2.NumberValue;
exports.BooleanValue = classes_2.BooleanValue;
exports.StringValue = classes_2.StringValue;
exports.DateValue = classes_2.DateValue;
exports.variableReplacer = classes_2.variableReplacer;
var parser_1 = require("./parser");
exports.SyntaxError = parser_1.SyntaxError;
/** Shortcut to Expression.Parse */
function parse(str) {
    return classes_1.Expression.Parse(str);
}
exports.parse = parse;
/** Shortcut to TextExpression.Parse */
function parseTextExpression(str) {
    return classes_1.TextExpression.Parse(str);
}
exports.parseTextExpression = parseTextExpression;
var helpers_1 = require("./helpers");
exports.variable = helpers_1.variable;
exports.functionCall = helpers_1.functionCall;
exports.lambda = helpers_1.lambda;
exports.fields = helpers_1.fields;
exports.add = helpers_1.add;
exports.sub = helpers_1.sub;
exports.mul = helpers_1.mul;
exports.div = helpers_1.div;
exports.number = helpers_1.number;
exports.string = helpers_1.string;
exports.date = helpers_1.date;
exports.boolean = helpers_1.boolean;
exports.ExpressionCache = helpers_1.ExpressionCache;
exports.getDefaultAggregationFunction = helpers_1.getDefaultAggregationFunction;
exports.getCompatibleAggregationFunctions = helpers_1.getCompatibleAggregationFunctions;
exports.aggregationFunctions = helpers_1.aggregationFunctions;
exports.verifyUserExpression = helpers_1.verifyUserExpression;
//# sourceMappingURL=index.js.map