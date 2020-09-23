"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
Object.defineProperty(exports, "__esModule", { value: true });
const Dataset = require("../dataset");
const Expression = require("../expression");
const Prototypes = require("../prototypes");
const common_1 = require("../common");
const abstract_1 = require("./abstract");
const wasm_solver_1 = require("./wasm_solver");
const expression_1 = require("../expression");
/** Solves constraints in the scope of a chart */
class ChartConstraintSolver {
    /** Create a ChartConstraintSolver
     * - stage == "chart": disregard glyphs, solve chart-level constraints
     * - stage == "glyphs": fix chart-level attributes, solve only glyphs
     * @param stage determines the scope of the variables to solve
     */
    constructor(stage) {
        this.supportVariables = new common_1.KeyNameMap();
        this.glyphAnalyzeResults = new WeakMap();
        this.solver = new wasm_solver_1.WASMSolver();
        this.stage = stage;
    }
    setManager(manager) {
        this.chart = manager.chart;
        this.chartState = manager.chartState;
        this.manager = manager;
        this.dataset = manager.dataset;
        this.datasetContext = new Dataset.DatasetContext(this.dataset);
        this.expressionCache = new Expression.ExpressionCache();
    }
    setDataset(dataset) {
        this.dataset = dataset;
        this.datasetContext = new Dataset.DatasetContext(this.dataset);
        this.expressionCache = new Expression.ExpressionCache();
    }
    solve() {
        const loss = this.solver.solve();
        this.solver.applyPlugins();
        return { softLoss: loss[1], hardLoss: loss[0] };
    }
    destroy() {
        if (this.solver) {
            this.solver.destroy();
        }
    }
    addMapping(attrs, parentAttrs, attr, info, mapping, rowContext) {
        if (rowContext == null &&
            (mapping.type == "scale" || mapping.type == "text")) {
            const xMapping = mapping ||
                mapping;
            rowContext = this.manager.getChartDataContext(xMapping.table);
        }
        switch (mapping.type) {
            case "scale":
                {
                    const scaleMapping = mapping;
                    if (scaleMapping.scale != null) {
                        // Apply the scale
                        const expr = this.expressionCache.parse(scaleMapping.expression);
                        const dataValue = expr.getValue(rowContext);
                        const scaleClass = this.manager.getClassById(scaleMapping.scale);
                        if (!info.solverExclude) {
                            scaleClass.buildConstraint(dataValue, this.solver.attr(attrs, attr), this.solver);
                        }
                        const value = scaleClass.mapDataToAttribute(dataValue);
                        attrs[attr] = value;
                        // this.registry.makeConstant(attrs, attr);
                        // this.hardBuilder.addLinear(value as number, [[-1, this.hardBuilder.attr(attrs, attr)]])
                    }
                    else {
                        // No scale, map the column value directly
                        const expr = this.expressionCache.parse(scaleMapping.expression);
                        const dataValue = expr.getValue(rowContext);
                        attrs[attr] = dataValue;
                        if (!info.solverExclude) {
                            this.solver.makeConstant(attrs, attr);
                        }
                        // this.hardBuilder.addLinear(attrs[attr] as number, [[-1, this.hardBuilder.attr(attrs, attr)]])
                    }
                }
                break;
            case "text":
                {
                    const textMapping = mapping;
                    const expr = this.expressionCache.parseTextExpression(textMapping.textExpression);
                    if (expr.parts.find(part => part.expression instanceof expression_1.FunctionCall && part.expression.name === "columnName")) {
                        attrs[attr] = expr.getValue(rowContext.getTable());
                    }
                    else {
                        attrs[attr] = expr.getValue(rowContext);
                    }
                }
                break;
            case "value":
                {
                    const valueMapping = mapping;
                    attrs[attr] = valueMapping.value;
                    if (!info.solverExclude) {
                        this.solver.makeConstant(attrs, attr);
                    }
                    // this.registry.makeConstant(attrs, attr);
                }
                break;
            case "parent":
                {
                    const parentMapping = mapping;
                    this.solver.addEquals(abstract_1.ConstraintStrength.HARD, this.solver.attr(attrs, attr), this.solver.attr(parentAttrs, parentMapping.parentAttribute));
                }
                break;
        }
    }
    addObject(object, objectState, parentState, rowContext, solve) {
        const objectClass = this.manager.getClass(objectState);
        for (const attr of objectClass.attributeNames) {
            const info = objectClass.attributes[attr];
            if (!info.solverExclude) {
                if (objectState.attributes[attr] == null) {
                    objectState.attributes[attr] = 0;
                }
                this.addAttribute(objectState.attributes, attr, solve || info.editableInGlyphStage);
            }
            if (!info.stateExclude) {
                if (object.mappings.hasOwnProperty(attr)) {
                    // If the attribute is mapped, apply the mapping, and do not compute gradient
                    const mapping = object.mappings[attr];
                    this.addMapping(objectState.attributes, parentState != null ? parentState.attributes : null, attr, info, mapping, rowContext);
                }
                else {
                    if (info.defaultValue !== undefined) {
                        objectState.attributes[attr] = info.defaultValue;
                    }
                }
            }
        }
    }
    addScales(allowScaleParameterChange = true) {
        const { chart, chartState } = this;
        for (const [scale, scaleState] of common_1.zip(chart.scales, chartState.scales)) {
            this.addObject(scale, scaleState, null, null, allowScaleParameterChange);
        }
    }
    getSupportVariable(key, name, defaultValue) {
        if (this.supportVariables.has(key, name)) {
            return this.solver.attr(this.supportVariables.get(key, name), "value");
        }
        else {
            const attr = {};
            attr.value = defaultValue;
            this.supportVariables.add(key, name, attr);
            const variable = this.solver.attr(attr, "value", {
                edit: true
            });
            return variable;
        }
    }
    addMark(layout, mark, rowContext, markState, element, elementState) {
        this.addObject(element, elementState, markState, rowContext, true);
        const elementClass = this.manager.getMarkClass(elementState);
        elementClass.buildConstraints(this.solver, {
            rowContext,
            getExpressionValue: (expr, context) => {
                return this.manager.dataflow.cache.parse(expr).getNumberValue(context);
            }
        });
    }
    getAttachedAttributes(mark) {
        const attached = new Set();
        for (const element of mark.marks) {
            if (element.classID == "mark.anchor") {
                continue;
            }
            for (const name in element.mappings) {
                const mapping = element.mappings[name];
                if (mapping.type == "parent") {
                    attached.add(mapping.parentAttribute);
                }
            }
        }
        return attached;
    }
    getGlyphAnalyzeResult(glyph) {
        if (this.glyphAnalyzeResults.has(glyph)) {
            return this.glyphAnalyzeResults.get(glyph);
        }
        const analyzer = new GlyphConstraintAnalyzer(glyph);
        analyzer.solve();
        this.glyphAnalyzeResults.set(glyph, analyzer);
        return analyzer;
    }
    addGlyph(layout, rowContext, glyph, glyphState) {
        // Mark attributes
        this.addObject(glyph, glyphState, null, rowContext, true);
        const glyphAnalyzed = this.getGlyphAnalyzeResult(glyph);
        const glyphClass = this.manager.getGlyphClass(glyphState);
        for (const attr of glyphClass.attributeNames) {
            // const info = glyphClass.attributes[attr];
            // if (info.solverExclude) {
            //   continue;
            // }
            // this.addAttribute(glyphState.attributes, attr, true);
            // If width/height are not constrained, make them constant
            if (attr == "width" && glyphAnalyzed.widthFree) {
                const variable = this.getSupportVariable(layout, glyph._id + "/" + attr, glyphState.attributes[attr]);
                this.solver.addEquals(abstract_1.ConstraintStrength.HARD, variable, this.solver.attr(glyphState.attributes, attr));
            }
            if (attr == "height" && glyphAnalyzed.heightFree) {
                const variable = this.getSupportVariable(layout, glyph._id + "/" + attr, glyphState.attributes[attr]);
                this.solver.addEquals(abstract_1.ConstraintStrength.HARD, variable, this.solver.attr(glyphState.attributes, attr));
            }
        }
        // Element attributes and intrinsic constraints
        for (const [element, elementState] of common_1.zip(glyph.marks, glyphState.marks)) {
            this.addMark(layout, glyph, rowContext, glyphState, element, elementState);
        }
        // Mark-level constraints
        glyphClass.buildIntrinsicConstraints(this.solver);
        for (const constraint of glyph.constraints) {
            const cls = Prototypes.Constraints.ConstraintTypeClass.getClass(constraint.type);
            cls.buildConstraints(constraint, glyph.marks, glyphState.marks, this.solver);
        }
    }
    addAttribute(attrs, attr, edit) {
        this.solver.attr(attrs, attr, { edit });
    }
    addChart() {
        const { chart, chartState } = this;
        this.addObject(chart, chartState, null, null, this.stage == "chart");
        const boundsClass = this.manager.getChartClass(chartState);
        boundsClass.buildIntrinsicConstraints(this.solver);
        for (const [element, elementState] of common_1.zip(chart.elements, chartState.elements)) {
            this.addObject(element, elementState, chartState, null, this.stage == "chart");
            const elementClass = this.manager.getChartElementClass(elementState);
            elementClass.buildConstraints(this.solver, {
                getExpressionValue: (expr, context) => {
                    return this.manager.dataflow.cache
                        .parse(expr)
                        .getNumberValue(context);
                },
                getGlyphAttributes: (glyphID, table, rowIndex) => {
                    const analyzed = this.getGlyphAnalyzeResult(common_1.getById(this.chart.glyphs, glyphID));
                    return analyzed.computeAttributes(this.manager.dataflow.getTable(table).getGroupedContext(rowIndex));
                }
            });
            if (this.stage == "glyphs") {
                if (Prototypes.isType(element.classID, "plot-segment")) {
                    const layout = element;
                    const layoutState = elementState;
                    const mark = common_1.getById(chart.glyphs, layout.glyph);
                    const tableContext = this.manager.dataflow.getTable(layout.table);
                    for (const [dataRowIndex, markState] of common_1.zip(layoutState.dataRowIndices, layoutState.glyphs)) {
                        this.addGlyph(layout, tableContext.getGroupedContext(dataRowIndex), mark, markState);
                    }
                    elementClass.buildGlyphConstraints(this.solver, {
                        getExpressionValue: (expr, context) => {
                            return this.manager.dataflow.cache
                                .parse(expr)
                                .getNumberValue(context);
                        },
                        getGlyphAttributes: (glyphID, table, rowIndex) => {
                            const analyzed = this.getGlyphAnalyzeResult(common_1.getById(this.chart.glyphs, glyphID));
                            return analyzed.computeAttributes(this.manager.dataflow
                                .getTable(table)
                                .getGroupedContext(rowIndex));
                        }
                    });
                }
            }
        }
        for (const constraint of chart.constraints) {
            const cls = Prototypes.Constraints.ConstraintTypeClass.getClass(constraint.type);
            cls.buildConstraints(constraint, chart.elements, chartState.elements, this.solver);
        }
    }
    setup(manager) {
        this.setManager(manager);
        this.addScales(true);
        this.addChart();
    }
}
exports.ChartConstraintSolver = ChartConstraintSolver;
class GlyphConstraintAnalyzer extends abstract_1.ConstraintSolver {
    constructor(glyph) {
        super();
        // Variable registry
        this.variableRegistry = new common_1.KeyNameMap();
        this.indexToAttribute = new Map();
        this.currentVariableIndex = 0;
        this.linears = [];
        this.inputBiases = new Map();
        this.indexToBias = new Map();
        this.inputBiasesCount = 0;
        this.dataInputList = new Map();
        const glyphState = {
            attributes: {},
            marks: []
        };
        const glyphClass = Prototypes.ObjectClasses.Create(null, glyph, glyphState);
        glyphClass.initializeState();
        for (const mark of glyph.marks) {
            const markState = {
                attributes: {}
            };
            glyphState.marks.push(markState);
            const markClass = Prototypes.ObjectClasses.Create(glyphClass, mark, markState);
            markClass.initializeState();
        }
        for (const attr of glyphClass.attributeNames) {
            const info = glyphClass.attributes[attr];
            if (info.solverExclude) {
                continue;
            }
            this.addAttribute(glyphState.attributes, attr, glyph._id);
            if (glyph.mappings.hasOwnProperty(attr)) {
                this.addMapping(glyphState.attributes, attr, glyph.mappings[attr], null);
            }
        }
        for (const [mark, markState] of common_1.zip(glyph.marks, glyphState.marks)) {
            const markClass = Prototypes.ObjectClasses.Create(glyphClass, mark, markState);
            for (const attr of markClass.attributeNames) {
                const info = markClass.attributes[attr];
                if (info.solverExclude) {
                    continue;
                }
                this.addAttribute(markState.attributes, attr, mark._id);
                if (mark.mappings.hasOwnProperty(attr)) {
                    this.addMapping(markState.attributes, attr, mark.mappings[attr], glyphState.attributes);
                }
            }
            markClass.buildConstraints(this, {
                getExpressionValue: () => 1
            });
        }
        glyphClass.buildIntrinsicConstraints(this);
        this.addInputAttribute("x", this.attr(glyphState.attributes, "x"));
        this.addInputAttribute("y", this.attr(glyphState.attributes, "y"));
        for (const constraint of glyph.constraints) {
            const cls = Prototypes.Constraints.ConstraintTypeClass.getClass(constraint.type);
            cls.buildConstraints(constraint, glyph.marks, glyphState.marks, this);
        }
        this.glyphState = glyphState;
    }
    addAttribute(attrs, attr, id) {
        const value = this.currentVariableIndex;
        const attrInfo = {
            index: this.currentVariableIndex,
            type: "object",
            id,
            attribute: attr
        };
        this.variableRegistry.add(attrs, attr, attrInfo);
        this.indexToAttribute.set(attrInfo.index, attrInfo);
        this.currentVariableIndex += 1;
        return attrInfo;
    }
    // Allocate or get attribute index
    attr(attrs, attr) {
        if (this.variableRegistry.has(attrs, attr)) {
            return this.variableRegistry.get(attrs, attr);
        }
        else {
            const value = this.currentVariableIndex;
            const attrInfo = {
                index: this.currentVariableIndex,
                id: common_1.uniqueID(),
                type: "object",
                attribute: attr
            };
            console.warn("Adding unnamed attribute", attr);
            this.variableRegistry.add(attrs, attr, attrInfo);
            this.indexToAttribute.set(attrInfo.index, attrInfo);
            this.currentVariableIndex += 1;
            return attrInfo;
        }
    }
    addLinear(strength, bias, lhs, rhs = []) {
        this.linears.push([
            bias,
            lhs
                .map(([weight, obj]) => ({ weight, index: obj.index }))
                .concat(rhs.map(([weight, obj]) => ({ weight: -weight, index: obj.index })))
        ]);
    }
    addSoftInequality(strength, bias, lhs, rhs = []) {
        this.linears.push([
            bias,
            lhs
                .map(([weight, obj]) => ({ weight, index: obj.index }))
                .concat(rhs.map(([weight, obj]) => ({ weight: -weight, index: obj.index })))
        ]);
    }
    addInputAttribute(name, attr) {
        if (this.inputBiases.has(name)) {
            const idx = this.inputBiases.get(name).index;
            this.linears.push([
                0,
                [{ weight: 1, index: attr.index }, { weight: 1, biasIndex: idx }]
            ]);
        }
        else {
            const idx = this.inputBiasesCount;
            this.inputBiasesCount++;
            const attrInfo = {
                index: idx,
                type: "input",
                id: null,
                attribute: name
            };
            this.inputBiases.set(name, attrInfo);
            this.indexToBias.set(attrInfo.index, attrInfo);
            this.linears.push([
                0,
                [{ weight: 1, index: attr.index }, { weight: 1, biasIndex: idx }]
            ]);
        }
    }
    addDataInput(name, expression) {
        this.dataInputList.set(name, Expression.parse(expression));
    }
    addMapping(attrs, attr, mapping, parentAttrs) {
        switch (mapping.type) {
            case "scale":
                {
                    const scaleMapping = mapping;
                    this.addInputAttribute(`scale/${scaleMapping.scale}/${scaleMapping.expression}`, this.attr(attrs, attr));
                    this.addDataInput(`scale/${scaleMapping.scale}/${scaleMapping.expression}`, scaleMapping.expression);
                }
                break;
            case "value":
                {
                    const valueMapping = mapping;
                    attrs[attr] = valueMapping.value;
                    this.addLinear(abstract_1.ConstraintStrength.HARD, valueMapping.value, [[-1, this.attr(attrs, attr)]]);
                }
                break;
            case "parent":
                {
                    const parentMapping = mapping;
                    this.addEquals(abstract_1.ConstraintStrength.HARD, this.attr(attrs, attr), this.attr(parentAttrs, parentMapping.parentAttribute));
                }
                break;
        }
    }
    setValue() { }
    getValue() {
        return 0;
    }
    makeConstant(attr) {
        console.warn("(unimplemented) Make Constant: ", attr);
    }
    destroy() { }
    solve() {
        const N = this.currentVariableIndex;
        const linears = this.linears;
        // Formulate the problem as A * X = B
        const A = new wasm_solver_1.Matrix();
        A.init(linears.length, N);
        const B = new wasm_solver_1.Matrix();
        B.init(linears.length, this.inputBiasesCount + 1);
        const A_data = A.data(), A_rowStride = A.rowStride, A_colStride = A.colStride;
        const B_data = B.data(), B_rowStride = B.rowStride, B_colStride = B.colStride;
        for (let i = 0; i < linears.length; i++) {
            B_data[i * B_rowStride] = -linears[i][0];
            for (const item of linears[i][1]) {
                if (item.index != null) {
                    A_data[i * A_rowStride + item.index * A_colStride] = item.weight;
                }
                if (item.biasIndex != null) {
                    B_data[i * B_rowStride + (1 + item.biasIndex) * B_colStride] =
                        item.weight;
                }
            }
        }
        const X = new wasm_solver_1.Matrix();
        const ker = new wasm_solver_1.Matrix();
        wasm_solver_1.Matrix.SolveLinearSystem(X, ker, A, B);
        this.X0 = [];
        this.ker = [];
        const X_data = X.data(), X_colStride = X.colStride, X_rowStride = X.rowStride;
        for (let i = 0; i < X.cols; i++) {
            const a = new Float64Array(N);
            for (let j = 0; j < N; j++) {
                a[j] = X_data[i * X_colStride + j * X_rowStride];
            }
            this.X0.push(a);
        }
        const ker_data = ker.data(), ker_colStride = ker.colStride, ker_rowStride = ker.rowStride;
        for (let i = 0; i < ker.cols; i++) {
            const a = new Float64Array(N);
            for (let j = 0; j < N; j++) {
                a[j] = ker_data[i * ker_colStride + j * ker_rowStride];
            }
            this.ker.push(a);
        }
        X.destroy();
        ker.destroy();
        A.destroy();
        B.destroy();
        return null;
    }
    isAttributeFree(attr) {
        let isNonZero = false;
        for (const x of this.ker) {
            if (Math.abs(x[attr.index]) > 1e-8) {
                isNonZero = true;
            }
        }
        return isNonZero;
    }
    get widthFree() {
        return this.isAttributeFree(this.attr(this.glyphState.attributes, "width"));
    }
    get heightFree() {
        return this.isAttributeFree(this.attr(this.glyphState.attributes, "height"));
    }
    computeAttribute(attr, rowContext) {
        let result = 0;
        for (let i = 0; i < this.X0.length; i++) {
            const bi = this.X0[i][attr.index];
            if (i == 0) {
                result += bi;
            }
            else {
                const bias = this.indexToBias.get(i - 1);
                if (bias && this.dataInputList.has(bias.attribute)) {
                    result +=
                        bi *
                            this.dataInputList.get(bias.attribute).getNumberValue(rowContext);
                }
            }
        }
        return result;
    }
    computeAttributes(rowContext) {
        return {
            width: this.computeAttribute(this.attr(this.glyphState.attributes, "width"), rowContext),
            height: this.computeAttribute(this.attr(this.glyphState.attributes, "height"), rowContext)
        };
    }
}
exports.GlyphConstraintAnalyzer = GlyphConstraintAnalyzer;
//# sourceMappingURL=solver.js.map