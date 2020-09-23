"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Helper functions for digest
function objectDigest(obj) {
    return obj ? [obj.classID, obj._id] : null;
}
exports.objectDigest = objectDigest;
class Action {
    dispatch(dispatcher) {
        dispatcher.dispatch(this);
    }
    digest() {
        return { name: this.constructor.name };
    }
}
exports.Action = Action;
class SelectMark extends Action {
    constructor(plotSegment, glyph, mark, glyphIndex = null) {
        super();
        this.plotSegment = plotSegment;
        this.glyph = glyph;
        this.mark = mark;
        this.glyphIndex = glyphIndex;
    }
    digest() {
        return {
            name: "SelectMark",
            plotSegment: objectDigest(this.plotSegment),
            glyph: objectDigest(this.glyph),
            mark: objectDigest(this.mark),
            glyphIndex: this.glyphIndex
        };
    }
}
exports.SelectMark = SelectMark;
class ClearSelection extends Action {
    digest() {
        return {
            name: "ClearSelection"
        };
    }
}
exports.ClearSelection = ClearSelection;
//# sourceMappingURL=actions.js.map