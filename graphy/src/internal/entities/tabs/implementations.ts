import { type BrowserWindow, type Change, type ITab, type TabGraph, type TabInfo, type TabQuery, type TabRelation, type VPromise } from "./exports";
import type { IStorage } from "../storage/interface";
import type { TabStorage } from "../storage/nuilder";

class Tab implements ITab {
  info: TabInfo;
  history: string[] = [];

  private storage: TabStorage;
  private relations: { [K in TabRelation]?: number[] } = {};
  private memoryRelationRefs: Map<number, ITab> = new Map();

  constructor(id: number, storage: TabStorage) {
    this.info = { id };
    this.storage = storage;
  }

  private async persist(): VPromise {
    await this.storage.save(this.info.id!.toString(), this.toRaw());
  }

  static fromRaw(raw: any): Tab {
    const t = new Tab(raw.info.id);
    t.history = raw.history;
    t.relations = raw.relations || {};
    return t;
  }

  toRaw(): object {
    return {
      info: this.info,
      history: this.history,
      relations: this.relations,
    };
  }

  async addChange(change: {}): VPromise {
    this.history.push(JSON.stringify(change));
    await this.storage.save(this.info.id!.toString(), this.toRaw());
  }

  async addRelation(tab: ITab, type: TabRelation): VPromise {
    const id = tab.info.id!;
    if (!this.relations[type]) this.relations[type] = [];
    if (!this.relations[type]!.includes(id)) {
      this.relations[type]!.push(id);
      this.memoryRelationRefs.set(id, tab);
      await this.storage.save(this.info.id!.toString(), this.toRaw());
    }
  }

  getRelations(_query: TabQuery): ITab[] {
    return [...this.memoryRelationRefs.values()];
  }
}

class BrowserWindowImpl implements BrowserWindow {
  id: number;
  tabs: ITab[] = [];
  storage: TabStorage;

  constructor(id: number, storage: TabStorage) {
    this.id = id;
    this.storage = storage;
  }

  async removeTab(id: number): VPromise {
    this.tabs = this.tabs.filter(t => t.info.id !== id);
    await this.storage.delete(id.toString());
  }

  addTab(tab: ITab): void {
    this.tabs.push(tab);
  }

  getTab(id: number): ITab | undefined {
    return this.tabs.find(t => t.info.id === id);
  }
}

class TabGraphImpl implements TabGraph {
  windows: BrowserWindowImpl[] = [];
  storage:  TabStorage;

  constructor(storage: TabStorage) {
    this.storage = storage;
  }
  
  async init(): VPromise {
    if ((await this.storage.getAll()).length === 0) {
      const tabs = await browser.tabs.query({})
      tabs.forEach(tab => {
        this.windows.find(w => w.id === tab.windowId)?.addTab(new Tab(tab.id!, this.storage));
        const t = new Tab(tab.id!, this.storage);
        this.storage.save(tab.id!.toString(), t.toRaw());
      })


    }
  }

  getOrCreateWindow(id: number): BrowserWindowImpl {
    let win = this.windows.find(w => w.id === id);
    if (!win) {
      win = new BrowserWindowImpl(id, this.storage);
      this.windows.push(win);
    }
    return win;
  }

  addTabToWindow(windowId: number, tab: ITab): void {
    const win = this.getOrCreateWindow(windowId);
    win.addTab(tab);
  }

  getTab(windowId: number, tabId: number): ITab | undefined {
    const win = this.windows.find(w => w.id === windowId);
    return win?.getTab(tabId);
  }
}

// class BrowserHistoryImpl implements BrowserHistory {
//   private changes: Change[] = [];

//   async init(): VPromise {
//     if(this.storage.get("changes")) {
//       this.changes = await this.storage.get("changes");
//     }

//   }

//   addChange(change: Change): void {
//     this.changes.push(change);
//   }

//   get(): Change[] {
//     return [...this.changes];
//   }

//   getWindowChanges(window: number): Change[] {
//     return this.changes.filter(c => c.window === window);
//   }

//   getTabChanges(window: number, tab: number): Change[] {
//     return this.changes.filter(c => c.window === window && c.tab === tab);
//   }
// }
