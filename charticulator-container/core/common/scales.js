"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
Object.defineProperty(exports, "__esModule", { value: true });
const d3_scale_1 = require("d3-scale");
var Scale;
(function (Scale) {
    /** Base scale class */
    class BaseScale {
        /** Get mapped values */
        map(values) {
            return values.map(x => (x == null ? null : this.get(x)));
        }
    }
    Scale.BaseScale = BaseScale;
    class LinearScale extends BaseScale {
        inferParameters(values) {
            const scale = d3_scale_1.scaleLinear()
                .domain([Math.min(...values), Math.max(...values)])
                .nice();
            this.domainMin = scale.domain()[0];
            this.domainMax = scale.domain()[1];
            if (this.domainMax == this.domainMin) {
                this.domainMax = this.domainMin + 1;
            }
        }
        adjustDomain(options) {
            if (options.startWithZero == "default" || options.startWithZero == null) {
                if (this.domainMin > 0) {
                    this.domainMin = 0;
                }
            }
            else if (options.startWithZero == "always") {
                this.domainMin = 0;
            }
        }
        get(v) {
            return (v - this.domainMin) / (this.domainMax - this.domainMin);
        }
        ticks(n = 10) {
            const scale = d3_scale_1.scaleLinear().domain([this.domainMin, this.domainMax]);
            return scale.ticks(n);
        }
        tickFormat(n = 10, specifier) {
            const scale = d3_scale_1.scaleLinear().domain([this.domainMin, this.domainMax]);
            return scale.tickFormat(n, specifier);
        }
    }
    Scale.LinearScale = LinearScale;
    class LogarithmicScale extends BaseScale {
        inferParameters(values) {
            const scale = d3_scale_1.scaleLog()
                .domain([Math.min(...values), Math.max(...values)])
                .nice();
            this.domainMin = scale.domain()[0];
            this.domainMax = scale.domain()[1];
            if (this.domainMax == this.domainMin) {
                this.domainMax = this.domainMin + 1;
            }
        }
        get(v) {
            return ((Math.log(v) - Math.log(this.domainMin)) /
                (Math.log(this.domainMax) - Math.log(this.domainMin)));
        }
        ticks(n = 10) {
            const scale = d3_scale_1.scaleLog().domain([this.domainMin, this.domainMax]);
            return scale.ticks(n);
        }
        tickFormat(n = 10, specifier) {
            const scale = d3_scale_1.scaleLog().domain([this.domainMin, this.domainMax]);
            return scale.tickFormat(n, specifier);
        }
    }
    Scale.LogarithmicScale = LogarithmicScale;
    class DateScale extends LinearScale {
        inferParameters(values) {
            const scale = d3_scale_1.scaleUtc()
                .domain([Math.min(...values), Math.max(...values)])
                .nice();
            this.domainMin = scale.domain()[0].getTime();
            this.domainMax = scale.domain()[1].getTime();
            if (this.domainMax == this.domainMin) {
                this.domainMax = this.domainMin + 1000; // 1 second difference
            }
        }
        ticks(n = 10) {
            const scale = d3_scale_1.scaleUtc().domain([this.domainMin, this.domainMax]);
            return scale.ticks(n).map(x => x.getTime());
        }
        tickFormat(n = 10, specifier) {
            const scale = d3_scale_1.scaleUtc().domain([this.domainMin, this.domainMax]);
            const fmt = scale.tickFormat(n, specifier);
            return (t) => fmt(new Date(t));
        }
    }
    Scale.DateScale = DateScale;
    class CategoricalScale extends BaseScale {
        inferParameters(values, order = "alphabetically") {
            const vals = new Map();
            const domain = [];
            for (let v of values) {
                if (v == null) {
                    continue;
                }
                v = v.toString();
                if (vals.has(v)) {
                    vals.set(v, vals.get(v) + 1);
                }
                else {
                    vals.set(v, 1);
                    domain.push(v);
                }
            }
            // Sort alphabetically
            switch (order) {
                case "alphabetically":
                    {
                        domain.sort((a, b) => (a < b ? -1 : 1));
                    }
                    break;
                case "occurrence":
                    {
                        domain.sort((a, b) => {
                            const ca = vals.get(a);
                            const cb = vals.get(b);
                            if (ca != cb) {
                                return cb - ca;
                            }
                            else {
                                return a < b ? -1 : 1;
                            }
                        });
                    }
                    break;
                case "order":
                    {
                    }
                    break;
            }
            this.domain = new Map();
            for (let i = 0; i < domain.length; i++) {
                this.domain.set(domain[i], i);
            }
            this.length = domain.length;
        }
        get(v) {
            return this.domain.get(v);
        }
    }
    Scale.CategoricalScale = CategoricalScale;
})(Scale = exports.Scale || (exports.Scale = {}));
//# sourceMappingURL=scales.js.map