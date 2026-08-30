import { getAppDefinition } from "../apps/registry";
import { osConfig } from "../config/os";

export interface WindowBounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface WindowState extends WindowBounds {
  id: string;
  appId: string;
  title: string;
  icon: string;
  zIndex: number;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  previousBounds?: WindowBounds;
}

export interface OSState {
  windows: WindowState[];
  activeWindowId: string | null;
  highestZIndex: number;
  startMenuOpen: boolean;
  booting: boolean;
  sleeping: boolean;
  shutdown: boolean;
}

type StateListener = (state: Readonly<OSState>) => void;

interface DragState {
  windowId: string;
  pointerId: number;
  offsetX: number;
  offsetY: number;
}

const clamp = (value: number, min: number, max: number): number =>
  Math.min(Math.max(value, min), Math.max(min, max));

export class WindowManager {
  readonly state: OSState = {
    windows: [],
    activeWindowId: null,
    highestZIndex: 100,
    startMenuOpen: false,
    booting: osConfig.enableBoot,
    sleeping: false,
    shutdown: false,
  };

  private listeners = new Set<StateListener>();
  private dragState: DragState | null = null;
  private instanceCount = 0;

  constructor(private readonly layer: HTMLElement) {
    window.addEventListener("resize", () => this.handleResize());
  }

  subscribe(listener: StateListener): () => void {
    this.listeners.add(listener);
    listener(this.state);
    return () => this.listeners.delete(listener);
  }

  openWindow(appId: string): string {
    const app = getAppDefinition(appId);
    const existing = app.singleInstance
      ? this.state.windows.find((candidate) => candidate.appId === appId && candidate.isOpen)
      : undefined;

    if (existing) {
      this.restoreWindow(existing.id);
      return existing.id;
    }

    this.instanceCount += 1;
    const id = `${appId}-${this.instanceCount}`;
    const isMobile = this.isMobileViewport();
    const bounds = isMobile
      ? this.maximizedBounds()
      : this.getOpeningBounds(app.defaultWidth, app.defaultHeight);
    const state: WindowState = {
      id,
      appId,
      title: app.title,
      icon: app.icon,
      ...bounds,
      zIndex: ++this.state.highestZIndex,
      isOpen: true,
      isMinimized: false,
      isMaximized: isMobile,
    };

    const element = this.createWindowElement(state, app.render());
    this.layer.append(element);
    this.state.windows.push(state);
    this.focusWindow(id);
    return id;
  }

  closeWindow(windowId: string): void {
    const state = this.getWindow(windowId);
    if (!state) return;
    state.isOpen = false;
    const element = this.layer.querySelector<HTMLElement>(this.selector(windowId));
    element?.querySelector<HTMLElement>(".app-shell")?.dispatchEvent(new CustomEvent("app:dispose"));
    element?.remove();
    this.state.windows = this.state.windows.filter((candidate) => candidate.id !== windowId);
    if (this.state.activeWindowId === windowId) this.focusTopWindow();
    this.emit();
  }

  minimizeWindow(windowId: string): void {
    const state = this.getWindow(windowId);
    const element = this.getElement(windowId);
    if (!state || !element) return;
    state.isMinimized = true;
    element.classList.add("is-minimized");
    element.setAttribute("aria-hidden", "true");
    if (this.state.activeWindowId === windowId) this.focusTopWindow(windowId);
    this.emit();
  }

  restoreWindow(windowId: string): void {
    const state = this.getWindow(windowId);
    const element = this.getElement(windowId);
    if (!state || !element) return;
    state.isMinimized = false;
    if (this.isMobileViewport()) {
      Object.assign(state, this.maximizedBounds());
      state.isMaximized = true;
      state.previousBounds = undefined;
      this.applyBounds(state, element);
    }
    element.classList.remove("is-minimized");
    element.removeAttribute("aria-hidden");
    this.focusWindow(windowId);
  }

  maximizeWindow(windowId: string): void {
    const state = this.getWindow(windowId);
    if (!state) return;
    if (this.isMobileViewport()) {
      Object.assign(state, this.maximizedBounds());
      state.previousBounds = undefined;
      state.isMaximized = true;
      this.applyBounds(state);
      this.focusWindow(windowId);
      return;
    }
    if (state.isMaximized && state.previousBounds) {
      Object.assign(state, state.previousBounds);
      state.previousBounds = undefined;
      state.isMaximized = false;
    } else {
      state.previousBounds = { x: state.x, y: state.y, width: state.width, height: state.height };
      Object.assign(state, this.maximizedBounds());
      state.isMaximized = true;
    }
    this.applyBounds(state);
    this.focusWindow(windowId);
  }

