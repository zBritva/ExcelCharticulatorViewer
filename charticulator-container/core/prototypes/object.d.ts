import * as Specification from "../specification";
import { TemplateParameters } from ".";
import { Controls, CreatingInteraction } from "./common";
export interface AttributeDescription {
    name: string;
    type: Specification.AttributeType;
    /** Exclude this from the constraint solver */
    solverExclude?: boolean;
    stateExclude?: boolean;
    editableInGlyphStage?: boolean;
    /** Default value: used when nothing is specified for this attribute */
    defaultValue?: Specification.AttributeValue;
    /** Default range: hint for scale inference */
    defaultRange?: Specification.AttributeValue[];
}
export interface AttributeDescriptions {
    [name: string]: AttributeDescription;
}
export interface ObjectClassMetadata {
    /** Display name of the object */
    displayName?: string;
    /** Object icon resource */
    iconPath?: string;
    /** Create by mouse interaction */
    creatingInteraction?: CreatingInteraction.Description;
}
/** A ObjectClass contains the runtime info for a chart object */
export declare abstract class ObjectClass<PropertiesType extends Specification.AttributeMap = Specification.AttributeMap, AttributesType extends Specification.AttributeMap = Specification.AttributeMap> {
    /** The static classID */
    static classID: string;
    /** The static type */
    static type: string;
    /** The metadata associated with the class */
    static metadata: ObjectClassMetadata;
    /** Default attributes */
    static defaultProperties: Specification.AttributeMap;
    /** Default mapping values */
    static defaultMappingValues: Specification.AttributeMap;
    /** The stored object */
    readonly object: Specification.Object<PropertiesType>;
    /** The stored object state */
    readonly state: Specification.ObjectState<AttributesType>;
    /** The parent object class */
    readonly parent: ObjectClass;
    /** Attribute names, this can be a normal field or a dynamic property with a get method */
    abstract attributeNames: string[];
    /** Attribute descriptions, this can be a normal field or a dynamic property with a get method */
    abstract attributes: AttributeDescriptions;
    constructor(parent: ObjectClass, object: Specification.Object<PropertiesType>, state: Specification.ObjectState<AttributesType>);
    /** Initialize the state of the object */
    initializeState(): void;
    /** Get the UI spec for property panel */
    getAttributePanelWidgets(manager: Controls.WidgetManager): Controls.Widget[];
    getTemplateParameters(): TemplateParameters;
    /** Create a default object */
    static createDefault(...args: any[]): Specification.Object;
}
/** ObjectClass constructor */
export interface ObjectClassConstructor {
    new (parent: ObjectClass, object: Specification.Object, state: Specification.ObjectState): ObjectClass;
    classID: string;
    type: string;
    metadata: ObjectClassMetadata;
    defaultProperties: Specification.AttributeMap;
    defaultMappingValues: Specification.AttributeMap;
    createDefault: (...args: any[]) => Specification.Object;
}
/** Store the registered object classes */
export declare class ObjectClasses {
    private static registeredObjectClasses;
    private static type2Parents;
    /** Create a ObjectClass for a object and its state */
    static Create(parent: ObjectClass, object: Specification.Object, state: Specification.ObjectState): ObjectClass;
    static CreateDefault(classID: string, ...args: any[]): Specification.Object<Specification.ObjectProperties>;
    static GetMetadata(classID: string): ObjectClassMetadata;
    static Register(constructor: ObjectClassConstructor): void;
    static RegisterType(name: string, ...parents: string[]): void;
    static isType(type: string, parentType: string): boolean;
    /**
     * Gets an interator of registered classes.
     */
    static RegisteredClasses(): IterableIterator<ObjectClassConstructor>;
}
export declare let isType: typeof ObjectClasses.isType;
