import type { MusicCommand, MusicState } from "./musicPlayer";

export function createMusicTray(): HTMLElement {
  const tray = document.createElement("div");
  tray.className = "music-tray";
  tray.hidden = true;
  tray.innerHTML = `
    <button class="music-tray__toggle classic-button raised" type="button" aria-label="Now playing" aria-expanded="false">
      <span class="music-tray__note" aria-hidden="true">♫</span>
      <span class="music-tray__title"></span>
    </button>
    <section class="music-tray__popup raised" aria-label="Now playing controls" hidden>
      <img class="music-tray__artwork" alt="">
      <div class="music-tray__copy"><strong></strong><span></span></div>
      <div class="music-tray__progress"><i></i></div>
      <div class="music-tray__controls">
        <button type="button" data-command="previous" aria-label="Previous song">◀◀</button>
        <button type="button" data-command="play-pause" aria-label="Play">▶</button>
        <button type="button" data-command="next" aria-label="Next song">▶▶</button>
        <button type="button" data-command="open" aria-label="Open Napster">Napster</button>
      </div>
    </section>
  `;

  const toggle = tray.querySelector<HTMLButtonElement>(".music-tray__toggle")!;
  const popup = tray.querySelector<HTMLElement>(".music-tray__popup")!;
  const playButton = tray.querySelector<HTMLButtonElement>('[data-command="play-pause"]')!;

  const setPopup = (open: boolean): void => {
    popup.hidden = !open;
    toggle.setAttribute("aria-expanded", String(open));
  };

  toggle.addEventListener("click", () => setPopup(popup.hidden));
  tray.querySelectorAll<HTMLButtonElement>("[data-command]").forEach((button) => {
    button.addEventListener("click", () => {
      document.dispatchEvent(new CustomEvent<MusicCommand>("os:music-command", { detail: button.dataset.command as MusicCommand }));
      if (button.dataset.command === "open") setPopup(false);
    });
  });
  document.addEventListener("pointerdown", (event) => {
    if (!popup.hidden && !tray.contains(event.target as Node)) setPopup(false);
  });
  document.addEventListener("os:music-state", (event) => {
    const state = (event as CustomEvent<MusicState>).detail;
    tray.hidden = !state.active;
    if (!state.active) {
      setPopup(false);
      return;
    }
    tray.querySelector<HTMLElement>(".music-tray__title")!.textContent = state.title;
    tray.querySelector<HTMLImageElement>(".music-tray__artwork")!.src = state.artwork;
    tray.querySelector<HTMLImageElement>(".music-tray__artwork")!.alt = `${state.title} cover`;
    tray.querySelector<HTMLElement>(".music-tray__copy strong")!.textContent = state.title;
    tray.querySelector<HTMLElement>(".music-tray__copy span")!.textContent = state.artist;
    tray.querySelector<HTMLElement>(".music-tray__progress i")!.style.width = `${Math.max(0, Math.min(100, state.progress))}%`;
    playButton.textContent = state.playing ? "❚❚" : "▶";
    playButton.setAttribute("aria-label", state.playing ? "Pause" : "Play");
  });
  return tray;
}
