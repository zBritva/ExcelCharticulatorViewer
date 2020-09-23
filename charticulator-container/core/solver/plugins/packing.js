"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
const d3_force_1 = require("d3-force");
const abstract_1 = require("../abstract");
class PackingPlugin extends abstract_1.ConstraintPlugin {
    constructor(solver, cx, cy, points, axisOnly, getXYScale, options) {
        super();
        this.solver = solver;
        this.cx = cx;
        this.cy = cy;
        this.points = points;
        this.xEnable = axisOnly == null || axisOnly == "x";
        this.yEnable = axisOnly == null || axisOnly == "y";
        this.getXYScale = getXYScale;
        this.gravityX = options.gravityX;
        this.gravityY = options.gravityY;
        console.log("this.gravityX", this.gravityX, "this.gravityY", this.gravityY);
    }
    apply() {
        let xScale = 1;
        let yScale = 1;
        if (this.getXYScale != null) {
            const { x, y } = this.getXYScale();
            xScale = x;
            yScale = y;
        }
        const cx = this.solver.getValue(this.cx);
        const cy = this.solver.getValue(this.cy);
        const nodes = this.points.map(pt => {
            const x = (this.solver.getValue(pt[0]) - cx) / xScale;
            const y = (this.solver.getValue(pt[1]) - cy) / yScale;
            // Use forceSimulation's default initialization
            return {
                fx: !this.xEnable ? x : undefined,
                fy: !this.yEnable ? y : undefined,
                r: pt[2]
            };
        });
        const force = d3_force_1.forceSimulation(nodes);
        force.force("collision", d3_force_1.forceCollide(d => d.r));
        force.force("gravityX", d3_force_1.forceX().strength(this.gravityX || 0.1));
        force.force("gravityY", d3_force_1.forceY().strength(this.gravityY || 0.1));
        force.stop();
        const n = Math.ceil(Math.log(force.alphaMin()) / Math.log(1 - force.alphaDecay()));
        for (let i = 0; i < n * 2; i++) {
            force.tick();
        }
        for (let i = 0; i < nodes.length; i++) {
            if (this.xEnable) {
                this.solver.setValue(this.points[i][0], nodes[i].x * xScale + cx);
            }
            if (this.yEnable) {
                this.solver.setValue(this.points[i][1], nodes[i].y * yScale + cy);
            }
        }
        return true;
    }
}
exports.PackingPlugin = PackingPlugin;
//# sourceMappingURL=packing.js.map