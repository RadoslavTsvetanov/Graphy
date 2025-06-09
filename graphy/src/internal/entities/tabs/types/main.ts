import type { VCallback } from "@blazyts/better-standard-library"
import {undefined} from "zod";

export type TabInfo = { id: browser.tabs.Tab["id"]}

export type VPromise = Promise<void>


export const relations = ["parent","child"] as const

export type TabRelation = typeof relations[number];
 

export type TabQuery = {}

export interface ITab {
    info: TabInfo
    addChange(TabChangeInfo: {}): VPromise
    addRelation(tab: ITab, type: TabRelation): VPromise
    getRelations(tabQuery: TabQuery): ITab[]
    history: string[]
}

export type Change = {
    window: browser.windows.Window["id"],
    tab: browser.tabs.Tab["id"],
    payload: string
}

export interface BrowserHistory {
    init(): VPromise//runs when the extension is instealled for the first time and no data has been saved
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
    init(): VPromise    
    windows: BrowserWindow[] 
}


