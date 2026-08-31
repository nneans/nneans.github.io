import type { OSState, WindowManager } from "./windowManager";
import { installMobileTapActivation } from "./mobileTap";

export class Taskbar {
  private readonly taskList: HTMLElement;

  constructor(
    private readonly element: HTMLElement,
    private readonly windowManager: WindowManager,
  ) {
    const taskList = element.querySelector<HTMLElement>(".task-list");
    if (!taskList) throw new Error("Missing task list");
    this.taskList = taskList;
    installMobileTapActivation(element);
    windowManager.subscribe((state) => this.render(state));
  }

  get startButton(): HTMLButtonElement {
    const button = this.element.querySelector<HTMLButtonElement>(".start-button");
    if (!button) throw new Error("Missing Start button");
    return button;
  }

  private render(state: Readonly<OSState>): void {
    this.taskList.replaceChildren(
      ...state.windows.map((windowState) => {
        const button = document.createElement("button");
        const active = state.activeWindowId === windowState.id && !windowState.isMinimized;
        button.className = `task-button classic-button raised${active ? " is-active" : ""}`;
        button.type = "button";
        button.dataset.windowId = windowState.id;
        button.setAttribute("aria-pressed", String(active));

        const image = document.createElement("img");
        image.src = windowState.icon;
        image.alt = "";
        image.draggable = false;
        const label = document.createElement("span");
        label.textContent = windowState.title;
        button.append(image, label);

        button.addEventListener("click", () => {
          if (windowState.isMinimized) this.windowManager.restoreWindow(windowState.id);
          else if (state.activeWindowId === windowState.id) this.windowManager.minimizeWindow(windowState.id);
          else this.windowManager.focusWindow(windowState.id);
        });
        return button;
      }),
    );
  }
}
