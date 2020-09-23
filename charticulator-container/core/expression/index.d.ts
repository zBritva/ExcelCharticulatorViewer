import { Expression, TextExpression } from "./classes";
export { Expression, TextExpression, TextExpressionPart, Context, ShadowContext, LambdaFunction, SimpleContext, FieldAccess, FunctionCall, Variable, Value, NumberValue, BooleanValue, StringValue, DateValue, variableReplacer } from "./classes";
export { SyntaxError } from "./parser";
/** Shortcut to Expression.Parse */
export declare function parse(str: string): Expression;
/** Shortcut to TextExpression.Parse */
export declare function parseTextExpression(str: string): TextExpression;
export { variable, functionCall, lambda, fields, add, sub, mul, div, number, string, date, boolean, ExpressionCache, getDefaultAggregationFunction, getCompatibleAggregationFunctions, aggregationFunctions, AggregationFunctionDescription, verifyUserExpression, VerifyUserExpressionOptions, VerifyUserExpressionReport } from "./helpers";
