"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
__export(require("./common"));
var config_1 = require("./config");
exports.getConfig = config_1.getConfig;
const Dataset = require("./dataset");
exports.Dataset = Dataset;
const Expression = require("./expression");
exports.Expression = Expression;
const Graphics = require("./graphics");
exports.Graphics = Graphics;
const Prototypes = require("./prototypes");
exports.Prototypes = Prototypes;
const Solver = require("./solver");
exports.Solver = Solver;
const Specification = require("./specification");
exports.Specification = Specification;
__export(require("./actions"));
const config_2 = require("./config");
const wasm_solver_1 = require("./solver/wasm_solver");
function initialize(config) {
    config_2.setConfig(config);
    return wasm_solver_1.initialize();
}
exports.initialize = initialize;
//# sourceMappingURL=index.js.map