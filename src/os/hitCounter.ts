const countStorageKey = "mingyun-os:hit-count";
const recordedStorageKey = "mingyun-os:hit-recorded";
const remoteVisitorStorageKey = "mingyun-os:remote-hit-visitor";
const remoteRecordedStorageKey = "mingyun-os:remote-hit-recorded";

export interface HitCounterState {
  count: number;
  hasHit: boolean;
}

export interface HitCounterStore {
  read(): Promise<HitCounterState>;
  leaveHit(): Promise<HitCounterState>;
}

export class LocalHitCounterStore implements HitCounterStore {
  constructor(private readonly storage: Storage = window.localStorage) {}

  async read(): Promise<HitCounterState> {
    try {
      const parsedCount = Number.parseInt(this.storage.getItem(countStorageKey) ?? "0", 10);
      const count = Number.isFinite(parsedCount) && parsedCount > 0 ? parsedCount : 0;
      return {
        count,
        hasHit: this.storage.getItem(recordedStorageKey) === "true",
      };
    } catch {
      return { count: 0, hasHit: false };
    }
  }

  async leaveHit(): Promise<HitCounterState> {
    const current = await this.read();
    if (current.hasHit) return current;

    const next = { count: current.count + 1, hasHit: true };
    try {
      this.storage.setItem(countStorageKey, String(next.count));
      this.storage.setItem(recordedStorageKey, "true");
    } catch {
      // The visual interaction still works when storage is unavailable.
    }
    return next;
  }
}

export class CloudflareHitCounterStore implements HitCounterStore {
  constructor(
    private readonly apiUrl: string,
    private readonly storage: Storage = window.localStorage,
    private readonly fetcher: typeof fetch = window.fetch.bind(window),
  ) {}

  async read(): Promise<HitCounterState> {
    const response = await this.fetcher(this.endpoint(), {
      headers: { Accept: "application/json" },
    });
    const data = await responseJson(response);

    return {
      count: normalisedCount(data.count),
      hasHit: this.readStorage(remoteRecordedStorageKey) === "true",
    };
  }

  async leaveHit(): Promise<HitCounterState> {
    if (this.readStorage(remoteRecordedStorageKey) === "true") return this.read();

    const response = await this.fetcher(this.endpoint(), {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ visitorId: this.visitorId() }),
    });
    const data = await responseJson(response);

    this.writeStorage(remoteRecordedStorageKey, "true");
    return { count: normalisedCount(data.count), hasHit: true };
  }

  private endpoint(): string {
    return `${this.apiUrl.replace(/\/$/, "")}/api/hits`;
  }

  private visitorId(): string {
    const existing = this.readStorage(remoteVisitorStorageKey);
    if (existing) return existing;

    const visitorId = typeof crypto.randomUUID === "function"
      ? crypto.randomUUID()
      : "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (character) => {
          const random = Math.floor(Math.random() * 16);
          const value = character === "x" ? random : (random & 0x3) | 0x8;
          return value.toString(16);
        });
    this.writeStorage(remoteVisitorStorageKey, visitorId);
    return visitorId;
  }

  private readStorage(key: string): string | null {
    try {
      return this.storage.getItem(key);
    } catch {
      return null;
    }
  }

  private writeStorage(key: string, value: string): void {
    try {
      this.storage.setItem(key, value);
    } catch {
      // D1 UUID uniqueness still protects a completed request.
    }
  }
}

class FallbackHitCounterStore implements HitCounterStore {
  private useFallback = false;

  constructor(
    private readonly primary: HitCounterStore,
    private readonly fallback: HitCounterStore,
  ) {}

  async read(): Promise<HitCounterState> {
    if (this.useFallback) return this.fallback.read();
    try {
      return await this.primary.read();
    } catch {
      this.useFallback = true;
      return this.fallback.read();
    }
  }

  async leaveHit(): Promise<HitCounterState> {
    if (this.useFallback) return this.fallback.leaveHit();
    try {
      return await this.primary.leaveHit();
    } catch {
      this.useFallback = true;
      return this.fallback.leaveHit();
    }
  }
}

function normalisedCount(value: unknown): number {
  const count = Number(value);
  return Number.isFinite(count) && count > 0 ? Math.floor(count) : 0;
}

async function responseJson(response: Response): Promise<{ count: unknown }> {
  if (!response.ok) throw new Error(`HIT API returned ${response.status}`);
  const data: unknown = await response.json();
  if (!data || typeof data !== "object" || !("count" in data)) {
    throw new Error("HIT API returned an invalid response");
  }
  return data as { count: unknown };
}

export function createDefaultHitCounterStore(storage: Storage = window.localStorage): HitCounterStore {
  const apiUrl = import.meta.env.VITE_HIT_COUNTER_API_URL?.trim();
  const local = new LocalHitCounterStore(storage);
  return apiUrl
    ? new FallbackHitCounterStore(new CloudflareHitCounterStore(apiUrl, storage), local)
    : local;
}

function formattedCount(count: number): string {
  return Math.max(0, count).toString().padStart(6, "0");
}

export function createHitCounter(store: HitCounterStore = createDefaultHitCounterStore()): HTMLElement {
  const widget = document.createElement("section");
  widget.className = "desktop-hit-counter raised";
  widget.setAttribute("aria-label", "MingyunOS hit counter");

  const button = document.createElement("button");
  button.className = "desktop-hit-counter__button classic-button raised";
  button.type = "button";
  button.title = "Click to leave your trace on MingyunOS.";

  const digits = document.createElement("output");
  digits.className = "desktop-hit-counter__digits sunken";
  digits.setAttribute("aria-label", "Hit count");
  digits.setAttribute("aria-live", "polite");

  const notice = document.createElement("div");
  notice.className = "desktop-hit-counter__notice raised";
  notice.hidden = true;
  notice.setAttribute("role", "status");
  notice.setAttribute("aria-live", "polite");

  const noticeTitle = document.createElement("strong");
  noticeTitle.textContent = "HIT RECORDED!";
  const noticeText = document.createElement("span");
  notice.append(noticeTitle, noticeText);

  const render = (state: HitCounterState): void => {
    digits.value = formattedCount(state.count);
    digits.textContent = formattedCount(state.count);
    button.textContent = state.hasHit ? "HIT ✓" : "HIT!";
    button.disabled = state.hasHit;
    widget.classList.toggle("is-recorded", state.hasHit);
  };

  digits.value = "------";
  digits.textContent = "------";
  button.textContent = "HIT!";
  button.disabled = true;
  void store.read().then(render);

  button.addEventListener("click", async () => {
    button.disabled = true;
    const state = await store.leaveHit();
    render(state);
    noticeText.textContent = `YOU ARE HIT #${formattedCount(state.count)}`;
    notice.hidden = false;
  });

  widget.append(button, digits, notice);
  return widget;
}
