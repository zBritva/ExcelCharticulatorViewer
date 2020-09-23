"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class CompiledFilter {
    constructor(filter, cache) {
        if (filter.categories) {
            const expr = cache.parse(filter.categories.expression);
            const map = filter.categories.values;
            this.filter = context => {
                const val = expr.getStringValue(context);
                return map.hasOwnProperty(val) && map[val] == true;
            };
        }
        else if (filter.expression) {
            const expr = cache.parse(filter.expression);
            this.filter = context => {
                return expr.getValue(context);
            };
        }
    }
}
exports.CompiledFilter = CompiledFilter;
//# sourceMappingURL=filter.js.map