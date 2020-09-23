"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
const React = require("react");
const controls_1 = require("../panels/widgets/controls");
const utils_1 = require("../../utils");
class TableView extends React.Component {
    render() {
        const table = this.props.table;
        const onTypeChange = this.props.onTypeChange;
        let maxRows = table.rows.length;
        if (this.props.maxRows != null) {
            if (maxRows > this.props.maxRows) {
                maxRows = this.props.maxRows;
            }
        }
        return (React.createElement("table", { className: "charticulator__dataset-table-view" },
            React.createElement("thead", null,
                React.createElement("tr", null, table.columns.map(c => (React.createElement("th", { key: c.name }, c.name))))),
            React.createElement("tbody", null,
                onTypeChange && (React.createElement("tr", { key: -1 }, table.columns.map(c => {
                    const convertableTypes = utils_1.getConvertableTypes(c.type, table.rows.slice(0, 10).map(row => row[c.name]));
                    return (React.createElement("td", { key: c.name }, React.createElement(controls_1.Select, { onChange: newType => {
                            onTypeChange(c.name, newType);
                            this.forceUpdate();
                        }, value: c.type, options: convertableTypes, labels: convertableTypes.map(type => {
                            const str = type.toString();
                            return str[0].toUpperCase() + str.slice(1);
                        }), showText: true })));
                }))),
                table.rows.slice(0, maxRows).map(r => (React.createElement("tr", { key: r._id }, table.columns.map(c => (React.createElement("td", { key: c.name }, r[c.name] && r[c.name].toString())))))),
                table.rows.length > maxRows ? (React.createElement("tr", null, table.columns.map((c, i) => i == 0 ? (React.createElement("td", { key: i },
                    "(",
                    table.rows.length - maxRows,
                    " more rows)")) : (React.createElement("td", { key: i }, "..."))))) : null)));
    }
}
exports.TableView = TableView;
//# sourceMappingURL=table_view.js.map