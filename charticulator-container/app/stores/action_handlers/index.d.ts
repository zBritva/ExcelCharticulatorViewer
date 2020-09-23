import { Actions } from "../../actions";
import { AppStore } from "../app_store";
import { ActionHandlerRegistry } from "./registry";
export declare function registerActionHandlers(REG: ActionHandlerRegistry<AppStore, Actions.Action>): void;
export { ActionHandlerRegistry };
