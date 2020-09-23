"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
const dataset_1 = require("./dataset");
const datetime_1 = require("./datetime");
exports.dataTypes = {
    boolean: {
        test: (x) => {
            const lx = x.toLowerCase();
            return lx === "true" || lx === "false" || lx == "yes" || lx == "no";
        },
        convert: (x) => {
            const lx = x.toLowerCase();
            if (lx == "true" || lx == "yes") {
                return true;
            }
            else if (lx == "false" || lx == "no") {
                return false;
            }
            else {
                return null;
            }
        }
    },
    number: {
        test: (x) => !isNaN(+x.replace(/\,/g, "")),
        convert: (x) => {
            const value = +x.replace(/\,/g, "");
            return isNaN(value) ? null : value;
        }
    },
    date: {
        test: (x) => datetime_1.parseDate(x) != null,
        convert: (x) => datetime_1.parseDate(x)
    },
    string: {
        test: (x) => true,
        convert: (x) => x.toString()
    }
};
/** Infer column type from a set of strings (not null) */
function inferColumnType(values) {
    const candidates = [
        dataset_1.DataType.Boolean,
        dataset_1.DataType.Number,
        dataset_1.DataType.Date
    ];
    for (let i = 0; i < values.length; i++) {
        let v = values[i];
        v = v.trim();
        if (v == "") {
            continue;
        }
        // test for remaining candidates
        for (let j = 0; j < candidates.length; j++) {
            if (!exports.dataTypes[candidates[j]].test(v)) {
                // console.log(candidates[j], "fail at", v);
                candidates.splice(j, 1);
                j -= 1;
            }
        }
        // if no types left, return "string"
        if (candidates.length == 0) {
            return dataset_1.DataType.String;
        }
    }
    return candidates[0];
}
exports.inferColumnType = inferColumnType;
/** Convert strings to value type, null & non-convertibles are set as null */
function convertColumn(type, values) {
    const converter = exports.dataTypes[type].convert;
    return values.map(v => (v != null ? converter(v) : null));
}
exports.convertColumn = convertColumn;
/** Get distinct values from a non-null array of basic types */
function getDistinctValues(values) {
    const seen = new Set();
    for (const v of values) {
        seen.add(v);
    }
    return Array.from(seen);
}
exports.getDistinctValues = getDistinctValues;
/** Infer column metadata and update type if necessary */
function inferAndConvertColumn(values, hints) {
    const inferredType = inferColumnType(values.filter(x => x != null));
    const convertedValues = convertColumn(inferredType, values);
    if (hints == null) {
        hints = {};
    }
    switch (inferredType) {
        case dataset_1.DataType.Number: {
            const validValues = convertedValues.filter(x => x != null);
            const minValue = Math.min(...validValues);
            const maxValue = Math.max(...validValues);
            if (validValues.every((x) => Math.round(x) == x)) {
                // All integers
                if (minValue >= 1900 && maxValue <= 2100) {
                    // Special case: Year
                    return {
                        type: dataset_1.DataType.String,
                        values: convertedValues.map(x => x.toString()),
                        metadata: {
                            unit: "__year",
                            kind: dataset_1.DataKind.Ordinal,
                            orderMode: "alphabetically"
                        }
                    };
                }
            }
            // let valuesFixed = values
            //   .map(d => +d)
            //   .filter(d => !isNaN(d))
            //   .map(d => d.toFixed(10));
            // valuesFixed = valuesFixed.map(d => {
            //   const m = d.match(/\.([0-9]{10})$/);
            //   if (m) {
            //     return m[1];
            //   } else {
            //     return "0000000000";
            //   }
            // });
            // let k: number;
            // for (k = 10 - 1; k >= 0; k--) {
            //   if (valuesFixed.every(v => v[k] == "0")) {
            //     continue;
            //   } else {
            //     break;
            //   }
            // }
            // const format = `.${k + 1}f`;
            return {
                type: dataset_1.DataType.Number,
                values: convertedValues,
                metadata: {
                    kind: dataset_1.DataKind.Numerical,
                    unit: hints.unit
                }
            };
        }
        case dataset_1.DataType.Boolean: {
            return {
                type: dataset_1.DataType.Boolean,
                values: convertedValues,
                metadata: {
                    kind: dataset_1.DataKind.Categorical
                }
            };
        }
        case dataset_1.DataType.Date: {
            return {
                type: dataset_1.DataType.Date,
                values: convertedValues,
                metadata: {
                    kind: dataset_1.DataKind.Temporal,
                    unit: hints.unit
                }
            };
        }
        case dataset_1.DataType.String: {
            const metadata = {
                kind: dataset_1.DataKind.Categorical,
                unit: hints.unit
            };
            const validValues = convertedValues.filter(x => x != null);
            if (validValues.every((x) => datetime_1.testAndNormalizeMonthName(x) != null)) {
                // Special case: month names
                // Return as ordinal column with month ordering, use normalized month names
                return {
                    type: dataset_1.DataType.String,
                    values: convertedValues.map((x) => x != null ? datetime_1.testAndNormalizeMonthName(x) : null),
                    metadata: {
                        kind: dataset_1.DataKind.Ordinal,
                        order: datetime_1.monthNames,
                        unit: "__month"
                    }
                };
            }
            if (hints.order) {
                metadata.order = hints.order.split(",");
                metadata.kind = dataset_1.DataKind.Ordinal;
            }
            else {
                metadata.orderMode = "alphabetically";
                metadata.kind = dataset_1.DataKind.Categorical;
            }
            return {
                type: dataset_1.DataType.String,
                values: convertedValues,
                metadata
            };
        }
    }
    // We shouldn't get here.
    console.warn("inferAndConvertColumn: inferredType is unexpected");
    return {
        type: inferredType,
        values: convertedValues,
        metadata: { kind: dataset_1.DataKind.Categorical }
    };
}
exports.inferAndConvertColumn = inferAndConvertColumn;
function convertColumnType(values, type) {
    switch (type) {
        case dataset_1.DataType.Boolean: {
            return values.map(v => {
                if (v == null) {
                    return null;
                }
                if (typeof v == "boolean") {
                    return v;
                }
                if (typeof v == "number") {
                    return v > 0;
                }
                const l = v.toString().toLowerCase();
                return l == "yes" || l == "true";
            });
        }
        case dataset_1.DataType.Number: {
            return values.map(v => {
                // Check for null as well, since +null == 0
                if (v == null) {
                    return null;
                }
                const n = +v;
                return isNaN(n) ? null : n;
            });
        }
        case dataset_1.DataType.String: {
            return values.map(v => (v == null ? "" : v.toString()));
        }
        case dataset_1.DataType.Date: {
            return values.map(v => {
                if (v == null) {
                    return null;
                }
                if (typeof v == "number") {
                    return v;
                }
                return datetime_1.parseDate(v.toString());
            });
        }
    }
}
exports.convertColumnType = convertColumnType;
//# sourceMappingURL=data_types.js.map