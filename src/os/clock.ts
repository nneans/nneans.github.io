import { osConfig } from "../config/os";

export class Clock {
  private intervalId: number | undefined;

  constructor(private readonly element: HTMLTimeElement) {
    this.update();
    this.intervalId = window.setInterval(() => this.update(), 30_000);
  }

  destroy(): void {
    if (this.intervalId !== undefined) window.clearInterval(this.intervalId);
  }

  private update(): void {
    const now = new Date();
    const time = new Intl.DateTimeFormat(undefined, {
      hour: "2-digit",
      minute: "2-digit",
      hour12: osConfig.clockFormat === "12h",
    }).format(now);
    this.element.dateTime = now.toISOString();
    this.element.textContent = time;
    this.element.title = new Intl.DateTimeFormat(undefined, { dateStyle: "full", timeStyle: "short" }).format(now);
  }
}
