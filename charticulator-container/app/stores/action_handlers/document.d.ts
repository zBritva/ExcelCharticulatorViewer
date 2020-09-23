import { Actions } from "../../actions";
import { AppStore } from "../app_store";
import { ActionHandlerRegistry } from "./registry";
/** Handlers for document-level actions such as Load, Save, Import, Export, Undo/Redo, Reset */
export default function (REG: ActionHandlerRegistry<AppStore, Actions.Action>): void;
