export interface CharticulatorCoreConfig {
    MapService?: {
        provider: string;
        apiKey: string;
    };
}
export declare function setConfig(_?: CharticulatorCoreConfig): void;
export declare function getConfig(): CharticulatorCoreConfig;
