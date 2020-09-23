"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/** General geometry functions */
var Geometry;
(function (Geometry) {
    /** Return the length of a vector */
    function vectorLength(p) {
        return Math.sqrt(p.x * p.x + p.y * p.y);
    }
    Geometry.vectorLength = vectorLength;
    /** Return the distance between two points */
    function pointDistance(p1, p2) {
        return Math.sqrt((p1.x - p2.x) * (p1.x - p2.x) + (p1.y - p2.y) * (p1.y - p2.y));
    }
    Geometry.pointDistance = pointDistance;
    /** Return the normalized version of a vector */
    function vectorNormalize(p) {
        const len = Math.sqrt(p.x * p.x + p.y * p.y);
        return { x: p.x / len, y: p.y / len };
    }
    Geometry.vectorNormalize = vectorNormalize;
    /** Rotate a vector 90 degrees (counter-clock-wise, but clock-wise in screen coordiantes) */
    function vectorRotate90(p) {
        return { y: p.x, x: -p.y };
    }
    Geometry.vectorRotate90 = vectorRotate90;
    /** Rotate a vector by a angle in radians (counter-clock-wise, but clock-wise in screen coordiantes) */
    function vectorRotate(p, radians) {
        return {
            x: p.x * Math.cos(radians) + p.y * Math.sin(radians),
            y: -p.x * Math.sin(radians) + p.y * Math.cos(radians)
        };
    }
    Geometry.vectorRotate = vectorRotate;
    /** Add two vectors */
    function vectorAdd(p1, p2) {
        return { x: p1.x + p2.x, y: p1.y + p2.y };
    }
    Geometry.vectorAdd = vectorAdd;
    /** Subtract two vectors */
    function vectorSub(p1, p2) {
        return { x: p1.x - p2.x, y: p1.y - p2.y };
    }
    Geometry.vectorSub = vectorSub;
    /** Multiply two vectors element-wise */
    function vectorMul(p1, p2) {
        return { x: p1.x * p2.x, y: p1.y * p2.y };
    }
    Geometry.vectorMul = vectorMul;
    /** Divide two vectors element-wise */
    function vectorDiv(p1, p2) {
        return { x: p1.x / p2.x, y: p1.y / p2.y };
    }
    Geometry.vectorDiv = vectorDiv;
    /** Scale a vector by a constant factor */
    function vectorScale(p, s) {
        return { x: p.x * s, y: p.y * s };
    }
    Geometry.vectorScale = vectorScale;
    /** Compute the inner product between two vectors */
    function vectorDot(p1, p2) {
        return p1.x * p2.x + p1.y * p2.y;
    }
    Geometry.vectorDot = vectorDot;
    /** Compute the cross product between two vectors */
    function vectorCross(p1, p2) {
        return p1.x * p2.y - p2.x * p1.y;
    }
    Geometry.vectorCross = vectorCross;
    /** Determine if two intervals overlap */
    function intervalOverlap(xMin, xMax, yMin, yMax) {
        return !(xMax < yMin || yMax < xMin);
    }
    Geometry.intervalOverlap = intervalOverlap;
    /** Determine if two rects overlap */
    function rectOverlap(a1, a2) {
        return (intervalOverlap(Math.min(a1.x1, a1.x2), Math.max(a1.x1, a1.x2), Math.min(a2.x1, a2.x2), Math.max(a2.x1, a2.x2)) &&
            intervalOverlap(Math.min(a1.y1, a1.y2), Math.max(a1.y1, a1.y2), Math.min(a2.y1, a2.y2), Math.max(a2.y1, a2.y2)));
    }
    Geometry.rectOverlap = rectOverlap;
    /** Apply zoom to a point (point to pixel) */
    function applyZoom(zoom, pt) {
        return {
            x: pt.x * zoom.scale + zoom.centerX,
            y: pt.y * zoom.scale + zoom.centerY
        };
    }
    Geometry.applyZoom = applyZoom;
    /** Unapply zoom to a point (pixel to point) */
    function unapplyZoom(zoom, pt) {
        return {
            x: (pt.x - zoom.centerX) / zoom.scale,
            y: (pt.y - zoom.centerY) / zoom.scale
        };
    }
    Geometry.unapplyZoom = unapplyZoom;
})(Geometry = exports.Geometry || (exports.Geometry = {}));
function prettyNumber(x, digits = 8) {
    return x
        .toFixed(digits)
        .replace(/^([\+\-]?[0-9]*(\.[0-9]*[1-9]+)?)\.?0+$/, "$1");
}
exports.prettyNumber = prettyNumber;
//# sourceMappingURL=math.js.map