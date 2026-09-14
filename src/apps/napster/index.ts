import { appShell, element, menuBar } from "../shared/dom";
import type { MusicTrayState } from "../../os/musicTray";

interface PlaylistTrack {
  title: string;
  artist: string;
  url: string;
  previewUrl: string;
  artwork: string;
}

const playlistUrl = "https://music.apple.com/kr/playlist/cree-pung/pl.u-XkD0vNBTDK1lNbD";
const playlistTitle = "Cree-pung";
const playlistOwner = "강민균";
const playlistArtwork = "https://is1-ssl.mzstatic.com/image/thumb/SG-MQ-US-001-Image000001/v4/9b/54/a4/9b54a40b-f4e1-78fa-5a5c-3f514760a35e/image/600x600bb.jpg";

const tracks: PlaylistTrack[] = [
  {
    title: "Silence (feat. Josh Bogert)",
    artist: "Axollo",
    url: "https://music.apple.com/kr/album/silence-feat-josh-bogert/1869729019?i=1869729020",
    previewUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/60/23/0a/60230ae0-4ac2-0a49-6e7c-9a222d0d8aef/mzaf_11816799711311260633.plus.aac.p.m4a",
    artwork: "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/6c/5d/dc/6c5ddc6f-64e4-d632-8e89-a62148060bce/8721465236729.png/160x160bb.jpg",
  },
  {
    title: "East Side of Sorrow",
    artist: "Zach Bryan",
    url: "https://music.apple.com/kr/album/east-side-of-sorrow/1703216858?i=1703217232",
    previewUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/c9/57/f0/c957f0e2-61d5-2932-577f-4e172052b9f6/mzaf_5563729766845996027.plus.aac.p.m4a",
    artwork: "https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/ce/36/7f/ce367f3d-2a4f-46ee-1434-e3fbb52f1fc8/093624849797.jpg/160x160bb.jpg",
  },
  {
    title: "Price Tag",
    artist: "빌스택스",
    url: "https://music.apple.com/kr/album/price-tag/1559672592?i=1559672603",
    previewUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/f8/31/a9/f831a9f2-0110-d8b1-dcef-3ffbfecee672/mzaf_4756462023062017395.plus.aac.p.m4a",
    artwork: "https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/df/7e/a1/df7ea15d-15d5-731d-e2e2-8d4a34c09d65/555.jpg/160x160bb.jpg",
  },
  {
    title: "Shower Song",
    artist: "홍다빈",
    url: "https://music.apple.com/kr/album/shower-song/1725089966?i=1725090353",
    previewUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/91/0d/f9/910df9b9-001f-3157-7e33-3f6b66169c42/mzaf_3044514689886877617.plus.aac.p.m4a",
    artwork: "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/8c/95/d9/8c95d9c5-4855-3a34-3ea1-6d838dce804e/8809704427722_Cover.jpg/160x160bb.jpg",
  },
  {
    title: "Waves",
    artist: "Kanye West",
    url: "https://music.apple.com/kr/album/waves/1443063578?i=1443063983",
    previewUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/64/54/72/6454723d-407d-f2e4-7db7-e24b8f40e7d2/mzaf_3826964363389813889.plus.aac.p.m4a",
    artwork: "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/ab/74/4a/ab744ae9-235f-0a2f-9f8a-74ddee3c339e/16UMGIM37046.rgb.jpg/160x160bb.jpg",
  },
  {
    title: "Train (feat. C JAMM)",
    artist: "빈지노",
    url: "https://music.apple.com/kr/album/train-feat-c-jamm/1724894312?i=1724894320",
    previewUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/a8/6f/16/a86f16c4-cb35-366f-fd17-d46fe7918089/mzaf_4662835658785796695.plus.aac.p.m4a",
    artwork: "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/28/d4/c5/28d4c507-19fb-0f9c-9d25-a590500f26f7/197190893304.jpg/160x160bb.jpg",
  },
  {
    title: "Overtime",
    artist: "Zach Bryan",
    url: "https://music.apple.com/kr/album/overtime/1703216858?i=1703216864",
    previewUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/c1/68/f7/c168f725-3fcd-ca67-9ed0-7026a5745020/mzaf_17862817731244769637.plus.aac.p.m4a",
    artwork: "https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/ce/36/7f/ce367f3d-2a4f-46ee-1434-e3fbb52f1fc8/093624849797.jpg/160x160bb.jpg",
  },
];

