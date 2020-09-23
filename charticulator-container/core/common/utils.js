"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
/** zip two arrays, return an iterator */
function* zip(a, b) {
    for (let i = 0; i < a.length; i++) {
        yield [a[i], b[i]];
    }
}
exports.zip = zip;
/** zip two arrays, return a new array */
function zipArray(a, b) {
    if (a.length < b.length) {
        return a.map((elem, idx) => [elem, b[idx]]);
    }
    else {
        return b.map((elem, idx) => [a[idx], elem]);
    }
}
exports.zipArray = zipArray;
/** Transpose a matrix r[i][j] = matrix[j][i] */
function transpose(matrix) {
    if (matrix == undefined) {
        return undefined;
    }
    if (matrix.length == 0) {
        return [];
    }
    const jLength = matrix[0].length;
    const r = [];
    for (let j = 0; j < jLength; j++) {
        const rj = [];
        for (let i = 0; i < matrix.length; i++) {
            rj.push(matrix[i][j]);
        }
        r.push(rj);
    }
    return r;
}
exports.transpose = transpose;
/** Generate a range of integers: [start, end) */
function makeRange(start, end) {
    const r = [];
    for (let i = start; i < end; i++) {
        r.push(i);
    }
    return r;
}
exports.makeRange = makeRange;
/** Deep clone an object. The object must be JSON-serializable */
function deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
}
exports.deepClone = deepClone;
function shallowClone(obj) {
    const r = {};
    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            r[key] = obj[key];
        }
    }
    return r;
}
exports.shallowClone = shallowClone;
function max(array, accessor) {
    // Credit: https://github.com/d3/d3-array/blob/master/src/max.js
    let i = -1;
    const n = array.length;
    let value;
    let max;
    while (++i < n) {
        if ((value = accessor(array[i], i, array)) != null && value >= value) {
            max = value;
            while (++i < n) {
                if ((value = accessor(array[i], i, array)) != null && value > max) {
                    max = value;
                }
            }
        }
    }
    return max;
}
exports.max = max;
function argMax(array, accessor) {
    let i = -1;
    const n = array.length;
    let value;
    let max;
    let argmax = -1;
    while (++i < n) {
        if ((value = accessor(array[i], i, array)) != null && value >= value) {
            max = value;
            argmax = i;
            while (++i < n) {
                if ((value = accessor(array[i], i, array)) != null && value > max) {
                    max = value;
                    argmax = i;
                }
            }
        }
    }
    return argmax;
}
exports.argMax = argMax;
function min(array, accessor) {
    // Credit: https://github.com/d3/d3-array/blob/master/src/min.js
    let i = -1;
    const n = array.length;
    let value;
    let min;
    while (++i < n) {
        if ((value = accessor(array[i], i, array)) != null && value >= value) {
            min = value;
            while (++i < n) {
                if ((value = accessor(array[i], i, array)) != null && min > value) {
                    min = value;
                }
            }
        }
    }
    return min;
}
exports.min = min;
function argMin(array, accessor) {
    let i = -1;
    const n = array.length;
    let value;
    let min;
    let argmin;
    while (++i < n) {
        if ((value = accessor(array[i], i, array)) != null && value >= value) {
            min = value;
            argmin = i;
            while (++i < n) {
                if ((value = accessor(array[i], i, array)) != null && min > value) {
                    min = value;
                    argmin = i;
                }
            }
        }
    }
    return argmin;
}
exports.argMin = argMin;
function setField(obj, field, value) {
    let p = obj;
    if (typeof field == "string" || typeof field == "number") {
        p[field] = value;
    }
    else {
        for (let i = 0; i < field.length - 1; i++) {
            if (p[field[i]] == undefined) {
                p[field[i]] = {};
            }
            p = p[field[i]];
        }
        p[field[field.length - 1]] = value;
    }
    return obj;
}
exports.setField = setField;
function getField(obj, field) {
    let p = obj;
    if (typeof field == "string" || typeof field == "number") {
        return p[field];
    }
    else {
        const fieldList = field;
        for (let i = 0; i < fieldList.length - 1; i++) {
            if (p[fieldList[i]] == undefined) {
                return undefined;
            }
            p = p[fieldList[i]];
        }
        return p[fieldList[fieldList.length - 1]];
    }
}
exports.getField = getField;
/** Fill default values into an object */
function fillDefaults(obj, defaults) {
    if (obj == null) {
        obj = {};
    }
    for (const key in defaults) {
        if (defaults.hasOwnProperty(key)) {
            if (!obj.hasOwnProperty(key)) {
                obj[key] = defaults[key];
            }
        }
    }
    return obj;
}
exports.fillDefaults = fillDefaults;
/** Find the index of the first element that satisfies the predicate, return -1 if not found */
function indexOf(array, predicate) {
    for (let i = 0; i < array.length; i++) {
        if (predicate(array[i], i)) {
            return i;
        }
    }
    return -1;
}
exports.indexOf = indexOf;
/** Get the first element with element._id == id, return null if not found */
function getById(array, id) {
    for (let i = 0; i < array.length; i++) {
        if (array[i]._id == id) {
            return array[i];
        }
    }
    return null;
}
exports.getById = getById;
/** Get the index of the first element with element._id == id, return -1 if not found */
function getIndexById(array, id) {
    for (let i = 0; i < array.length; i++) {
        if (array[i]._id == id) {
            return i;
        }
    }
    return -1;
}
exports.getIndexById = getIndexById;
/** Get the first element with element.name == name, return null if not found */
function getByName(array, name) {
    for (let i = 0; i < array.length; i++) {
        if (array[i].name == name) {
            return array[i];
        }
    }
    return null;
}
exports.getByName = getByName;
/** Get the index of the first element with element.name == name, return -1 if not found */
function getIndexByName(array, name) {
    for (let i = 0; i < array.length; i++) {
        if (array[i].name == name) {
            return i;
        }
    }
    return -1;
}
exports.getIndexByName = getIndexByName;
function gather(array, keyFunction) {
    const map = new Map();
    array.forEach((item, index) => {
        const key = keyFunction(item, index);
        if (map.has(key)) {
            map.get(key).push(item);
        }
        else {
            map.set(key, [item]);
        }
    });
    const r = [];
    for (const array of map.values()) {
        r.push(array);
    }
    return r;
}
exports.gather = gather;
/**
 * Sort an array with compare function, make sure when compare(a, b) == 0,
 * a and b are still in the original order (i.e., stable)
 */
