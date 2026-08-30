import { osConfig } from "../config/os";

export class BootSequence {
  readonly element: HTMLElement;

  constructor(private readonly host: HTMLElement) {
    this.element = document.createElement("section");
    this.element.className = "boot-screen";
    this.element.setAttribute("role", "status");
    this.element.setAttribute("aria-live", "polite");
    this.element.style.setProperty("--boot-duration", `${osConfig.bootDuration}ms`);
    this.element.innerHTML = `
      <div class="boot-logo">${osConfig.brandPrefix}<span>${osConfig.brandSuffix}</span> <small>${osConfig.version}</small></div>
      <p class="boot-subtitle">${osConfig.subtitle}</p>
      <div class="boot-progress sunken" aria-hidden="true"><i></i></div>
      <p class="boot-status">Starting ${osConfig.name}…</p>
    `;
    this.host.append(this.element);
  }

  async play(): Promise<void> {
    this.element.classList.remove("is-done");
    const bar = this.element.querySelector<HTMLElement>(".boot-progress i");
    if (bar) bar.style.animation = "none";
    void this.element.offsetWidth;
    if (bar) bar.style.animation = "";

    if (!osConfig.enableBoot) {
      this.element.classList.add("is-done");
      return;
    }

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    await new Promise((resolve) => window.setTimeout(resolve, reduced ? 80 : osConfig.bootDuration));
    this.element.classList.add("is-done");
  }
}
