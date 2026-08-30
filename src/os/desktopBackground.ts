export interface DesktopBackground {
  label: string;
  color: string;
}

export const desktopBackgrounds: DesktopBackground[] = [
  { label: "Classic Teal", color: "#008080" },
  { label: "Midnight Blue", color: "#000080" },
  { label: "Forest", color: "#006440" },
  { label: "Slate", color: "#5a6170" },
];

export const defaultDesktopBackground = desktopBackgrounds[0];
const storageKey = "mingyun-os:desktop-background";

function isAvailable(color: string | null): color is string {
  return color !== null && desktopBackgrounds.some((background) => background.color === color);
}

function readSavedBackground(): string | null {
  try {
    return window.localStorage.getItem(storageKey);
  } catch {
    return null;
  }
}

export function getDesktopBackground(): string {
  const saved = readSavedBackground();
  return isAvailable(saved) ? saved : defaultDesktopBackground.color;
}

export function initializeDesktopBackground(): void {
  const saved = readSavedBackground();
  if (isAvailable(saved)) document.documentElement.style.setProperty("--desktop-bg", saved);
}

export function setDesktopBackground(color: string): void {
  if (!isAvailable(color)) return;
  document.documentElement.style.setProperty("--desktop-bg", color);
  try {
    window.localStorage.setItem(storageKey, color);
  } catch {
    // The selected background still applies for this session.
  }
}

export function resetDesktopBackground(): void {
  document.documentElement.style.removeProperty("--desktop-bg");
  try {
    window.localStorage.removeItem(storageKey);
  } catch {
    // The default background still applies for this session.
  }
}
