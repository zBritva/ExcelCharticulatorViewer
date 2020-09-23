"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
/** A registry of action handlers */
class ActionHandlerRegistry {
    constructor() {
        this.handlers = [];
    }
    /**
     * Register an action handler function
     * @param constructor the action constructor
     * @param handler the action handler
     */
    add(constructor, handler) {
        this.handlers.push({ constructor, handler });
    }
    /**
     * Find and call the handler(s) for the action
     * @param thisArg the this argument for the handler
     * @param action the action to pass to
     */
    handleAction(thisArg, action) {
        for (const handler of this.handlers) {
            if (action instanceof handler.constructor) {
                handler.handler.call(thisArg, action);
            }
        }
    }
}
exports.ActionHandlerRegistry = ActionHandlerRegistry;
//# sourceMappingURL=registry.js.map