/** A registry of action handlers */
export declare class ActionHandlerRegistry<ThisType, BaseAction> {
    private handlers;
    /**
     * Register an action handler function
     * @param constructor the action constructor
     * @param handler the action handler
     */
    add<ActionType extends BaseAction>(constructor: {
        new (...args: any[]): ActionType;
    }, handler: (this: ThisType, action: ActionType) => void): void;
    /**
     * Find and call the handler(s) for the action
     * @param thisArg the this argument for the handler
     * @param action the action to pass to
     */
    handleAction(thisArg: ThisType, action: BaseAction): void;
}
