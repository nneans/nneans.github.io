import { osConfig } from "../config/os";
import { desktopItems } from "../config/desktop";
import { recycleStore } from "./recycleStore";
import type { WindowManager } from "./windowManager";

export class Desktop {
  private selectedIcon: HTMLButtonElement | null = null;
  private drag:
    | { icon: HTMLButtonElement; pointerId: number; offsetX: number; offsetY: number; startX: number; startY: number; moved: boolean }
    | undefined;
  private suppressClick = false;

  constructor(
    private readonly element: HTMLElement,
    private readonly windowManager: WindowManager,
  ) {
    this.element.querySelectorAll<HTMLButtonElement>(".desktop-icon").forEach((icon) => {
      icon.addEventListener("click", (event) => {
        if (this.suppressClick) {
          this.suppressClick = false;
          event.preventDefault();
          event.stopPropagation();
          return;
        }
        event.stopPropagation();
        this.select(icon);
      });
      icon.addEventListener("dblclick", (event) => {
        event.stopPropagation();
        this.open(icon);
      });
      icon.addEventListener("pointerup", (event) => {
        if (window.innerWidth > osConfig.mobileBreakpoint) this.finishDrag(event);
        else if (event.pointerType !== "mouse") this.open(icon);
      });
      icon.addEventListener("pointerdown", (event) => this.beginDrag(icon, event));
      icon.addEventListener("pointermove", (event) => this.moveDrag(event));
      icon.addEventListener("pointercancel", (event) => this.finishDrag(event));
      icon.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
          event.preventDefault();
          this.open(icon);
        }
      });
    });
    this.element.addEventListener("pointerdown", (event) => {
      if (!(event.target as HTMLElement).closest(".desktop-icon, .os-window")) this.clearSelection();
    });
    recycleStore.subscribe((items) => {
      const recycledIds = new Set(items.map((item) => item.id));
      this.element.querySelectorAll<HTMLButtonElement>(".desktop-icon").forEach((icon) => {
        const recycled = recycledIds.has(icon.dataset.itemId ?? "");
        if (icon.hidden && !recycled) {
          const item = desktopItems.find((candidate) => candidate.id === icon.dataset.itemId);
          if (item) {
            icon.style.left = `${item.column * 88 + 4}px`;
            icon.style.top = `${item.row * 88 + 2}px`;
          }
        }
        icon.hidden = recycled;
      });
    });
  }

  clearSelection(): void {
    this.selectedIcon?.setAttribute("aria-selected", "false");
    this.selectedIcon = null;
  }

  private select(icon: HTMLButtonElement): void {
    this.clearSelection();
    this.selectedIcon = icon;
    icon.setAttribute("aria-selected", "true");
  }

  private open(icon: HTMLButtonElement): void {
    const appId = icon.dataset.appId;
    if (appId) this.windowManager.openWindow(appId);
  }

  private beginDrag(icon: HTMLButtonElement, event: PointerEvent): void {
    if (window.innerWidth <= osConfig.mobileBreakpoint || event.button !== 0) return;
    const rect = icon.getBoundingClientRect();
    this.drag = {
      icon,
      pointerId: event.pointerId,
      offsetX: event.clientX - rect.left,
      offsetY: event.clientY - rect.top,
      startX: event.clientX,
      startY: event.clientY,
      moved: false,
    };
    icon.setPointerCapture(event.pointerId);
  }

  private moveDrag(event: PointerEvent): void {
    const drag = this.drag;
    if (!drag || drag.pointerId !== event.pointerId) return;
    if (!drag.moved && Math.hypot(event.clientX - drag.startX, event.clientY - drag.startY) < 6) return;
    drag.moved = true;
    drag.icon.classList.add("is-dragging");
    const area = this.element.querySelector<HTMLElement>(".desktop-icons")?.getBoundingClientRect();
    if (!area) return;
    const x = Math.max(0, Math.min(area.width - drag.icon.offsetWidth, event.clientX - area.left - drag.offsetX));
    const y = Math.max(0, Math.min(area.height - drag.icon.offsetHeight, event.clientY - area.top - drag.offsetY));
    drag.icon.style.left = `${x}px`;
    drag.icon.style.top = `${y}px`;
    this.recycleBinIcon()?.classList.toggle("is-drop-target", this.overRecycleBin(drag.icon));
  }

  private finishDrag(event: PointerEvent): void {
    const drag = this.drag;
    if (!drag || drag.pointerId !== event.pointerId) return;
    if (drag.icon.hasPointerCapture(event.pointerId)) drag.icon.releasePointerCapture(event.pointerId);
    if (drag.moved) {
      this.suppressClick = true;
      if (this.overRecycleBin(drag.icon)) {
        const item = desktopItems.find((candidate) => candidate.id === drag.icon.dataset.itemId);
        if (item) recycleStore.recycle(item);
      }
    }
    drag.icon.classList.remove("is-dragging");
    this.recycleBinIcon()?.classList.remove("is-drop-target");
    this.drag = undefined;
  }

  private recycleBinIcon(): HTMLButtonElement | null {
    return this.element.querySelector<HTMLButtonElement>('[data-app-id="recycleBin"]');
  }

  private overRecycleBin(icon: HTMLElement): boolean {
    const bin = this.recycleBinIcon();
    if (!bin || bin === icon) return false;
    const iconRect = icon.getBoundingClientRect();
    const binRect = bin.getBoundingClientRect();
    const centerX = iconRect.left + iconRect.width / 2;
    const centerY = iconRect.top + iconRect.height / 2;
    return centerX >= binRect.left && centerX <= binRect.right && centerY >= binRect.top && centerY <= binRect.bottom;
  }
}
