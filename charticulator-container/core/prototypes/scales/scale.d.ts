import { ConstraintSolver, Variable } from "../../solver";
import { DataValue, Scale, ScaleState, AttributeValue, AttributeMap } from "../../specification";
import { DataMappingHints, ObjectClass, TemplateParameters, ObjectClassMetadata } from "../common";
export interface InferParametersOptions extends DataMappingHints {
    /** Whether to extend the scale domain/range with new data */
    extendScale?: boolean;
    /** Whether to reuse the existing range of the scale, applies to color and image */
    reuseRange?: boolean;
    /** Whether to ensure the domainMin == 0 (for numeric scales) */
    startWithZero?: "default" | "always" | "never";
}
export declare abstract class ScaleClass<PropertiesType extends AttributeMap = AttributeMap, AttributesType extends AttributeMap = AttributeMap> extends ObjectClass<PropertiesType, AttributesType> {
    readonly object: Scale<PropertiesType>;
    readonly state: ScaleState<AttributesType>;
    static metadata: ObjectClassMetadata;
    abstract mapDataToAttribute(data: DataValue): AttributeValue;
    buildConstraint(data: DataValue, target: Variable, solver: ConstraintSolver): void;
    abstract inferParameters(column: DataValue[], options?: InferParametersOptions): void;
    getTemplateParameters(): TemplateParameters;
}
