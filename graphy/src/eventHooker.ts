import { wrap } from "@blazyts/better-standard-library/src/errors-as-values/rust-like-pattern/tick";
import { TabService } from "./application/services/TabService";
import type { ITab } from "~domain/tabs/entities/Tab";

export interface TabsAPI {
  tabs: {
    onActivated: { addListener(fn: (info: { tabId: number }) => void): void };
    onUpdated: {
      addListener(
        fn: (
          tabId: number,
          changeInfo: { status?: string },
          tab: browser.tabs.Tab
        ) => void
      ): void;
    };
    onRemoved: { addListener(fn: (tabId: number) => void): void };
    onStartup: { addListener(fn: () => void): void };
    get(tabId: number): Promise<browser.tabs.Tab>;
    query(query: Record<string, unknown>): Promise<browser.tabs.Tab[]>;
  };
  runtime: {
    onInstalled: { addListener(fn: () => void): void };
    onStartup: { addListener(fn: () => void): void };
  };
}


export class EventHooker {
  constructor(
    private browser: TabsAPI,
    private tabService: TabService
  ) {}

  public registerAllHooks() {
    this.registerOnActivated();
    this.registerOnUpdated();
    this.registerOnRemoved();
    this.registerOnInstalled();
    this.registerOnStartup();
  }

  private registerOnActivated() {
    this.browser.tabs.onActivated.addListener((activeInfo) => {
      wrap(async () => {
        const tab = await this.browser.tabs.get(activeInfo.tabId);
        if (tab.id && tab.windowId) {
          this.tabService.addTab(this.sanitizeTab(tab));
        }
      });
    });
  }

  private registerOnUpdated() {
    this.browser.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
      if (
        changeInfo.status === "complete" &&
        tab.active &&
        tab.id &&
        tab.windowId
      ) {
        wrap(() => this.tabService.addTab(this.sanitizeTab(tab)))
      }
    });
  }

  private registerOnRemoved() {
    this.browser.tabs.onRemoved.addListener(async (tabId) => {
      try {
        await this.tabService.removeTab(tabId);
      } catch (error) {
        console.error("Error removing tab:", error);
      }
    });
  }

  private registerOnInstalled() {
    this.browser.runtime.onInstalled.addListener(() => {
      console.log("Graphy extension installed/updated");
    });
  }

  private registerOnStartup() {
    this.browser.runtime.onStartup.addListener(async () => {
      console.log("Extension starting up...");
      try {
        const tabs = await this.browser.tabs.query({});
        for (const tab of tabs) {
          if (tab.active && tab.id && tab.windowId) {
            await this.tabService.addTab(this.sanitizeTab(tab));
          }
        }
        console.log("Extension initialized");
      } catch (error) {
        console.error("Error initializing extension:", error);
      }
    });
  }

  private sanitizeTab(tab: browser.tabs.Tab): ITab {
    return {
      id: tab.id!,
      windowId: tab.windowId!,
      url: tab.url,
      title: tab.title,
      favIconUrl: tab.favIconUrl,
      status: tab.status,
      active: tab.active,
      pinned: tab.pinned,
      highlighted: tab.highlighted,
      incognito: tab.incognito,
      width: (tab as any).width,
      height: (tab as any).height,
      sessionId: (tab as any).sessionId,
    };
  }
}
