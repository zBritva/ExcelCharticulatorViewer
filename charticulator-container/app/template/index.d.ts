import { Dataset, Prototypes, Specification } from "../../core";
export interface ExportTemplateTargetProperty {
    displayName: string;
    name: string;
    type: string;
    default: any;
}
/** Represents target chart template export format */
export interface ExportTemplateTarget {
    /** Get export format properties, such as template name, author */
    getProperties(): ExportTemplateTargetProperty[];
    /** Get the file name of the exported artifact */
    getFileName?(properties: {
        [name: string]: any;
    }): string;
    /** Deprecated: get the file extension of the exported artifact */
    getFileExtension?(properties: {
        [name: string]: any;
    }): string;
    /** Generate the exported template, return a base64 string encoding the file */
    generate(properties: {
        [name: string]: any;
    }): Promise<string>;
}
export declare class ChartTemplateBuilder {
    readonly chart: Specification.Chart;
    readonly dataset: Dataset.Dataset;
    readonly manager: Prototypes.ChartStateManager;
    protected template: Specification.Template.ChartTemplate;
    protected tableColumns: {
        [name: string]: Set<string>;
    };
    private objectVisited;
    constructor(chart: Specification.Chart, dataset: Dataset.Dataset, manager: Prototypes.ChartStateManager);
    reset(): void;
    addTable(table: string): void;
    addColumn(table: string, column: string): void;
    addColumnsFromExpression(table: string, expr: string, textExpression?: boolean): void;
    propertyToString(property: Specification.Template.PropertyField): string;
    addObject(table: string, objectClass: Prototypes.ObjectClass): void;
    build(): Specification.Template.ChartTemplate;
    /**
     * Computes the default attributes
     */
    private computeDefaultAttributes;
}
