"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
const common_1 = require("../../common");
const solver_1 = require("../../solver");
const specification_1 = require("../../specification");
const index_1 = require("./index");
function reuseMapping(domain, existing) {
    const result = {};
    const available = [];
    for (const d of Object.keys(existing)) {
        if (domain.has(d)) {
            // Found one with the same key, reuse the color
            result[d] = existing[d];
        }
        else {
            // Other, make the color available
            available.push(existing[d]);
        }
    }
    // Assign remaining keys from the domain
    domain.forEach((v, d) => {
        if (!result.hasOwnProperty(d)) {
            if (available.length > 1) {
                result[d] = available[0];
                available.splice(0, 1);
            }
            else {
                // No available color left, fail
                return null;
            }
        }
    });
    return result;
}
class CategoricalScaleNumber extends index_1.ScaleClass {
    constructor() {
        super(...arguments);
        this.attributeNames = ["rangeScale"];
        this.attributes = {
            rangeScale: {
                name: "rangeScale",
                type: specification_1.AttributeType.Number
            }
        };
    }
    mapDataToAttribute(data) {
        const attrs = this.state.attributes;
        const props = this.object.properties;
        const number = props.mapping[data.toString()];
        return number * attrs.rangeScale;
    }
    buildConstraint(data, target, solver) {
        const attrs = this.state.attributes;
        const props = this.object.properties;
        const k = props.mapping[data.toString()];
        solver.addLinear(solver_1.ConstraintStrength.HARD, 0, [[1, target]], [[k, solver.attr(attrs, "rangeScale")]]);
    }
    initializeState() {
        const attrs = this.state.attributes;
        attrs.rangeScale = 10;
    }
    inferParameters(column, options = {}) {
        const attrs = this.state.attributes;
        const props = this.object.properties;
        const s = new common_1.Scale.CategoricalScale();
        const values = column.filter(x => typeof x == "string");
        s.inferParameters(values, "order");
        props.mapping = {};
        let range = [1, s.domain.size];
        if (options.rangeNumber) {
            range = options.rangeNumber;
        }
        s.domain.forEach((v, d) => {
            props.mapping[d] =
                (v / (s.domain.size - 1)) * (range[1] - range[0]) + range[0];
        });
        attrs.rangeScale = range[1];
    }
    getAttributePanelWidgets(manager) {
        const props = this.object.properties;
        const keys = [];
        for (const key in props.mapping) {
            if (props.mapping.hasOwnProperty(key)) {
                keys.push(key);
            }
        }
        return [
            manager.sectionHeader("Number Mapping"),
            manager.scrollList(keys.map(key => manager.horizontal([2, 3], manager.text(key, "right"), manager.inputNumber({ property: "mapping", field: key }))))
        ];
    }
}
CategoricalScaleNumber.classID = "scale.categorical<string,number>";
CategoricalScaleNumber.type = "scale";
exports.CategoricalScaleNumber = CategoricalScaleNumber;
class CategoricalScaleColor extends index_1.ScaleClass {
    constructor() {
        super(...arguments);
        this.attributeNames = [];
        this.attributes = {};
    }
    mapDataToAttribute(data) {
        const props = this.object.properties;
        return props.mapping[data.toString()];
    }
    initializeState() { }
    inferParameters(column, options = {}) {
        const props = this.object.properties;
        const s = new common_1.Scale.CategoricalScale();
        const values = column
            .filter(x => x != null)
            .map(x => x.toString());
        s.inferParameters(values, "order");
        // If we shouldn't reuse the range, then reset the mapping
        if (!options.reuseRange) {
            props.mapping = null;
            // Otherwise, if we already have a mapping, try to reuse it
        }
        else if (props.mapping != null) {
            props.mapping = reuseMapping(s.domain, props.mapping);
        }
        if (props.mapping == null) {
            // If we can't reuse existing colors, infer from scratch
            props.mapping = {};
            // Find a good default color palette
            const colorList = common_1.getDefaultColorPalette(s.length);
            s.domain.forEach((v, d) => {
                // If we still don't have enough colors, reuse them
                // TODO: fix this with a better method
                props.mapping[d] = colorList[v % colorList.length];
            });
        }
    }
    getAttributePanelWidgets(manager) {
        const props = this.object.properties;
        const keys = [];
        for (const key in props.mapping) {
            if (props.mapping.hasOwnProperty(key)) {
                keys.push(key);
            }
        }
        return [
            manager.sectionHeader("Color Mapping"),
            manager.scrollList(keys.map(key => manager.horizontal([2, 3], manager.text(key, "right"), manager.inputColor({
                property: "mapping",
                field: key,
                noComputeLayout: true
            }))))
        ];
    }
}
CategoricalScaleColor.classID = "scale.categorical<string,color>";
CategoricalScaleColor.type = "scale";
exports.CategoricalScaleColor = CategoricalScaleColor;
class CategoricalScaleEnum extends index_1.ScaleClass {
    constructor() {
        super(...arguments);
        this.attributeNames = [];
        this.attributes = {};
    }
    mapDataToAttribute(data) {
        const props = this.object.properties;
        return props.mapping[data.toString()];
    }
    initializeState() { }
    inferParameters(column, options = {}) {
        const props = this.object.properties;
        const s = new common_1.Scale.CategoricalScale();
        const values = column
            .filter(x => x != null)
            .map(x => x.toString());
        s.inferParameters(values, "order");
        // If we shouldn't reuse the range, then reset the mapping
        if (!options.reuseRange) {
            props.mapping = null;
            // Otherwise, if we already have a mapping, try to reuse it
        }
        else if (props.mapping != null) {
            props.mapping = reuseMapping(s.domain, props.mapping);
        }
        if (props.mapping == null) {
            props.mapping = {};
            if (options.rangeEnum) {
                props.defaultRange = options.rangeEnum.slice();
            }
            s.domain.forEach((v, d) => {
                if (options.rangeEnum) {
                    props.mapping[d] = options.rangeEnum[v % options.rangeEnum.length];
                }
                else {
                    props.mapping[d] = d;
                }
            });
        }
    }
    getAttributePanelWidgets(manager) {
        const props = this.object.properties;
        const keys = [];
        for (const key in props.mapping) {
            if (props.mapping.hasOwnProperty(key)) {
                keys.push(key);
            }
        }
        return [
            manager.sectionHeader("String Mapping"),
            manager.scrollList(keys.map(key => manager.horizontal([2, 3], manager.text(key, "right"), manager.inputComboBox({ property: "mapping", field: key }, props.defaultRange, false))))
        ];
    }
}
CategoricalScaleEnum.classID = "scale.categorical<string,enum>";
CategoricalScaleEnum.type = "scale";
exports.CategoricalScaleEnum = CategoricalScaleEnum;
class CategoricalScaleBoolean extends index_1.ScaleClass {
    constructor() {
        super(...arguments);
        this.attributeNames = [];
        this.attributes = {};
    }
    mapDataToAttribute(data) {
        const props = this.object.properties;
        return props.mapping[data.toString()];
    }
    initializeState() { }
    inferParameters(column, options = {}) {
        const props = this.object.properties;
        const s = new common_1.Scale.CategoricalScale();
        const values = column
            .filter(x => x != null)
            .map(x => x.toString());
        s.inferParameters(values, "order");
        // If we shouldn't reuse the range, then reset the mapping
        if (!options.reuseRange) {
            props.mapping = null;
            // Otherwise, if we already have a mapping, try to reuse it
        }
        else if (props.mapping != null) {
            props.mapping = reuseMapping(s.domain, props.mapping);
        }
        if (props.mapping == null) {
            props.mapping = {};
            s.domain.forEach((v, d) => {
                props.mapping[d] = true;
            });
        }
    }
    getAttributePanelWidgets(manager) {
        const items = [];
        const props = this.object.properties;
        const mappingALL = {};
        const mappingNONE = {};
        for (const key in props.mapping) {
            if (props.mapping.hasOwnProperty(key)) {
                items.push(manager.inputBoolean({ property: "mapping", field: key }, { type: "checkbox-fill-width", label: key }));
                mappingALL[key] = true;
                mappingNONE[key] = false;
            }
        }
        return [
            manager.sectionHeader("Boolean Mapping"),
            manager.row(null, manager.horizontal([0, 0], manager.setButton({ property: "mapping" }, mappingALL, null, "Select All"), manager.setButton({ property: "mapping" }, mappingNONE, null, "Clear"))),
            manager.scrollList(items)
        ];
    }
}
CategoricalScaleBoolean.classID = "scale.categorical<string,boolean>";
CategoricalScaleBoolean.type = "scale";
exports.CategoricalScaleBoolean = CategoricalScaleBoolean;
class CategoricalScaleImage extends index_1.ScaleClass {
    constructor() {
        super(...arguments);
        this.attributeNames = [];
        this.attributes = {};
    }
    mapDataToAttribute(data) {
        const props = this.object.properties;
        return props.mapping[data.toString()];
    }
    initializeState() { }
    inferParameters(column, options = {}) {
        const props = this.object.properties;
        const s = new common_1.Scale.CategoricalScale();
        const values = column
            .filter(x => x != null)
            .map(x => x.toString());
        s.inferParameters(values, "order");
        // If we shouldn't reuse the range, then reset the mapping
        if (!options.reuseRange) {
            props.mapping = null;
            // Otherwise, if we already have a mapping, try to reuse it
        }
        else if (props.mapping != null) {
            props.mapping = reuseMapping(s.domain, props.mapping);
        }
        if (props.mapping == null) {
            props.mapping = {};
            s.domain.forEach((v, d) => {
                if (options.rangeImage) {
                    props.mapping[d] = options.rangeImage[v % options.rangeImage.length];
                }
                else {
                    props.mapping[d] = null;
                }
            });
        }
    }
    getAttributePanelWidgets(manager) {
        const props = this.object.properties;
        const keys = [];
        for (const key in props.mapping) {
            if (props.mapping.hasOwnProperty(key)) {
                keys.push(key);
            }
        }
        return [
            manager.sectionHeader("Image Mapping"),
            manager.scrollList(keys.map(key => manager.horizontal([2, 5], manager.text(key, "right"), manager.inputImageProperty({ property: "mapping", field: key }), manager.clearButton({ property: "mapping", field: key }, ""))))
        ];
    }
}
CategoricalScaleImage.classID = "scale.categorical<string,image>";
CategoricalScaleImage.type = "scale";
exports.CategoricalScaleImage = CategoricalScaleImage;
//# sourceMappingURL=categorical.js.map