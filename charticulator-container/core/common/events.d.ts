export declare class EventSubscription {
    emitter: EventEmitter;
    event: string;
    listener: Function;
    next: EventSubscription;
    prev: EventSubscription;
    constructor(emitter: EventEmitter, event: string, listener: Function);
    remove(): void;
}
export declare class EventEmitter {
    private eventSubscriptions;
    addListener(event: string, listener: Function): EventSubscription;
    emit(event: string, ...parameters: any[]): void;
    removeSubscription(subscription: EventSubscription): void;
}
export declare class Dispatcher<ActionType> {
    static PRIORITY_LOW: number;
    static PRIORITY_DEFAULT: number;
    static PRIORITY_HIGH: number;
    private registeredItems;
    private currentID;
    private isDispatching;
    private dispatchingIndex;
    private currentAction;
    dispatch(action: ActionType): void;
    private invoke;
    register(callback: (action: ActionType) => void, priority?: number): string;
    unregister(id: string): void;
    waitFor(ids: string[]): void;
}
