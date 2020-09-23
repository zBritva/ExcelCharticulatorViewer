"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("../common");
class CompiledGroupBy {
    constructor(groupBy, cache) {
        if (groupBy.expression) {
            const expr = cache.parse(groupBy.expression);
            this.groupBy = (table) => {
                const indices = common_1.makeRange(0, table.rows.length);
                const groups = common_1.gather(indices, i => expr.getStringValue(table.getRowContext(i)));
                return groups;
            };
        }
    }
}
exports.CompiledGroupBy = CompiledGroupBy;
//# sourceMappingURL=group_by.js.map