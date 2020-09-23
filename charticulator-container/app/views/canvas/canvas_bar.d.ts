import * as React from "react";
export interface CanvasBarProps {
    canvasWidth: number;
    canvasHeight: number;
    onReset?: () => void;
}
export declare class CanvasBar extends React.Component<CanvasBarProps, {}> {
    render(): JSX.Element;
}
