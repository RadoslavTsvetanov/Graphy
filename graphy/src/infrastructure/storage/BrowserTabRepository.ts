import type { ITabRepository } from "../../domain/tabs/repositories/ITabRepository";
import type { ITab } from "../../domain/tabs/entities/Tab";
import type { IBrowserWindow } from "../../domain/tabs/entities/BrowserWindow";
import { mapOptionable, type Optionable } from "@blazyts/better-standard-library";

const WINDOWS_KEY = 'graphy_windows';
const TABS_KEY = 'graphy_tabs';

type StorageResult<T> = { [key: string]: T };

async function getFromStorage<T>(key: string): Promise<T | undefined> {
  const result = await browser.storage.local.get(key);
  return result[key] as T | undefined;
}



class Storage<T , Key extends string> {
  private key: Key;
  constructor(key: Key) {
    this.key = key;
  }
  get(): Promise<T | undefined> {
    return getFromStorage<T>(this.key);
  }
  set(key: string, value: T): Promise<void> {
    return browser.storage.local.set({ [key]: value });
  }
  remove(key: string): Promise<void> {
    return browser.storage.local.remove(key);
  }
}

class TabsStorage extends Storage<IBrowserWindow[], "tabs"> {
  constructor(){
    super("tabs")
  }
}


export class BrowserTabRepository  {
  private storage = new  TabsStorage() 

  async getWindow(windowId: number): Promise<Optionable<IBrowserWindow>> {
      return mapOptionable((await this.storage.get()).find(v => v.id === windowId))
  } 
  saveWindow(window: IBrowserWindow): Promise<void> {
    throw new Error("Method not implemented.");
  }
  removeWindow(windowId: number): Promise<void> {
    throw new Error("Method not implemented.");
  }
  getTab(tabId: number): Promise<ITab | undefined> {
    throw new Error("Method not implemented.");
  }
  saveTab(tab: ITab): Promise<void> {
    throw new Error("Method not implemented.");
  }
  removeTab(tabId: number): Promise<void> {
    throw new Error("Method not implemented.");
  }
  findTabs(query: { url?: string; title?: string; }): Promise<ITab[]> {
    throw new Error("Method not implemented.");
  }
  getWindows(): Promise<IBrowserWindow[]> {
    throw new Error("Method not implemented.");
  }
  
}
