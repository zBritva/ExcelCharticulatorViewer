"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
const React = require("react");
const index_1 = require("./index");
class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            hasError: false
        };
    }
    componentDidCatch(error, info) {
        this.setState({
            hasError: true
        });
        console.log(error, info);
    }
    render() {
        if (this.state.hasError) {
            const maxWidth = this.props.maxWidth
                ? this.props.maxWidth + "px"
                : undefined;
            return (React.createElement("div", { className: "charticulator__error-boundary-report", style: { margin: "1em", maxWidth } },
                React.createElement("p", null, "Oops! Something went wrong here. This must be a software bug. As a last resort, you can undo the previous change and try again."),
                React.createElement("p", null,
                    React.createElement(index_1.ButtonRaised, { text: "Try Again", onClick: () => {
                            this.setState({
                                hasError: false
                            });
                        } }))));
        }
        return this.props.children;
    }
}
exports.ErrorBoundary = ErrorBoundary;
//# sourceMappingURL=error_boundary.js.map