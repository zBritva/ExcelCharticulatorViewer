"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
const React = require("react");
const button_1 = require("./button");
class InputFile extends React.Component {
    constructor(props) {
        super(props);
        this.doOpenFile = this.doOpenFile.bind(this);
    }
    doOpenFile() {
        this.inputElement.value = null;
        this.inputElement.click();
    }
    onFileSelected() {
        if (this.inputElement.files.length == 1) {
            const file = this.inputElement.files[0];
            const reader = new FileReader();
            reader.onload = e => {
                this.props.onOpenFile(file.name, reader.result);
            };
            switch (this.props.outputType) {
                case "data-url":
                    {
                        reader.readAsDataURL(file);
                    }
                    break;
                case "text":
                    {
                        reader.readAsText(file);
                    }
                    break;
                case "array-buffer":
                    {
                        reader.readAsArrayBuffer(file);
                    }
                    break;
            }
        }
    }
    render() {
        return (React.createElement("span", { className: "charticulator__widget-control-input-file" },
            this.props.fileName ? React.createElement("span", { className: "el-filename" }) : null,
            React.createElement(button_1.Button, { icon: "general/open", active: false, onClick: this.doOpenFile }),
            React.createElement("input", { style: { display: "none" }, ref: e => (this.inputElement = e), type: "file", accept: this.props.accept.join(","), onChange: this.onFileSelected })));
    }
}
exports.InputFile = InputFile;
//# sourceMappingURL=input_file.js.map