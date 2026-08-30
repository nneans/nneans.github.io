// @vitest-environment happy-dom
import { beforeEach, describe, expect, it, vi } from "vitest";
import { Taskbar } from "./taskbar";
import { WindowManager } from "./windowManager";

function setViewport(width = 1366, height = 768): void {
  Object.defineProperty(window, "innerWidth", { configurable: true, value: width });
  Object.defineProperty(window, "innerHeight", { configurable: true, value: height });
}

function createTaskbar(manager: WindowManager): HTMLElement {
  const taskbar = document.createElement("nav");
  taskbar.innerHTML = '<button class="start-button"></button><div class="task-list"></div>';
  new Taskbar(taskbar, manager);
  return taskbar;
}

describe("WindowManager and taskbar synchronization", () => {
  let layer: HTMLElement;
  let manager: WindowManager;

  beforeEach(() => {
    vi.restoreAllMocks();
    document.body.replaceChildren();
    setViewport();
    layer = document.createElement("div");
    document.body.append(layer);
    manager = new WindowManager(layer);
  });

  it("opens one single-instance window and creates a task button", () => {
    const taskbar = createTaskbar(manager);
    document.body.append(taskbar);
    manager.openWindow("workArchive");
    manager.openWindow("workArchive");

    expect(manager.state.windows).toHaveLength(1);
    expect(layer.querySelectorAll(".os-window")).toHaveLength(1);
    expect(taskbar.querySelectorAll(".task-button")).toHaveLength(1);
  });

  it("focuses the requested window and raises its z-index", () => {
    const workId = manager.openWindow("workArchive");
    const aboutId = manager.openWindow("about");
    const before = manager.state.windows.find((item) => item.id === workId)?.zIndex ?? 0;
    manager.focusWindow(workId);

    expect(manager.state.activeWindowId).toBe(workId);
    expect(manager.state.activeWindowId).not.toBe(aboutId);
    expect(manager.state.windows.find((item) => item.id === workId)?.zIndex).toBeGreaterThan(before);
  });

  it("keeps minimized windows in the taskbar and restores them", () => {
    const taskbar = createTaskbar(manager);
    document.body.append(taskbar);
    const id = manager.openWindow("about");
    manager.minimizeWindow(id);

    expect(manager.state.windows[0].isMinimized).toBe(true);
    expect(layer.querySelector(`[data-window-id="${id}"]`)?.classList.contains("is-minimized")).toBe(true);
    expect(taskbar.querySelectorAll(".task-button")).toHaveLength(1);

    taskbar.querySelector<HTMLButtonElement>(".task-button")?.click();
    expect(manager.state.windows[0].isMinimized).toBe(false);
    expect(manager.state.activeWindowId).toBe(id);
  });

  it("maximizes inside the usable viewport and restores previous bounds", () => {
    const id = manager.openWindow("contact");
    const initial = { ...manager.state.windows[0] };
    manager.maximizeWindow(id);

    expect(manager.state.windows[0]).toMatchObject({ x: 0, y: 0, width: 1366, height: 734, isMaximized: true });
    manager.maximizeWindow(id);
    expect(manager.state.windows[0]).toMatchObject({
      x: initial.x,
      y: initial.y,
      width: initial.width,
      height: initial.height,
      isMaximized: false,
    });
  });

  it("closes all windows during a reset", () => {
    manager.openWindow("about");
    manager.openWindow("workArchive");
    manager.closeAllWindows();

    expect(manager.state.windows).toHaveLength(0);
    expect(manager.state.activeWindowId).toBeNull();
    expect(layer.querySelectorAll(".os-window")).toHaveLength(0);
  });
});
