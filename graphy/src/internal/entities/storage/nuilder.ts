import type { Optionable } from "@blazyts/better-standard-library";
import type { IStorage } from "./interface";
import LocalBrowserStorage from "./local-browser";
import type { ITab } from "../tabs/exports";

abstract class EntityStorage<V> extends LocalBrowserStorage {
    constructor() {
           super("graphy_");
    }

    async getValue(key: string): Promise<Optionable<V>> {
        const v = await super.get(key);
        return v as Optionable<V>;
    }

    async setValue(key: string, value: V): Promise<void> {
        await super.save(key, value);
    }   

    async deleteValue(key: string): Promise<void> {
        await super.delete(key);
    }   

    async getAll(): Promise<V[]> {
        const all = await super.getAll();
        return all as V[];
    }
}

export class TabStorage extends EntityStorage<ITab["info"]> {}