"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const object_1 = require("./object");
class ObjectClassCache {
    constructor() {
        this.cache = new WeakMap();
    }
    /** Clear the cache */
    clear() {
        this.cache = new WeakMap();
    }
    hasClass(state) {
        return this.cache.has(state);
    }
    getMarkClass(state) {
        return this.getClass(state);
    }
    getGlyphClass(state) {
        return this.getClass(state);
    }
    getPlotSegmentClass(state) {
        return this.getClass(state);
    }
    getChartElementClass(state) {
        return this.getClass(state);
    }
    getScaleClass(state) {
        return this.getClass(state);
    }
    getChartClass(state) {
        return this.getClass(state);
    }
    getClass(state) {
        if (this.cache.has(state)) {
            return this.cache.get(state);
        }
        else {
            throw new Error(`class not found for state`);
        }
    }
    createMarkClass(parent, object, state) {
        return this.createClass(parent, object, state);
    }
    createGlyphClass(parent, object, state) {
        return this.createClass(parent, object, state);
    }
    createPlotSegmentClass(parent, object, state) {
        return this.createClass(parent, object, state);
    }
    createChartElementClass(parent, object, state) {
        return this.createClass(parent, object, state);
    }
    createScaleClass(parent, object, state) {
        return this.createClass(parent, object, state);
    }
    createChartClass(parent, object, state) {
        return this.createClass(parent, object, state);
    }
    createClass(parent, object, state) {
        const newClass = object_1.ObjectClasses.Create(parent, object, state);
        this.cache.set(state, newClass);
        return newClass;
    }
}
exports.ObjectClassCache = ObjectClassCache;
//# sourceMappingURL=cache.js.map