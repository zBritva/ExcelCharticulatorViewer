"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("../../core");
exports.Action = core_1.Action;
exports.SelectMark = core_1.SelectMark;
exports.ClearSelection = core_1.ClearSelection;
class Undo extends core_1.Action {
    digest() {
        return { name: "Undo" };
    }
}
exports.Undo = Undo;
class Redo extends core_1.Action {
    digest() {
        return { name: "Redo" };
    }
}
exports.Redo = Redo;
class Reset extends core_1.Action {
    digest() {
        return { name: "Reset" };
    }
}
exports.Reset = Reset;
class Export extends core_1.Action {
    constructor(type, options = {}) {
        super();
        this.type = type;
        this.options = options;
    }
    digest() {
        return { name: "Export", type: this.type, options: this.options };
    }
}
exports.Export = Export;
class ExportTemplate extends core_1.Action {
    constructor(kind, target, properties) {
        super();
        this.kind = kind;
        this.target = target;
        this.properties = properties;
    }
    digest() {
        return { name: "ExportTemplate" };
    }
}
exports.ExportTemplate = ExportTemplate;
class SaveExportTemplatePropertyName extends core_1.Action {
    constructor(objectId, propertyName, value) {
        super();
        this.objectId = objectId;
        this.propertyName = propertyName;
        this.value = value;
    }
    digest() {
        return { name: "SaveExportTemplatePropertyName" };
    }
}
exports.SaveExportTemplatePropertyName = SaveExportTemplatePropertyName;
class Open extends core_1.Action {
    constructor(id, onFinish) {
        super();
        this.id = id;
        this.onFinish = onFinish;
    }
    digest() {
        return { name: "Open", id: this.id };
    }
}
exports.Open = Open;
/** Save the current chart */
class Save extends core_1.Action {
    constructor(onFinish) {
        super();
        this.onFinish = onFinish;
    }
    digest() {
        return { name: "Save" };
    }
}
exports.Save = Save;
class SaveAs extends core_1.Action {
    constructor(saveAs, onFinish) {
        super();
        this.saveAs = saveAs;
        this.onFinish = onFinish;
    }
    digest() {
        return { name: "SaveAs", saveAs: this.saveAs };
    }
}
exports.SaveAs = SaveAs;
class Load extends core_1.Action {
    constructor(projectData) {
        super();
        this.projectData = projectData;
    }
    digest() {
        return { name: "Load" };
    }
}
exports.Load = Load;
class ImportDataset extends core_1.Action {
    constructor(dataset) {
        super();
        this.dataset = dataset;
    }
    digest() {
        return { name: "ImportDataset", datasetName: this.dataset.name };
    }
}
exports.ImportDataset = ImportDataset;
class ImportChartAndDataset extends core_1.Action {
    constructor(specification, dataset, options) {
        super();
        this.specification = specification;
        this.dataset = dataset;
        this.options = options;
    }
    digest() {
        return { name: "ImportChartAndDataset" };
    }
}
exports.ImportChartAndDataset = ImportChartAndDataset;
class ReplaceDataset extends core_1.Action {
    constructor(dataset) {
        super();
        this.dataset = dataset;
    }
    digest() {
        return { name: "ReplaceDataset", datasetName: this.dataset.name };
    }
}
exports.ReplaceDataset = ReplaceDataset;
/** Invokes updaes all plot segments on the chart,  */
class UpdatePlotSegments extends core_1.Action {
    constructor() {
        super();
    }
    digest() {
        return { name: "UpdatePlotSegments" };
    }
}
exports.UpdatePlotSegments = UpdatePlotSegments;
class ConvertColumnDataType extends core_1.Action {
    constructor(tableName, column, type) {
        super();
        this.tableName = tableName;
        this.column = column;
        this.type = type;
    }
    digest() {
        return { name: "ConvertColumnDataType" };
    }
}
exports.ConvertColumnDataType = ConvertColumnDataType;
// Glyph editing actions
/** Add an empty glyph to the chart */
class AddGlyph extends core_1.Action {
    constructor(classID) {
        super();
        this.classID = classID;
    }
    digest() {
        return {
            name: "AddGlyph",
            classID: this.classID
        };
    }
}
exports.AddGlyph = AddGlyph;
/** Remove a glyph from the chart */
class RemoveGlyph extends core_1.Action {
    constructor(glyph) {
        super();
        this.glyph = glyph;
    }
    digest() {
        return {
            name: "RemoveGlyph",
            glyph: core_1.objectDigest(this.glyph)
        };
    }
}
exports.RemoveGlyph = RemoveGlyph;
// Mark editing actions
class AddMarkToGlyph extends core_1.Action {
    constructor(glyph, classID, point, mappings = {}, properties = {}) {
        super();
        this.glyph = glyph;
        this.classID = classID;
        this.point = point;
        this.mappings = mappings;
        this.properties = properties;
    }
    digest() {
        return {
            name: "AddMarkToGlyph",
            classID: this.classID,
            glyph: core_1.objectDigest(this.glyph),
            mappings: this.mappings,
            properties: this.properties
        };
    }
}
exports.AddMarkToGlyph = AddMarkToGlyph;
class RemoveMarkFromGlyph extends core_1.Action {
    constructor(glyph, mark) {
        super();
        this.glyph = glyph;
        this.mark = mark;
    }
    digest() {
        return {
            name: "RemoveMarkFromGlyph",
            glyph: core_1.objectDigest(this.glyph),
            mark: core_1.objectDigest(this.mark)
        };
    }
}
exports.RemoveMarkFromGlyph = RemoveMarkFromGlyph;
class MapDataToMarkAttribute extends core_1.Action {
    constructor(glyph, mark, attribute, attributeType, expression, valueType, valueMetadata, hints) {
        super();
        this.glyph = glyph;
        this.mark = mark;
        this.attribute = attribute;
        this.attributeType = attributeType;
        this.expression = expression;
        this.valueType = valueType;
        this.valueMetadata = valueMetadata;
        this.hints = hints;
    }
    digest() {
        return {
            name: "MapDataToMarkAttribute",
            glyph: core_1.objectDigest(this.glyph),
            mark: core_1.objectDigest(this.mark),
            attribute: this.attribute,
            attributeType: this.attributeType,
            expression: this.expression,
            valueType: this.valueType,
            hints: this.hints
        };
    }
}
exports.MapDataToMarkAttribute = MapDataToMarkAttribute;
class MarkAction extends core_1.Action {
}
exports.MarkAction = MarkAction;
class SetMarkAttribute extends MarkAction {
    constructor(glyph, mark, attribute, mapping) {
        super();
        this.glyph = glyph;
        this.mark = mark;
        this.attribute = attribute;
        this.mapping = mapping;
    }
    digest() {
        return {
            name: "SetMarkAttribute",
            glyph: core_1.objectDigest(this.glyph),
            mark: core_1.objectDigest(this.mark),
            attribute: this.attribute,
            mapping: this.mapping
        };
    }
}
exports.SetMarkAttribute = SetMarkAttribute;
class UnmapMarkAttribute extends MarkAction {
    constructor(glyph, mark, attribute) {
        super();
        this.glyph = glyph;
        this.mark = mark;
        this.attribute = attribute;
    }
    digest() {
        return {
            name: "UnmapMarkAttribute",
            glyph: core_1.objectDigest(this.glyph),
            mark: core_1.objectDigest(this.mark),
            attribute: this.attribute
        };
    }
}
exports.UnmapMarkAttribute = UnmapMarkAttribute;
class UpdateMarkAttribute extends MarkAction {
    constructor(glyph, mark, updates) {
        super();
        this.glyph = glyph;
        this.mark = mark;
        this.updates = updates;
    }
    digest() {
        return {
            name: "UpdateMarkAttribute",
            glyph: core_1.objectDigest(this.glyph),
            mark: core_1.objectDigest(this.mark),
            updates: this.updates
        };
    }
}
exports.UpdateMarkAttribute = UpdateMarkAttribute;
class SnapMarks extends MarkAction {
    constructor(glyph, mark, attribute, targetMark, targetAttribute) {
        super();
        this.glyph = glyph;
        this.mark = mark;
        this.attribute = attribute;
        this.targetMark = targetMark;
        this.targetAttribute = targetAttribute;
    }
    digest() {
        return {
            name: "SnapMarks",
            glyph: core_1.objectDigest(this.glyph),
            mark: core_1.objectDigest(this.mark),
            attribute: this.attribute,
            targetMark: core_1.objectDigest(this.targetMark),
            targetAttribute: this.targetAttribute
        };
    }
}
exports.SnapMarks = SnapMarks;
class MarkActionGroup extends MarkAction {
    constructor(actions = []) {
        super();
        this.actions = actions;
    }
    add(action) {
        this.actions.push(action);
    }
    digest() {
        return {
            name: "MarkActionGroup",
            actions: this.actions.map(x => x.digest())
        };
    }
}
exports.MarkActionGroup = MarkActionGroup;
class SetGlyphAttribute extends core_1.Action {
    constructor(glyph, attribute, mapping) {
        super();
        this.glyph = glyph;
        this.attribute = attribute;
        this.mapping = mapping;
    }
    digest() {
        return {
            name: "SetGlyphAttribute",
            glyph: core_1.objectDigest(this.glyph),
            attribute: this.attribute,
            mapping: this.mapping
        };
    }
}
exports.SetGlyphAttribute = SetGlyphAttribute;
class UpdateGlyphAttribute extends core_1.Action {
    constructor(glyph, updates) {
        super();
        this.glyph = glyph;
        this.updates = updates;
    }
    digest() {
        return {
            name: "UpdateGlyphAttribute",
            glyph: core_1.objectDigest(this.glyph),
            updates: this.updates
        };
    }
}
exports.UpdateGlyphAttribute = UpdateGlyphAttribute;
class AddChartElement extends core_1.Action {
    constructor(classID, mappings, properties = {}) {
        super();
        this.classID = classID;
        this.mappings = mappings;
        this.properties = properties;
    }
    digest() {
        return {
            name: "AddChartElement",
            classID: this.classID,
            mappings: this.mappings,
            attribute: this.properties
        };
    }
}
exports.AddChartElement = AddChartElement;
class DeleteChartElement extends core_1.Action {
    constructor(chartElement) {
        super();
        this.chartElement = chartElement;
    }
    digest() {
        return {
            name: "DeleteChartElement",
            chartElement: core_1.objectDigest(this.chartElement)
        };
    }
}
exports.DeleteChartElement = DeleteChartElement;
class SetChartElementMapping extends core_1.Action {
    constructor(chartElement, attribute, mapping) {
        super();
        this.chartElement = chartElement;
        this.attribute = attribute;
        this.mapping = mapping;
    }
    digest() {
        return {
            name: "SetChartElementMapping",
            chartElement: core_1.objectDigest(this.chartElement),
            attribute: this.attribute,
            mapping: this.mapping
        };
    }
}
exports.SetChartElementMapping = SetChartElementMapping;
class MapDataToChartElementAttribute extends core_1.Action {
    constructor(chartElement, attribute, attributeType, table, expression, valueType, valueMetadata, hints) {
        super();
        this.chartElement = chartElement;
        this.attribute = attribute;
        this.attributeType = attributeType;
        this.table = table;
        this.expression = expression;
        this.valueType = valueType;
        this.valueMetadata = valueMetadata;
        this.hints = hints;
    }
    digest() {
        return {
            name: "MapChartElementkAttribute",
            chartElement: core_1.objectDigest(this.chartElement),
            attribute: this.attribute,
            attributeType: this.attributeType,
            expression: this.expression,
            valueType: this.valueType,
            hints: this.hints
        };
    }
}
exports.MapDataToChartElementAttribute = MapDataToChartElementAttribute;
class SetPlotSegmentFilter extends core_1.Action {
    constructor(plotSegment, filter) {
        super();
        this.plotSegment = plotSegment;
        this.filter = filter;
    }
    digest() {
        return {
            name: "SetPlotSegmentFilter",
            plotSegment: core_1.objectDigest(this.plotSegment),
            filter: this.filter
        };
    }
}
exports.SetPlotSegmentFilter = SetPlotSegmentFilter;
class SetPlotSegmentGroupBy extends core_1.Action {
    constructor(plotSegment, groupBy) {
        super();
        this.plotSegment = plotSegment;
        this.groupBy = groupBy;
    }
    digest() {
        return {
            name: "SetPlotSegmentGroupBy",
            plotSegment: core_1.objectDigest(this.plotSegment),
            groupBy: this.groupBy
        };
    }
}
exports.SetPlotSegmentGroupBy = SetPlotSegmentGroupBy;
class SetScaleAttribute extends core_1.Action {
    constructor(scale, attribute, mapping) {
        super();
        this.scale = scale;
        this.attribute = attribute;
        this.mapping = mapping;
    }
    digest() {
        return {
            name: "SetScaleAttribute",
            scale: core_1.objectDigest(this.scale),
            attribute: this.attribute,
            mapping: this.mapping
        };
    }
}
exports.SetScaleAttribute = SetScaleAttribute;
class ToggleLegendForScale extends core_1.Action {
    constructor(scale) {
        super();
        this.scale = scale;
    }
    digest() {
        return {
            name: "ToggleLegendForScale",
            scale: this.scale
        };
    }
}
exports.ToggleLegendForScale = ToggleLegendForScale;
class UpdateChartElementAttribute extends core_1.Action {
    constructor(chartElement, updates) {
        super();
        this.chartElement = chartElement;
        this.updates = updates;
    }
    digest() {
        return {
            name: "UpdateChartElementAttribute",
            chartElement: core_1.objectDigest(this.chartElement),
            updates: this.updates
        };
    }
}
exports.UpdateChartElementAttribute = UpdateChartElementAttribute;
class SnapChartElements extends core_1.Action {
    constructor(element, attribute, targetElement, targetAttribute) {
        super();
        this.element = element;
        this.attribute = attribute;
        this.targetElement = targetElement;
        this.targetAttribute = targetAttribute;
    }
    digest() {
        return {
            name: "SnapChartElements",
            element: core_1.objectDigest(this.element),
            attribute: this.attribute,
            targetElement: core_1.objectDigest(this.targetElement),
            targetAttribute: this.targetAttribute
        };
    }
}
exports.SnapChartElements = SnapChartElements;
class BindDataToAxis extends core_1.Action {
    constructor(object, property, appendToProperty, dataExpression) {
        super();
        this.object = object;
        this.property = property;
        this.appendToProperty = appendToProperty;
        this.dataExpression = dataExpression;
    }
    digest() {
        return {
            name: "BindDataToAxis",
            object: core_1.objectDigest(this.object),
            property: this.property,
            appendToProperty: this.appendToProperty,
            dataExpression: {
                table: this.dataExpression.table.name,
                expression: this.dataExpression.expression,
                valueType: this.dataExpression.valueType,
                kind: this.dataExpression.metadata.kind
            }
        };
    }
}
exports.BindDataToAxis = BindDataToAxis;
class AddLinks extends core_1.Action {
    constructor(links) {
        super();
        this.links = links;
    }
    digest() {
        return {
            name: "AddLinks",
            links: this.links
        };
    }
}
exports.AddLinks = AddLinks;
class UpdateChartAttribute extends core_1.Action {
    constructor(chart, updates) {
        super();
        this.chart = chart;
        this.updates = updates;
    }
    digest() {
        return {
            name: "UpdateChartAttribute",
            updates: this.updates
        };
    }
}
exports.UpdateChartAttribute = UpdateChartAttribute;
class SetChartSize extends core_1.Action {
    constructor(width, height) {
        super();
        this.width = width;
        this.height = height;
    }
    digest() {
        return {
            name: "SetChartSize",
            width: this.width,
            height: this.height
        };
    }
}
exports.SetChartSize = SetChartSize;
class SetChartAttribute extends core_1.Action {
    constructor(attribute, mapping) {
        super();
        this.attribute = attribute;
        this.mapping = mapping;
    }
    digest() {
        return {
            name: "SetChartAttribute",
            attribute: this.attribute,
            mapping: this.mapping
        };
    }
}
exports.SetChartAttribute = SetChartAttribute;
class SetObjectProperty extends core_1.Action {
    constructor(object, property, field, value, noUpdateState = false, noComputeLayout = false) {
        super();
        this.object = object;
        this.property = property;
        this.field = field;
        this.value = value;
        this.noUpdateState = noUpdateState;
        this.noComputeLayout = noComputeLayout;
    }
    digest() {
        return {
            name: "SetObjectProperty",
            object: core_1.objectDigest(this.object),
            property: this.property,
            field: this.field,
            value: this.value,
            noUpdateState: this.noUpdateState,
            noComputeLayout: this.noComputeLayout
        };
    }
}
exports.SetObjectProperty = SetObjectProperty;
class ExtendPlotSegment extends core_1.Action {
    constructor(plotSegment, extension) {
        super();
        this.plotSegment = plotSegment;
        this.extension = extension;
    }
    digest() {
        return {
            name: "ExtendPlotSegment",
            plotSegment: core_1.objectDigest(this.plotSegment),
            extension: this.extension
        };
    }
}
exports.ExtendPlotSegment = ExtendPlotSegment;
class ReorderChartElement extends core_1.Action {
    constructor(fromIndex, toIndex) {
        super();
        this.fromIndex = fromIndex;
        this.toIndex = toIndex;
    }
    digest() {
        return {
            name: "ReorderChartElement",
            fromIndex: this.fromIndex,
            toIndex: this.toIndex
        };
    }
}
exports.ReorderChartElement = ReorderChartElement;
class ReorderGlyphMark extends core_1.Action {
    constructor(glyph, fromIndex, toIndex) {
        super();
        this.glyph = glyph;
        this.fromIndex = fromIndex;
        this.toIndex = toIndex;
    }
    digest() {
        return {
            name: "ReorderGlyphMark",
            glyph: core_1.objectDigest(this.glyph),
            fromIndex: this.fromIndex,
            toIndex: this.toIndex
        };
    }
}
exports.ReorderGlyphMark = ReorderGlyphMark;
class SelectGlyph extends core_1.Action {
    constructor(plotSegment, glyph, glyphIndex = null) {
        super();
        this.plotSegment = plotSegment;
        this.glyph = glyph;
        this.glyphIndex = glyphIndex;
    }
    digest() {
        return {
            name: "SelectGlyph",
            plotSegment: core_1.objectDigest(this.plotSegment),
            glyph: core_1.objectDigest(this.glyph),
            glyphIndex: this.glyphIndex
        };
    }
}
exports.SelectGlyph = SelectGlyph;
class SelectChartElement extends core_1.Action {
    constructor(chartElement, glyphIndex = null) {
        super();
        this.chartElement = chartElement;
        this.glyphIndex = glyphIndex;
    }
    digest() {
        return {
            name: "SelectChartElement",
            glyph: core_1.objectDigest(this.chartElement),
            glyphIndex: this.glyphIndex
        };
    }
}
exports.SelectChartElement = SelectChartElement;
class SetCurrentTool extends core_1.Action {
    constructor(tool, options = null) {
        super();
        this.tool = tool;
        this.options = options;
    }
    digest() {
        return {
            name: "SetCurrentTool",
            tool: this.tool,
            options: this.options
        };
    }
}
exports.SetCurrentTool = SetCurrentTool;
//# sourceMappingURL=actions.js.map