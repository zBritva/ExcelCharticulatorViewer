"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function loadDataFromURL(url, contentType = "text", timeout = 10) {
    return fetch(url).then(response => {
        if (response.ok && response.status == 200) {
            if (contentType == "text") {
                return response.text();
            }
            if (contentType == "json") {
                return response.json();
            }
            if (contentType == "arraybuffer") {
                return response.arrayBuffer();
            }
            if (contentType == "blob") {
                return response.blob();
            }
            return response.text();
        }
        else {
            throw new Error("failed to fetch url");
        }
    });
}
exports.loadDataFromURL = loadDataFromURL;
//# sourceMappingURL=fetch.js.map