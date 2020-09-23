/// <reference types="react" />
import { Specification } from "../../../../core";
import { DataMappingHints } from "../../../../core/prototypes";
import { InputNumberOptions } from "../../../../core/prototypes/controls";
import { ContextedComponent } from "../../../context_component";
export interface ValueEditorProps {
    value: Specification.AttributeValue;
    type: Specification.AttributeType;
    /** When value is null, show defaultValue in editor */
    defaultValue?: Specification.AttributeValue;
    /** When value is null, show placeholder text */
    placeholder?: string;
    onEmitValue?: (value: Specification.AttributeValue) => void;
    onClear?: () => void;
    /** In some cases the value editor can emit data mapping */
    onEmitMapping?: (mapping: Specification.Mapping) => void;
    onBeginDataFieldSelection?: (anchor: Element) => void;
    /** The table to use for data mapping */
    getTable?: () => string;
    hints?: DataMappingHints;
    numberOptions?: InputNumberOptions;
}
export declare class ValueEditor extends ContextedComponent<ValueEditorProps, {}> {
    emitClearValue(): void;
    emitSetValue(value: Specification.AttributeValue): void;
    emitMapping(mapping: Specification.Mapping): void;
    render(): JSX.Element;
}
