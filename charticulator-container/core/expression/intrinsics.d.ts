import { ValueType } from "./classes";
export declare let constants: {
    [name: string]: ValueType;
};
export declare let functions: {
    [name: string]: Function | {
        [name: string]: Function;
    };
};
export declare let operators: {
    [name: string]: Function;
};
export declare let precedences: {
    LAMBDA_EXPRESSION: number;
    FUNCTION_ARGUMENT: number;
    OPERATORS: {
        [name: string]: number[];
    };
    FUNCTION_CALL: number;
    LAMBDA_FUNCTION: number;
    VARIABLE: number;
    FIELD_ACCESS: number;
    VALUE: number;
};
