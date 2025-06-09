import { TabService } from "./application/services/TabService";
import { BrowserTabRepository } from "./infrastructure/storage/BrowserTabRepository";

const tabRepository = new BrowserTabRepository();
const tabService = new TabService(tabRepository);

// Repository will be initialized on first use

// Track tab activation
browser.tabs.onActivated.addListener(async (activeInfo: browser.tabs._OnActivatedActiveInfo) => {
  try {
    const tab = await browser.tabs.get(activeInfo.tabId);
    if (tab.id && tab.windowId) {
      await tabService.trackTab({
        id: tab.id,
        windowId: tab.windowId,
        url: tab.url,
        title: tab.title,
        favIconUrl: tab.favIconUrl,
        status: tab.status,
        active: tab.active,
        pinned: tab.pinned,
        highlighted: tab.highlighted,
        incognito: tab.incognito,
        width: tab.width,
        height: tab.height,
        sessionId: (tab as any).sessionId,
      }, tab.windowId);
    }
  } catch (error) {
    console.error('Error tracking tab activation:', error);
  }
});

// Track tab updates
browser.tabs.onUpdated.addListener(async (
  tabId: number,
  changeInfo: browser.tabs._OnUpdatedChangeInfo,
  tab: browser.tabs.Tab
) => {
  if (changeInfo.status === 'complete' && tab.active && tab.id && tab.windowId) {
    try {
      await tabService.trackTab({
        id: tab.id,
        windowId: tab.windowId,
        url: tab.url,
        title: tab.title,
        favIconUrl: tab.favIconUrl,
        status: tab.status,
        active: tab.active,
        pinned: tab.pinned,
        highlighted: tab.highlighted,
        incognito: tab.incognito,
        width: tab.width,
        height: tab.height,
        sessionId: (tab as any).sessionId,
      }, tab.windowId);
    } catch (error) {
      console.error('Error tracking tab update:', error);
    }
  }
});

// Track tab removal
browser.tabs.onRemoved.addListener(async (tabId: number, removeInfo: browser.tabs._OnRemovedRemoveInfo) => {
  try {
    await tabService.removeTab(tabId);
  } catch (error) {
    console.error('Error removing tab:', error);
  }
});

// Handle extension installation/update
browser.runtime.onInstalled.addListener(() => {
  console.log('Graphy extension installed/updated');
});

// Initialize the extension on startup
browser.runtime.onStartup.addListener(async () => {
  console.log('Extension starting up...');
  
  try {
    // Load existing tabs
    const tabs = await browser.tabs.query({});
    for (const tab of tabs) {
      if (tab.active && tab.id && tab.windowId) {
        await tabService.trackTab({
          id: tab.id,
          windowId: tab.windowId,
          url: tab.url,
          title: tab.title,
          favIconUrl: tab.favIconUrl,
          status: tab.status,
          active: tab.active,
          pinned: tab.pinned,
          highlighted: tab.highlighted,
          incognito: tab.incognito,
          width: tab.width,
          height: tab.height,
          sessionId: (tab as any).sessionId,
        }, tab.windowId);
      }
    }
    
    console.log('Extension initialized');
  } catch (error) {
    console.error('Error initializing extension:', error);
  }
});