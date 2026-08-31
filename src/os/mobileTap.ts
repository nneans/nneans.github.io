import { osConfig } from "../config/os";

const isMobileViewport = (): boolean => window.innerWidth <= osConfig.mobileBreakpoint;

function activationTarget(root: HTMLElement, target: EventTarget | null): HTMLElement | null {
  if (!(target instanceof Element)) return null;
  const candidate = target.closest<HTMLElement>("button, a[href], video");
  if (!candidate || !root.contains(candidate)) return null;
  if (candidate instanceof HTMLButtonElement && candidate.disabled) return null;
  return candidate;
}

/**
 * Makes mouse-style click handlers reliably respond to one touch on mobile browsers.
 * The native follow-up click is suppressed so toggle buttons do not run twice.
 */
export function installMobileTapActivation(root: HTMLElement): void {
  const touchActivatedTargets = new WeakSet<HTMLElement>();
  let syntheticTouchTarget: HTMLElement | null = null;

  root.addEventListener("pointerup", (event) => {
    if (!isMobileViewport() || event.pointerType === "mouse" || event.defaultPrevented) return;
    const target = activationTarget(root, event.target);
    if (!target) return;

    touchActivatedTargets.add(target);
    syntheticTouchTarget = target;
    event.preventDefault();
    target.click();
    syntheticTouchTarget = null;
  });

  root.addEventListener("click", (event) => {
    if (!isMobileViewport()) return;
    const target = activationTarget(root, event.target);
    if (!target || syntheticTouchTarget === target || !touchActivatedTargets.has(target)) return;
    touchActivatedTargets.delete(target);
    event.preventDefault();
    event.stopImmediatePropagation();
  }, true);
}
