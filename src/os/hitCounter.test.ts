// @vitest-environment happy-dom
import { describe, expect, it } from "vitest";
import { CloudflareHitCounterStore, createHitCounter, LocalHitCounterStore } from "./hitCounter";

function memoryStorage(): Storage {
  const values = new Map<string, string>();
  return {
    get length() {
      return values.size;
    },
    clear: () => values.clear(),
    getItem: (key) => values.get(key) ?? null,
    key: (index) => [...values.keys()][index] ?? null,
    removeItem: (key) => values.delete(key),
    setItem: (key, value) => values.set(key, String(value)),
  };
}

describe("desktop hit counter", () => {
  it("records one local hit and restores it on the next visit", async () => {
    const storage = memoryStorage();
    const widget = createHitCounter(new LocalHitCounterStore(storage));
    const button = widget.querySelector<HTMLButtonElement>("button");

    await Promise.resolve();
    expect(widget.querySelector("output")?.textContent).toBe("000000");
    expect(button?.textContent).toBe("HIT!");

    button?.click();
    await Promise.resolve();
    await Promise.resolve();
    expect(widget.querySelector("output")?.textContent).toBe("000001");
    expect(button?.textContent).toBe("HIT ✓");
    expect(button?.disabled).toBe(true);
    expect(widget.querySelector("[role='status']")?.textContent).toContain("YOU ARE HIT #000001");

    const restored = createHitCounter(new LocalHitCounterStore(storage));
    await Promise.resolve();
    expect(restored.querySelector("output")?.textContent).toBe("000001");
    expect(restored.querySelector<HTMLButtonElement>("button")?.disabled).toBe(true);
  });

  it("reads and records a deduplicated hit through the Worker API", async () => {
    const storage = memoryStorage();
    const visitors = new Set<string>();
    const fetcher: typeof fetch = async (input, init) => {
      expect(String(input)).toBe("https://hits.example.com/api/hits");
      if (init?.method === "POST") {
        const body = JSON.parse(String(init.body)) as { visitorId: string };
        visitors.add(body.visitorId);
      }
      return Response.json({ count: 40 + visitors.size });
    };
    const store = new CloudflareHitCounterStore("https://hits.example.com/", storage, fetcher);

    await expect(store.read()).resolves.toEqual({ count: 40, hasHit: false });
    await expect(store.leaveHit()).resolves.toEqual({ count: 41, hasHit: true });
    await expect(store.leaveHit()).resolves.toEqual({ count: 41, hasHit: true });
    expect(visitors.size).toBe(1);
  });
});
