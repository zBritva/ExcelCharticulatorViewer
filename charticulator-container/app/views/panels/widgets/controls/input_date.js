"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
const React = require("react");
const input_text_1 = require("./input_text");
const datetime_1 = require("../../../../../core/dataset/datetime");
const d3 = require("d3-time-format");
class InputDate extends React.Component {
    formatDate(value, interval) {
        if (value == null) {
            return "";
        }
        if (typeof value === "number") {
            return d3.timeFormat("%Y-%m-%dT%H:%M:%S")(new Date(value));
        }
        if (typeof Date === "object" && value instanceof Date) {
            return d3.timeFormat("%Y-%m-%dT%H:%M:%S")(value);
        }
    }
    render() {
        return (React.createElement("span", { className: "charticulator__widget-control-input-number" },
            React.createElement("div", { className: "charticulator__widget-control-input-number-input" }, this.props.showCalendar ?
                "datapicker" :
                (React.createElement(input_text_1.InputText, { ref: e => (this.textInput = e), placeholder: this.props.placeholder, defaultValue: this.formatDate(this.props.defaultValue, this.props.interval), onEnter: str => {
                        const date = datetime_1.parseDate(str);
                        this.props.onEnter(date);
                        return date != null;
                    } })))));
    }
}
exports.InputDate = InputDate;
//# sourceMappingURL=input_date.js.map