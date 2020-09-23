"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
const LSCGSolver = require("lscg-solver");
const common_1 = require("../common");
const abstract_1 = require("./abstract");
function initialize() {
    return LSCGSolver.initialize();
}
exports.initialize = initialize;
exports.Matrix = LSCGSolver.Matrix;
const strengthMap = {
    [abstract_1.ConstraintStrength.HARD]: LSCGSolver.ConstraintSolver.STRENGTH_HARD,
    [abstract_1.ConstraintStrength.STRONG]: LSCGSolver.ConstraintSolver.STRENGTH_STRONG,
    [abstract_1.ConstraintStrength.MEDIUM]: LSCGSolver.ConstraintSolver.STRENGTH_MEDIUM,
    [abstract_1.ConstraintStrength.WEAK]: LSCGSolver.ConstraintSolver.STRENGTH_WEAK,
    [abstract_1.ConstraintStrength.WEAKER]: LSCGSolver.ConstraintSolver.STRENGTH_WEAKER
};
class WASMSolver extends abstract_1.ConstraintSolver {
    constructor() {
        super();
        this.currentIndex = 0;
        this.softInequalities = [];
        this.variables = new common_1.KeyNameMap();
        this.solver = new LSCGSolver.ConstraintSolver();
        this.solver.flags = LSCGSolver.ConstraintSolver.FLAG_REDUCE; // | LSCGSolver.ConstraintSolver.FLAG_LAGRANGE;
        this.solver.tolerance = 1e-8;
    }
    makeConstant(map, name) {
        this.solver.makeConstant(this.attr(map, name).index);
    }
    /** Get the variable of an attribute */
    attr(map, name, options) {
        if (this.variables.has(map, name)) {
            return this.variables.get(map, name);
        }
        else {
            this.currentIndex++;
            const item = { index: this.currentIndex, map, name };
            this.variables.add(map, name, item);
            let value = +map[name];
            // Safety check: the solver won't like NaNs
            if (isNaN(value)) {
                value = 0;
            }
            this.solver.addVariable(this.currentIndex, value, options ? options.edit : false);
            if (!options) {
                console.warn(`Creating new attr ${name} without options`);
            }
            return item;
        }
    }
    /** Get the value of a variable */
    getValue(attr) {
        return attr.map[attr.name];
    }
    /** Set the value of a variable */
    setValue(attr, value) {
        attr.map[attr.name] = value;
    }
    /** Add a linear constraint */
    addLinear(strength, bias, lhs, rhs) {
        const st = strengthMap[strength];
        const weights = [];
        const variable_names = [];
        for (const item of lhs) {
            weights.push(item[0]);
            variable_names.push(item[1].index);
        }
        if (rhs) {
            for (const item of rhs) {
                weights.push(-item[0]);
                variable_names.push(item[1].index);
            }
        }
        this.solver.addConstraint(st, bias, variable_names, weights);
    }
    /** Add a soft inequality constraint: bias + linear(lhs) >= linear(rhs) */
    addSoftInequality(strength, bias, lhs, rhs) {
        const st = strengthMap[strength];
        const weights = [];
        const variable_names = [];
        for (const item of lhs) {
            weights.push(item[0]);
            variable_names.push(item[1].index);
        }
        if (rhs) {
            for (const item of rhs) {
                weights.push(-item[0]);
                variable_names.push(item[1].index);
            }
        }
        const id = this.solver.addConstraint(st, bias, variable_names, weights);
        this.softInequalities.push({
            id,
            bias,
            variable_names,
            weights
        });
    }
    /** Solve the constraints */
    solve() {
        this.variables.forEach((value, map, key) => {
            this.solver.setValue(value.index, map[key]);
        });
        this.solver.regularizerWeight = 0.001;
        const maxIters = 20;
        for (let iter = 0; iter < maxIters; iter++) {
            this.solver.solve();
            let shouldReiterate = false;
            for (const soft of this.softInequalities) {
                let value = soft.bias;
                for (let i = 0; i < soft.variable_names.length; i++) {
                    value +=
                        this.solver.getValue(soft.variable_names[i]) * soft.weights[i];
                }
                if (value >= -1e-6) {
                    this.solver.setConstraintStrength(soft.id, LSCGSolver.ConstraintSolver.STRENGTH_DISABLED);
                }
                else {
                    shouldReiterate = true;
                }
            }
            if (!shouldReiterate) {
                break;
            }
            if (iter == maxIters - 1) {
                console.warn(`Soft inequalities didn't converge within ${maxIters} iterations`);
            }
        }
        this.variables.forEach((value, map, key) => {
            map[key] = this.solver.getValue(value.index);
        });
        return [0, this.solver.error];
    }
    destroy() {
        this.solver.destroy();
    }
}
exports.WASMSolver = WASMSolver;
//# sourceMappingURL=wasm_solver.js.map