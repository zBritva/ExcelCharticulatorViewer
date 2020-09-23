"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
}
function uuid() {
    return (s4() +
        s4() +
        "-" +
        s4() +
        "-" +
        s4() +
        "-" +
        s4() +
        "-" +
        s4() +
        s4() +
        s4());
}
exports.uuid = uuid;
const usedIDs = new Set();
/** Generate a unique ID in uuid format */
function uniqueID() {
    while (true) {
        const id = Math.random()
            .toString(36)
            .substr(2);
        if (!usedIDs.has(id)) {
            usedIDs.add(id);
            return id;
        }
    }
}
exports.uniqueID = uniqueID;
let hashIndex = 1;
const objectHashs = new WeakMap();
function objectHash(o) {
    if (objectHashs.has(o)) {
        return objectHashs.get(o);
    }
    const newHash = `<#${hashIndex.toString()}>`;
    hashIndex += 1;
    objectHashs.set(o, newHash);
    return newHash;
}
exports.objectHash = objectHash;
//# sourceMappingURL=unique_id.js.map