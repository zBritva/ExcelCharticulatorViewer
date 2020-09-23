import * as React from "react";
import { Dataset, Prototypes, Specification } from "../../../core";
export interface ChartDisplayViewProps {
    manager: Prototypes.ChartStateManager;
}
export declare class ChartDisplayView extends React.Component<ChartDisplayViewProps, {}> {
    render(): JSX.Element;
}
export declare function renderChartToString(dataset: Dataset.Dataset, chart: Specification.Chart, chartState: Specification.ChartState): string;
export declare function renderChartToLocalString(dataset: Dataset.Dataset, chart: Specification.Chart, chartState: Specification.ChartState): Promise<string>;
