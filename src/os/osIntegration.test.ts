// @vitest-environment happy-dom
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { BootSequence } from "./boot";
import { Desktop } from "./desktop";
import { StartMenu } from "./startMenu";
import { SystemController } from "./system";
import { WindowManager } from "./windowManager";
import { recycleStore } from "./recycleStore";
import { desktopItems } from "../config/desktop";

function setViewport(width = 1366, height = 768): void {
  Object.defineProperty(window, "innerWidth", { configurable: true, value: width });
  Object.defineProperty(window, "innerHeight", { configurable: true, value: height });
}

describe("desktop, Start menu, and system flows", () => {
  let root: HTMLElement;
  let layer: HTMLElement;
  let manager: WindowManager;

  beforeEach(() => {
    vi.restoreAllMocks();
    document.body.replaceChildren();
    setViewport();
    recycleStore.empty();
    root = document.createElement("main");
    layer = document.createElement("div");
    root.append(layer);
    document.body.append(root);
    manager = new WindowManager(layer);
  });

  it("opens a desktop app on double click", () => {
    const desktop = document.createElement("section");
    const icon = document.createElement("button");
    icon.className = "desktop-icon";
    icon.dataset.appId = "workArchive";
    desktop.append(icon, layer);
    root.append(desktop);
    new Desktop(desktop, manager);

    icon.dispatchEvent(new MouseEvent("dblclick", { bubbles: true }));
    expect(manager.state.windows[0]?.appId).toBe("workArchive");
  });

  it("opens Start, launches About, and closes the menu", () => {
    const startButton = document.createElement("button");
    startButton.className = "start-button";
    startButton.setAttribute("aria-expanded", "false");
    document.body.append(startButton);
    const menu = new StartMenu(startButton, manager, vi.fn());

    startButton.click();
    expect(startButton.getAttribute("aria-expanded")).toBe("true");
    const about = [...menu.element.querySelectorAll<HTMLButtonElement>(".start-menu__item")].find((button) =>
      button.textContent?.includes("About Me"),
    );
    about?.click();

    expect(manager.state.windows[0]?.appId).toBe("about");
    expect(startButton.getAttribute("aria-expanded")).toBe("false");
  });

  it("opens Start and launches an app with mobile taps", () => {
    setViewport(390, 844);
    const startButton = document.createElement("button");
    startButton.className = "start-button";
    startButton.setAttribute("aria-expanded", "false");
    document.body.append(startButton);
    const menu = new StartMenu(startButton, manager, vi.fn());

    startButton.dispatchEvent(new PointerEvent("pointerup", { bubbles: true, pointerType: "touch" }));
    expect(startButton.getAttribute("aria-expanded")).toBe("true");

    const about = [...menu.element.querySelectorAll<HTMLButtonElement>(".start-menu__item")].find((button) =>
      button.textContent?.includes("About Me"),
    );
    about?.dispatchEvent(new PointerEvent("pointerup", { bubbles: true, pointerType: "touch" }));

    expect(manager.state.windows[0]?.appId).toBe("about");
    expect(startButton.getAttribute("aria-expanded")).toBe("false");
  });

  it("sleeps, ignores the opening pointer, then wakes after the debounce", () => {
    const boot = { play: vi.fn().mockResolvedValue(undefined) } as unknown as BootSequence;
    const system = new SystemController(root, manager, boot);
    const now = vi.spyOn(performance, "now").mockReturnValue(0);

    system.handleAction("sleep");
    expect(root.querySelector(".sleep-overlay")?.classList.contains("is-open")).toBe(true);
    document.dispatchEvent(new PointerEvent("pointerdown"));
    expect(root.querySelector(".sleep-overlay")?.classList.contains("is-open")).toBe(true);

    now.mockReturnValue(500);
    document.dispatchEvent(new PointerEvent("pointerdown"));
    expect(root.querySelector(".sleep-overlay")?.classList.contains("is-open")).toBe(false);
  });

  it("restarts into a clean desktop without reloading the browser", () => {
    const boot = { play: vi.fn().mockResolvedValue(undefined) } as unknown as BootSequence;
    const system = new SystemController(root, manager, boot);
    manager.openWindow("about");
    manager.openWindow("workArchive");
    recycleStore.recycle(desktopItems[0]);

    system.handleAction("restart");
    expect(manager.state.windows).toHaveLength(0);
    expect(recycleStore.getItems()).toHaveLength(0);
    expect(boot.play).toHaveBeenCalledOnce();
  });
});
