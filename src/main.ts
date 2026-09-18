import "./styles/reset.css";
import "./styles/tokens.css";
import "./styles/win95.css";
import "./styles/desktop.css";
import "./styles/scene.css";
import "./styles/taskbar.css";
import "./styles/window.css";
import "./styles/startMenu.css";
import "./styles/system.css";
import "./styles/apps.css";
import { desktopItems } from "./config/desktop";
import { osConfig } from "./config/os";
import { BootSequence } from "./os/boot";
import { Clock } from "./os/clock";
import { Desktop } from "./os/desktop";
import { applyDesktopMode, getDesktopMode, initializeDesktopBackground } from "./os/desktopBackground";
import { createHitCounter } from "./os/hitCounter";
import { StartMenu } from "./os/startMenu";
import { SystemController } from "./os/system";
import { Taskbar } from "./os/taskbar";
import { WindowManager } from "./os/windowManager";
import { createDesktopCalendar } from "./os/desktopCalendar";
import { createMusicTray } from "./os/musicTray";
import { createDesktopMusic } from "./os/desktopMusic";
import { createDesktopScene } from "./os/desktopScene";
import { createScreensaver } from "./os/screensaver";
import { createClippyPop } from "./os/clippyPop";
import { createDesktopWeather, updateDesktopWeather } from "./os/desktopWeather";

let desktopScene: ReturnType<typeof createDesktopScene> | undefined;

function createDesktop(): HTMLElement {
  const desktop = document.createElement("section");
  desktop.className = "desktop";
  desktop.id = "desktop";
  desktop.setAttribute("aria-label", `${osConfig.name} desktop`);

  const icons = document.createElement("div");
  icons.className = "desktop-icons";
  icons.setAttribute("role", "listbox");
  icons.setAttribute("aria-label", "Desktop applications");

  desktopItems.forEach((item) => {
    const button = document.createElement("button");
    button.className = "desktop-icon";
    button.type = "button";
    button.dataset.appId = item.appId;
    button.dataset.itemId = item.id;
    button.style.left = `${item.column * 88 + 4}px`;
    button.style.top = `${item.row * 88 + 2}px`;
    button.setAttribute("role", "option");
    button.setAttribute("aria-selected", "false");
    button.setAttribute("aria-label", `Open ${item.label}`);

    const image = document.createElement("img");
    image.className = "desktop-icon__image";
    image.src = item.icon;
    image.alt = "";
    image.draggable = false;

    const label = document.createElement("span");
    label.className = "desktop-icon__label";
    label.textContent = item.label;
    button.append(image, label);
    icons.append(button);
  });

  const desktopWidgets = document.createElement("div");
  desktopWidgets.className = "desktop-widgets";
  const weather = createDesktopWeather();
  const scene = createDesktopScene((snapshot) => updateDesktopWeather(weather, snapshot));
  desktopScene = scene;
  const widgetColumn = document.createElement("div");
  widgetColumn.className = "desktop-widget-column";
  widgetColumn.append(weather, createDesktopCalendar(), createDesktopMusic());
  desktopWidgets.append(widgetColumn, createHitCounter());
  desktop.append(scene.element, icons, desktopWidgets);
  return desktop;
}

function createTaskbar(): HTMLElement {
  const taskbar = document.createElement("nav");
  taskbar.className = "taskbar raised";
  taskbar.setAttribute("aria-label", "System taskbar");
  taskbar.innerHTML = `
    <button class="start-button classic-button raised" type="button" aria-expanded="false" aria-controls="start-menu">
      <span class="start-mark" aria-hidden="true"><i></i><i></i><i></i><i></i></span>
      <span class="start-button__label">Start</span>
    </button>
    <div class="task-list" aria-label="Open windows"></div>
  `;
  if (osConfig.showUpdateButton) {
    const update = document.createElement("button");
    update.className = "update-button classic-button raised";
    update.type = "button";
    update.textContent = "Update to 2026";
    update.disabled = true;
    update.title = "The modern-site transition is outside this build's scope.";
    taskbar.append(update);
  }
  taskbar.append(createMusicTray());
  const clock = document.createElement("time");
  clock.className = "clock sunken";
  clock.setAttribute("aria-label", "Current time");
  clock.textContent = "--:--";
  taskbar.append(clock);
  return taskbar;
}

const root = document.querySelector<HTMLElement>("#os-root");
if (!root) throw new Error("Missing #os-root element");

initializeDesktopBackground();
const desktop = createDesktop();
const windowLayer = document.createElement("div");
windowLayer.className = "window-layer";
desktop.append(windowLayer);
const taskbarElement = createTaskbar();
root.append(desktop, taskbarElement);
// Must run after the desktop is in the document, or the scene class lands nowhere.
applyDesktopMode(getDesktopMode());

const systemOverlayOpen = (): boolean =>
  document.querySelector(".sleep-overlay.is-open, .shutdown-overlay.is-open") !== null;

const screensaver = createScreensaver(root, {
  sky: () => desktopScene?.snapshot ?? null,
  blocked: systemOverlayOpen,
});

const windowManager = new WindowManager(windowLayer);
const taskbar = new Taskbar(taskbarElement, windowManager);
new Desktop(desktop, windowManager);

const clockElement = taskbarElement.querySelector<HTMLTimeElement>(".clock");
if (!clockElement) throw new Error("Missing clock");
new Clock(clockElement);

let openWindowCount = 0;
windowManager.subscribe((state) => {
  openWindowCount = state.windows.filter((entry) => entry.isOpen).length;
});
createClippyPop(root, {
  sky: () => desktopScene?.snapshot ?? null,
  openWindows: () => openWindowCount,
  blocked: () => screensaver.running || systemOverlayOpen(),
});

const boot = new BootSequence(root);
const system = new SystemController(root, windowManager, boot);
const startMenu = new StartMenu(taskbar.startButton, windowManager, (action) => system.handleAction(action));
system.connectStartMenu(startMenu);
document.addEventListener("os:open-app", (event) => {
  const appId = (event as CustomEvent<string>).detail;
  if (appId) windowManager.openWindow(appId);
});
document.addEventListener("os:open-time-travel", (event) => {
  const date = (event as CustomEvent<{ date: string }>).detail?.date;
  windowManager.openWindow("timeTravel");
  if (date) document.dispatchEvent(new CustomEvent("time-travel:open-date", { detail: { date } }));
});
void system.initialize();