  focusWindow(windowId: string): void {
    const state = this.getWindow(windowId);
    if (!state || state.isMinimized) return;
    state.zIndex = ++this.state.highestZIndex;
    this.state.activeWindowId = windowId;
    this.state.windows.forEach((candidate) => {
      const element = this.getElement(candidate.id);
      const active = candidate.id === windowId;
      element?.classList.toggle("is-active", active);
      element?.setAttribute("aria-current", active ? "true" : "false");
      if (element) element.style.zIndex = String(candidate.zIndex);
    });
    this.emit();
  }

  startDrag(windowId: string, event: PointerEvent, handle: HTMLElement): void {
    const state = this.getWindow(windowId);
    if (!state || state.isMaximized || window.innerWidth <= osConfig.mobileBreakpoint) return;
    this.focusWindow(windowId);
    const element = this.getElement(windowId);
    if (!element) return;
    const rect = element.getBoundingClientRect();
    this.dragState = {
      windowId,
      pointerId: event.pointerId,
      offsetX: event.clientX - rect.left,
      offsetY: event.clientY - rect.top,
    };
    handle.setPointerCapture(event.pointerId);
    element.classList.add("is-dragging");
    event.preventDefault();
  }

  dragWindow(event: PointerEvent): void {
    const drag = this.dragState;
    if (!drag || drag.pointerId !== event.pointerId) return;
    const state = this.getWindow(drag.windowId);
    if (!state) return;
    const bounds = this.clampBounds({
      ...state,
      x: event.clientX - drag.offsetX,
      y: event.clientY - drag.offsetY,
    });
    state.x = bounds.x;
    state.y = bounds.y;
    this.applyBounds(state);
  }

  stopDrag(event: PointerEvent, handle: HTMLElement): void {
    if (!this.dragState || this.dragState.pointerId !== event.pointerId) return;
    this.getElement(this.dragState.windowId)?.classList.remove("is-dragging");
    if (handle.hasPointerCapture(event.pointerId)) handle.releasePointerCapture(event.pointerId);
    this.dragState = null;
    this.emit();
  }

  closeAllWindows(): void {
    this.state.windows.forEach((windowState) => {
      const element = this.getElement(windowState.id);
      element?.querySelector<HTMLElement>(".app-shell")?.dispatchEvent(new CustomEvent("app:dispose"));
      element?.remove();
    });
    this.state.windows = [];
    this.state.activeWindowId = null;
    this.state.highestZIndex = 100;
    this.emit();
  }

  setStartMenuOpen(open: boolean): void {
    this.state.startMenuOpen = open;
    this.emit();
  }

  setBooting(booting: boolean): void {
    this.state.booting = booting;
    this.emit();
  }

  setSleeping(sleeping: boolean): void {
    this.state.sleeping = sleeping;
    this.emit();
  }

  setShutdown(shutdown: boolean): void {
    this.state.shutdown = shutdown;
    this.emit();
  }

  private createWindowElement(state: WindowState, content: HTMLElement): HTMLElement {
    const element = document.createElement("section");
    element.className = "os-window raised is-active";
    element.dataset.windowId = state.id;
    element.setAttribute("role", "dialog");
    element.setAttribute("aria-label", state.title);
    element.setAttribute("aria-current", "true");

    const titlebar = document.createElement("header");
    titlebar.className = "titlebar";
    titlebar.innerHTML = `
      <img class="titlebar__icon" src="${state.icon}" alt="" draggable="false" />
      <span class="titlebar__title">${state.title}</span>
      <div class="titlebar__controls"></div>
    `;

    const controls = titlebar.querySelector<HTMLElement>(".titlebar__controls");
    if (!controls) throw new Error("Could not create window controls");
    controls.append(
      this.createControl("_", `Minimize ${state.title}`, () => this.minimizeWindow(state.id)),
      this.createControl("□", `Maximize ${state.title}`, () => this.maximizeWindow(state.id)),
      this.createControl("×", `Close ${state.title}`, () => this.closeWindow(state.id)),
    );

    const body = document.createElement("div");
    body.className = "window-body";
    body.append(content);
    element.append(titlebar, body);
    this.applyBounds(state, element);

    element.addEventListener("pointerdown", () => this.focusWindow(state.id));
    titlebar.addEventListener("dblclick", (event) => {
      if ((event.target as HTMLElement).closest("button")) return;
      this.maximizeWindow(state.id);
    });
    titlebar.addEventListener("pointerdown", (event) => {
      if ((event.target as HTMLElement).closest("button")) return;
      this.startDrag(state.id, event, titlebar);
    });
    titlebar.addEventListener("pointermove", (event) => this.dragWindow(event));
    titlebar.addEventListener("pointerup", (event) => this.stopDrag(event, titlebar));
    titlebar.addEventListener("pointercancel", (event) => this.stopDrag(event, titlebar));
    return element;
  }

