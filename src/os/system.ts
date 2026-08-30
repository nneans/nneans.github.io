import { osConfig } from "../config/os";
import { recycleStore } from "./recycleStore";
import type { BootSequence } from "./boot";
import type { StartMenu, SystemAction } from "./startMenu";
import type { WindowManager } from "./windowManager";

export class SystemController {
  private readonly sleepOverlay: HTMLElement;
  private readonly shutdownOverlay: HTMLElement;
  private sleepingSince = 0;
  private startMenu: StartMenu | null = null;

  constructor(
    host: HTMLElement,
    private readonly windowManager: WindowManager,
    private readonly boot: BootSequence,
  ) {
    this.sleepOverlay = this.createSleepOverlay();
    this.shutdownOverlay = this.createShutdownOverlay();
    host.append(this.sleepOverlay, this.shutdownOverlay);

    const wake = () => this.wake();
    document.addEventListener("keydown", wake);
    document.addEventListener("pointerdown", wake);
    document.addEventListener("pointermove", wake);
  }

  connectStartMenu(startMenu: StartMenu): void {
    this.startMenu = startMenu;
  }

  async initialize(): Promise<void> {
    await this.replayBoot();
  }

  handleAction(action: SystemAction): void {
    if (action === "restart") void this.restart();
    if (action === "sleep") this.sleep();
    if (action === "shutdown") this.shutdown();
  }

  private async replayBoot(): Promise<void> {
    this.windowManager.setBooting(true);
    await this.boot.play();
    this.windowManager.setBooting(false);
  }

  private sleep(): void {
    this.sleepingSince = performance.now();
    this.windowManager.setSleeping(true);
    this.sleepOverlay.classList.add("is-open");
  }

  private wake(): void {
    if (!this.sleepOverlay.classList.contains("is-open")) return;
    if (performance.now() - this.sleepingSince < 350) return;
    this.sleepOverlay.classList.remove("is-open");
    this.windowManager.setSleeping(false);
  }

  private async restart(): Promise<void> {
    this.startMenu?.setOpen(false);
    this.sleepOverlay.classList.remove("is-open");
    this.shutdownOverlay.classList.remove("is-open");
    this.windowManager.setSleeping(false);
    this.windowManager.setShutdown(false);
    this.windowManager.closeAllWindows();
    recycleStore.empty();
    await this.replayBoot();
  }

  private shutdown(): void {
    this.startMenu?.setOpen(false);
    this.windowManager.setShutdown(true);
    this.shutdownOverlay.classList.add("is-open");
  }

  private createSleepOverlay(): HTMLElement {
    const overlay = document.createElement("section");
    overlay.className = "sleep-overlay";
    overlay.setAttribute("aria-label", "Computer sleeping");
    overlay.innerHTML = `
      <div class="sleep-logo"><span>${osConfig.brandPrefix}</span>${osConfig.brandSuffix}</div>
      <p>Move the mouse or press a key to wake…</p>
    `;
    return overlay;
  }

  private createShutdownOverlay(): HTMLElement {
    const overlay = document.createElement("section");
    overlay.className = "shutdown-overlay";
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "true");
    overlay.innerHTML = `
      <div>
        <p>It's now safe to turn off your computer.</p>
        <strong>Thanks for visiting ${osConfig.name}.</strong>
        <button class="shutdown-restart" type="button">← Restart ${osConfig.name}</button>
      </div>
    `;
    overlay.querySelector("button")?.addEventListener("click", () => void this.restart());
    return overlay;
  }

}
