"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
const React = require("react");
const R = require("../../resources");
const components_1 = require("../../components");
const utils_1 = require("../../utils");
const export_view_1 = require("./export_view");
const new_view_1 = require("./new_view");
const open_view_1 = require("./open_view");
const save_view_1 = require("./save_view");
class CurrentChartView extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            svgDataURL: null
        };
        this.renderImage();
    }
    renderImage() {
        return __awaiter(this, void 0, void 0, function* () {
            const svg = yield this.props.store.renderLocalSVG();
            this.setState({
                svgDataURL: utils_1.stringToDataURL("image/svg+xml", svg)
            });
        });
    }
    render() {
        return (React.createElement("div", { className: "current-chart-view" },
            React.createElement("img", { src: this.state.svgDataURL })));
    }
}
exports.CurrentChartView = CurrentChartView;
class FileView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentTab: this.props.defaultTab || "open"
        };
    }
    switchTab(name) {
        this.setState({
            currentTab: name
        });
    }
    renderContent() {
        switch (this.state.currentTab) {
            case "new": {
                return React.createElement(new_view_1.FileViewNew, { onClose: this.props.onClose });
            }
            case "save": {
                return React.createElement(save_view_1.FileViewSaveAs, { onClose: this.props.onClose });
            }
            case "export": {
                return React.createElement(export_view_1.FileViewExport, { onClose: this.props.onClose });
            }
            case "about": {
                return (React.createElement("iframe", { className: "charticulator__file-view-about", src: "about.html", style: { flex: "1" } }));
            }
            case "open":
            default: {
                return React.createElement(open_view_1.FileViewOpen, { onClose: this.props.onClose });
            }
        }
    }
    render() {
        return (React.createElement("div", { className: "charticulator__file-view" },
            React.createElement("div", { className: "charticulator__file-view-tabs" },
                React.createElement("div", { className: "el-button-back", onClick: () => this.props.onClose() },
                    React.createElement(components_1.SVGImageIcon, { url: R.getSVGIcon("toolbar/back") })),
                React.createElement("div", { className: utils_1.classNames("el-tab", [
                        "active",
                        this.state.currentTab == "new"
                    ]), onClick: () => this.switchTab("new") }, "New"),
                React.createElement("div", { className: utils_1.classNames("el-tab", [
                        "active",
                        this.state.currentTab == "open"
                    ]), onClick: () => this.switchTab("open") }, "Open"),
                React.createElement("div", { className: utils_1.classNames("el-tab", [
                        "active",
                        this.state.currentTab == "save"
                    ]), onClick: () => this.switchTab("save") }, "Save As"),
                React.createElement("div", { className: utils_1.classNames("el-tab", [
                        "active",
                        this.state.currentTab == "export"
                    ]), onClick: () => this.switchTab("export") }, "Export"),
                React.createElement("div", { className: "el-sep" }),
                React.createElement("div", { className: utils_1.classNames("el-tab", [
                        "active",
                        this.state.currentTab == "about"
                    ]), onClick: () => this.switchTab("about") }, "About")),
            React.createElement(components_1.ErrorBoundary, null, this.renderContent())));
    }
}
exports.FileView = FileView;
//# sourceMappingURL=index.js.map