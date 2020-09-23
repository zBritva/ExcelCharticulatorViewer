"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
Object.defineProperty(exports, "__esModule", { value: true });
const registry_1 = require("./registry");
exports.ActionHandlerRegistry = registry_1.ActionHandlerRegistry;
const chart_1 = require("./chart");
const document_1 = require("./document");
const glyph_1 = require("./glyph");
const mark_1 = require("./mark");
const selection_1 = require("./selection");
function registerActionHandlers(REG) {
    document_1.default(REG);
    chart_1.default(REG);
    glyph_1.default(REG);
    mark_1.default(REG);
    selection_1.default(REG);
}
exports.registerActionHandlers = registerActionHandlers;
//# sourceMappingURL=index.js.map