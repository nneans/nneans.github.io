import type { SkyCondition, SkyPhase } from "./weather";

export type SaverMode = "starfield" | "flying" | "mystify";

export interface ScreensaverOptions {
  /** Idle time before the saver kicks in. */
  idleMs?: number;
  /** Lets the saver match whatever the desktop sky is currently doing. */
  sky?: () => { phase: SkyPhase; condition: SkyCondition } | null;
  /** The saver stays away while a system overlay (sleep, shutdown) is up. */
  blocked?: () => boolean;
}

/**
 * Picks the classic saver that suits the sky: a starfield at night, Mystify's
 * cold ribbons under bad weather, Flying Windows the rest of the time.
 */
export function modeForSky(phase: SkyPhase, condition: SkyCondition): SaverMode {
  if (condition === "rain" || condition === "storm" || condition === "snow" || condition === "fog") return "mystify";
  if (phase === "night") return "starfield";
  return "flying";
}

interface Star {
  x: number;
  y: number;
  z: number;
}

interface MystifyShape {
  points: { x: number; y: number; dx: number; dy: number }[];
  history: { x: number; y: number }[][];
  hue: number;
}

interface Flyer {
  x: number;
  y: number;
  z: number;
}

const flagColors = ["#ff3b30", "#4cd964", "#2f7fe0", "#ffcc00"];

export function createScreensaver(host: HTMLElement, options: ScreensaverOptions = {}) {
  const idleMs = options.idleMs ?? 3 * 60 * 1000;
  const overlay = document.createElement("div");
  overlay.className = "screensaver";
  overlay.hidden = true;
  const canvas = document.createElement("canvas");
  overlay.append(canvas);
  const context = canvas.getContext("2d");
  host.append(overlay);

  let mode: SaverMode = "starfield";
  let frame = 0;
  let idleTimer = 0;
  let running = false;
  let stars: Star[] = [];
  let flyers: Flyer[] = [];
  let shapes: MystifyShape[] = [];
  let width = 0;
  let height = 0;

  const resize = (): void => {
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    width = overlay.clientWidth;
    height = overlay.clientHeight;
    canvas.width = Math.max(1, Math.round(width * ratio));
    canvas.height = Math.max(1, Math.round(height * ratio));
    context?.setTransform(ratio, 0, 0, ratio, 0, 0);
  };

  const seed = (): void => {
    stars = Array.from({ length: 360 }, () => ({
      x: Math.random() * 2 - 1,
      y: Math.random() * 2 - 1,
      z: Math.random(),
    }));
    flyers = Array.from({ length: 44 }, () => ({
      x: Math.random() * 2 - 1,
      y: Math.random() * 2 - 1,
      z: Math.random(),
    }));
    shapes = [0, 1].map((index) => ({
      hue: index === 0 ? 200 : 320,
      points: Array.from({ length: 4 }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        dx: (Math.random() * 2 - 1) * 2.4,
        dy: (Math.random() * 2 - 1) * 2.4,
      })),
      history: [],
    }));
  };

  const drawStarfield = (): void => {
    if (!context) return;
    context.fillStyle = "#000";
    context.fillRect(0, 0, width, height);
    const centerX = width / 2;
    const centerY = height / 2;
    stars.forEach((star) => {
      star.z -= 0.006;
      if (star.z <= 0.02) {
        star.x = Math.random() * 2 - 1;
        star.y = Math.random() * 2 - 1;
        star.z = 1;
      }
      const x = centerX + (star.x / star.z) * centerX;
      const y = centerY + (star.y / star.z) * centerY;
      if (x < 0 || x > width || y < 0 || y > height) return;
      const size = Math.max(1, (1 - star.z) * 3.4);
      context.fillStyle = `rgba(255,255,255,${(1 - star.z).toFixed(2)})`;
      context.fillRect(x, y, size, size);
    });
  };

  const drawFlyingWindows = (): void => {
    if (!context) return;
    context.fillStyle = "#000";
    context.fillRect(0, 0, width, height);
    const centerX = width / 2;
    const centerY = height / 2;
    flyers.forEach((flyer) => {
      flyer.z -= 0.0042;
      if (flyer.z <= 0.05) {
        flyer.x = Math.random() * 2 - 1;
        flyer.y = Math.random() * 2 - 1;
        flyer.z = 1;
      }
      const x = centerX + (flyer.x / flyer.z) * centerX * 0.9;
      const y = centerY + (flyer.y / flyer.z) * centerY * 0.9;
      const size = (1 - flyer.z) * 46;
      if (size < 2 || x < -size || x > width + size || y < -size || y > height + size) return;
      const pane = size / 2.35;
      const gap = size / 12;
      flagColors.forEach((color, index) => {
        context.fillStyle = color;
        context.fillRect(
          x + (index % 2) * (pane + gap),
          y + Math.floor(index / 2) * (pane + gap),
          pane,
          pane,
        );
      });
    });
  };

  const drawMystify = (): void => {
    if (!context) return;
    // A translucent wash instead of a clear, so the ribbons leave trails.
    context.fillStyle = "rgba(0,0,0,0.12)";
    context.fillRect(0, 0, width, height);
    shapes.forEach((shape) => {
      shape.points.forEach((point) => {
        point.x += point.dx;
        point.y += point.dy;
        if (point.x < 0 || point.x > width) point.dx *= -1;
        if (point.y < 0 || point.y > height) point.dy *= -1;
        point.x = Math.max(0, Math.min(width, point.x));
        point.y = Math.max(0, Math.min(height, point.y));
      });
      shape.history.unshift(shape.points.map((point) => ({ x: point.x, y: point.y })));
      shape.history.length = Math.min(shape.history.length, 12);
      shape.history.forEach((trace, depth) => {
        context.strokeStyle = `hsla(${shape.hue + depth * 7}, 85%, ${62 - depth * 2}%, ${1 - depth / 13})`;
        context.lineWidth = 2;
        context.beginPath();
        trace.forEach((point, index) => {
          if (index === 0) context.moveTo(point.x, point.y);
          else context.lineTo(point.x, point.y);
        });
        context.closePath();
        context.stroke();
      });
    });
  };

  const tick = (): void => {
    if (!running) return;
    if (mode === "starfield") drawStarfield();
    else if (mode === "flying") drawFlyingWindows();
    else drawMystify();
    frame = window.requestAnimationFrame(tick);
  };

  const start = (): void => {
    if (running || options.blocked?.()) return;
    const sky = options.sky?.();
    mode = sky ? modeForSky(sky.phase, sky.condition) : "starfield";
    overlay.dataset.mode = mode;
    overlay.hidden = false;
    running = true;
    resize();
    seed();
    if (context) {
      context.fillStyle = "#000";
      context.fillRect(0, 0, width, height);
    }
    frame = window.requestAnimationFrame(tick);
  };

  const stop = (): void => {
    if (!running) return;
    running = false;
    window.cancelAnimationFrame(frame);
    overlay.hidden = true;
  };

  const scheduleIdle = (): void => {
    window.clearTimeout(idleTimer);
    idleTimer = window.setTimeout(start, idleMs);
  };

  const onActivity = (): void => {
    stop();
    scheduleIdle();
  };

  ["pointerdown", "pointermove", "keydown", "wheel", "touchstart"].forEach((type) => {
    document.addEventListener(type, onActivity, { passive: true });
  });
  window.addEventListener("resize", () => {
    if (running) resize();
  });
  scheduleIdle();

  return { overlay, start, stop, get running() { return running; } };
}
