import {
  arcProgress,
  busan,
  fetchWeather,
  localMinutesNow,
  phaseFor,
  type WeatherSnapshot,
} from "./weather";

const refreshInterval = 10 * 60 * 1000;
const arcInterval = 60 * 1000;
const starCount = 70;

function buildStars(): HTMLElement {
  const stars = document.createElement("div");
  stars.className = "scene__stars";
  for (let index = 0; index < starCount; index += 1) {
    const star = document.createElement("i");
    star.style.left = `${Math.random() * 100}%`;
    star.style.top = `${Math.random() * 62}%`;
    star.style.setProperty("--size", `${Math.random() < 0.18 ? 3 : 2}px`);
    star.style.setProperty("--delay", `${(Math.random() * 6).toFixed(2)}s`);
    star.style.setProperty("--dim", (0.35 + Math.random() * 0.55).toFixed(2));
    stars.append(star);
  }
  return stars;
}

function buildPrecipitation(className: string, count: number): HTMLElement {
  const layer = document.createElement("div");
  layer.className = className;
  for (let index = 0; index < count; index += 1) {
    const drop = document.createElement("i");
    drop.style.left = `${Math.random() * 100}%`;
    drop.style.setProperty("--delay", `${(Math.random() * 1.6).toFixed(2)}s`);
    drop.style.setProperty("--duration", `${(0.5 + Math.random() * 0.6).toFixed(2)}s`);
    drop.style.setProperty("--drift", `${(Math.random() * 40 - 20).toFixed(0)}px`);
    layer.append(drop);
  }
  return layer;
}

export interface DesktopScene {
  element: HTMLElement;
  /** The last painted forecast, or null before the first one lands. */
  readonly snapshot: WeatherSnapshot | null;
  /** Re-fetches the forecast and repaints; also returns the snapshot for the readout. */
  refresh: () => Promise<WeatherSnapshot>;
  stop: () => void;
}

export function createDesktopScene(onUpdate?: (snapshot: WeatherSnapshot) => void): DesktopScene {
  const scene = document.createElement("div");
  scene.className = "desktop-scene";
  scene.setAttribute("aria-hidden", "true");
  scene.dataset.phase = "day";
  scene.dataset.condition = "clear";

  const sky = document.createElement("div");
  sky.className = "scene__sky";
  const body = document.createElement("div");
  body.className = "scene__body";
  const clouds = document.createElement("div");
  clouds.className = "scene__clouds";
  for (let index = 0; index < 5; index += 1) {
    const cloud = document.createElement("i");
    cloud.style.setProperty("--top", `${6 + index * 11}%`);
    cloud.style.setProperty("--scale", (0.7 + Math.random() * 0.8).toFixed(2));
    cloud.style.setProperty("--duration", `${90 + index * 26}s`);
    cloud.style.setProperty("--delay", `${index * -21}s`);
    clouds.append(cloud);
  }
  const drift = document.createElement("div");
  drift.className = "scene__drift";
  const glow = document.createElement("div");
  glow.className = "scene__glow";
  const flash = document.createElement("div");
  flash.className = "scene__flash";
  const fog = document.createElement("div");
  fog.className = "scene__fog";
  const scrim = document.createElement("div");
  scrim.className = "scene__scrim";

  scene.append(
    sky,
    buildStars(),
    glow,
    body,
    clouds,
    buildPrecipitation("scene__rain", 60),
    buildPrecipitation("scene__snow", 44),
    drift,
    fog,
    flash,
    scrim,
  );

  let timer: number | undefined;
  let last: WeatherSnapshot | null = null;

  /**
   * Walks the sun or moon along its arc and keeps the sky phase honest between
   * forecast refreshes, so the desktop changes minute by minute rather than
   * jumping every ten.
   */
  const placeBody = (snapshot: WeatherSnapshot): void => {
    const minutes = localMinutesNow(new Date(), snapshot.timeZone);
    const { t, body } = arcProgress(minutes, snapshot.sunrise, snapshot.sunset);
    scene.dataset.phase = phaseFor(minutes, snapshot.sunrise, snapshot.sunset);
    // At sunrise and sunset one body replaces the other, so cut rather than slide.
    if (body !== lastBody) {
      scene.classList.add("is-teleport");
      window.setTimeout(() => scene.classList.remove("is-teleport"), 60);
      lastBody = body;
    }
    scene.dataset.body = body;
    // East on the left, west on the right, peaking overhead at the halfway point.
    scene.style.setProperty("--body-x", `${(6 + t * 88).toFixed(2)}%`);
    scene.style.setProperty("--body-y", `${(8 + (1 - Math.sin(Math.PI * t)) * 46).toFixed(2)}%`);
  };

  let lastBody = "";

  const paint = (snapshot: WeatherSnapshot): void => {
    last = snapshot;
    scene.dataset.condition = snapshot.condition;
    // The taskbar lives outside the desktop, so snow is announced on the root.
    document.documentElement.dataset.weather = snapshot.condition;

    // Clouds cross faster on windy days; 12km/h is an ordinary breeze.
    const wind = Math.max(0.45, Math.min(2.6, snapshot.windSpeed / 12));
    scene.style.setProperty("--wind", wind.toFixed(2));

    placeBody(snapshot);
    onUpdate?.(snapshot);
  };

  const refresh = async (): Promise<WeatherSnapshot> => {
    const snapshot = await fetchWeather(busan);
    paint(snapshot);
    return snapshot;
  };

  void refresh();
  timer = window.setInterval(() => void refresh(), refreshInterval);
  const arcTimer = window.setInterval(() => {
    if (last) placeBody(last);
  }, arcInterval);
  // A laptop waking from sleep should not sit on a stale midnight sky.
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") void refresh();
  });

  return {
    element: scene,
    get snapshot() {
      return last;
    },
    refresh,
    stop: () => {
      window.clearInterval(timer);
      window.clearInterval(arcTimer);
    },
  };
}