  private createControl(label: string, ariaLabel: string, action: () => void): HTMLButtonElement {
    const button = document.createElement("button");
    button.className = "window-control raised";
    button.type = "button";
    button.textContent = label;
    button.setAttribute("aria-label", ariaLabel);
    let handledFromTouch = false;

    button.addEventListener("pointerdown", (event) => event.stopPropagation());
    button.addEventListener("pointerup", (event) => {
      if (!this.isMobileViewport() || event.pointerType === "mouse") return;
      handledFromTouch = true;
      event.preventDefault();
      event.stopPropagation();
      action();
    });
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      if (handledFromTouch) {
        handledFromTouch = false;
        return;
      }
      action();
    });
    return button;
  }

  private getOpeningBounds(width: number, height: number): WindowBounds {
    const usableHeight = window.innerHeight - osConfig.taskbarHeight;
    const safeWidth = Math.min(width, Math.max(280, window.innerWidth - 24));
    const safeHeight = Math.min(height, Math.max(200, usableHeight - 24));
    const offset = (this.state.windows.length % 7) * 24;
    return this.clampBounds({
      x: Math.round((window.innerWidth - safeWidth) / 2 + offset - 50),
      y: Math.round((usableHeight - safeHeight) / 2 + offset - 24),
      width: safeWidth,
      height: safeHeight,
    });
  }

  private maximizedBounds(): WindowBounds {
    return { x: 0, y: 0, width: window.innerWidth, height: window.innerHeight - osConfig.taskbarHeight };
  }

  private clampBounds(bounds: WindowBounds): WindowBounds {
    const usableHeight = window.innerHeight - osConfig.taskbarHeight;
    const minVisibleWidth = Math.min(96, bounds.width);
    return {
      ...bounds,
      x: clamp(bounds.x, minVisibleWidth - bounds.width, window.innerWidth - minVisibleWidth),
      y: clamp(bounds.y, 0, Math.max(0, usableHeight - 24)),
    };
  }

  private handleResize(): void {
    this.state.windows.forEach((state) => {
      if (this.isMobileViewport()) {
        Object.assign(state, this.maximizedBounds());
        state.isMaximized = true;
        state.previousBounds = undefined;
      } else if (state.isMaximized) Object.assign(state, this.maximizedBounds());
      else Object.assign(state, this.clampBounds(state));
      this.applyBounds(state);
    });
    this.emit();
  }

  private focusTopWindow(excludedId?: string): void {
    const next = [...this.state.windows]
      .filter((candidate) => candidate.id !== excludedId && !candidate.isMinimized && candidate.isOpen)
      .sort((a, b) => b.zIndex - a.zIndex)[0];
    this.state.activeWindowId = null;
    this.state.windows.forEach((candidate) => {
      const active = candidate.id === next?.id;
      this.getElement(candidate.id)?.classList.toggle("is-active", active);
    });
    if (next) this.focusWindow(next.id);
  }

  private applyBounds(state: WindowState, element = this.getElement(state.id)): void {
    if (!element) return;
    element.style.left = `${state.x}px`;
    element.style.top = `${state.y}px`;
    element.style.width = `${state.width}px`;
    element.style.height = `${state.height}px`;
    element.style.zIndex = String(state.zIndex);
  }

  private isMobileViewport(): boolean {
    return window.innerWidth <= osConfig.mobileBreakpoint;
  }

  private getWindow(windowId: string): WindowState | undefined {
    return this.state.windows.find((candidate) => candidate.id === windowId);
  }

  private getElement(windowId: string): HTMLElement | null {
    return this.layer.querySelector<HTMLElement>(this.selector(windowId));
  }

  private selector(windowId: string): string {
    return `[data-window-id="${CSS.escape(windowId)}"]`;
  }

  private emit(): void {
    this.listeners.forEach((listener) => listener(this.state));
  }
}
