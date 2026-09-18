import { describe, expect, it } from "vitest";
import { modeForSky } from "./screensaver";
import { chooseLine } from "./clippyPop";
import type { ClippyContext } from "../config/clippy";

describe("modeForSky", () => {
  it("runs the starfield at night and Flying Windows by day", () => {
    expect(modeForSky("night", "clear")).toBe("starfield");
    expect(modeForSky("day", "clear")).toBe("flying");
  });

  it("switches to Mystify under bad weather, whatever the hour", () => {
    expect(modeForSky("night", "rain")).toBe("mystify");
    expect(modeForSky("day", "snow")).toBe("mystify");
    expect(modeForSky("dusk", "storm")).toBe("mystify");
  });
});

const context = (overrides: Partial<ClippyContext> = {}): ClippyContext => ({
  condition: "clear",
  phase: "day",
  temperature: 20,
  hour: 13,
  openWindows: 1,
  musicPlaying: false,
  ...overrides,
});

describe("chooseLine", () => {
  it("only offers lines whose conditions match", () => {
    // Always take the first eligible line so the pick is deterministic.
    const line = chooseLine(context({ condition: "snow" }), [], () => 0);
    expect(line?.id).toBe("snow");
  });

  it("skips lines shown recently", () => {
    const line = chooseLine(context({ condition: "snow" }), ["snow"], () => 0);
    expect(line?.id).not.toBe("snow");
  });

  it("still finds something to say when nothing specific applies", () => {
    expect(chooseLine(context({ hour: 11, openWindows: 2 }), [])).not.toBeNull();
  });
});
