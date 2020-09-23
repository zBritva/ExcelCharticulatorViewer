"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
const React = require("react");
const buttons_1 = require("./buttons");
const R = require("../resources");
class EditableTextView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            editing: this.props.autofocus || false,
            currentText: this.props.text
        };
        this.confirmEdit = this.confirmEdit.bind(this);
        this.cancelEdit = this.cancelEdit.bind(this);
        this.startEdit = this.startEdit.bind(this);
    }
    confirmEdit() {
        const text = this.state.currentText;
        this.setState({
            editing: false
        });
        if (this.props.onEdit) {
            this.props.onEdit(text);
        }
    }
    cancelEdit() {
        this.setState({
            editing: false
        });
    }
    startEdit() {
        this.setState({
            editing: true,
            currentText: this.props.text
        });
    }
    componentDidMount() {
        if (this.props.autofocus) {
            this.refs.input.select();
        }
    }
    componentDidUpdate(prevProps, prevState) {
        if (prevState.editing == false && this.state.editing == true) {
            this.refs.input.select();
        }
    }
    render() {
        if (this.state.editing) {
            return (React.createElement("div", { className: "editable-text-view editable-text-view-editing" },
                React.createElement("input", { type: "text", ref: "input", value: this.state.currentText, onChange: e => this.setState({ currentText: this.refs.input.value }), onKeyDown: e => {
                        if (e.key == "Enter") {
                            this.confirmEdit();
                        }
                        if (e.key == "Escape") {
                            this.cancelEdit();
                        }
                    }, autoFocus: true, onBlur: () => {
                        if (this.state.currentText == this.props.text) {
                            this.cancelEdit();
                        }
                    } }),
                React.createElement(buttons_1.ButtonFlat, { url: R.getSVGIcon("general/confirm"), onClick: this.confirmEdit, stopPropagation: true })));
        }
        else {
            return (React.createElement("div", { className: "editable-text-view", onClick: this.startEdit },
                React.createElement("span", { className: "text" }, this.props.text)));
        }
    }
}
exports.EditableTextView = EditableTextView;
//# sourceMappingURL=editable_text_view.js.map