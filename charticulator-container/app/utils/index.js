"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
const core_1 = require("../../core");
const specification_1 = require("../../core/specification");
function classNames(...args) {
    return args
        .filter(x => x != null && (typeof x == "string" || x[1] == true))
        .map(x => (typeof x == "string" ? x : x[0]))
        .join(" ");
}
exports.classNames = classNames;
function toSVGNumber(x) {
    return core_1.prettyNumber(x, 8);
}
exports.toSVGNumber = toSVGNumber;
function toSVGZoom(zoom) {
    return `translate(${core_1.prettyNumber(zoom.centerX)},${core_1.prettyNumber(zoom.centerY)}) scale(${core_1.prettyNumber(zoom.scale)})`;
}
exports.toSVGZoom = toSVGZoom;
function parseHashString(value) {
    // Make sure value doesn't start with "#" or "#!"
    if (value[0] == "#") {
        value = value.substr(1);
    }
    if (value[0] == "!") {
        value = value.substr(1);
    }
    // Split by & and parse each key=value pair
    return value.split("&").reduce((prev, str) => {
        const pair = str.split("=");
        prev[decodeURIComponent(pair[0])] =
            pair.length == 2 ? decodeURIComponent(pair[1]) : "";
        return prev;
    }, {});
}
exports.parseHashString = parseHashString;
function renderDataURLToPNG(dataurl, options) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = dataurl;
        img.onload = () => {
            const width = img.width;
            const height = img.height;
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");
            switch (options.mode) {
                case "scale":
                    {
                        canvas.width = width * options.scale;
                        canvas.height = height * options.scale;
                        if (options.background) {
                            ctx.fillStyle = options.background;
                            ctx.fillRect(0, 0, canvas.width, canvas.height);
                        }
                        ctx.scale(options.scale, options.scale);
                        ctx.drawImage(img, 0, 0);
                    }
                    break;
                case "thumbnail":
                    {
                        canvas.width = options.thumbnail[0];
                        canvas.height = options.thumbnail[1];
                        if (options.background) {
                            ctx.fillStyle = options.background;
                            ctx.fillRect(0, 0, canvas.width, canvas.height);
                        }
                        const maxScale = Math.max(canvas.width / width, canvas.height / height);
                        ctx.scale(maxScale, maxScale);
                        ctx.drawImage(img, 0, 0);
                    }
                    break;
            }
            resolve(canvas);
        };
        img.onerror = () => {
            reject(new Error("failed to load image"));
        };
    });
}
exports.renderDataURLToPNG = renderDataURLToPNG;
function readFileAsString(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            resolve(reader.result);
        };
        reader.onerror = () => {
            reject(new Error(`unable to read file ${file.name}`));
        };
        reader.readAsText(file, "utf-8");
    });
}
exports.readFileAsString = readFileAsString;
function readFileAsDataUrl(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            resolve(reader.result);
        };
        reader.onerror = () => {
            reject(new Error(`unable to read file ${file.name}`));
        };
        reader.readAsDataURL(file);
    });
}
exports.readFileAsDataUrl = readFileAsDataUrl;
function getExtensionFromFileName(filename) {
    const m = filename.match(/\.([^\.]+)$/);
    if (m) {
        return m[1].toLowerCase();
    }
    else {
        return null;
    }
}
exports.getExtensionFromFileName = getExtensionFromFileName;
function getFileNameWithoutExtension(filename) {
    return filename.replace(/\.([^\.]+)$/, "");
}
exports.getFileNameWithoutExtension = getFileNameWithoutExtension;
function showOpenFileDialog(accept) {
    return new Promise((resolve, reject) => {
        const inputElement = document.createElement("input");
        inputElement.type = "file";
        if (accept != null) {
            inputElement.accept = accept.map(x => "." + x).join(",");
        }
        inputElement.onchange = e => {
            if (inputElement.files.length == 1) {
                resolve(inputElement.files[0]);
            }
            else {
                reject();
            }
        };
        inputElement.click();
    });
}
exports.showOpenFileDialog = showOpenFileDialog;
function b64EncodeUnicode(str) {
    return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (match, p1) => {
        return String.fromCharCode(parseInt(p1, 16));
    }));
}
exports.b64EncodeUnicode = b64EncodeUnicode;
function stringToDataURL(mimeType, content) {
    return "data:" + mimeType + ";base64," + b64EncodeUnicode(content);
}
exports.stringToDataURL = stringToDataURL;
function checkConvertion(type, dataSample) {
    let convertable = true;
    if (type === specification_1.DataType.String) {
        return convertable;
    }
    switch (type) {
        case specification_1.DataType.Boolean:
            for (const data of dataSample) {
                if (data && (data.toString() != "0" && data.toString() != "true" && data.toString() != "1" && data.toString() != "false")) {
                    convertable = false;
                    break;
                }
            }
            return convertable;
        case specification_1.DataType.Date:
            convertable = true;
            for (const data of dataSample) {
                if (data && Number.isNaN(Date.parse(data.toString())) && Number.isNaN(new Date(+data.toString()).getDate())) {
                    convertable = false;
                    break;
                }
            }
            return convertable;
        case specification_1.DataType.Number:
            convertable = true;
            for (const data of dataSample) {
                if (data && Number.isNaN(Number.parseFloat(data.toString()))) {
                    convertable = false;
                    break;
                }
            }
            return convertable;
        default:
            return false;
    }
}
function getConvertableDataKind(type, dataSample) {
    let types;
    switch (type) {
        case specification_1.DataType.Boolean:
            types = [
                specification_1.DataKind.Ordinal,
                specification_1.DataKind.Categorical,
            ];
            break;
        case specification_1.DataType.Date:
            types = [
                specification_1.DataKind.Categorical,
                specification_1.DataKind.Ordinal,
                specification_1.DataKind.Temporal,
            ];
            break;
        case specification_1.DataType.String:
            types = [
                specification_1.DataKind.Categorical,
                specification_1.DataKind.Ordinal
            ];
            break;
        case specification_1.DataType.Number:
            types = [
                specification_1.DataKind.Categorical,
                specification_1.DataKind.Numerical,
                specification_1.DataKind.Ordinal,
            ];
            break;
    }
    return types;
}
exports.getConvertableDataKind = getConvertableDataKind;
function getConvertableTypes(type, dataSample) {
    let types;
    switch (type) {
        case specification_1.DataType.Boolean:
            types = [
                specification_1.DataType.Number,
                specification_1.DataType.String,
                specification_1.DataType.Boolean
            ];
            break;
        case specification_1.DataType.Date:
            types = [
                specification_1.DataType.Number,
                specification_1.DataType.String,
                specification_1.DataType.Date
            ];
            break;
        case specification_1.DataType.String:
            types = [
                specification_1.DataType.Number,
                specification_1.DataType.String,
                specification_1.DataType.Boolean,
                specification_1.DataType.Date,
            ];
            break;
        case specification_1.DataType.Number:
            types = [
                specification_1.DataType.Number,
                specification_1.DataType.String,
                specification_1.DataType.Boolean,
                specification_1.DataType.Date,
            ];
            break;
    }
    return types.filter(t => {
        if (t == type) {
            return true;
        }
        if (dataSample) {
            return checkConvertion(t, dataSample.map(d => d.toString()));
        }
    });
}
exports.getConvertableTypes = getConvertableTypes;
//# sourceMappingURL=index.js.map