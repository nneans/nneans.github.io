import type { WeatherSnapshot } from "./weather";

export function createDesktopWeather(): HTMLElement {
  const readout = document.createElement("div");
  readout.className = "desktop-weather";
  readout.innerHTML = `
    <span class="desktop-weather__place">BUSAN</span>
    <strong class="desktop-weather__temp">--°</strong>
    <span class="desktop-weather__label">불러오는 중…</span>
  `;
  return readout;
}

export function updateDesktopWeather(readout: HTMLElement, snapshot: WeatherSnapshot): void {
  const temperature = Number.isFinite(snapshot.temperature) ? `${Math.round(snapshot.temperature)}°` : "--°";
  readout.querySelector<HTMLElement>(".desktop-weather__place")!.textContent = snapshot.place;
  readout.querySelector<HTMLElement>(".desktop-weather__temp")!.textContent = temperature;
  readout.querySelector<HTMLElement>(".desktop-weather__label")!.textContent = snapshot.label;
}
