"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
const common_1 = require("../common");
const Controls = require("./controls");
exports.Controls = Controls;
__export(require("./chart_element"));
__export(require("./object"));
function findObjectById(spec, id) {
    if (spec._id == id) {
        return spec;
    }
    let obj = common_1.getById(spec.scales, id) ||
        common_1.getById(spec.elements, id) ||
        common_1.getById(spec.glyphs, id);
    if (obj != null) {
        return obj;
    }
    for (const glyph of spec.glyphs) {
        obj = common_1.getById(glyph.marks, id);
        if (obj != null) {
            return obj;
        }
    }
    return null;
}
exports.findObjectById = findObjectById;
function* forEachObject(chart) {
    yield { kind: "chart", object: chart };
    for (const chartElement of chart.elements) {
        yield { kind: "chart-element", object: chartElement, chartElement };
    }
    for (const glyph of chart.glyphs) {
        yield { kind: "glyph", object: glyph, glyph };
        for (const mark of glyph.marks) {
            yield { kind: "mark", object: mark, glyph, mark };
        }
    }
    for (const scale of chart.scales) {
        yield { kind: "scale", object: scale, scale };
    }
}
exports.forEachObject = forEachObject;
function* forEachMapping(mappings) {
    for (const key of Object.keys(mappings)) {
        yield [key, mappings[key]];
    }
}
exports.forEachMapping = forEachMapping;
function setProperty(object, property, value) {
    if (typeof property == "string") {
        object.properties[property] = value;
    }
    else {
        common_1.setField(object.properties[property.property], property.field, value);
    }
}
exports.setProperty = setProperty;
function getProperty(object, property) {
    if (typeof property == "string") {
        return object.properties[property];
    }
    else {
        return common_1.getField(object.properties[property.property], property.field);
    }
}
exports.getProperty = getProperty;
//# sourceMappingURL=common.js.map