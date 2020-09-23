/// <reference types="d3-scale" />
export declare namespace Scale {
    /** Base scale class */
    abstract class BaseScale<InputType, OutputType> {
        /** Infer scale parameters given a list of values */
        abstract inferParameters(values: InputType[]): void;
        /** Get mapped value */
        abstract get(value: InputType): OutputType;
        /** Get mapped values */
        map(values: InputType[]): OutputType[];
    }
    class LinearScale extends BaseScale<number, number> {
        domainMin: number;
        domainMax: number;
        inferParameters(values: number[]): void;
        adjustDomain(options: {
            startWithZero?: "default" | "always" | "never";
        }): void;
        get(v: number): number;
        ticks(n?: number): number[];
        tickFormat(n?: number, specifier?: string): (d: number | {
            valueOf(): number;
        }) => string;
    }
    class LogarithmicScale extends BaseScale<number, number> {
        domainMin: number;
        domainMax: number;
        inferParameters(values: number[]): void;
        get(v: number): number;
        ticks(n?: number): number[];
        tickFormat(n?: number, specifier?: string): (d: number | {
            valueOf(): number;
        }) => string;
    }
    class DateScale extends LinearScale {
        inferParameters(values: number[]): void;
        ticks(n?: number): number[];
        tickFormat(n?: number, specifier?: string): (t: number) => string;
    }
    class CategoricalScale extends BaseScale<string, number> {
        domain: Map<string, number>;
        length: number;
        inferParameters(values: string[], order?: "alphabetically" | "occurrence" | "order"): void;
        get(v: string): number;
    }
}
