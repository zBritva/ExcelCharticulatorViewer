"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mark_1 = require("./mark");
const specification_1 = require("../../specification");
const DEFAULT_EMPHASIS_DESATURATION = {
    saturation: { multiply: 0.2 },
    lightness: { add: 0.01, pow: 0.2 }
};
const DEFAULT_EMPHASIS_STROKE_COLOR = { r: 255, g: 0, b: 0 };
const DEFAULT_EMPHASIS_STROKE_WIDTH = 1;
/**
 * Represents a mark class that is emphasizable
 */
class EmphasizableMarkClass extends mark_1.MarkClass {
    constructor(parent, object, state, defaultMethod = specification_1.EmphasisMethod.Saturation) {
        super(parent, object, state);
        this.defaultMethod = defaultMethod;
    }
    /**
     * Generates styling info for styling emphasized marks
     * @param emphasize If true, emphasis will be applied.
     */
    generateEmphasisStyle(emphasize) {
        // If emphasize is undefined (or true), we use full saturation
        const style = {
            saturation: 1
        };
        // only if emphasize is explicitly false to we use saturation of .7
        const method = this.object.properties.emphasisMethod || this.defaultMethod;
        if (method === specification_1.EmphasisMethod.Saturation && emphasize === false) {
            style.colorFilter = DEFAULT_EMPHASIS_DESATURATION;
        }
        if (method === specification_1.EmphasisMethod.Outline && emphasize) {
            style.strokeColor = DEFAULT_EMPHASIS_STROKE_COLOR;
            style.strokeWidth = DEFAULT_EMPHASIS_STROKE_WIDTH;
        }
        return style;
    }
}
exports.EmphasizableMarkClass = EmphasizableMarkClass;
//# sourceMappingURL=emphasis.js.map