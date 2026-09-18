import { clippyLines, type ClippyContext, type ClippyLine } from "../config/clippy";
import type { MusicState } from "./musicPlayer";
import type { WeatherSnapshot } from "./weather";

export interface ClippyPopOptions {
  sky: () => WeatherSnapshot | null;
  openWindows: () => number;
  /** Clippy keeps quiet while the screensaver or a system overlay is up. */
  blocked?: () => boolean;
  firstDelayMs?: number;
  intervalMs?: number;
}

const mutedKey = "mingyun-os:clippy-muted";
const recentMemory = 8;

function isMuted(): boolean {
  try {
    return window.localStorage.getItem(mutedKey) === "1";
  } catch {
    return false;
  }
}

function mute(): void {
  try {
    window.localStorage.setItem(mutedKey, "1");
  } catch {
    // Clippy still stays quiet for the rest of this session.
  }
}

function busanHour(now = new Date()): number {
  return Number(
    new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Seoul", hour: "2-digit", hour12: false }).format(now),
  );
}

/** Weighted pick among the lines whose conditions match, skipping recent ones. */
export function chooseLine(context: ClippyContext, recent: string[], random = Math.random): ClippyLine | null {
  const eligible = clippyLines.filter((line) => !recent.includes(line.id) && (line.when?.(context) ?? true));
  const pool = eligible.length > 0 ? eligible : clippyLines.filter((line) => !line.when);
  if (pool.length === 0) return null;
  const total = pool.reduce((sum, line) => sum + (line.weight ?? 1), 0);
  let ticket = random() * total;
  for (const line of pool) {
    ticket -= line.weight ?? 1;
    if (ticket <= 0) return line;
  }
  return pool[pool.length - 1];
}

export function createClippyPop(host: HTMLElement, options: ClippyPopOptions) {
  const pop = document.createElement("aside");
  pop.className = "clippy-pop";
  pop.hidden = true;
  pop.setAttribute("role", "status");
  pop.innerHTML = `
    <div class="assistant-character clippy-pop__buddy" aria-hidden="true"><i></i><i></i></div>
    <div class="assistant-bubble clippy-pop__bubble">
      <button class="clippy-pop__close" type="button" aria-label="닫기">✕</button>
      <p class="clippy-pop__text"></p>
      <button class="clippy-pop__mute classic-button raised" type="button">이제 그만 말 걸기</button>
    </div>
  `;
  host.append(pop);

  const text = pop.querySelector<HTMLElement>(".clippy-pop__text")!;
  const recent: string[] = [];
  let musicPlaying = false;
  let hideTimer = 0;
  let nextTimer = 0;

  document.addEventListener("os:music-state", (event) => {
    musicPlaying = (event as CustomEvent<MusicState>).detail.playing;
  });

  const hide = (): void => {
    pop.hidden = true;
    window.clearTimeout(hideTimer);
  };

  const schedule = (delay: number): void => {
    window.clearTimeout(nextTimer);
    nextTimer = window.setTimeout(speak, delay);
  };

  function speak(): void {
    if (isMuted()) return;
    if (options.blocked?.()) {
      schedule(30_000);
      return;
    }
    const snapshot = options.sky();
    const line = chooseLine(
      {
        condition: snapshot?.condition ?? "clear",
        phase: snapshot?.phase ?? "day",
        temperature: snapshot?.temperature ?? Number.NaN,
        hour: busanHour(),
        openWindows: options.openWindows(),
        musicPlaying,
      },
      recent,
    );
    if (line) {
      recent.push(line.id);
      if (recent.length > recentMemory) recent.shift();
      text.textContent = line.text;
      pop.hidden = false;
      window.clearTimeout(hideTimer);
      hideTimer = window.setTimeout(hide, 16_000);
    }
    schedule(options.intervalMs ?? 5 * 60 * 1000);
  }

  pop.querySelector<HTMLButtonElement>(".clippy-pop__close")!.addEventListener("click", hide);
  pop.querySelector<HTMLButtonElement>(".clippy-pop__mute")!.addEventListener("click", () => {
    mute();
    hide();
    window.clearTimeout(nextTimer);
  });

  if (!isMuted()) schedule(options.firstDelayMs ?? 45_000);

  return { element: pop, hide };
}
