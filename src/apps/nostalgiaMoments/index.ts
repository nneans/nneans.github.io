import { appShell, element, menuBar } from "../shared/dom";

interface NostalgiaVideo {
  title: string;
  filename: string;
  src: string;
}

const videos: NostalgiaVideo[] = [
  { title: "살자 제발", filename: "살자_제발.mp4", src: "/assets/video/nostalgia/salja-jebal.mp4" },
  { title: "살자 제발 2", filename: "살자_제발2.mp4", src: "/assets/video/nostalgia/salja-jebal-2.mp4" },
];

function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds)) return "00:00";
  const minutes = Math.floor(seconds / 60);
  const remainder = Math.floor(seconds % 60);
  return `${String(minutes).padStart(2, "0")}:${String(remainder).padStart(2, "0")}`;
}

export function renderNostalgiaMoments(): HTMLElement {
  const app = appShell("nostalgia-app");
  const layout = element("div", "nostalgia-layout");
  const playerPane = element("section", "nostalgia-player");
  const screen = element("div", "nostalgia-screen sunken");
  const video = element("video", "nostalgia-video");
  video.controls = false;
  video.preload = "metadata";
  video.playsInline = true;
  screen.append(video);

  const nowPlaying = element("div", "nostalgia-now-playing");
  const nowTitle = element("strong");
  const nowFilename = element("span");
  nowPlaying.append(nowTitle, nowFilename);

  const controls = element("div", "nostalgia-controls raised");
  const previous = element("button", "classic-button raised", "|◀");
  previous.type = "button";
  previous.title = "Previous video";
  previous.setAttribute("aria-label", "Previous video");
  const play = element("button", "classic-button raised nostalgia-play", "▶");
  play.type = "button";
  play.title = "Play";
  play.setAttribute("aria-label", "Play video");
  const stop = element("button", "classic-button raised", "■");
  stop.type = "button";
  stop.title = "Stop";
  stop.setAttribute("aria-label", "Stop video");
  const next = element("button", "classic-button raised", "▶|");
  next.type = "button";
  next.title = "Next video";
  next.setAttribute("aria-label", "Next video");
  const timeline = element("input", "nostalgia-range nostalgia-timeline");
  timeline.type = "range";
  timeline.min = "0";
  timeline.max = "1000";
  timeline.value = "0";
  timeline.setAttribute("aria-label", "Video position");
  const clock = element("span", "nostalgia-clock sunken", "00:00 / 00:00");
  const volumeLabel = element("span", "nostalgia-volume-label", "VOL");
  const volume = element("input", "nostalgia-range nostalgia-volume");
  volume.type = "range";
  volume.min = "0";
  volume.max = "100";
  volume.value = "80";
  volume.setAttribute("aria-label", "Volume");
  video.volume = 0.8;
  const fullscreen = element("button", "classic-button raised", "□");
  fullscreen.type = "button";
  fullscreen.title = "Full screen";
  fullscreen.setAttribute("aria-label", "Enter full screen");
  controls.append(previous, play, stop, next, timeline, clock, volumeLabel, volume, fullscreen);
  playerPane.append(screen, nowPlaying, controls);

  const playlist = element("aside", "nostalgia-playlist sunken");
  playlist.append(element("header", undefined, "PLAYLIST"));
  const videoList = element("div", "nostalgia-video-list");
  playlist.append(videoList);
  const status = element("footer", "app-status sunken");
  let currentIndex = 0;

  const updateTimeline = (): void => {
    const duration = video.duration;
    const current = video.currentTime;
    timeline.value = Number.isFinite(duration) && duration > 0 ? String(Math.round((current / duration) * 1000)) : "0";
    clock.textContent = `${formatTime(current)} / ${formatTime(duration)}`;
  };

  const updatePlayButton = (): void => {
    const playing = !video.paused && !video.ended;
    play.textContent = playing ? "Ⅱ" : "▶";
    play.title = playing ? "Pause" : "Play";
    play.setAttribute("aria-label", playing ? "Pause video" : "Play video");
  };

  const loadVideo = (index: number, autoplay = false): void => {
    currentIndex = (index + videos.length) % videos.length;
    const selected = videos[currentIndex];
    video.src = selected.src;
    video.load();
    nowTitle.textContent = selected.title;
    nowFilename.textContent = selected.filename;
    status.textContent = `${currentIndex + 1} of ${videos.length} · ${selected.filename}`;
    videoList.querySelectorAll<HTMLButtonElement>("button").forEach((button, buttonIndex) => {
      button.classList.toggle("is-selected", buttonIndex === currentIndex);
      button.setAttribute("aria-selected", String(buttonIndex === currentIndex));
    });
    if (autoplay) void video.play().catch(() => undefined);
  };

  videos.forEach((item, index) => {
    const button = element("button", "nostalgia-list-item");
    button.type = "button";
    button.setAttribute("role", "option");
    const icon = element("img");
    icon.src = "/icons/video.png";
    icon.alt = "";
    icon.draggable = false;
    const copy = element("span");
    copy.append(element("strong", undefined, item.title), element("small", undefined, item.filename));
    button.append(icon, copy);
    button.addEventListener("click", () => loadVideo(index));
    button.addEventListener("dblclick", () => loadVideo(index, true));
    videoList.append(button);
  });

  const togglePlayback = (): void => {
    if (video.paused || video.ended) void video.play().catch(() => undefined);
    else video.pause();
  };
  play.addEventListener("click", togglePlayback);
  video.addEventListener("click", togglePlayback);
  stop.addEventListener("click", () => {
    video.pause();
    video.currentTime = 0;
    updateTimeline();
  });
  previous.addEventListener("click", () => loadVideo(currentIndex - 1, !video.paused));
  next.addEventListener("click", () => loadVideo(currentIndex + 1, !video.paused));
  previous.disabled = videos.length < 2;
  next.disabled = videos.length < 2;
  timeline.addEventListener("input", () => {
    if (Number.isFinite(video.duration)) video.currentTime = (Number(timeline.value) / 1000) * video.duration;
  });
  volume.addEventListener("input", () => { video.volume = Number(volume.value) / 100; });
  fullscreen.addEventListener("click", () => void screen.requestFullscreen?.());
  video.addEventListener("loadedmetadata", updateTimeline);
  video.addEventListener("timeupdate", updateTimeline);
  video.addEventListener("play", updatePlayButton);
  video.addEventListener("pause", updatePlayButton);
  video.addEventListener("ended", () => {
    updatePlayButton();
    if (videos.length > 1) loadVideo(currentIndex + 1, true);
  });

  layout.append(playerPane, playlist);
  app.addEventListener("app:dispose", () => video.pause(), { once: true });
  app.append(menuBar(["File", "View", "Playback", "Help"]), layout, status);
  loadVideo(0);
  return app;
}
