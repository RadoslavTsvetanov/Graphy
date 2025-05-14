import { map, Try } from "@custom-express/better-standard-library"
import { Log } from "~./custom-log"
import type { BrowserHistory, ITab, TabGraph } from "~./internal/entities/tabs/exports"


class CurrentOpenedTab {
  set current(id: number) {
    browser.storage.local.set({ currentTabId: id })
  }

  async getCurrent(): Promise<number> {
    return await browser.storage.local.get("currentTabId")
  }
}

const currentTab = new CurrentOpenedTab()

const  g: BrowserHistory = null

const h: TabGraph = null

const logCurrentTab = async () => {
  try {
    const [tab] = await browser.tabs.query({
      active: true,
      currentWindow: true
    })
    if (tab && tab.url) {
      console.log(`Current tab URL: ${tab.url}`)
      await browser.storage.local.set({ lastVisitedUrl: tab.url })
    }
  } catch (error) {
    console.error("Error getting current tab:", error)
  }
}

function setupRuntimeListeners() {
  browser.runtime.onInstalled.addListener(async (details) => {
    console.log("Extension installed/updated:" + details.reason)
    await logCurrentTab()
  })

  browser.runtime.onStartup.addListener(async () => {
    console.log("Browser started")
    await logCurrentTab()
  })
}

function setUpTabListeners() {

  browser.tabs.onCreated.addListener(async (tab) => {

    console.log(`New tab created: ${tab.id}`)

    console.log(`Initial new tab URL: ${tab.url || "unknown"}`)
    map(
      h.windows.find(v => v.id === tab.id),
      currentWindow =>
        map(
          currentWindow.tabs.find(v => v.info.id === tab.openerTabId),
          currentTab => Try(
            currentTab,
            {
              ifNone: () => currentWindow.tabs.push(tab),
              ifNotNone: v => currentTab.addRelation(tab, "child"),
            }
          )
        )  
    )
  })

  chrome.tabs.onActivated.addListener(activeInfo => {
    currentTab.current = activeInfo.tabId
  })

  chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    g.addChange({
      tab: tab.id,
      window: tab.windowId,
      payload: JSON.stringify(changeInfo) 
    })

    map(
      h.windows.find(w => w.id === tab.windowId),
      currentWindow =>
        map(
          currentWindow.tabs.find(t => t.info.id === tabId),
          currentTab => currentTab.history.push(JSON.stringify(changeInfo))
        )
    )


  });

  browser.tabs.onRemoved.addListener((tabId, removeInfo) => {
    if (removeInfo.isWindowClosing) {
      h.windows = h.windows.filter(window => window.id !== removeInfo.windowId);
      return
    }
    map(
      h.windows.find(w => removeInfo.windowId === w.id),
      currentWindow => currentWindow.removeTab(tabId)
    )
  })

}

function setUpAlarms() {

  browser.alarms.create("keepServiceWorkerAlive", { periodInMinutes: 1 })
  browser.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === "keepServiceWorkerAlive") {
      console.log("Background service worker ping")
    }
  })
}


setupRuntimeListeners();
setUpTabListeners();
setUpAlarms();