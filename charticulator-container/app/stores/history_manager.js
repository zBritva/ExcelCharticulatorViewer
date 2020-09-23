"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
Object.defineProperty(exports, "__esModule", { value: true });
class HistoryManager {
    constructor() {
        this.statesBefore = [];
        this.statesAfter = [];
    }
    addState(state) {
        this.statesAfter = [];
        this.statesBefore.push(state);
    }
    undo(currentState) {
        if (this.statesBefore.length > 0) {
            const item = this.statesBefore.pop();
            this.statesAfter.push(currentState);
            return item;
        }
        else {
            return null;
        }
    }
    redo(currentState) {
        if (this.statesAfter.length > 0) {
            const item = this.statesAfter.pop();
            this.statesBefore.push(currentState);
            return item;
        }
        else {
            return null;
        }
    }
    clear() {
        this.statesAfter = [];
        this.statesBefore = [];
    }
}
exports.HistoryManager = HistoryManager;
//# sourceMappingURL=history_manager.js.map