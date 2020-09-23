"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
const config_1 = require("../../../config");
class StaticMapService {
    getImageryAtPoint(options) {
        return new Promise((resolve, reject) => {
            const url = this.getImageryURLAtPoint(options);
            const img = new Image();
            img.setAttribute("crossOrigin", "anonymous");
            img.onload = () => {
                const canvas = document.createElement("canvas");
                canvas.width = img.width;
                canvas.height = img.height;
                canvas.getContext("2d").drawImage(img, 0, 0);
                resolve(canvas.toDataURL("image/png"));
            };
            img.onerror = () => {
                reject(new Error(`failed to retrieve map image at url ${url}`));
            };
            img.src = url;
        });
    }
    static GetService() {
        if (StaticMapService.cachedService == null) {
            const config = config_1.getConfig();
            if (config.MapService) {
                switch (config.MapService.provider) {
                    case "Google":
                        {
                            StaticMapService.cachedService = new GoogleMapService(config.MapService.apiKey);
                        }
                        break;
                    case "Bing":
                        {
                            StaticMapService.cachedService = new BingMapService(config.MapService.apiKey);
                        }
                        break;
                }
            }
        }
        return StaticMapService.cachedService;
    }
}
StaticMapService.cachedService = null;
exports.StaticMapService = StaticMapService;
function buildQueryParameters(options) {
    const r = [];
    for (const p in options) {
        if (options.hasOwnProperty(p)) {
            r.push(encodeURIComponent(p) + "=" + encodeURIComponent(options[p]));
        }
    }
    return r.join("&");
}
class GoogleMapService extends StaticMapService {
    constructor(apiKey) {
        super();
        this.apiKey = apiKey;
    }
    getImageryURLAtPoint(options) {
        const params = {
            center: `${options.center.latitude},${options.center.longitude}`,
            zoom: `${options.zoom}`,
            size: `${options.width}x${options.height}`,
            key: this.apiKey,
            format: "png"
        };
        if (options.resolution == "high") {
            params.scale = "2";
        }
        if (options.type == "satellite") {
            params.maptype = "satellite";
        }
        if (options.type == "hybrid") {
            params.maptype = "hybrid";
        }
        if (options.type == "terrain") {
            params.maptype = "terrain";
        }
        let url = "https://maps.googleapis.com/maps/api/staticmap";
        url += "?" + buildQueryParameters(params);
        return url;
    }
}
exports.GoogleMapService = GoogleMapService;
class BingMapService extends StaticMapService {
    constructor(apiKey) {
        super();
        this.apiKey = apiKey;
    }
    getImageryURLAtPoint(options) {
        const params = {
            mapSize: `${options.width},${options.height}`,
            key: this.apiKey,
            format: "png"
        };
        if (options.resolution == "high") {
            params.dpi = "Large";
            params.mapSize = `${options.width * 2},${options.height * 2}`;
        }
        let type = "Road";
        if (options.type == "satellite") {
            type = "Aerial";
        }
        if (options.type == "hybrid") {
            type = "AerialWithLabels";
        }
        let url = `https://dev.virtualearth.net/REST/v1/Imagery/Map/${type}/`;
        url += `${options.center.latitude},${options.center.longitude}/${options.zoom + 1}`;
        url += "?" + buildQueryParameters(params);
        return url;
    }
}
exports.BingMapService = BingMapService;
//# sourceMappingURL=map_service.js.map