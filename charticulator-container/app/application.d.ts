import { MainView } from "./main_view";
import { AppStore } from "./stores";
import { Dispatcher, Specification } from "../core";
import { ExtensionContext, Extension } from "./extension";
import { Action } from "./actions/actions";
import { CharticulatorWorker } from "../worker";
import { CharticulatorAppConfig } from "./config";
import { ExportTemplateTarget } from "./template";
export declare class ApplicationExtensionContext implements ExtensionContext {
    app: Application;
    constructor(app: Application);
    getGlobalDispatcher(): Dispatcher<Action>;
    /** Get the store */
    getAppStore(): AppStore;
    getApplication(): Application;
}
export declare class Application {
    worker: CharticulatorWorker;
    appStore: AppStore;
    mainView: MainView;
    extensionContext: ApplicationExtensionContext;
    initialize(config: CharticulatorAppConfig, containerID: string, workerScriptURL: string): Promise<void>;
    setupNestedEditor(id: string): void;
    processHashString(): Promise<void>;
    addExtension(extension: Extension): void;
    registerExportTemplateTarget(name: string, ctor: (template: Specification.Template.ChartTemplate) => ExportTemplateTarget): void;
    unregisterExportTemplateTarget(name: string): void;
}
