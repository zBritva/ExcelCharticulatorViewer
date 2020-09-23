"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
const d3_time_format_1 = require("d3-time-format");
const d3_format_1 = require("d3-format");
const datetime_1 = require("../dataset/datetime");
exports.constants = {};
exports.functions = {};
exports.operators = {};
exports.precedences = {
    LAMBDA_EXPRESSION: 1,
    FUNCTION_ARGUMENT: 0,
    OPERATORS: {
        "unary:not": [11, 11],
        and: [12, 12, 12],
        or: [13, 13, 13],
        ">": [14, 14, 15],
        "<": [14, 14, 15],
        ">=": [14, 14, 15],
        "<=": [14, 14, 15],
        "==": [14, 14, 15],
        "!=": [14, 14, 15],
        "+": [16, 16, 16],
        "-": [16, 16, 17],
        "*": [18, 18, 18],
        "/": [18, 18, 19],
        "^": [20, 20, 21],
        "unary:+": [22, 22],
        "unary:-": [23, 23]
    },
    FUNCTION_CALL: 100,
    LAMBDA_FUNCTION: 100,
    VARIABLE: 100,
    FIELD_ACCESS: 100,
    VALUE: 100
};
// Math constants
exports.constants.PI = Math.PI;
exports.constants.E = Math.E;
/** Make a unary function capable of taking element-wise array input */
function makeArrayCapable1(f) {
    return (a) => {
        if (a instanceof Array) {
            return a.map(f);
        }
        else {
            return f(a);
        }
    };
}
/** Make a binary function capable of taking element-wise array input */
function makeArrayCapable2(f) {
    return (a, b) => {
        if (a instanceof Array && b instanceof Array) {
            return a.map((ai, i) => f(ai, b[i]));
        }
        else if (a instanceof Array) {
            return a.map(ai => f(ai, b));
        }
        else if (b instanceof Array) {
            return b.map(bi => f(a, bi));
        }
        else {
            return f(a, b);
        }
    };
}
// Math functions
exports.functions.abs = makeArrayCapable1(Math.abs);
exports.functions.sign = makeArrayCapable1(Math.sign);
exports.functions.floor = makeArrayCapable1(Math.floor);
exports.functions.ceil = makeArrayCapable1(Math.ceil);
exports.functions.exp = makeArrayCapable1(Math.exp);
exports.functions.log = makeArrayCapable1(Math.log);
exports.functions.log10 = makeArrayCapable1(Math.log10);
exports.functions.sin = makeArrayCapable1(Math.sin);
exports.functions.cos = makeArrayCapable1(Math.cos);
exports.functions.tan = makeArrayCapable1(Math.tan);
exports.functions.asin = makeArrayCapable1(Math.asin);
exports.functions.acos = makeArrayCapable1(Math.acos);
exports.functions.atan = makeArrayCapable1(Math.atan);
exports.functions.atan2 = makeArrayCapable2(Math.atan2);
exports.functions.tanh = makeArrayCapable1(Math.tanh);
exports.functions.sqrt = makeArrayCapable1(Math.sqrt);
exports.functions.pow = makeArrayCapable2(Math.pow);
// List and range
exports.functions.array = (...args) => args;
exports.functions.list = exports.functions.array;
exports.functions.length = (arg) => arg.length;
exports.functions.range = (min, max, step = 1) => {
    const opt = [];
    for (let i = min; i <= max; i += step) {
        opt.push(i);
    }
    return opt;
};
// Object and fields
exports.functions.get = (obj, field) => obj[field];
// Array functions
exports.functions.first = (list) => list[0];
exports.functions.last = (list) => list[list.length - 1];
exports.functions.map = (list, func) => list.map(item => func(item));
exports.functions.filter = (list, func) => list.filter(item => func(item));
// Statistics
function stat_foreach(f, list) {
    for (let i = 0; i < list.length; i++) {
        const l = list[i];
        if (l instanceof Array) {
            for (let j = 0; j < l.length; j++) {
                if (l[j] != null) {
                    f(l[j]);
                }
            }
        }
        else {
            if (l != null) {
                f(l);
            }
        }
    }
}
exports.functions.min = (...list) => {
    let r = null;
    stat_foreach(x => {
        if (r == null || x < r) {
            r = x;
        }
    }, list);
    return r;
};
exports.functions.max = (...list) => {
    let r = null;
    stat_foreach(x => {
        if (r == null || x > r) {
            r = x;
        }
    }, list);
    return r;
};
exports.functions.sum = (...list) => {
    let r = 0;
    stat_foreach(x => (r += x), list);
    return r;
};
exports.functions.count = (...list) => {
    let r = 0;
    stat_foreach(x => (r += 1), list);
    return r;
};
exports.functions.stdev = (...list) => {
    let count = 0;
    let sumX = 0;
    let sumX2 = 0;
    stat_foreach(x => {
        count += 1;
        sumX += x;
        sumX2 += x * x;
    }, list);
    sumX2 /= count;
    sumX /= count;
    return Math.sqrt(sumX2 - sumX * sumX);
};
exports.functions.variance = (...list) => {
    let count = 0;
    let sumX = 0;
    let sumX2 = 0;
    stat_foreach(x => {
        count += 1;
        sumX += x;
        sumX2 += x * x;
    }, list);
    sumX2 /= count;
    sumX /= count;
    return sumX2 - sumX * sumX;
};
exports.functions.median = (...list) => {
    const values = [];
    stat_foreach(x => {
        values.push(x);
    }, list);
    values.sort((a, b) => a - b);
    if (values.length % 2 == 0) {
        return (values[values.length / 2] + values[values.length / 2 + 1]) / 2;
    }
    else {
        return values[(values.length - 1) / 2];
    }
};
exports.functions.avg = (...list) => {
    let r = 0, c = 0;
    stat_foreach(x => {
        r += x;
        c += 1;
    }, list);
    if (c == 0) {
        return NaN;
    }
    return r / c;
};
exports.functions.mean = exports.functions.avg;
exports.functions.average = exports.functions.avg;
// General operators
exports.operators["+"] = makeArrayCapable2((a, b) => a + b);
exports.operators["-"] = makeArrayCapable2((a, b) => a - b);
exports.operators["*"] = makeArrayCapable2((a, b) => a * b);
exports.operators["/"] = makeArrayCapable2((a, b) => a / b);
exports.operators["^"] = makeArrayCapable2((a, b) => Math.pow(a, b));
exports.operators["unary:+"] = makeArrayCapable1((a) => +a);
exports.operators["unary:-"] = makeArrayCapable1((a) => -a);
exports.operators["<"] = makeArrayCapable2((a, b) => a < b);
exports.operators[">"] = makeArrayCapable2((a, b) => a > b);
exports.operators["<="] = makeArrayCapable2((a, b) => a <= b);
exports.operators[">="] = makeArrayCapable2((a, b) => a >= b);
exports.operators["=="] = makeArrayCapable2((a, b) => a == b);
exports.operators["!="] = makeArrayCapable2((a, b) => a != b);
exports.operators.and = makeArrayCapable2((a, b) => a && b);
exports.operators.or = makeArrayCapable2((a, b) => a || b);
exports.operators["unary:not"] = makeArrayCapable1((a) => !a);
// Date operations
exports.functions.date = {
    parse: makeArrayCapable1((x) => datetime_1.parseDate(x)),
    year: makeArrayCapable1(d3_time_format_1.utcFormat("%Y")),
    month: makeArrayCapable1(d3_time_format_1.utcFormat("%b")),
    day: makeArrayCapable1(d3_time_format_1.utcFormat("%d")),
    weekOfYear: makeArrayCapable1(d3_time_format_1.utcFormat("%U")),
    dayOfYear: makeArrayCapable1(d3_time_format_1.utcFormat("%j")),
    weekday: makeArrayCapable1(d3_time_format_1.utcFormat("%a")),
    hour: makeArrayCapable1(d3_time_format_1.utcFormat("%H")),
    minute: makeArrayCapable1(d3_time_format_1.utcFormat("%M")),
    second: makeArrayCapable1(d3_time_format_1.utcFormat("%S")),
    timestamp: makeArrayCapable1((d) => d.getTime() / 1000)
};
exports.functions.format = makeArrayCapable2((value, spec) => {
    return d3_format_1.format(spec)(value);
});
// JSON format
exports.functions.json = {
    parse: makeArrayCapable1((x) => JSON.parse(x)),
    stringify: makeArrayCapable1((x) => JSON.stringify(x))
};
// Comparison
exports.functions.sortBy = (fieldName, reversed = false) => {
    const SM = reversed ? 1 : -1;
    const LG = reversed ? -1 : 1;
    if (typeof fieldName == "string") {
        return (a, b) => {
            const fa = a[fieldName];
            const fb = b[fieldName];
            if (fa == fb) {
                return 0;
            }
            return fa < fb ? SM : LG;
        };
    }
    else {
        return (a, b) => {
            const fa = fieldName(a);
            const fb = fieldName(b);
            if (fa == fb) {
                return 0;
            }
            return fa < fb ? SM : LG;
        };
    }
};
exports.functions.columnName = (columns, name) => {
    if (columns instanceof Array) {
        const column = columns.find(column => column.name === name);
        return column.displayName || column.name;
    }
    else {
        return columns.displayName || columns.name;
    }
};
//# sourceMappingURL=intrinsics.js.map