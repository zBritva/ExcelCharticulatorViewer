"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
class ElementInfo {
    constructor(element) {
        const rect = element.getBoundingClientRect();
        this.previousWidth = rect.width;
        this.previousHeight = rect.height;
        this.currentID = 0;
        this.callbacks = new Map();
        this.element = element;
    }
    addCallback(cb) {
        this.currentID += 1;
        this.callbacks.set(this.currentID, cb);
        return this.currentID;
    }
    removeCallback(handle) {
        this.callbacks.delete(handle);
    }
    timerCallback() {
        const rect = this.element.getBoundingClientRect();
        if (rect.width != this.previousWidth ||
            rect.height != this.previousHeight) {
            this.previousWidth = rect.width;
            this.previousHeight = rect.height;
            this.callbacks.forEach((cb, e) => {
                cb();
            });
        }
    }
}
class ResizeListeners {
    constructor() {
        this.entries = new Map();
        this.timer = setInterval(this.timerCallback.bind(this), 200);
    }
    addListener(element, callback) {
        if (this.entries.has(element)) {
            return this.entries.get(element).addCallback(callback);
        }
        else {
            const info = new ElementInfo(element);
            this.entries.set(element, info);
            return info.addCallback(callback);
        }
    }
    removeListener(element, handle) {
        if (this.entries.has(element)) {
            const info = this.entries.get(element);
            info.removeCallback(handle);
            if (info.callbacks.size == 0) {
                this.entries.delete(element);
            }
        }
    }
    timerCallback() {
        for (const [element, info] of this.entries) {
            info.timerCallback();
        }
    }
}
exports.ResizeListeners = ResizeListeners;
//# sourceMappingURL=resize_observer.js.map