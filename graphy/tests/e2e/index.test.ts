// EventHooker.integration.test.ts
import { FakeBrowser } from "tests/__mocks__/browser";
import { describe, it, expect, beforeEach } from "vitest";
import { TabService } from "../../src/application/services/TabService";
import { EventHooker } from "../../src/eventHooker";

describe("EventHooker integration", () => {
  let browser: FakeBrowser;
  let hooker: EventHooker;
  let service: TabService;

  beforeEach(() => {
    browser = new FakeBrowser();
    service = new TabService();
    hooker = new EventHooker(browser, service);
    hooker.registerAllHooks();
  });

  it("should track tab lifecycle correctly", async () => {
    // Simulate startup with one tab
    browser.mockTabs.push({
      id: 1,
      windowId: 101,
      url: "https://example.com",
      title: "Example",
      active: true,
      status: "complete",
    });
    browser.triggerStartup();
    expect((await service.getTabGraph(1)).tabs.length).toBe(1);

    // Simulate tab activation (open new tab)
    browser.mockTabs.push({
      id: 2,
      windowId: 101,
      url: "https://google.com",
      title: "Google",
      active: true,
      status: "complete",
    });
    browser.triggerActivated(2);
    await new Promise((r) => setTimeout(r, 0));

    const graphAfterActivation = await service.getTabGraph(2);
    expect(graphAfterActivation.tabs.length).toBe(2);

    // Simulate tab update
    const updatedTab = {
      id: 2,
      windowId: 101,
      url: "https://google.bg",
      title: "Google BG",
      active: true,
      status: "complete",
    };
    browser.mockTabs[1] = updatedTab;
    browser.triggerUpdated(updatedTab);
    await new Promise((r) => setTimeout(r, 0));

    const graphAfterUpdate = await service.getTabGraph(2);
    expect(graphAfterUpdate.tabs.find((t) => t.id === 2).info.url).toBe("https://google.bg");

    // Simulate tab close
    browser.triggerRemoved(1);
    await new Promise((r) => setTimeout(r, 0));

    const graphAfterRemove = await service.getTabGraph(2);
    expect(graphAfterRemove.tabs.some((t) => t.id === 1)).toBe(false);
  });
});
