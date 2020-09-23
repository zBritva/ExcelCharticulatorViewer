export declare class ResizeListeners {
    private timer;
    private entries;
    constructor();
    addListener(element: Element, callback: () => void): number;
    removeListener(element: Element, handle: number): void;
    private timerCallback;
}
