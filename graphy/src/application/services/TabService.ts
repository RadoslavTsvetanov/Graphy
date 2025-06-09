import type { ITab, TabInfo, TabRelation } from "../../domain/tabs/entities/Tab";
import type { IBrowserWindow } from "../../domain/tabs/entities/BrowserWindow";
import { ifNotNone, Optionable, Try } from "@blazyts/better-standard-library";

type VPromise = Promise<void>;

export class TabService {
  private windows: IBrowserWindow[] = []
  constructor() { }

  private getTab(tabId: ITab["id"]): Optionable<ITab> {
    let tab = null

    this.windows.forEach(w => w.tabs.forEach(t => t.id === tabId ? tab = t : "" /*no real meaning behind this it just shouldnt do anything  */));

    return Optionable.new(tab)
  }


  async removeTab(tabId: number): VPromise {
    this.windows.forEach(window => {
      window.tabs = window.tabs.filter(tab => tab.id !== tabId);
    })
  }

addTab(tab: ITab){
    Try(this.windows.find(w => w.id === tab.windowId), {ifNotNone: w => w.addTab(tab), ifNone: () => this.windows.push({})})
  }


  async getTabGraph(windowId: number): Promise<{
    windows: IBrowserWindow[];
    tabs: ITab[];
  }> {

    return {
      windows: this.windows,
      tabs: this.windows.map(win => [...win.tabs]).flat()
    };
  }

  async findRelatedTabs(tabId: number, relation: TabRelation): Promise<ITab[]> {

    return this.getTab(tabId).try({
      ifNone: () => [],
      ifNotNone: v => v.getRelations(relation)
    })

  }
}
