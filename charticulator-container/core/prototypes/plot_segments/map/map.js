"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
const Graphics = require("../../../graphics");
const solver_1 = require("../../../solver");
const Specification = require("../../../specification");
const common_1 = require("../../../common");
const plot_segment_1 = require("../plot_segment");
const axis_1 = require("../axis");
const map_service_1 = require("./map_service");
class MapPlotSegment extends plot_segment_1.PlotSegmentClass {
    constructor() {
        super(...arguments);
        this.attributeNames = ["x1", "x2", "y1", "y2"];
        this.attributes = {
            x1: {
                name: "x1",
                type: Specification.AttributeType.Number
            },
            x2: {
                name: "x2",
                type: Specification.AttributeType.Number
            },
            y1: {
                name: "y1",
                type: Specification.AttributeType.Number
            },
            y2: {
                name: "y2",
                type: Specification.AttributeType.Number
            }
        };
        // The map service for this map
        this.mapService = map_service_1.StaticMapService.GetService();
    }
    initializeState() {
        const attrs = this.state.attributes;
        attrs.x1 = -100;
        attrs.x2 = 100;
        attrs.y1 = -100;
        attrs.y2 = 100;
    }
    buildGlyphConstraints(solver) {
        const [latitude, longitude, zoom] = this.getCenterZoom();
        const longitudeData = this.object.properties.longitudeData;
        const latitudeData = this.object.properties.latitudeData;
        if (latitudeData && longitudeData) {
            const latExpr = this.parent.dataflow.cache.parse(latitudeData.expression);
            const lngExpr = this.parent.dataflow.cache.parse(longitudeData.expression);
            const table = this.parent.dataflow.getTable(this.object.table);
            const [cx, cy] = this.mercatorProjection(latitude, longitude);
            for (const [glyphState, index] of common_1.zipArray(this.state.glyphs, this.state.dataRowIndices)) {
                const row = table.getGroupedContext(index);
                const lat = latExpr.getNumberValue(row);
                const lng = lngExpr.getNumberValue(row);
                const p = this.getProjectedPoints([[lat, lng]])[0];
                solver.addLinear(solver_1.ConstraintStrength.HARD, p[0], [], [[1, solver.attr(glyphState.attributes, "x")]]);
                solver.addLinear(solver_1.ConstraintStrength.HARD, p[1], [], [[1, solver.attr(glyphState.attributes, "y")]]);
            }
        }
    }
    getBoundingBox() {
        const attrs = this.state.attributes;
        const { x1, x2, y1, y2 } = attrs;
        return {
            type: "rectangle",
            cx: (x1 + x2) / 2,
            cy: (y1 + y2) / 2,
            width: Math.abs(x2 - x1),
            height: Math.abs(y2 - y1),
            rotation: 0
        };
    }
    getSnappingGuides() {
        const attrs = this.state.attributes;
        const { x1, y1, x2, y2 } = attrs;
        return [
            { type: "x", value: x1, attribute: "x1" },
            { type: "x", value: x2, attribute: "x2" },
            { type: "y", value: y1, attribute: "y1" },
            { type: "y", value: y2, attribute: "y2" }
        ];
    }
    mercatorProjection(lat, lng) {
        // WebMercator Projection:
        // x, y range: [0, 256]
        const x = (128 / 180) * (180 + lng);
        const y = (128 / 180) *
            (180 -
                (180 / Math.PI) *
                    Math.log(Math.tan(Math.PI / 4 + ((lat / 180) * Math.PI) / 2)));
        return [x, y];
        // // Bing's version as of here: https://msdn.microsoft.com/en-us/library/bb259689.aspx
        // // Same as Google's Version
        // let sin = Math.sin(lat / 180 * Math.PI);
        // let x1 = (lng + 180) / 360 * 256;
        // let y1 = (0.5 - Math.log((1 + sin) / (1 - sin)) / (4 * Math.PI)) * 256;
        // console.log((x - x1).toFixed(8), (y - y1).toFixed(8));
    }
    // Get (x, y) coordinates based on longitude and latitude
    getProjectedPoints(points) {
        const attrs = this.state.attributes;
        const [cLatitude, cLongitude, zoom] = this.getCenterZoom();
        const [cX, cY] = this.mercatorProjection(cLatitude, cLongitude);
        const scale = Math.pow(2, zoom);
        const { x1, y1, x2, y2 } = attrs;
        return points.map(p => {
            const [x, y] = this.mercatorProjection(p[0], p[1]);
            return [
                (x - cX) * scale + (x1 + x2) / 2,
                -(y - cY) * scale + (y1 + y2) / 2
            ];
        });
    }
    getCenterZoom() {
        const attrs = this.state.attributes;
        const props = this.object.properties;
        let minLongitude = -180;
        let maxLongitude = 180;
        let minLatitude = -50;
        let maxLatitude = 50;
        if (props.latitudeData != null) {
            minLatitude = props.latitudeData.domainMin;
            maxLatitude = props.latitudeData.domainMax;
        }
        if (props.longitudeData != null) {
            minLongitude = props.longitudeData.domainMin;
            maxLongitude = props.longitudeData.domainMax;
        }
        const [xMin, yMin] = this.mercatorProjection(minLatitude, minLongitude);
        const [xMax, yMax] = this.mercatorProjection(maxLatitude, maxLongitude);
        // Find the appropriate zoom level for the given box.
        const scaleX = Math.abs(Math.abs(attrs.x2 - attrs.x1) / Math.abs(xMax - xMin));
        const scaleY = Math.abs(Math.abs(attrs.y2 - attrs.y1) / Math.abs(yMax - yMin));
        const scale = Math.min(scaleX, scaleY);
        const zoom = Math.floor(Math.log2(scale));
        const latitude = (minLatitude + maxLatitude) / 2;
        const longitude = (minLongitude + maxLongitude) / 2;
        return [latitude, longitude, zoom];
    }
    getPlotSegmentGraphics(glyphGraphics) {
        const attrs = this.state.attributes;
        const { x1, y1, x2, y2 } = attrs;
        const [latitude, longitude, zoom] = this.getCenterZoom();
        const width = x2 - x1;
        const height = y2 - y1;
        const img = {
            type: "image",
            src: this.mapService.getImageryURLAtPoint({
                center: {
                    latitude,
                    longitude
                },
                type: this.object.properties.mapType,
                zoom,
                width,
                height,
                resolution: "high"
            }),
            x: x1,
            y: y1,
            width,
            height
        };
        return Graphics.makeGroup([img, glyphGraphics]);
    }
    getDropZones() {
        const attrs = this.state.attributes;
        const { x1, y1, x2, y2, x, y } = attrs;
        const zones = [];
        zones.push({
            type: "line",
            p1: { x: x2, y: y1 },
            p2: { x: x1, y: y1 },
            title: "Longitude",
            dropAction: {
                axisInference: { property: "longitudeData" }
            }
        });
        zones.push({
            type: "line",
            p1: { x: x1, y: y1 },
            p2: { x: x1, y: y2 },
            title: "Latitude",
            dropAction: {
                axisInference: { property: "latitudeData" }
            }
        });
        return zones;
    }
    getHandles() {
        const attrs = this.state.attributes;
        const rows = this.parent.dataflow.getTable(this.object.table).rows;
        const { x1, x2, y1, y2 } = attrs;
        const h = [
            {
                type: "line",
                axis: "y",
                value: y1,
                span: [x1, x2],
                actions: [{ type: "attribute", attribute: "y1" }]
            },
            {
                type: "line",
                axis: "y",
                value: y2,
                span: [x1, x2],
                actions: [{ type: "attribute", attribute: "y2" }]
            },
            {
                type: "line",
                axis: "x",
                value: x1,
                span: [y1, y2],
                actions: [{ type: "attribute", attribute: "x1" }]
            },
            {
                type: "line",
                axis: "x",
                value: x2,
                span: [y1, y2],
                actions: [{ type: "attribute", attribute: "x2" }]
            },
            {
                type: "point",
                x: x1,
                y: y1,
                actions: [
                    { type: "attribute", source: "x", attribute: "x1" },
                    { type: "attribute", source: "y", attribute: "y1" }
                ]
            },
            {
                type: "point",
                x: x2,
                y: y1,
                actions: [
                    { type: "attribute", source: "x", attribute: "x2" },
                    { type: "attribute", source: "y", attribute: "y1" }
                ]
            },
            {
                type: "point",
                x: x1,
                y: y2,
                actions: [
                    { type: "attribute", source: "x", attribute: "x1" },
                    { type: "attribute", source: "y", attribute: "y2" }
                ]
            },
            {
                type: "point",
                x: x2,
                y: y2,
                actions: [
                    { type: "attribute", source: "x", attribute: "x2" },
                    { type: "attribute", source: "y", attribute: "y2" }
                ]
            }
        ];
        return h;
    }
    getAttributePanelWidgets(m) {
        const props = this.object.properties;
        const widgets = [
            ...axis_1.buildAxisWidgets(props.latitudeData, "latitudeData", m, "Latitude"),
            ...axis_1.buildAxisWidgets(props.longitudeData, "longitudeData", m, "Longitude"),
            m.sectionHeader("Map Style"),
            m.inputSelect({ property: "mapType" }, {
                type: "dropdown",
                showLabel: true,
                labels: ["Roadmap", "Satellite", "Hybrid", "Terrain"],
                options: ["roadmap", "satellite", "hybrid", "terrain"]
            })
        ];
        return widgets;
    }
}
MapPlotSegment.classID = "plot-segment.map";
MapPlotSegment.type = "plot-segment";
MapPlotSegment.metadata = {
    iconPath: "plot-segment/map"
};
MapPlotSegment.defaultMappingValues = {};
MapPlotSegment.defaultProperties = {
    mapType: "roadmap"
};
exports.MapPlotSegment = MapPlotSegment;
//# sourceMappingURL=map.js.map