"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const specification_1 = require("../specification");
class AttrBuilder {
    static attr(name, type, options = {}) {
        const r = {};
        r[name] = Object.assign({ name, type }, options);
        return r;
    }
    static number(name, solvable = true, options = {}) {
        if (solvable) {
            return this.attr(name, specification_1.AttributeType.Number, options);
        }
        else {
            return this.attr(name, specification_1.AttributeType.Number, Object.assign({ solverExclude: true }, options));
        }
    }
    static color(name, options = {}) {
        return this.attr(name, specification_1.AttributeType.Color, Object.assign({ solverExclude: true }, options));
    }
    static boolean(name, options = {}) {
        return this.attr(name, specification_1.AttributeType.Boolean, Object.assign({ solverExclude: true }, options));
    }
    static enum(name, options = {}) {
        return this.attr(name, specification_1.AttributeType.Enum, Object.assign({ solverExclude: true }, options));
    }
    static line() {
        return Object.assign({}, this.number("x1"), this.number("y1"), this.number("x2"), this.number("y2"));
    }
    static point() {
        return Object.assign({}, this.number("x"), this.number("y"));
    }
    static center() {
        return Object.assign({}, this.number("cx"), this.number("cy"));
    }
    static size() {
        return Object.assign({}, this.number("width", true, { defaultRange: [0, 200] }), this.number("height", true, { defaultRange: [0, 200] }));
    }
    static dXdY() {
        return Object.assign({}, this.number("dx", true, { defaultRange: [30, 100] }), this.number("dy", true, { defaultRange: [30, 100] }));
    }
    static opacity() {
        return this.number("opacity", false, {
            defaultRange: [0, 1],
            defaultValue: 1
        });
    }
    static visible() {
        return this.boolean("visible", { defaultValue: true });
    }
    static image() {
        return this.attr("image", specification_1.AttributeType.Image, {
            solverExclude: true,
            defaultValue: null
        });
    }
    static style(options = {}) {
        const r = Object.assign({}, this.color("stroke", { defaultValue: null }), this.number("strokeWidth", false, {
            defaultRange: [0, 5],
            defaultValue: 1
        }), this.opacity(), this.visible());
        if (options.fill) {
            r.fill = this.color("fill", { defaultValue: null }).fill;
        }
        return r;
    }
}
exports.AttrBuilder = AttrBuilder;
//# sourceMappingURL=attrs.js.map