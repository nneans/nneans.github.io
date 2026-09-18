import { appShell, element, menuBar } from "../shared/dom";
import { musicPlayer, onMusicState, sendMusicCommand } from "../../os/musicPlayer";
import { playlistArtwork, playlistOwner, playlistTitle, playlistUrl, tracks } from "./playlist";

function openExternal(url: string): void {
  window.open(url, "_blank", "noopener,noreferrer");
}

function formatTime(seconds: number): string {
  const safeSeconds = Number.isFinite(seconds) ? Math.max(0, Math.floor(seconds)) : 0;
  return `${Math.floor(safeSeconds / 60)}:${String(safeSeconds % 60).padStart(2, "0")}`;
}

export function renderNapster(): HTMLElement {
  const app = appShell("napster-app");
  const header = element("div", "napster-header");
  header.append(element("strong", undefined, "N A P S T E R"), element("span", undefined, "MusicShare 1.0"));

  const search = element("div", "napster-search");
  const input = element("input");
  input.value = playlistTitle;
  input.readOnly = true;
  input.setAttribute("aria-label", "Current playlist");
  const openPlaylist = element("button", "classic-button raised", "Open in Apple Music");
  openPlaylist.type = "button";
  openPlaylist.addEventListener("click", () => openExternal(playlistUrl));
  search.append(input, openPlaylist);

  const table = element("table", "napster-results sunken");
  table.innerHTML = "<thead><tr><th>Playlist</th><th>Service</th><th>Status</th></tr></thead>";
  const tableBody = element("tbody");
  const tableRow = element("tr", "is-selected");
  [playlistTitle, "Apple Music", "Preview Ready"].forEach((value) => tableRow.append(element("td", undefined, value)));
  tableBody.append(tableRow);
  table.append(tableBody);

  const layout = element("main", "napster-player-layout sunken");
  const nowPlaying = element("section", "napster-now-playing");
  const cover = element("img", "napster-playlist-cover");
  cover.src = playlistArtwork;
  cover.alt = `${playlistTitle} playlist cover`;
  cover.decoding = "async";
  const details = element("div", "napster-playlist-details");
  const detailTitle = element("strong", "napster-playlist-title", playlistTitle);
  const detailArtist = element("span", "napster-playlist-owner", playlistOwner);
  details.append(detailTitle, detailArtist);
  const progress = element("div", "napster-progress");
  const seek = element("input", "napster-seek") as HTMLInputElement;
  seek.type = "range";
  seek.min = "0";
  seek.max = "100";
  seek.value = "0";
  seek.step = "0.1";
  seek.setAttribute("aria-label", "노래 진행률");
  const progressTimes = element("div", "napster-progress-times");
  const elapsed = element("span", undefined, "0:00");
  const remaining = element("span", undefined, "-0:30");
  progressTimes.append(elapsed, remaining);
  progress.append(seek, progressTimes);
  const controls = element("div", "napster-controls");
  const previousButton = element("button", "napster-skip-button");
  previousButton.type = "button";
  previousButton.setAttribute("aria-label", "Previous song");
  const playButton = element("button", "napster-play-button");
  playButton.type = "button";
  playButton.setAttribute("aria-label", "Play");
  const nextButton = element("button", "napster-skip-button");
  nextButton.type = "button";
  nextButton.setAttribute("aria-label", "Next song");
  controls.append(previousButton, playButton, nextButton);
  nowPlaying.append(cover, details, progress, controls);

  const trackPanel = element("section", "napster-track-panel");
  const trackHeading = element("header", "napster-track-heading");
  trackHeading.append(element("strong", undefined, "SONG LIST"), element("span", undefined, `${tracks.length} tracks`));
  const trackList = element("div", "napster-track-list");
  trackList.setAttribute("role", "listbox");
  trackList.setAttribute("aria-label", `${playlistTitle} songs`);
  const openCurrent = element("button", "napster-open-current", "Apple Music에서 보기 ↗");
  openCurrent.type = "button";

  let selectedIndex = musicPlayer.state.index;
  const trackButtons: HTMLButtonElement[] = [];

  tracks.forEach((track, index) => {
    const item = element("button", "napster-track-item");
    item.type = "button";
    item.setAttribute("role", "option");
    const artwork = element("img");
    artwork.src = track.artwork;
    artwork.alt = "";
    artwork.loading = "lazy";
    const copy = element("span", "napster-track-copy");
    copy.append(element("strong", undefined, track.title), element("small", undefined, track.artist));
    const number = element("span", "napster-track-number", String(index + 1).padStart(2, "0"));
    item.append(artwork, copy, number);
    item.addEventListener("click", () => sendMusicCommand(`select:${index}`));
    trackButtons.push(item);
    trackList.append(item);
  });

  playButton.addEventListener("click", () => sendMusicCommand("play-pause"));
  previousButton.addEventListener("click", () => sendMusicCommand("previous"));
  nextButton.addEventListener("click", () => sendMusicCommand("next"));
  seek.addEventListener("input", () => musicPlayer.seekToPercent(Number(seek.value)));
  openCurrent.addEventListener("click", () => openExternal(tracks[selectedIndex].url));

  const stopListening = onMusicState((state) => {
    const changedTrack = state.index !== selectedIndex;
    selectedIndex = state.index;
    if (state.active) {
      cover.src = tracks[selectedIndex].artwork.replace("160x160bb", "600x600bb");
      cover.alt = `${tracks[selectedIndex].title} cover`;
      detailTitle.textContent = state.title;
      detailArtist.textContent = state.artist;
    }
    seek.value = String(state.progress);
    elapsed.textContent = formatTime(state.currentTime);
    remaining.textContent = `-${formatTime(Math.max(0, state.duration - state.currentTime))}`;
    playButton.classList.toggle("is-playing", state.playing);
    playButton.setAttribute("aria-label", state.playing ? "Pause" : "Play");
    tableRow.lastElementChild!.textContent = state.playing ? "Preview Playing" : "Preview Ready";
    trackButtons.forEach((button, index) => {
      const isSelected = index === selectedIndex;
      button.classList.toggle("is-selected", isSelected);
      button.setAttribute("aria-selected", String(isSelected));
    });
    if (changedTrack) trackButtons[selectedIndex]?.scrollIntoView({ block: "nearest" });
  });

  app.addEventListener("app:dispose", () => stopListening(), { once: true });

  trackPanel.append(trackHeading, trackList, openCurrent);
  layout.append(nowPlaying, trackPanel);

  app.append(
    menuBar(["File", "Library", "Actions", "Help"]),
    header,
    search,
    table,
    layout,
    element("footer", "app-status sunken", `${playlistTitle} · previews provided by Apple Music`),
  );
  return app;
}
