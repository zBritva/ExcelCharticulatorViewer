"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ShadowContext {
    constructor(upstream = null, shadows = {}) {
        this.upstream = upstream;
        this.shadows = shadows;
    }
    getVariable(name) {
        if (this.shadows.hasOwnProperty(name)) {
            return this.shadows[name];
        }
        return this.upstream.getVariable(name);
    }
}
exports.ShadowContext = ShadowContext;
class SimpleContext {
    constructor() {
        this.variables = {};
    }
    getVariable(name) {
        return this.variables[name];
    }
}
exports.SimpleContext = SimpleContext;
const intrinsics_1 = require("./intrinsics");
const d3_format_1 = require("d3-format");
const parser_1 = require("./parser");
function variableReplacer(map) {
    return (expr) => {
        if (expr instanceof Variable) {
            if (map.hasOwnProperty(expr.name)) {
                return new Variable(map[expr.name]);
            }
        }
    };
}
exports.variableReplacer = variableReplacer;
class Expression {
    toStringPrecedence(parent) {
        if (this.getPrecedence() < parent) {
            return `(${this.toString()})`;
        }
        else {
            return this.toString();
        }
    }
    getNumberValue(c) {
        const v = this.getValue(c);
        return v;
    }
    getStringValue(c) {
        const v = this.getValue(c);
        return v.toString();
    }
    static Parse(expr) {
        return parser_1.parse(expr);
    }
    replace(replacer) {
        const r = replacer(this);
        if (r) {
            // If the expression matches the pattern, replace itself
            return r;
        }
        else {
            // Otherwise, replace any pattern found inside
            return this.replaceChildren(replacer);
        }
    }
}
exports.Expression = Expression;
/** Text expression is a special class, it cannot be used inside other expression */
class TextExpression {
    constructor(parts = []) {
        this.parts = parts;
    }
    getValue(context) {
        return this.parts
            .map(part => {
            if (part.string) {
                return part.string;
            }
            else if (part.expression) {
                const val = part.expression.getValue(context);
                if (part.format) {
                    return d3_format_1.format(part.format)(+val);
                }
                else {
                    return val;
                }
            }
        })
            .join("");
    }
    isTrivialString() {
        return this.parts.every(x => x.string != null);
    }
    toString() {
        return this.parts
            .map(part => {
            if (part.string) {
                return part.string.replace(/([\$\\])/g, "\\$1");
            }
            else if (part.expression) {
                const str = part.expression.toString();
                if (part.format) {
                    return "${" + str + "}{" + part.format + "}";
                }
                else {
                    return "${" + str + "}";
                }
            }
        })
            .join("");
    }
    static Parse(expr) {
        return parser_1.parse(expr, { startRule: "start_text" });
    }
    replace(r) {
        return new TextExpression(this.parts.map(part => {
            if (part.string) {
                return { string: part.string };
            }
            else if (part.expression) {
                if (part.format) {
                    return {
                        expression: part.expression.replace(r),
                        format: part.format
                    };
                }
                else {
                    return { expression: part.expression.replace(r) };
                }
            }
        }));
    }
}
exports.TextExpression = TextExpression;
class Value extends Expression {
    constructor(value) {
        super();
        this.value = value;
    }
    getValue() {
        return this.value;
    }
    toString() {
        return JSON.stringify(this.value);
    }
    getPrecedence() {
        return intrinsics_1.precedences.VALUE;
    }
    replaceChildren(r) {
        return new Value(this.value);
    }
}
exports.Value = Value;
class StringValue extends Value {
}
exports.StringValue = StringValue;
class NumberValue extends Value {
}
exports.NumberValue = NumberValue;
class BooleanValue extends Value {
}
exports.BooleanValue = BooleanValue;
class DateValue extends Value {
}
exports.DateValue = DateValue;
class FieldAccess extends Expression {
    constructor(expr, fields) {
        super();
        this.expr = expr;
        this.fields = fields;
    }
    getValue(c) {
        let v = this.expr.getValue(c);
        for (const f of this.fields) {
            v = v[f];
        }
        return v;
    }
    toString() {
        return `${this.expr.toStringPrecedence(intrinsics_1.precedences.FIELD_ACCESS)}.${this.fields.map(Variable.VariableNameToString).join(".")}`;
    }
    getPrecedence() {
        return intrinsics_1.precedences.FIELD_ACCESS;
    }
    replaceChildren(r) {
        return new FieldAccess(this.expr.replace(r), this.fields);
    }
}
exports.FieldAccess = FieldAccess;
class FunctionCall extends Expression {
    constructor(parts, args) {
        super();
        this.name = parts.join(".");
        this.args = args;
        let v = intrinsics_1.functions;
        for (const part of parts) {
            if (v.hasOwnProperty(part)) {
                v = v[part];
            }
            else {
                v = undefined;
            }
        }
        if (v == undefined) {
            throw new SyntaxError(`undefiend function ${this.name}`);
        }
        else {
            this.function = v;
        }
    }
    getValue(c) {
        return this.function(...this.args.map(arg => arg.getValue(c)));
    }
    toString() {
        return `${this.name}(${this.args
            .map(arg => arg.toStringPrecedence(intrinsics_1.precedences.FUNCTION_ARGUMENT))
            .join(", ")})`;
    }
    getPrecedence() {
        return intrinsics_1.precedences.FUNCTION_CALL;
    }
    replaceChildren(r) {
        return new FunctionCall(this.name.split("."), this.args.map(x => x.replace(r)));
    }
}
exports.FunctionCall = FunctionCall;
class Operator extends Expression {
    constructor(name, lhs, rhs) {
        super();
        this.name = name;
        this.lhs = lhs;
        this.rhs = rhs;
        if (rhs != undefined) {
            this.op = intrinsics_1.operators[name];
        }
        else {
            this.op = intrinsics_1.operators["unary:" + name];
        }
    }
    getValue(c) {
        const lhs = this.lhs.getValue(c);
        if (this.rhs != undefined) {
            const rhs = this.rhs.getValue(c);
            return this.op(lhs, rhs);
        }
        else {
            return this.op(lhs);
        }
    }
    toString() {
        const p = this.getMyPrecedence();
        if (this.rhs != undefined) {
            return `${this.lhs.toStringPrecedence(p[1])} ${this.name} ${this.rhs.toStringPrecedence(p[2])}`;
        }
        else {
            return `${this.name} ${this.lhs.toStringPrecedence(p[1])}`;
        }
    }
    getMyPrecedence() {
        if (this.rhs != undefined) {
            return intrinsics_1.precedences.OPERATORS[this.name];
        }
        else {
            return intrinsics_1.precedences.OPERATORS["unary:" + this.name];
        }
    }
    getPrecedence() {
        return this.getMyPrecedence()[0];
    }
    replaceChildren(r) {
        return new Operator(this.name, this.lhs.replace(r), this.rhs ? this.rhs.replace(r) : null);
    }
}
exports.Operator = Operator;
class LambdaFunction extends Expression {
    constructor(expr, argNames) {
        super();
        this.expr = expr;
        this.argNames = argNames;
    }
    getValue(c) {
        return (...args) => {
            const lambdaContext = new ShadowContext(c);
            for (let i = 0; i < this.argNames.length; i++) {
                lambdaContext.shadows[this.argNames[i]] = args[i];
            }
            return this.expr.getValue(lambdaContext);
        };
    }
    toString() {
        return `(${this.argNames.join(", ")}) => ${this.expr.toStringPrecedence(intrinsics_1.precedences.LAMBDA_EXPRESSION)}`;
    }
    getPrecedence() {
        return intrinsics_1.precedences.LAMBDA_FUNCTION;
    }
    replaceChildren(r) {
        // Mask the argument variables in the lambda function
        const rMasked = (expr) => {
            if (expr instanceof Variable && this.argNames.indexOf(expr.name) >= 0) {
                return undefined;
            }
            else {
                return r(expr);
            }
        };
        return new LambdaFunction(this.expr.replace(rMasked), this.argNames);
    }
}
exports.LambdaFunction = LambdaFunction;
class Variable extends Expression {
    constructor(name) {
        super();
        this.name = name;
    }
    getValue(c) {
        const v = c.getVariable(this.name);
        if (v === undefined) {
            return intrinsics_1.constants[this.name];
        }
        else {
            return v;
        }
    }
    toString() {
        return Variable.VariableNameToString(this.name);
    }
    getPrecedence() {
        return intrinsics_1.precedences.VARIABLE;
    }
    static VariableNameToString(name) {
        if (name.match(/^[a-zA-Z_][a-zA-Z0-9_]*$/)) {
            return name;
        }
        else {
            return JSON.stringify(name).replace(/^\"|\"$/g, "`");
        }
    }
    replaceChildren(r) {
        return new Variable(this.name);
    }
}
exports.Variable = Variable;
//# sourceMappingURL=classes.js.map