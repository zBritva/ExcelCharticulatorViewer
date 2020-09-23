"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
Object.defineProperty(exports, "__esModule", { value: true });
const attrs_1 = require("../attrs");
exports.iconAttributes = Object.assign({}, attrs_1.AttrBuilder.point(), attrs_1.AttrBuilder.number("size", false, {
    defaultRange: [0, 3600],
    defaultValue: 400
}), attrs_1.AttrBuilder.opacity(), attrs_1.AttrBuilder.visible(), attrs_1.AttrBuilder.image());
//# sourceMappingURL=icon.attrs.js.map