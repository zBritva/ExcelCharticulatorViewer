"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class TextMeasurer {
    constructor() {
        if (typeof document != "undefined") {
            this.canvas = document.createElement("canvas");
            this.context = this.canvas.getContext("2d");
            this.fontFamily = "Arial";
            this.fontSize = 13;
        }
    }
    setFontFamily(family) {
        this.fontFamily = family;
    }
    setFontSize(size) {
        this.fontSize = size;
    }
    measure(text) {
        this.context.font = `${this.fontSize}px "${this.fontFamily}"`;
        return {
            width: this.context.measureText(text).width,
            fontSize: this.fontSize,
            ideographicBaseline: this.fontSize * TextMeasurer.parameters.ideographicBaseline[0] +
                TextMeasurer.parameters.ideographicBaseline[1],
            hangingBaseline: this.fontSize * TextMeasurer.parameters.hangingBaseline[0] +
                TextMeasurer.parameters.hangingBaseline[1],
            alphabeticBaseline: this.fontSize * TextMeasurer.parameters.alphabeticBaseline[0] +
                TextMeasurer.parameters.alphabeticBaseline[1],
            middle: this.fontSize * TextMeasurer.parameters.middle[0] +
                TextMeasurer.parameters.middle[1]
        };
    }
    static GetGlobalInstance() {
        if (this.globalInstance == null) {
            this.globalInstance = new TextMeasurer();
        }
        return this.globalInstance;
    }
    static Measure(text, family, size) {
        const inst = this.GetGlobalInstance();
        inst.setFontFamily(family);
        inst.setFontSize(size);
        return inst.measure(text);
    }
    static ComputeTextPosition(x, y, metrics, alignX = "left", alignY = "middle", xMargin = 0, yMargin = 0) {
        const cwidth = metrics.width;
        const cheight = (metrics.middle - metrics.ideographicBaseline) * 2;
        let cx = cwidth / 2, cy = cheight / 2;
        if (alignX == "left") {
            cx = -xMargin;
        }
        if (alignX == "right") {
            cx = cwidth + xMargin;
        }
        if (alignY == "top") {
            cy = -yMargin;
        }
        if (alignY == "bottom") {
            cy = cheight + yMargin;
        }
        return [x - cx, y - cheight + cy - metrics.ideographicBaseline];
    }
}
TextMeasurer.parameters = {
    hangingBaseline: [0.7245381636743151, -0.005125313493913097],
    ideographicBaseline: [-0.2120442632498544, 0.008153756552125913],
    alphabeticBaseline: [0, 0],
    middle: [0.34642399534071056, -0.22714036109493208]
};
TextMeasurer.globalInstance = null;
exports.TextMeasurer = TextMeasurer;
//# sourceMappingURL=text_measurer.js.map