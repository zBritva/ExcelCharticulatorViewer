"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
Object.defineProperty(exports, "__esModule", { value: true });
const actions_1 = require("../../actions");
function default_1(REG) {
    REG.add(actions_1.Actions.SaveExportTemplatePropertyName, function (action) {
        this.setPropertyExportName(action.propertyName, action.value);
    });
}
exports.default = default_1;
//# sourceMappingURL=exports.js.map