"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
const React = require("react");
const stores_1 = require("./stores");
exports.MainContextTypes = {
    store: (props, propName, componentName) => {
        if (props[propName] instanceof stores_1.AppStore) {
            return null;
        }
        else {
            return new Error(`store not found in component ${componentName}`);
        }
    }
};
class ContextedComponent extends React.Component {
    constructor(props, context) {
        super(props, context);
    }
    dispatch(action) {
        this.context.store.dispatcher.dispatch(action);
    }
    get store() {
        return this.context.store;
    }
}
ContextedComponent.contextTypes = exports.MainContextTypes;
exports.ContextedComponent = ContextedComponent;
//# sourceMappingURL=context_component.js.map