function openExternal(url: string): void {
  window.open(url, "_blank", "noopener,noreferrer");
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
  details.append(
    element("strong", "napster-playlist-title", playlistTitle),
    element("span", "napster-playlist-owner", playlistOwner),
  );
  const detailTitle = details.querySelector<HTMLElement>(".napster-playlist-title")!;
  const detailArtist = details.querySelector<HTMLElement>(".napster-playlist-owner")!;
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
  const audio = element("audio", "napster-audio");
  audio.preload = "none";
  nowPlaying.append(cover, details, progress, controls, audio);

  const trackPanel = element("section", "napster-track-panel");
  const trackHeading = element("header", "napster-track-heading");
  trackHeading.append(element("strong", undefined, "SONG LIST"), element("span", undefined, `${tracks.length} tracks`));
  const trackList = element("div", "napster-track-list");
  trackList.setAttribute("role", "listbox");
  trackList.setAttribute("aria-label", `${playlistTitle} songs`);
  const openCurrent = element("button", "napster-open-current", "Apple Music에서 보기 ↗");
  openCurrent.type = "button";

  let selectedIndex = 0;
  let hasSelectedTrack = false;
  const trackButtons: HTMLButtonElement[] = [];

  const emitMusicState = (active = true): void => {
    const selected = tracks[selectedIndex];
    const duration = Number.isFinite(audio.duration) ? audio.duration : 0;
    const state: MusicTrayState = {
      active,
      title: hasSelectedTrack ? selected.title : playlistTitle,
      artist: hasSelectedTrack ? selected.artist : playlistOwner,
      artwork: hasSelectedTrack ? selected.artwork : playlistArtwork,
      playing: !audio.paused,
      progress: duration > 0 ? (audio.currentTime / duration) * 100 : 0,
    };
    document.dispatchEvent(new CustomEvent("os:music-state", { detail: state }));
  };

  const updateSelection = (): void => {
    const selected = tracks[selectedIndex];
    if (hasSelectedTrack) {
      cover.src = selected.artwork.replace("160x160bb", "600x600bb");
      cover.alt = `${selected.title} cover`;
      detailTitle.textContent = selected.title;
      detailArtist.textContent = selected.artist;
    }
    seek.value = "0";
    elapsed.textContent = "0:00";
    remaining.textContent = "-0:30";
    trackButtons.forEach((button, index) => {
      const isSelected = index === selectedIndex;
      button.classList.toggle("is-selected", isSelected);
      button.setAttribute("aria-selected", String(isSelected));
    });
  };

  const formatTime = (seconds: number): string => {
    const safeSeconds = Number.isFinite(seconds) ? Math.max(0, Math.floor(seconds)) : 0;
    return `${Math.floor(safeSeconds / 60)}:${String(safeSeconds % 60).padStart(2, "0")}`;
  };

  const selectTrack = (index: number, autoplay = true): void => {
    selectedIndex = (index + tracks.length) % tracks.length;
    hasSelectedTrack = true;
    audio.pause();
    audio.removeAttribute("src");
    audio.load();
    updateSelection();
    trackButtons[selectedIndex]?.scrollIntoView({ block: "nearest" });
    emitMusicState();
    if (autoplay) void playSelected();
  };

  const playSelected = async (): Promise<void> => {
    const selected = tracks[selectedIndex];
    if (!hasSelectedTrack) {
      hasSelectedTrack = true;
      updateSelection();
    }
    if (audio.src !== selected.previewUrl) audio.src = selected.previewUrl;
    try {
      await audio.play();
    } catch {
      playButton.classList.remove("is-playing");
      playButton.setAttribute("aria-label", "Play");
      tableRow.lastElementChild!.textContent = "Open in Apple Music";
    }
  };

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
    item.addEventListener("click", () => {
      selectTrack(index);
    });
    trackButtons.push(item);
    trackList.append(item);
  });

  playButton.addEventListener("click", () => {
    if (audio.paused) void playSelected();
    else audio.pause();
  });
  previousButton.addEventListener("click", () => selectTrack(selectedIndex - 1));
  nextButton.addEventListener("click", () => selectTrack(selectedIndex + 1));
  seek.addEventListener("input", () => {
    if (Number.isFinite(audio.duration) && audio.duration > 0) {
      audio.currentTime = (Number(seek.value) / 100) * audio.duration;
    }
  });
  openCurrent.addEventListener("click", () => openExternal(tracks[selectedIndex].url));
  audio.addEventListener("play", () => {
    playButton.classList.add("is-playing");
    playButton.setAttribute("aria-label", "Pause");
    tableRow.lastElementChild!.textContent = "Preview Playing";
    emitMusicState();
  });
  audio.addEventListener("pause", () => {
    playButton.classList.remove("is-playing");
    playButton.setAttribute("aria-label", "Play");
    tableRow.lastElementChild!.textContent = "Preview Ready";
    if (hasSelectedTrack) emitMusicState();
  });
  audio.addEventListener("timeupdate", () => {
    const duration = Number.isFinite(audio.duration) ? audio.duration : 0;
    seek.value = duration > 0 ? String((audio.currentTime / duration) * 100) : "0";
    elapsed.textContent = formatTime(audio.currentTime);
    remaining.textContent = `-${formatTime(Math.max(0, duration - audio.currentTime))}`;
    emitMusicState();
  });
  audio.addEventListener("loadedmetadata", () => {
    remaining.textContent = `-${formatTime(audio.duration)}`;
  });
  audio.addEventListener("ended", () => {
    selectTrack(selectedIndex + 1);
  });
  const handleMusicCommand = (event: Event): void => {
    const command = (event as CustomEvent<string>).detail;
    if (command === "previous") selectTrack(selectedIndex - 1);
    if (command === "next") selectTrack(selectedIndex + 1);
    if (command === "play-pause") {
      if (audio.paused) void playSelected();
      else audio.pause();
    }
    if (command === "open") document.dispatchEvent(new CustomEvent("os:open-app", { detail: "napster" }));
  };
  document.addEventListener("os:music-command", handleMusicCommand);
  app.addEventListener("app:dispose", () => {
    audio.pause();
    document.removeEventListener("os:music-command", handleMusicCommand);
    emitMusicState(false);
  }, { once: true });

  trackPanel.append(trackHeading, trackList, openCurrent);
  layout.append(nowPlaying, trackPanel);
  updateSelection();

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
