import * as React from "react";
import { Graphics, Color } from "../../core";
import { ColorFilter } from "../../core/graphics";
export declare function applyColorFilter(color: Color, colorFilter: ColorFilter): {
    r: number;
    g: number;
    b: number;
};
/** Coverts {@Color} to `rgb(r,g,b)` string. Or coverts `#RRGGBB` fromat to `rgb(r,g,b)`}
 * @param color {@Color} object or color string in HEX format (`#RRGGBB`)
 */
export declare function renderColor(color: Color | string, colorFilter?: ColorFilter): string;
export declare function renderStyle(style: Graphics.Style): React.CSSProperties;
export declare function renderSVGPath(cmds: Array<{
    cmd: string;
    args: number[];
}>): string;
export declare function renderTransform(transform: Graphics.RigidTransform): string;
export interface DataSelection {
    isSelected(table: string, rowIndices: number[]): boolean;
}
export declare type GraphicalElementEventHandler = (element: Graphics.Element["selectable"], event: {
    shiftKey: boolean;
    ctrlKey: boolean;
    metaKey: boolean;
}) => any;
export interface RenderGraphicalElementSVGOptions {
    noStyle?: boolean;
    styleOverride?: Graphics.Style;
    className?: string;
    key?: string;
    chartComponentSync?: boolean;
    externalResourceResolver?: (url: string) => string;
    /** Called when a glyph is clicked */
    onClick?: GraphicalElementEventHandler;
    /** Called when the mouse enters a glyph */
    onMouseEnter?: GraphicalElementEventHandler;
    /** Called when the mouse leaves a glyph */
    onMouseLeave?: GraphicalElementEventHandler;
    /** Called when a glyph context menu is clicked */
    onContextMenu?: GraphicalElementEventHandler;
    selection?: DataSelection;
}
export declare function renderGraphicalElementSVG(element: Graphics.Element, options?: RenderGraphicalElementSVGOptions): JSX.Element;
export declare class GraphicalElementDisplay extends React.PureComponent<{
    element: Graphics.Element;
}, {}> {
    render(): JSX.Element;
}
