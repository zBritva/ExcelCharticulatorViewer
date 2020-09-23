import * as React from "react";
import { Specification } from "../../../core";
import { ContextedComponent } from "../../context_component";
export interface LinkCreationPanelProps {
    onFinish?: () => void;
}
export interface LinkCreationPanelState {
    linkType: "line" | "band";
    linkMode: string;
    plotSegments: Specification.PlotSegment[];
    selectedPlotSegments: string[];
    errorReport: string;
}
export declare class LinkCreationPanel extends ContextedComponent<LinkCreationPanelProps, LinkCreationPanelState> {
    state: LinkCreationPanelState;
    private groupBySelector;
    private getDefaultState;
    private isLinkDataPresent;
    render(): JSX.Element;
    private getDefaultAnchor;
    getLinkObject(): Specification.Links<Specification.ObjectProperties>;
}
export interface PlotSegmentSelectorProps {
    items: Specification.PlotSegment[];
    defaultSelection?: string[];
    onChange?: (newSelection: string[]) => void;
}
export interface PlotSegmentSelectorState {
    order: string[];
    selection: string[];
}
export declare class PlotSegmentSelector extends ContextedComponent<PlotSegmentSelectorProps, PlotSegmentSelectorState> {
    state: PlotSegmentSelectorState;
    private getInitialState;
    private notify;
    render(): JSX.Element;
}
export interface PanelRadioControlProps {
    options: string[];
    icons?: string[];
    labels?: string[];
    showText?: boolean;
    asList?: boolean;
    value?: string;
    onChange?: (newValue: string) => void;
}
export declare class PanelRadioControl extends React.Component<PanelRadioControlProps, {}> {
    render(): JSX.Element;
}
