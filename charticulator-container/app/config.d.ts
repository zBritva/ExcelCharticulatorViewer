import { CharticulatorCoreConfig } from "../core";
export interface CharticulatorAppConfig extends CharticulatorCoreConfig {
    LegalNotices: {
        /** HTML representation of the privacy statement */
        privacyStatementHTML: string;
    };
    /** Should we disable the file view */
    DisableFileView?: boolean;
    /** Load extensions */
    Extensions?: Array<{
        script: string | {
            src: string;
            sha256: string;
            integrity: string;
        };
        style: string;
        initialize: string;
    }>;
    /** Sample datasets to show */
    SampleDatasets?: Array<{
        name: string;
        description: string;
        tables: Array<{
            name: string;
            url: string;
            type: string;
        }>;
    }>;
    WorkerURL: string;
    ContainerURL: string;
}
export declare function getConfig(): CharticulatorAppConfig;
