export declare type ValueType = number | boolean | string | Date | Object;
export interface Context {
    getVariable(name: string): ValueType;
}
export declare class ShadowContext implements Context {
    upstream: Context;
    shadows: {
        [name: string]: ValueType;
    };
    constructor(upstream?: Context, shadows?: {
        [name: string]: ValueType;
    });
    getVariable(name: string): ValueType;
}
export declare class SimpleContext implements Context {
    variables: {
        [name: string]: ValueType;
    };
    getVariable(name: string): ValueType;
}
export declare type PatternReplacer = (expr: Expression) => Expression | void;
export declare function variableReplacer(map: {
    [name: string]: string;
}): (expr: Expression) => Variable;
export declare abstract class Expression {
    abstract getValue(context: Context): ValueType;
    abstract toString(): string;
    protected abstract getPrecedence(): number;
    protected abstract replaceChildren(r: PatternReplacer): Expression;
    toStringPrecedence(parent: number): string;
    getNumberValue(c: Context): number;
    getStringValue(c: Context): string;
    static Parse(expr: string): Expression;
    replace(replacer: PatternReplacer): Expression;
}
export interface TextExpressionPart {
    string?: string;
    expression?: Expression;
    format?: string;
}
/** Text expression is a special class, it cannot be used inside other expression */
export declare class TextExpression {
    parts: TextExpressionPart[];
    constructor(parts?: TextExpressionPart[]);
    getValue(context: Context): string;
    isTrivialString(): boolean;
    toString(): string;
    static Parse(expr: string): TextExpression;
    replace(r: PatternReplacer): TextExpression;
}
export declare class Value<T> extends Expression {
    value: T;
    constructor(value: T);
    getValue(): T;
    toString(): string;
    protected getPrecedence(): number;
    protected replaceChildren(r: PatternReplacer): Expression;
}
export declare class StringValue extends Value<string> {
}
export declare class NumberValue extends Value<number> {
}
export declare class BooleanValue extends Value<Boolean> {
}
export declare class DateValue extends Value<Date> {
}
export declare class FieldAccess extends Expression {
    expr: Expression;
    fields: string[];
    constructor(expr: Expression, fields: string[]);
    getValue(c: Context): any;
    toString(): string;
    protected getPrecedence(): number;
    protected replaceChildren(r: PatternReplacer): Expression;
}
export declare class FunctionCall extends Expression {
    name: string;
    function: Function;
    args: Expression[];
    constructor(parts: string[], args: Expression[]);
    getValue(c: Context): any;
    toString(): string;
    protected getPrecedence(): number;
    protected replaceChildren(r: PatternReplacer): Expression;
}
export declare class Operator extends Expression {
    name: string;
    lhs: Expression;
    rhs?: Expression;
    private op;
    constructor(name: string, lhs: Expression, rhs?: Expression);
    getValue(c: Context): any;
    toString(): string;
    protected getMyPrecedence(): number[];
    protected getPrecedence(): number;
    protected replaceChildren(r: PatternReplacer): Expression;
}
export declare class LambdaFunction extends Expression {
    readonly expr: Expression;
    readonly argNames: string[];
    constructor(expr: Expression, argNames: string[]);
    getValue(c: Context): (...args: ValueType[]) => ValueType;
    toString(): string;
    protected getPrecedence(): number;
    protected replaceChildren(r: PatternReplacer): Expression;
}
export declare class Variable extends Expression {
    readonly name: string;
    constructor(name: string);
    getValue(c: Context): ValueType;
    toString(): string;
    protected getPrecedence(): number;
    static VariableNameToString(name: string): string;
    protected replaceChildren(r: PatternReplacer): Expression;
}
