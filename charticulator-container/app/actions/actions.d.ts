import { Dataset, Point, Prototypes, Specification, Action, SelectMark, ClearSelection } from "../../core";
import * as DragData from "./drag_data";
import { ExportTemplateTarget } from "../template";
import { DataType } from "../../core/dataset";
export { Action, SelectMark, ClearSelection };
export declare class Undo extends Action {
    digest(): {
        name: string;
    };
}
export declare class Redo extends Action {
    digest(): {
        name: string;
    };
}
export declare class Reset extends Action {
    digest(): {
        name: string;
    };
}
export declare class Export extends Action {
    type: string;
    options: {
        scale?: number;
        quality?: number;
    };
    constructor(type: string, options?: {
        scale?: number;
        quality?: number;
    });
    digest(): {
        name: string;
        type: string;
        options: {
            scale?: number;
            quality?: number;
        };
    };
}
export declare class ExportTemplate extends Action {
    kind: string;
    target: ExportTemplateTarget;
    properties: {
        [name: string]: string;
    };
    constructor(kind: string, target: ExportTemplateTarget, properties: {
        [name: string]: string;
    });
    digest(): {
        name: string;
    };
}
export declare class SaveExportTemplatePropertyName extends Action {
    objectId: string;
    propertyName: string;
    value: string;
    constructor(objectId: string, propertyName: string, value: string);
    digest(): {
        name: string;
    };
}
export declare class Open extends Action {
    id: string;
    onFinish?: (error?: Error) => void;
    constructor(id: string, onFinish?: (error?: Error) => void);
    digest(): {
        name: string;
        id: string;
    };
}
/** Save the current chart */
export declare class Save extends Action {
    onFinish?: (error?: Error) => void;
    constructor(onFinish?: (error?: Error) => void);
    digest(): {
        name: string;
    };
}
export declare class SaveAs extends Action {
    saveAs: string;
    onFinish?: (error?: Error) => void;
    constructor(saveAs: string, onFinish?: (error?: Error) => void);
    digest(): {
        name: string;
        saveAs: string;
    };
}
export declare class Load extends Action {
    projectData: any;
    constructor(projectData: any);
    digest(): {
        name: string;
    };
}
export declare class ImportDataset extends Action {
    dataset: Dataset.Dataset;
    constructor(dataset: Dataset.Dataset);
    digest(): {
        name: string;
        datasetName: string;
    };
}
export declare class ImportChartAndDataset extends Action {
    specification: Specification.Chart;
    dataset: Dataset.Dataset;
    options: {
        [key: string]: any;
    };
    constructor(specification: Specification.Chart, dataset: Dataset.Dataset, options: {
        [key: string]: any;
    });
    digest(): {
        name: string;
    };
}
export declare class ReplaceDataset extends Action {
    dataset: Dataset.Dataset;
    constructor(dataset: Dataset.Dataset);
    digest(): {
        name: string;
        datasetName: string;
    };
}
/** Invokes updaes all plot segments on the chart,  */
export declare class UpdatePlotSegments extends Action {
    constructor();
    digest(): {
        name: string;
    };
}
export declare class ConvertColumnDataType extends Action {
    tableName: string;
    column: string;
    type: DataType;
    constructor(tableName: string, column: string, type: DataType);
    digest(): {
        name: string;
    };
}
/** Add an empty glyph to the chart */
export declare class AddGlyph extends Action {
    classID: string;
    constructor(classID: string);
    digest(): {
        name: string;
        classID: string;
    };
}
/** Remove a glyph from the chart */
export declare class RemoveGlyph extends Action {
    glyph: Specification.Glyph;
    constructor(glyph: Specification.Glyph);
    digest(): {
        name: string;
        glyph: string[];
    };
}
export declare class AddMarkToGlyph extends Action {
    glyph: Specification.Glyph;
    classID: string;
    point: Point;
    mappings: {
        [name: string]: [number, Specification.Mapping];
    };
    properties: Specification.AttributeMap;
    constructor(glyph: Specification.Glyph, classID: string, point: Point, mappings?: {
        [name: string]: [number, Specification.Mapping];
    }, properties?: Specification.AttributeMap);
    digest(): {
        name: string;
        classID: string;
        glyph: string[];
        mappings: {
            [name: string]: [number, Specification.Mapping];
        };
        properties: Specification.AttributeMap;
    };
}
export declare class RemoveMarkFromGlyph extends Action {
    glyph: Specification.Glyph;
    mark: Specification.Element;
    constructor(glyph: Specification.Glyph, mark: Specification.Element);
    digest(): {
        name: string;
        glyph: string[];
        mark: string[];
    };
}
export declare class MapDataToMarkAttribute extends Action {
    glyph: Specification.Glyph;
    mark: Specification.Element;
    attribute: string;
    attributeType: Specification.AttributeType;
    expression: string;
    valueType: Specification.DataType;
    valueMetadata: Dataset.ColumnMetadata;
    hints: Prototypes.DataMappingHints;
    constructor(glyph: Specification.Glyph, mark: Specification.Element, attribute: string, attributeType: Specification.AttributeType, expression: string, valueType: Specification.DataType, valueMetadata: Dataset.ColumnMetadata, hints: Prototypes.DataMappingHints);
    digest(): {
        name: string;
        glyph: string[];
        mark: string[];
        attribute: string;
        attributeType: Specification.AttributeType;
        expression: string;
        valueType: Dataset.DataType;
        hints: any;
    };
}
export declare class MarkAction extends Action {
}
export declare class SetMarkAttribute extends MarkAction {
    glyph: Specification.Glyph;
    mark: Specification.Element;
    attribute: string;
    mapping: Specification.Mapping;
    constructor(glyph: Specification.Glyph, mark: Specification.Element, attribute: string, mapping: Specification.Mapping);
    digest(): {
        name: string;
        glyph: string[];
        mark: string[];
        attribute: string;
        mapping: Specification.Mapping;
    };
}
export declare class UnmapMarkAttribute extends MarkAction {
    glyph: Specification.Glyph;
    mark: Specification.Element;
    attribute: string;
    constructor(glyph: Specification.Glyph, mark: Specification.Element, attribute: string);
    digest(): {
        name: string;
        glyph: string[];
        mark: string[];
        attribute: string;
    };
}
export declare class UpdateMarkAttribute extends MarkAction {
    glyph: Specification.Glyph;
    mark: Specification.Element;
    updates: {
        [name: string]: Specification.AttributeValue;
    };
    constructor(glyph: Specification.Glyph, mark: Specification.Element, updates: {
        [name: string]: Specification.AttributeValue;
    });
    digest(): {
        name: string;
        glyph: string[];
        mark: string[];
        updates: {
            [name: string]: Specification.AttributeValue;
        };
    };
}
export declare class SnapMarks extends MarkAction {
    glyph: Specification.Glyph;
    mark: Specification.Element;
    attribute: string;
    targetMark: Specification.Element;
    targetAttribute: string;
    constructor(glyph: Specification.Glyph, mark: Specification.Element, attribute: string, targetMark: Specification.Element, targetAttribute: string);
    digest(): {
        name: string;
        glyph: string[];
        mark: string[];
        attribute: string;
        targetMark: string[];
        targetAttribute: string;
    };
}
export declare class MarkActionGroup extends MarkAction {
    actions: MarkAction[];
    constructor(actions?: MarkAction[]);
    add(action: MarkAction): void;
    digest(): {
        name: string;
        actions: {
            name: string;
        }[];
    };
}
export declare class SetGlyphAttribute extends Action {
    glyph: Specification.Glyph;
    attribute: string;
    mapping: Specification.Mapping;
    constructor(glyph: Specification.Glyph, attribute: string, mapping: Specification.Mapping);
    digest(): {
        name: string;
        glyph: string[];
        attribute: string;
        mapping: Specification.Mapping;
    };
}
export declare class UpdateGlyphAttribute extends Action {
    glyph: Specification.Glyph;
    updates: {
        [name: string]: Specification.AttributeValue;
    };
    constructor(glyph: Specification.Glyph, updates: {
        [name: string]: Specification.AttributeValue;
    });
    digest(): {
        name: string;
        glyph: string[];
        updates: {
            [name: string]: Specification.AttributeValue;
        };
    };
}
export declare class AddChartElement extends Action {
    classID: string;
    mappings: {
        [name: string]: [Specification.AttributeValue, Specification.Mapping];
    };
    properties: Specification.AttributeMap;
    constructor(classID: string, mappings: {
        [name: string]: [Specification.AttributeValue, Specification.Mapping];
    }, properties?: Specification.AttributeMap);
    digest(): {
        name: string;
        classID: string;
        mappings: {
            [name: string]: [Specification.AttributeValue, Specification.Mapping];
        };
        attribute: Specification.AttributeMap;
    };
}
export declare class DeleteChartElement extends Action {
    chartElement: Specification.ChartElement;
    constructor(chartElement: Specification.ChartElement);
    digest(): {
        name: string;
        chartElement: string[];
    };
}
export declare class SetChartElementMapping extends Action {
    chartElement: Specification.ChartElement;
    attribute: string;
    mapping: Specification.Mapping;
    constructor(chartElement: Specification.ChartElement, attribute: string, mapping: Specification.Mapping);
    digest(): {
        name: string;
        chartElement: string[];
        attribute: string;
        mapping: Specification.Mapping;
    };
}
export declare class MapDataToChartElementAttribute extends Action {
    chartElement: Specification.ChartElement;
    attribute: string;
    attributeType: Specification.AttributeType;
    table: string;
    expression: string;
    valueType: Specification.DataType;
    valueMetadata: Dataset.ColumnMetadata;
    hints: Prototypes.DataMappingHints;
    constructor(chartElement: Specification.ChartElement, attribute: string, attributeType: Specification.AttributeType, table: string, expression: string, valueType: Specification.DataType, valueMetadata: Dataset.ColumnMetadata, hints: Prototypes.DataMappingHints);
    digest(): {
        name: string;
        chartElement: string[];
        attribute: string;
        attributeType: Specification.AttributeType;
        expression: string;
        valueType: Dataset.DataType;
        hints: any;
    };
}
export declare class SetPlotSegmentFilter extends Action {
    plotSegment: Specification.PlotSegment;
    filter: Specification.Types.Filter;
    constructor(plotSegment: Specification.PlotSegment, filter: Specification.Types.Filter);
    digest(): {
        name: string;
        plotSegment: string[];
        filter: Specification.Types.Filter;
    };
}
export declare class SetPlotSegmentGroupBy extends Action {
    plotSegment: Specification.PlotSegment;
    groupBy: Specification.Types.GroupBy;
    constructor(plotSegment: Specification.PlotSegment, groupBy: Specification.Types.GroupBy);
    digest(): {
        name: string;
        plotSegment: string[];
        groupBy: Specification.Types.GroupBy;
    };
}
export declare class SetScaleAttribute extends Action {
    scale: Specification.Scale;
    attribute: string;
    mapping: Specification.Mapping;
    constructor(scale: Specification.Scale, attribute: string, mapping: Specification.Mapping);
    digest(): {
        name: string;
        scale: string[];
        attribute: string;
        mapping: Specification.Mapping;
    };
}
export declare class ToggleLegendForScale extends Action {
    scale: string;
    constructor(scale: string);
    digest(): {
        name: string;
        scale: string;
    };
}
export declare class UpdateChartElementAttribute extends Action {
    chartElement: Specification.ChartElement;
    updates: {
        [name: string]: Specification.AttributeValue;
    };
    constructor(chartElement: Specification.ChartElement, updates: {
        [name: string]: Specification.AttributeValue;
    });
    digest(): {
        name: string;
        chartElement: string[];
        updates: {
            [name: string]: Specification.AttributeValue;
        };
    };
}
export declare class SnapChartElements extends Action {
    element: Specification.ChartElement;
    attribute: string;
    targetElement: Specification.ChartElement;
    targetAttribute: string;
    constructor(element: Specification.ChartElement, attribute: string, targetElement: Specification.ChartElement, targetAttribute: string);
    digest(): {
        name: string;
        element: string[];
        attribute: string;
        targetElement: string[];
        targetAttribute: string;
    };
}
export declare class BindDataToAxis extends Action {
    object: Specification.Object;
    property: string;
    appendToProperty: string;
    dataExpression: DragData.DataExpression;
    constructor(object: Specification.Object, property: string, appendToProperty: string, dataExpression: DragData.DataExpression);
    digest(): {
        name: string;
        object: string[];
        property: string;
        appendToProperty: string;
        dataExpression: {
            table: string;
            expression: string;
            valueType: Dataset.DataType;
            kind: Dataset.DataKind;
        };
    };
}
export declare class AddLinks extends Action {
    links: Specification.Links;
    constructor(links: Specification.Links);
    digest(): {
        name: string;
        links: Specification.Links<Specification.ObjectProperties>;
    };
}
export declare class UpdateChartAttribute extends Action {
    chart: Specification.Chart;
    updates: {
        [name: string]: Specification.AttributeValue;
    };
    constructor(chart: Specification.Chart, updates: {
        [name: string]: Specification.AttributeValue;
    });
    digest(): {
        name: string;
        updates: {
            [name: string]: Specification.AttributeValue;
        };
    };
}
export declare class SetChartSize extends Action {
    width: number;
    height: number;
    constructor(width: number, height: number);
    digest(): {
        name: string;
        width: number;
        height: number;
    };
}
export declare class SetChartAttribute extends Action {
    attribute: string;
    mapping: Specification.Mapping;
    constructor(attribute: string, mapping: Specification.Mapping);
    digest(): {
        name: string;
        attribute: string;
        mapping: Specification.Mapping;
    };
}
export declare class SetObjectProperty extends Action {
    object: Specification.Object;
    property: string;
    field: number | string | Array<number | string>;
    value: Specification.AttributeValue;
    noUpdateState: boolean;
    noComputeLayout: boolean;
    constructor(object: Specification.Object, property: string, field: number | string | Array<number | string>, value: Specification.AttributeValue, noUpdateState?: boolean, noComputeLayout?: boolean);
    digest(): {
        name: string;
        object: string[];
        property: string;
        field: string | number | import("csstype").AnimationIterationCountProperty[];
        value: Specification.AttributeValue;
        noUpdateState: boolean;
        noComputeLayout: boolean;
    };
}
export declare class ExtendPlotSegment extends Action {
    plotSegment: Specification.PlotSegment;
    extension: string;
    constructor(plotSegment: Specification.PlotSegment, extension: string);
    digest(): {
        name: string;
        plotSegment: string[];
        extension: string;
    };
}
export declare class ReorderChartElement extends Action {
    fromIndex: number;
    toIndex: number;
    constructor(fromIndex: number, toIndex: number);
    digest(): {
        name: string;
        fromIndex: number;
        toIndex: number;
    };
}
export declare class ReorderGlyphMark extends Action {
    glyph: Specification.Glyph;
    fromIndex: number;
    toIndex: number;
    constructor(glyph: Specification.Glyph, fromIndex: number, toIndex: number);
    digest(): {
        name: string;
        glyph: string[];
        fromIndex: number;
        toIndex: number;
    };
}
export declare class SelectGlyph extends Action {
    plotSegment: Specification.PlotSegment;
    glyph: Specification.Glyph;
    glyphIndex: number;
    constructor(plotSegment: Specification.PlotSegment, glyph: Specification.Glyph, glyphIndex?: number);
    digest(): {
        name: string;
        plotSegment: string[];
        glyph: string[];
        glyphIndex: number;
    };
}
export declare class SelectChartElement extends Action {
    chartElement: Specification.ChartElement;
    glyphIndex: number;
    constructor(chartElement: Specification.ChartElement, glyphIndex?: number);
    digest(): {
        name: string;
        glyph: string[];
        glyphIndex: number;
    };
}
export declare class SetCurrentTool extends Action {
    tool: string;
    options: string;
    constructor(tool: string, options?: string);
    digest(): {
        name: string;
        tool: string;
        options: string;
    };
}
