import { desktopItems } from "../config/desktop";
import { appCatalog, type AppMetadata } from "../apps/catalog";
import { osConfig } from "../config/os";
import { installMobileTapActivation } from "./mobileTap";
import type { WindowManager } from "./windowManager";

export type SystemAction = "restart" | "sleep" | "shutdown";

const systemItems: { action: SystemAction; label: string; icon: string }[] = [
  { action: "restart", label: "Restart", icon: "/icons/update.png" },
  { action: "sleep", label: "Sleep", icon: "/icons/time.png" },
  { action: "shutdown", label: "Shut Down…", icon: "/icons/power.png" },
];

export class StartMenu {
  readonly element: HTMLElement;
  private open = false;

  constructor(
    private readonly startButton: HTMLButtonElement,
    private readonly windowManager: WindowManager,
    private readonly onSystemAction: (action: SystemAction) => void,
  ) {
    this.element = this.createElement();
    document.body.append(this.element);
    installMobileTapActivation(startButton);
    installMobileTapActivation(this.element);
    startButton.addEventListener("click", (event) => {
      event.stopPropagation();
      this.setOpen(!this.open);
    });
    document.addEventListener("pointerdown", (event) => {
      const target = event.target as Node;
      if (this.open && !this.element.contains(target) && !this.startButton.contains(target)) this.setOpen(false);
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && this.open) {
        this.setOpen(false);
        this.startButton.focus();
      }
    });
  }

  setOpen(open: boolean): void {
    this.open = open;
    this.element.classList.toggle("is-open", open);
    this.element.setAttribute("aria-hidden", String(!open));
    this.startButton.setAttribute("aria-expanded", String(open));
    this.windowManager.setStartMenuOpen(open);
    if (open) this.element.querySelector<HTMLButtonElement>("button")?.focus();
  }

  private createElement(): HTMLElement {
    const menu = document.createElement("section");
    menu.className = "start-menu raised";
    menu.id = "start-menu";
    menu.setAttribute("aria-label", "Start menu");
    menu.setAttribute("aria-hidden", "true");

    const brand = document.createElement("div");
    brand.className = "start-menu__brand";
    brand.innerHTML = `${osConfig.brandPrefix}<span>${osConfig.brandSuffix}</span>`;

    const list = document.createElement("div");
    list.className = "start-menu__items";
    list.setAttribute("role", "menu");

    const launchers = desktopItems.filter(
      (item) => Boolean((appCatalog[item.appId] as AppMetadata).showInStartMenu),
    );
    list.append(this.createItem("Welcome", "/icons/start.png", () => this.windowManager.openWindow("welcome")));
    launchers.forEach((item) => {
      list.append(this.createItem(item.label, item.icon, () => this.windowManager.openWindow(item.appId)));
    });

    const separator = document.createElement("div");
    separator.className = "start-menu__separator";
    separator.setAttribute("role", "separator");
    list.append(separator);
    systemItems.forEach((item) => {
      list.append(this.createItem(item.label, item.icon, () => this.onSystemAction(item.action)));
    });
    menu.append(brand, list);
    return menu;
  }

  private createItem(label: string, icon: string, action: () => void): HTMLButtonElement {
    const button = document.createElement("button");
    button.className = "start-menu__item";
    button.type = "button";
    button.setAttribute("role", "menuitem");
    button.innerHTML = `<img src="${icon}" alt="" draggable="false"><span>${label}</span>`;
    button.addEventListener("click", () => {
      this.setOpen(false);
      action();
    });
    return button;
  }
}
