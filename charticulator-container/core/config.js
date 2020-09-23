"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let config;
function setConfig(_) {
    if (_ == null) {
        config = {};
    }
    else {
        config = _;
    }
}
exports.setConfig = setConfig;
function getConfig() {
    return config;
}
exports.getConfig = getConfig;
//# sourceMappingURL=config.js.map