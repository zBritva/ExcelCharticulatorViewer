"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("../common");
class ScaleClass extends common_1.ObjectClass {
    buildConstraint(data, target, solver) { }
    getTemplateParameters() {
        return {
            inferences: [
                {
                    objectID: this.object._id,
                    scale: {
                        classID: this.object.classID,
                        expressions: [],
                        properties: {
                            mapping: "mapping"
                        }
                    }
                }
            ]
        };
    }
}
ScaleClass.metadata = {
    displayName: "Scale",
    iconPath: "scale/scale"
};
exports.ScaleClass = ScaleClass;
//# sourceMappingURL=scale.js.map