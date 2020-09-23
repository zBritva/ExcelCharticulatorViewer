"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
Object.defineProperty(exports, "__esModule", { value: true });
const specification_1 = require("../specification");
exports.DataType = specification_1.DataType;
exports.DataKind = specification_1.DataKind;
var TableType;
(function (TableType) {
    /** The main table with data for the chart */
    TableType["Main"] = "Main";
    /** Table with source_id and target_id columns for links, can contain additional columns with data */
    TableType["Links"] = "Links";
    /** TelLs to nested chart that table is parent chart table with all data */
    TableType["ParentMain"] = "ParentMain";
    /** TelLs to nested chart that table is parent links table of the chart with all data */
    TableType["ParentLinks"] = "ParentLinks";
})(TableType = exports.TableType || (exports.TableType = {}));
//# sourceMappingURL=dataset.js.map