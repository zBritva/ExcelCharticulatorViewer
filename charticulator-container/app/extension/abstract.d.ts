import { Dispatcher } from "../../core";
import { Action } from "../actions/actions";
import { AppStore } from "../stores";
export interface ExtensionContext {
    getGlobalDispatcher(): Dispatcher<Action>;
    getAppStore(): AppStore;
}
export interface Extension {
    activate(context: ExtensionContext): void;
    deactivate(): void;
}
