import { BooleanValue, DateValue, Expression, FieldAccess, FunctionCall, LambdaFunction, NumberValue, Operator, StringValue, Variable, TextExpression, Context } from "./classes";
import { DataflowTable } from "../prototypes/dataflow";
export declare function variable(name: string): Variable;
export declare function functionCall(functionName: string, ...args: Expression[]): FunctionCall;
export declare function lambda(names: string[], expression: Expression): LambdaFunction;
export declare function fields(expr: Expression, ...fields: string[]): FieldAccess;
export declare function add(lhs: Expression, rhs: Expression): Operator;
export declare function sub(lhs: Expression, rhs: Expression): Operator;
export declare function mul(lhs: Expression, rhs: Expression): Operator;
export declare function div(lhs: Expression, rhs: Expression): Operator;
export declare function number(v: number): NumberValue;
export declare function string(v: string): StringValue;
export declare function boolean(v: boolean): BooleanValue;
export declare function date(v: Date): DateValue;
export interface AggregationFunctionDescription {
    name: string;
    displayName: string;
    /** Supported input types, if unspecified, any */
    inputTypes?: string[];
}
export declare const aggregationFunctions: AggregationFunctionDescription[];
export declare function getCompatibleAggregationFunctions(inputType: string): AggregationFunctionDescription[];
export declare function getDefaultAggregationFunction(inputType: string): "first" | "avg";
export declare class ExpressionCache {
    private items;
    private textItems;
    clear(): void;
    parse(expr: string): Expression;
    parseTextExpression(expr: string): TextExpression;
}
export interface VerifyUserExpressionOptions {
    /** Specify this to verify expression against data */
    data?: Iterable<Context>;
    /** Specify this to verify expression against table */
    table?: DataflowTable;
    /** Specify this to verify return types */
    expectedTypes?: string[];
    textExpression?: boolean;
}
export interface VerifyUserExpressionReport {
    /** Verification is passed */
    pass: boolean;
    /** Re-formatted expression if passed */
    formatted?: string;
    /** Error message if not passed */
    error?: string;
}
/**
 * Verify user input expression
 * @param inputString The expression from user input
 * @param options Verification options
 */
export declare function verifyUserExpression(inputString: string, options: VerifyUserExpressionOptions): VerifyUserExpressionReport;
