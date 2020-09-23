import { EventEmitter, Dispatcher } from "../common";
import { Actions } from "../../app/actions";
export declare class BaseStore extends EventEmitter {
    readonly _id: string;
    readonly parent: BaseStore;
    readonly dispatcher: Dispatcher<Actions.Action>;
    readonly dispatcherID: string;
    constructor(parent: BaseStore | null);
    handleAction(action: Actions.Action): void;
    destroy(): void;
}
