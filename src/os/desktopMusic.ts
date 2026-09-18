import { onMusicState, sendMusicCommand } from "./musicPlayer";

export function createDesktopMusic(): HTMLElement {
  const widget = document.createElement("aside");
  widget.className = "desktop-music";
  widget.setAttribute("aria-label", "Now playing");
  widget.innerHTML = `
    <div class="desktop-music__now">
      <img class="desktop-music__artwork" alt="" decoding="async">
      <div class="desktop-music__copy">
        <strong class="desktop-music__title"></strong>
        <span class="desktop-music__artist"></span>
      </div>
    </div>
    <div class="desktop-music__bar"><i></i></div>
    <div class="desktop-music__controls">
      <button class="desktop-music__skip" type="button" data-command="previous" aria-label="Previous song">◀◀</button>
      <button class="desktop-music__play" type="button" data-command="play-pause" aria-label="Play">▶</button>
      <button class="desktop-music__skip" type="button" data-command="next" aria-label="Next song">▶▶</button>
      <button class="desktop-music__open" type="button" data-command="open">Napster</button>
    </div>
  `;

  const artwork = widget.querySelector<HTMLImageElement>(".desktop-music__artwork")!;
  const title = widget.querySelector<HTMLElement>(".desktop-music__title")!;
  const artist = widget.querySelector<HTMLElement>(".desktop-music__artist")!;
  const bar = widget.querySelector<HTMLElement>(".desktop-music__bar i")!;
  const play = widget.querySelector<HTMLButtonElement>(".desktop-music__play")!;

  widget.querySelectorAll<HTMLButtonElement>("[data-command]").forEach((button) => {
    button.addEventListener("click", () => sendMusicCommand(button.dataset.command as "previous"));
  });

  onMusicState((state) => {
    artwork.src = state.artwork.replace("160x160bb", "300x300bb");
    artwork.alt = `${state.title} cover`;
    title.textContent = state.title;
    artist.textContent = state.artist;
    bar.style.width = `${Math.max(0, Math.min(100, state.progress))}%`;
    play.textContent = state.playing ? "❚❚" : "▶";
    play.setAttribute("aria-label", state.playing ? "Pause" : "Play");
    widget.classList.toggle("is-playing", state.playing);
  });

  return widget;
}
