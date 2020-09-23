"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ConstraintStrength;
(function (ConstraintStrength) {
    ConstraintStrength[ConstraintStrength["HARD"] = 1] = "HARD";
    ConstraintStrength[ConstraintStrength["STRONG"] = 2] = "STRONG";
    ConstraintStrength[ConstraintStrength["MEDIUM"] = 3] = "MEDIUM";
    ConstraintStrength[ConstraintStrength["WEAK"] = 4] = "WEAK";
    ConstraintStrength[ConstraintStrength["WEAKER"] = 5] = "WEAKER";
})(ConstraintStrength = exports.ConstraintStrength || (exports.ConstraintStrength = {}));
class ConstraintPlugin {
}
exports.ConstraintPlugin = ConstraintPlugin;
class ConstraintSolver {
    constructor() {
        this.plugins = [];
    }
    // /** Solve the constraints asynchronously */
    // public abstract solveAsync(callback: (finish: boolean) => void): void;
    // /** Stop the async solve */
    // public abstract solveAsyncStop(): void;
    // Below are general helper functions
    /** Get attributes */
    attrs(map, name) {
        return name.map(n => this.attr(map, n));
    }
    /** Get a linear value */
    getLinear(...items) {
        let s = 0;
        for (const v of items) {
            s += v[0] * this.getValue(v[1]);
        }
        return s;
    }
    /** Add a constraint that enfoces a = b */
    addEquals(strength, a, b) {
        this.addLinear(strength, 0, [[1, a], [-1, b]]);
    }
    /** Add a constraint that enfoces a = value */
    addEqualToConstant(strength, a, value) {
        this.addLinear(strength, value, [[-1, a]]);
    }
    addPlugin(plugin) {
        this.plugins.push(plugin);
    }
    applyPlugins() {
        this.plugins.forEach(p => p.apply());
    }
}
exports.ConstraintSolver = ConstraintSolver;
//# sourceMappingURL=abstract.js.map