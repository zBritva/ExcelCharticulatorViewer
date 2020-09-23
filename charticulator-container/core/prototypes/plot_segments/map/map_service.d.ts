export interface Location {
    longitude: number;
    latitude: number;
}
export interface GetImageryAtPointOptions {
    width: number;
    height: number;
    center: Location;
    zoom: number;
    type: "roadmap" | "satellite" | "hybrid" | "terrain";
    resolution?: "high" | "low";
}
export declare abstract class StaticMapService {
    /** Get the map imagery at a given point with zooming */
    abstract getImageryURLAtPoint(options: GetImageryAtPointOptions): string;
    getImageryAtPoint(options: GetImageryAtPointOptions): Promise<string>;
    private static cachedService;
    static GetService(): StaticMapService;
}
export declare class GoogleMapService extends StaticMapService {
    apiKey: string;
    constructor(apiKey: string);
    getImageryURLAtPoint(options: GetImageryAtPointOptions): string;
}
export declare class BingMapService extends StaticMapService {
    apiKey: string;
    constructor(apiKey: string);
    getImageryURLAtPoint(options: GetImageryAtPointOptions): string;
}
