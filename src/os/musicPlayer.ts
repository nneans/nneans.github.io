import { playlistArtwork, playlistOwner, playlistTitle, tracks } from "../apps/napster/playlist";

export interface MusicState {
  /** True once a track has been picked, i.e. the taskbar tray has something to show. */
  active: boolean;
  index: number;
  title: string;
  artist: string;
  artwork: string;
  playing: boolean;
  /** 0-100 */
  progress: number;
  currentTime: number;
  duration: number;
}

export type MusicCommand = "previous" | "play-pause" | "next" | "open" | `select:${number}`;

/**
 * The playlist audio lives here rather than inside the Napster app, so the desktop
 * widget keeps playing after the window is closed. Views talk to it by dispatching
 * `os:music-command` and re-render from `os:music-state`.
 */
class MusicPlayer {
  private readonly audio = document.createElement("audio");
  private index = 0;
  private started = false;

  constructor() {
    this.audio.preload = "none";
    ["play", "pause", "timeupdate", "loadedmetadata"].forEach((type) => {
      this.audio.addEventListener(type, () => this.emit());
    });
    this.audio.addEventListener("ended", () => this.select(this.index + 1));
    document.addEventListener("os:music-command", (event) => {
      this.handleCommand((event as CustomEvent<MusicCommand>).detail);
    });
  }

  get state(): MusicState {
    const track = tracks[this.index];
    const duration = Number.isFinite(this.audio.duration) ? this.audio.duration : 0;
    return {
      active: this.started,
      index: this.index,
      title: this.started ? track.title : playlistTitle,
      artist: this.started ? track.artist : playlistOwner,
      artwork: this.started ? track.artwork : playlistArtwork,
      playing: !this.audio.paused,
      progress: duration > 0 ? (this.audio.currentTime / duration) * 100 : 0,
      currentTime: this.audio.currentTime,
      duration,
    };
  }

  emit(): void {
    document.dispatchEvent(new CustomEvent<MusicState>("os:music-state", { detail: this.state }));
  }

  select(index: number, autoplay = true): void {
    this.index = (index + tracks.length) % tracks.length;
    this.started = true;
    this.audio.pause();
    this.audio.removeAttribute("src");
    this.audio.load();
    this.emit();
    if (autoplay) void this.play();
  }

  async play(): Promise<void> {
    this.started = true;
    const track = tracks[this.index];
    if (this.audio.src !== track.previewUrl) this.audio.src = track.previewUrl;
    try {
      await this.audio.play();
    } catch {
      this.emit();
    }
  }

  toggle(): void {
    if (this.audio.paused) void this.play();
    else this.audio.pause();
  }

  seekToPercent(percent: number): void {
    if (!Number.isFinite(this.audio.duration) || this.audio.duration <= 0) return;
    this.audio.currentTime = (percent / 100) * this.audio.duration;
  }

  private handleCommand(command: MusicCommand): void {
    if (command === "previous") this.select(this.index - 1);
    else if (command === "next") this.select(this.index + 1);
    else if (command === "play-pause") this.toggle();
    else if (command === "open") document.dispatchEvent(new CustomEvent("os:open-app", { detail: "napster" }));
    else if (command?.startsWith("select:")) this.select(Number(command.slice("select:".length)));
  }
}

export const musicPlayer = new MusicPlayer();

export function sendMusicCommand(command: MusicCommand): void {
  document.dispatchEvent(new CustomEvent<MusicCommand>("os:music-command", { detail: command }));
}

export function onMusicState(handler: (state: MusicState) => void): () => void {
  const listener = (event: Event): void => handler((event as CustomEvent<MusicState>).detail);
  document.addEventListener("os:music-state", listener);
  handler(musicPlayer.state);
  return () => document.removeEventListener("os:music-state", listener);
}