function stableSort(array, compare) {
    return (array
        // Convert to [ item, index ]
        .map((x, index) => [x, index])
        // Sort by compare then by index to stabilize
        .sort((a, b) => {
        const c = compare(a[0], b[0]);
        if (c != 0) {
            return c;
        }
        else {
            return a[1] - b[1];
        }
    })
        // Extract items back
        .map(x => x[0]));
}
exports.stableSort = stableSort;
/** Sort an array by key given by keyFunction */
function sortBy(array, keyFunction, reverse = false) {
    if (reverse) {
        return array.sort((a, b) => {
            const ka = keyFunction(a);
            const kb = keyFunction(b);
            if (ka == kb) {
                return 0;
            }
            return ka < kb ? +1 : -1;
        });
    }
    else {
        return array.sort((a, b) => {
            const ka = keyFunction(a);
            const kb = keyFunction(b);
            if (ka == kb) {
                return 0;
            }
            return ka < kb ? -1 : +1;
        });
    }
}
exports.sortBy = sortBy;
/** Stable sort an array by key given by keyFunction */
function stableSortBy(array, keyFunction, reverse = false) {
    if (reverse) {
        return stableSort(array, (a, b) => {
            const ka = keyFunction(a);
            const kb = keyFunction(b);
            if (ka == kb) {
                return 0;
            }
            return ka < kb ? +1 : -1;
        });
    }
    else {
        return stableSort(array, (a, b) => {
            const ka = keyFunction(a);
            const kb = keyFunction(b);
            if (ka == kb) {
                return 0;
            }
            return ka < kb ? -1 : +1;
        });
    }
}
exports.stableSortBy = stableSortBy;
/** Map object that maps (Object, string) into ValueType */
class KeyNameMap {
    constructor() {
        this.mapping = new Map();
    }
    /** Add a new entry to the map */
    add(key, name, value) {
        if (this.mapping.has(key)) {
            this.mapping.get(key)[name] = value;
        }
        else {
            const item = {};
            item[name] = value;
            this.mapping.set(key, item);
        }
    }
    /** Delete an entry (do nothing if not exist) */
    delete(key, name) {
        if (this.mapping.has(key)) {
            delete this.mapping.get(key)[name];
        }
    }
    /** Determine if the map has an entry */
    has(key, name) {
        if (this.mapping.has(key)) {
            return this.mapping.get(key).hasOwnProperty(name);
        }
        return false;
    }
    /** Get the value corresponding to an entry, return null if not found */
    get(key, name) {
        if (this.mapping.has(key)) {
            const m = this.mapping.get(key);
            if (m.hasOwnProperty(name)) {
                return m[name];
            }
            return null;
        }
        return null;
    }
    forEach(callback) {
        this.mapping.forEach((v, key) => {
            for (const p in v) {
                if (v.hasOwnProperty(p)) {
                    callback(v[p], key, p);
                }
            }
        });
    }
}
exports.KeyNameMap = KeyNameMap;
class HashMap {
    constructor() {
        this.map = new Map();
    }
    set(key, value) {
        this.map.set(this.hash(key), value);
    }
    get(key) {
        return this.map.get(this.hash(key));
    }
    has(key) {
        return this.map.has(this.hash(key));
    }
    delete(key) {
        this.map.delete(this.hash(key));
    }
    clear() {
        this.map.clear();
    }
    values() {
        return this.map.values();
    }
}
exports.HashMap = HashMap;
class MultistringHashMap extends HashMap {
    constructor() {
        super(...arguments);
        this.separator = Math.random()
            .toString(36)
            .substr(2);
    }
    hash(key) {
        return key.join(this.separator);
    }
}
exports.MultistringHashMap = MultistringHashMap;
/** Parse semver version string into a ParsedVersion */
function parseVersion(version) {
    const m = version.match(/^(\d+)\.(\d+)\.(\d+)$/);
    return {
        major: +m[1],
        minor: +m[2],
        patch: +m[3]
    };
}
exports.parseVersion = parseVersion;
/**
 * Compare two version strings
 * @param version1 version number 1
 * @param version2 version number 2
 * @returns negative if version1 < version2, zero if version1 == version2, positive if version1 > version2
 */
function compareVersion(version1, version2) {
    const p1 = parseVersion(version1);
    const p2 = parseVersion(version2);
    // Compare major version first, then minor and patch.
    if (p1.major != p2.major) {
        return p1.major - p2.major;
    }
    if (p1.minor != p2.minor) {
        return p1.minor - p2.minor;
    }
    return p1.patch - p2.patch;
}
exports.compareVersion = compareVersion;
function componentToHex(c) {
    const hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}
/**
 * Converts Color object to Hex
 * @param color Color object
 * @returns Hex representation of color
 */
function rgbToHex(color) {
    if (!color) {
        return null;
    }
    return ("#" +
        componentToHex(color.r) +
        componentToHex(color.g) +
        componentToHex(color.b));
}
exports.rgbToHex = rgbToHex;
/**
 * Converts Hex to Color object
 * @param color Color object
 * @returns Hex representation of color
 */
function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
        ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        }
        : null;
}
exports.hexToRgb = hexToRgb;
//# sourceMappingURL=utils.js.map