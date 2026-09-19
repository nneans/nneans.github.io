import { describe, expect, it } from "vitest";
import { arcProgress, busan, clockOnlySnapshot, phaseFor, toSnapshot } from "./weather";

const forecast = (code: number, isDay: number) => ({
  current: { temperature_2m: 21.4, weather_code: code, is_day: isDay, wind_speed_10m: 9 },
  daily: { sunrise: ["2026-09-19T06:09"], sunset: ["2026-09-19T18:25"] },
});

describe("phaseFor", () => {
  const sunrise = 6 * 60 + 9;
  const sunset = 18 * 60 + 25;

  it("puts midday in day and midnight in night", () => {
    expect(phaseFor(12 * 60, sunrise, sunset)).toBe("day");
    expect(phaseFor(2 * 60, sunrise, sunset)).toBe("night");
  });

  it("warms the sky around sunrise and sunset", () => {
    expect(phaseFor(sunrise, sunrise, sunset)).toBe("dawn");
    expect(phaseFor(sunset - 20, sunrise, sunset)).toBe("dusk");
  });
});

describe("toSnapshot", () => {
  it("maps WMO codes to the scenes the desktop can draw", () => {
    const at = (iso: string) => new Date(iso);
    expect(toSnapshot(forecast(0, 1), busan, at("2026-09-19T03:00:00Z")).condition).toBe("clear");
    expect(toSnapshot(forecast(3, 1), busan, at("2026-09-19T03:00:00Z")).condition).toBe("overcast");
    expect(toSnapshot(forecast(65, 1), busan, at("2026-09-19T03:00:00Z")).condition).toBe("rain");
    expect(toSnapshot(forecast(95, 1), busan, at("2026-09-19T03:00:00Z")).condition).toBe("storm");
    expect(toSnapshot(forecast(71, 1), busan, at("2026-09-19T03:00:00Z")).condition).toBe("snow");
  });

  it("reads the clock in Busan, not in the visitor's timezone", () => {
    // 21:00 UTC is 06:00 the next morning in Busan, so the sky is at dawn.
    expect(toSnapshot(forecast(0, 1), busan, new Date("2026-09-18T21:00:00Z")).phase).toBe("dawn");
    // 03:00 UTC is midday in Busan.
    expect(toSnapshot(forecast(0, 1), busan, new Date("2026-09-19T03:00:00Z")).phase).toBe("day");
  });

  it("trusts the forecast's own day flag over the clock", () => {
    expect(toSnapshot(forecast(0, 0), busan, new Date("2026-09-19T03:00:00Z")).phase).toBe("dusk");
  });
});

describe("arcProgress", () => {
  const sunrise = 6 * 60;
  const sunset = 18 * 60;

  it("walks the sun from rise to set across the day", () => {
    expect(arcProgress(sunrise, sunrise, sunset)).toEqual({ t: 0, body: "sun" });
    expect(arcProgress(12 * 60, sunrise, sunset)).toEqual({ t: 0.5, body: "sun" });
    expect(arcProgress(sunset, sunrise, sunset)).toEqual({ t: 1, body: "sun" });
  });

  it("hands the sky over to the moon after sunset, wrapping past midnight", () => {
    expect(arcProgress(sunset + 1, sunrise, sunset).body).toBe("moon");
    expect(arcProgress(2 * 60, sunrise, sunset).body).toBe("moon");
    // Midnight is the halfway point of a 12-hour night.
    expect(arcProgress(0, sunrise, sunset).t).toBeCloseTo(0.5, 5);
  });

  it("keeps the moon moving forward across midnight", () => {
    const before = arcProgress(23 * 60, sunrise, sunset).t;
    const after = arcProgress(1 * 60, sunrise, sunset).t;
    expect(after).toBeGreaterThan(before);
  });
});

describe("clockOnlySnapshot", () => {
  it("gives the sky a sensible phase with no network at all", () => {
    // 03:00 UTC is midday in Busan; 18:00 UTC is 03:00 the next morning.
    expect(clockOnlySnapshot(busan, new Date("2026-09-19T03:00:00Z")).phase).toBe("day");
    expect(clockOnlySnapshot(busan, new Date("2026-09-19T18:00:00Z")).phase).toBe("night");
  });

  it("carries sunrise and sunset so the sun can still be placed", () => {
    const snapshot = clockOnlySnapshot(busan, new Date("2026-09-19T03:00:00Z"));
    expect(snapshot.sunrise).toBeGreaterThan(0);
    expect(snapshot.sunset).toBeGreaterThan(snapshot.sunrise);
    expect(snapshot.live).toBe(false);
  });
});
