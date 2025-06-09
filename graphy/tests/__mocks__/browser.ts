interface TabsAPI {
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

type TabListener = (info: any) => void;
type TabUpdatedListener = (tabId: number, changeInfo: any, tab: browser.tabs.Tab) => void;

export class FakeBrowser implements TabsAPI {
  public mockTabs: browser.tabs.Tab[] = [];

  private activatedListeners: TabListener[] = [];
  private updatedListeners: TabUpdatedListener[] = [];
  private removedListeners: TabListener[] = [];
  private startupListeners: (() => void)[] = [];

  tabs = {
    onActivated: {
      addListener: (fn: TabListener) => this.activatedListeners.push(fn),
    },
    onUpdated: {
      addListener: (fn: TabUpdatedListener) => this.updatedListeners.push(fn),
    },
    onRemoved: {
      addListener: (fn: TabListener) => this.removedListeners.push(fn),
    },
    onStartup: {
      addListener: (fn: () => void) => this.startupListeners.push(fn),
    },
    get: async (tabId: number) => {
      const tab = this.mockTabs.find((t) => t.id === tabId);
      if (!tab) throw new Error("Tab not found");
      return tab;
    },
    query: async () => [...this.mockTabs],
  };

  runtime = {
    onInstalled: {
      addListener: (_fn: () => void) => {},
    },
    onStartup: {
      addListener: (fn: () => void) => this.startupListeners.push(fn),
    },
  };

  // Trigger methods for testing
  triggerActivated(tabId: number) {
    this.activatedListeners.forEach((fn) => fn({ tabId }));
  }

  triggerUpdated(tab: browser.tabs.Tab) {
    this.updatedListeners.forEach((fn) =>
      fn(tab.id!, { status: "complete" }, tab)
    );
  }

  triggerRemoved(tabId: number) {
    this.removedListeners.forEach((fn) => fn(tabId));
  }

  triggerStartup() {
    this.startupListeners.forEach((fn) => fn());
  }
}