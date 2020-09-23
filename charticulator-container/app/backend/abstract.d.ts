export interface ItemMetadata {
    [name: string]: string | number | boolean;
    name?: string;
    timeCreated?: number;
    timeModified?: number;
}
export interface ItemDescription {
    id: string;
    type: string;
    metadata: ItemMetadata;
}
export interface ItemData extends ItemDescription {
    data: any;
}
export declare abstract class AbstractBackend {
    abstract list(type: string, orderBy?: string, start?: number, count?: number): Promise<{
        items: ItemDescription[];
        totalCount: number;
    }>;
    abstract get(id: string): Promise<ItemData>;
    abstract create(type: string, data: any, metadata?: ItemMetadata): Promise<string>;
    abstract put(id: string, data: any, metadata?: ItemMetadata): Promise<void>;
    abstract delete(id: string): Promise<void>;
}
