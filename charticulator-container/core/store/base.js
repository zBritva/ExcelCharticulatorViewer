"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
const common_1 = require("../common");
class BaseStore extends common_1.EventEmitter {
    constructor(parent) {
        super();
        this._id = common_1.uniqueID();
        this.parent = parent;
        if (parent != null) {
            this.dispatcher = parent.dispatcher;
        }
        else {
            this.dispatcher = new common_1.Dispatcher();
        }
        this.dispatcherID = this.dispatcher.register(action => this.handleAction(action));
    }
    // Override this in the child store
    handleAction(action) { }
    destroy() {
        if (this.dispatcherID != null) {
            this.dispatcher.unregister(this.dispatcherID);
        }
    }
}
exports.BaseStore = BaseStore;
//# sourceMappingURL=base.js.map