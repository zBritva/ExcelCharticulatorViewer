import { Actions } from "../../actions";
import { AppStore } from "../app_store";
import { ActionHandlerRegistry } from "./registry";
export default function (REG: ActionHandlerRegistry<AppStore, Actions.Action>): void;
