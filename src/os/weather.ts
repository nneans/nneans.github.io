export type SkyPhase = "dawn" | "day" | "dusk" | "night";
export type SkyCondition = "clear" | "partly" | "overcast" | "fog" | "rain" | "snow" | "storm";

export interface SkyLocation {
  label: string;
  latitude: number;
  longitude: number;
  timeZone: string;
}

export interface WeatherSnapshot {
  place: string;
  temperature: number;
  condition: SkyCondition;
  phase: SkyPhase;
  label: string;
  /** km/h at 10m; drives how fast the clouds cross the sky. */
  windSpeed: number;
  /** Minutes past local midnight, so the sun and moon can be placed on their arc. */
  sunrise: number;
  sunset: number;
  timeZone: string;
  /** False when the network call failed and only the clock drove the scene. */
  live: boolean;
}

export const busan: SkyLocation = {
  label: "BUSAN",
  latitude: 35.1796,
  longitude: 129.0756,
  timeZone: "Asia/Seoul",
};

const forecastCacheKey = "mingyun-os:weather";
const forecastMaxAge = 10 * 60 * 1000;

interface ForecastResponse {
  current: { temperature_2m: number; weather_code: number; is_day: number; wind_speed_10m?: number };
  daily: { sunrise: string[]; sunset: string[] };
}

/** WMO weather interpretation codes, grouped into the scenes the desktop can draw. */
const conditions: { codes: number[]; condition: SkyCondition; label: string }[] = [
  { codes: [0], condition: "clear", label: "맑음" },
  { codes: [1, 2], condition: "partly", label: "구름 조금" },
  { codes: [3], condition: "overcast", label: "흐림" },
  { codes: [45, 48], condition: "fog", label: "안개" },
  { codes: [51, 53, 55, 56, 57], condition: "rain", label: "이슬비" },
  { codes: [61, 63, 65, 66, 67, 80, 81, 82], condition: "rain", label: "비" },
  { codes: [71, 73, 75, 77, 85, 86], condition: "snow", label: "눈" },
  { codes: [95, 96, 99], condition: "storm", label: "천둥번개" },
];

function describe(code: number): { condition: SkyCondition; label: string } {
  const match = conditions.find((entry) => entry.codes.includes(code));
  return match ? { condition: match.condition, label: match.label } : { condition: "partly", label: "흐림" };
}

function readCache<T>(key: string, maxAge: number): T | null {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return null;
    const { at, data } = JSON.parse(raw) as { at: number; data: T };
    return Date.now() - at < maxAge ? data : null;
  } catch {
    return null;
  }
}

function writeCache<T>(key: string, data: T): void {
  try {
    window.localStorage.setItem(key, JSON.stringify({ at: Date.now(), data }));
  } catch {
    // The value we already hold still drives this session.
  }
}

/* --- time of day --- */

/** Minutes past midnight at the drawn location, regardless of where the browser is. */
export function localMinutesNow(now: Date, timeZone: string): number {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(now);
  const hour = Number(parts.find((part) => part.type === "hour")?.value ?? 12);
  const minute = Number(parts.find((part) => part.type === "minute")?.value ?? 0);
  return hour * 60 + minute;
}

function minutesFromIso(isoLocalTime: string): number {
  const [hour, minute] = isoLocalTime.slice(11, 16).split(":").map(Number);
  return hour * 60 + minute;
}

/**
 * Where the sun (or moon) sits on its arc: 0 at rise, 1 at set. Daylight runs
 * sunrise to sunset; the night leg wraps around midnight.
 */
export function arcProgress(minutes: number, sunriseMinutes: number, sunsetMinutes: number): { t: number; body: "sun" | "moon" } {
  const isDay = minutes >= sunriseMinutes && minutes <= sunsetMinutes;
  if (isDay) {
    const daylight = Math.max(1, sunsetMinutes - sunriseMinutes);
    return { t: (minutes - sunriseMinutes) / daylight, body: "sun" };
  }
  const darkness = Math.max(1, 1440 - (sunsetMinutes - sunriseMinutes));
  const elapsed = minutes > sunsetMinutes ? minutes - sunsetMinutes : minutes + 1440 - sunsetMinutes;
  return { t: elapsed / darkness, body: "moon" };
}

/**
 * Dawn and dusk are the ~50 minutes around sunrise and sunset, so the desktop
 * gets a warm sky twice a day instead of flipping straight between day and night.
 */
export function phaseFor(minutes: number, sunriseMinutes: number, sunsetMinutes: number): SkyPhase {
  const window = 50;
  if (Math.abs(minutes - sunriseMinutes) <= window) return "dawn";
  if (Math.abs(minutes - sunsetMinutes) <= window) return "dusk";
  return minutes > sunriseMinutes && minutes < sunsetMinutes ? "day" : "night";
}

export function toSnapshot(data: ForecastResponse, location: SkyLocation, now = new Date()): WeatherSnapshot {
  const { condition, label } = describe(data.current.weather_code);
  const minutes = localMinutesNow(now, location.timeZone);
  const sunrise = minutesFromIso(data.daily.sunrise[0]);
  const sunset = minutesFromIso(data.daily.sunset[0]);
  const phase = phaseFor(minutes, sunrise, sunset);
  return {
    place: location.label,
    temperature: data.current.temperature_2m,
    condition,
    // The API's own day/night flag wins over our clock arithmetic near the edges.
    phase: data.current.is_day === 0 && phase === "day" ? "dusk" : phase,
    label,
    windSpeed: data.current.wind_speed_10m ?? 0,
    sunrise,
    sunset,
    timeZone: location.timeZone,
    live: true,
  };
}

/** Used when the forecast call fails; these hours are close enough for a backdrop. */
function offlineSnapshot(location: SkyLocation, now: Date): WeatherSnapshot {
  return {
    place: location.label,
    temperature: Number.NaN,
    condition: "clear",
    phase: phaseFor(localMinutesNow(now, location.timeZone), 6 * 60 + 20, 18 * 60 + 40),
    label: "날씨 정보 없음",
    windSpeed: 0,
    sunrise: 6 * 60 + 20,
    sunset: 18 * 60 + 40,
    timeZone: location.timeZone,
    live: false,
  };
}

export async function fetchWeather(location: SkyLocation, now = new Date()): Promise<WeatherSnapshot> {
  const key = `${forecastCacheKey}:${location.latitude.toFixed(2)},${location.longitude.toFixed(2)}`;
  const cached = readCache<ForecastResponse>(key, forecastMaxAge);
  if (cached) return toSnapshot(cached, location, now);
  const endpoint =
    `https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}` +
    `&current=temperature_2m,weather_code,is_day,wind_speed_10m&daily=sunrise,sunset&forecast_days=1` +
    `&timezone=${encodeURIComponent(location.timeZone)}`;
  try {
    const response = await fetch(endpoint);
    if (!response.ok) throw new Error(`Forecast responded ${response.status}`);
    const data = (await response.json()) as ForecastResponse;
    writeCache(key, data);
    return toSnapshot(data, location, now);
  } catch {
    return offlineSnapshot(location, now);
  }
}
