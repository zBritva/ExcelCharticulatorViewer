import * as React from "react";
export interface ErrorBoundaryProps {
    maxWidth?: number;
}
export declare class ErrorBoundary extends React.Component<ErrorBoundaryProps, {
    hasError: boolean;
}> {
    constructor(props: ErrorBoundaryProps);
    componentDidCatch(error: Error, info: any): void;
    render(): any;
}
