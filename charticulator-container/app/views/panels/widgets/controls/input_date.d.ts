import * as React from "react";
export interface InputDateProps {
    defaultValue?: number | Date;
    placeholder?: string;
    onEnter?: (value: number) => boolean;
    showCalendar?: boolean;
    calendarRange?: [number, number];
    interval?: "second" | "minute" | "hour" | "day" | "month" | "year";
    dateDisplayFormat?: string;
}
export declare class InputDate extends React.Component<InputDateProps, {}> {
    private textInput;
    private formatDate;
    render(): JSX.Element;
}
