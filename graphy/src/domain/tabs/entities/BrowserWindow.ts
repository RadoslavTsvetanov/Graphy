import type { ITab } from "./Tab";

type VPromise = Promise<void>;

export interface IBrowserWindow {
  id: number;
  tabs: ITab[];
  
  addTab(tab: ITab): VPromise;
  removeTab(tabId: number): VPromise;
  findTab(query: { id?: number; url?: string }): ITab | undefined;
}