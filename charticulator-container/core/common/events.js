"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
class EventSubscription {
    constructor(emitter, event, listener) {
        this.emitter = emitter;
        this.event = event;
        this.listener = listener;
    }
    remove() {
        this.emitter.removeSubscription(this);
    }
}
exports.EventSubscription = EventSubscription;
class EventEmitter {
    constructor() {
        this.eventSubscriptions = new Map();
    }
    addListener(event, listener) {
        const sub = new EventSubscription(this, event, listener);
        sub.prev = null;
        sub.next = null;
        if (this.eventSubscriptions.has(event)) {
            const head = this.eventSubscriptions.get(event);
            if (head.first == null) {
                head.first = sub;
                head.last = sub;
            }
            else {
                head.last.next = sub;
                sub.prev = head.last;
                head.last = sub;
            }
        }
        else {
            this.eventSubscriptions.set(event, {
                first: sub,
                last: sub
            });
        }
        return sub;
    }
    emit(event, ...parameters) {
        if (this.eventSubscriptions.has(event)) {
            let p = this.eventSubscriptions.get(event).first;
            while (p) {
                p.listener(...parameters);
                p = p.next;
            }
        }
    }
    removeSubscription(subscription) {
        const head = this.eventSubscriptions.get(subscription.event);
        if (subscription.prev != null) {
            subscription.prev.next = subscription.next;
        }
        else {
            head.first = subscription.next;
        }
        if (subscription.next != null) {
            subscription.next.prev = subscription.prev;
        }
        else {
            head.last = subscription.prev;
        }
    }
}
exports.EventEmitter = EventEmitter;
function compareOrder(a, b) {
    if (a[0] == b[0]) {
        return a[1] - b[1];
    }
    else {
        return a[0] - b[0];
    }
}
class Dispatcher {
    constructor() {
        this.registeredItems = new Map();
        this.currentID = 0;
        this.isDispatching = false;
        this.dispatchingIndex = 0;
    }
    dispatch(action) {
        if (this.isDispatching) {
            throw new Error("Dispatcher: cannot dispatch in the middle of a dispatch");
        }
        this.isDispatching = true;
        this.dispatchingIndex = 0;
        this.currentAction = action;
        this.registeredItems.forEach(x => (x.stage = 0));
        try {
            // Order the items by order of registration
            let items = Array.from(this.registeredItems.values());
            items = items.sort((a, b) => compareOrder(a.order, b.order));
            // Dispatch in the order
            for (const item of items) {
                if (item.stage != 0) {
                    continue;
                }
                this.invoke(item);
            }
        }
        finally {
            delete this.currentAction;
            this.isDispatching = false;
        }
    }
    invoke(item) {
        item.stage = 1;
        item.callback(this.currentAction);
        this.dispatchingIndex += 1;
        item.stage = 2;
    }
    register(callback, priority = Dispatcher.PRIORITY_DEFAULT) {
        const id = "ID" + (this.currentID++).toString();
        this.registeredItems.set(id, {
            order: [priority, this.currentID],
            stage: 0,
            callback
        });
        return id;
    }
    unregister(id) {
        this.registeredItems.delete(id);
    }
    waitFor(ids) {
        ids = ids
            .filter(a => this.registeredItems.has(a))
            .sort((a, b) => compareOrder(this.registeredItems.get(a).order, this.registeredItems.get(b).order));
        for (const id of ids) {
            const item = this.registeredItems.get(id);
            if (item.stage == 1) {
                console.warn("Dispatcher: circular dependency detected in waitFor " + id);
                continue;
            }
            else if (item.stage == 2) {
                continue;
            }
            this.invoke(item);
        }
    }
}
Dispatcher.PRIORITY_LOW = 70;
Dispatcher.PRIORITY_DEFAULT = 50;
Dispatcher.PRIORITY_HIGH = 30;
exports.Dispatcher = Dispatcher;
//# sourceMappingURL=events.js.map