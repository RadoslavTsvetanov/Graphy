import type { VCallback } from "@custom-express/better-standard-library"
import type {VPromise} from "@train-y/backend/src/types/Promises/vpromise";
import {undefined} from "zod";

async function getStorage<T>(key: string, defaultValue: T): Promise<T> {
  const result = await browser.storage.local.get(key as any);
  return (result[key] ?? defaultValue) as T;
}

async function setStorage<T>(key: string, value: T): Promise<void> {
  await browser.storage.local.set({ [key]: value } as any);
}

type TabInfo = { id: browser.tabs.Tab["id"]}

type VPromise = Promise<void>


const relations = ["parent","child"] as const

type TabRelation = typeof relations[number];
 

type TabQuery = {}

export interface ITab {
    info: TabInfo
    addChange(TabChangeInfo: {}): VPromise
    addRelation(tab: ITab, type: TabRelation): VPromise
    getRelations(tabQuery: TabQuery): ITab[]
    history: string[]
}

class Tab implements  ITab {
    history: string[];
    info: TabInfo;
    children: ITab[]
    addChange(TabChangeInfo: {}): VPromise {
        return Promise.resolve(undefined);
    }

    addRelation(tab: ITab, type: TabRelation): VPromise {
        return Promise.resolve(undefined);
    }

    getRelations(tabQuery: TabQuery): ITab[] {
        return [];
    }

}

export type Change = {
    window: browser.windows.Window["id"],
    tab: browser.tabs.Tab["id"],
    payload: string
}

export interface BrowserHistory {
    addChange(change: Change): void
    get(): Change[]
    getWindowChanges(window: Change["window"]): Change[]
    getTabChanges(window: Change["window"], tab: Change["tab"]): Change[]
}

export interface BrowserWindow {
    removeTab(id: browser.tabs.Tab["id"]): VPromise
    id: number 
    tabs: ITab[]
}

export interface TabGraph {
    windows: BrowserWindow[] 
}


