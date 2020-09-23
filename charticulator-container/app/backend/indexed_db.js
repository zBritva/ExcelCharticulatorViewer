"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
class IndexedDBBackend {
    constructor(db = "charticulator") {
        this.databaseName = db;
        this.database = null;
    }
    open() {
        return new Promise((resolve, reject) => {
            if (this.database) {
                resolve();
            }
            else {
                const request = indexedDB.open(this.databaseName, 2);
                request.onupgradeneeded = () => {
                    this.database = request.result;
                    const itemsStore = this.database.createObjectStore("items", {
                        keyPath: "id"
                    });
                    itemsStore.createIndex("TypeIndex", "type");
                    itemsStore.createIndex("DataIDIndex", "dataID");
                    itemsStore.createIndex("NameIndex", "metadata.name");
                    itemsStore.createIndex("TimeCreatedIndex", "metadata.timeCreated");
                    itemsStore.createIndex("TimeModifiedIndex", "metadata.timeModified");
                    const dataStore = this.database.createObjectStore("data", {
                        keyPath: "id"
                    });
                };
                request.onerror = () => {
                    reject(new Error("could not open database"));
                };
                request.onsuccess = e => {
                    this.database = request.result;
                    resolve();
                };
            }
        });
    }
    list(type, orderBy = "timeCreated", start = 0, count = 50) {
        return this.open().then(() => new Promise((resolve, reject) => {
            const tx = this.database.transaction("items", "readonly");
            const store = tx.objectStore("items");
            const request = store.index("TypeIndex").openCursor(type);
            const result = [];
            request.onsuccess = () => {
                const cursor = request.result;
                if (cursor) {
                    const value = cursor.value;
                    result.push(value);
                    cursor.continue();
                }
                else {
                    let resultFiltered = result.sort((a, b) => b.metadata[orderBy] -
                        a.metadata[orderBy]);
                    resultFiltered = resultFiltered.slice(start, start + count);
                    resolve({
                        items: resultFiltered,
                        totalCount: result.length
                    });
                }
            };
            request.onerror = () => {
                reject(new Error("could not read from the database"));
            };
        }));
    }
    get(id) {
        return this.open().then(() => new Promise((resolve, reject) => {
            const tx = this.database.transaction(["items", "data"], "readonly");
            const itemsStore = tx.objectStore("items");
            const dataStore = tx.objectStore("data");
            const request = itemsStore.get(id);
            request.onsuccess = () => {
                const item = request.result;
                const request2 = dataStore.get(item.dataID);
                request2.onsuccess = () => {
                    item.data = request2.result.data;
                    resolve(item);
                };
                request2.onerror = () => {
                    reject(new Error("could not read from the database"));
                };
            };
            request.onerror = () => {
                reject(new Error("could not read from the database"));
            };
        }));
    }
    put(id, data, metadata) {
        return this.open().then(() => new Promise((resolve, reject) => {
            const tx = this.database.transaction(["items", "data"], "readwrite");
            const itemsStore = tx.objectStore("items");
            const dataStore = tx.objectStore("data");
            const req1 = itemsStore.get(id);
            req1.onerror = () => {
                reject(new Error("could not write to the database"));
            };
            req1.onsuccess = () => {
                const original = req1.result;
                metadata.timeCreated = original.metadata.timeCreated;
                metadata.timeModified = new Date().getTime();
                const obj = {
                    id,
                    dataID: req1.result.dataID,
                    type: original.type,
                    metadata
                };
                const dataObj = {
                    id: req1.result.dataID,
                    data
                };
                dataStore.put(dataObj);
                itemsStore.put(obj);
                tx.oncomplete = () => {
                    resolve();
                };
                tx.onerror = () => {
                    reject(new Error("could not write to the database"));
                };
            };
        }));
    }
    create(type, data, metadata) {
        return this.open().then(() => new Promise((resolve, reject) => {
            const tx = this.database.transaction(["items", "data"], "readwrite");
            const itemsStore = tx.objectStore("items");
            const dataStore = tx.objectStore("data");
            metadata.timeCreated = new Date().getTime();
            metadata.timeModified = metadata.timeCreated;
            const obj = {
                id: uuid(),
                dataID: uuid(),
                type,
                metadata
            };
            const dataObj = {
                id: obj.dataID,
                data
            };
            dataStore.put(dataObj);
            itemsStore.put(obj);
            tx.oncomplete = () => {
                resolve(obj.id);
            };
            tx.onerror = () => {
                reject(new Error("could not write to the database"));
            };
        }));
    }
    delete(id) {
        return this.open().then(() => new Promise((resolve, reject) => {
            const tx = this.database.transaction(["items", "data"], "readwrite");
            const itemsStore = tx.objectStore("items");
            const dataStore = tx.objectStore("data");
            const request = itemsStore.get(id);
            request.onsuccess = () => {
                const dataID = request.result.dataID;
                itemsStore.delete(id);
                dataStore.delete(dataID);
                tx.oncomplete = () => {
                    resolve();
                };
                tx.onerror = () => {
                    reject(new Error("could not write to the database"));
                };
            };
            request.onerror = () => {
                reject(new Error("could not write to the database"));
            };
        }));
    }
}
exports.IndexedDBBackend = IndexedDBBackend;
//# sourceMappingURL=indexed_db.js.map