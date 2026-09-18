import {
  defaultDesktopBackground,
  desktopBackgrounds,
  getDesktopBackground,
  getDesktopMode,
  resetDesktopBackground,
  setDesktopBackground,
  setDesktopMode,
} from "../../os/desktopBackground";
import { appShell, element, menuBar } from "../shared/dom";

export function renderBackgrounds(): HTMLElement {
  const app = appShell("background-app");
  const panel = element("section", "list-panel sunken");
  panel.append(
    element("h1", undefined, "Desktop Backgrounds"),
    element("p", undefined, "Choose a solid 256-color desktop background:"),
  );

  const live = element("button", "classic-button raised background-live");
  live.type = "button";
  live.append(
    element("strong", undefined, "Busan Live ☀"),
    element("small", undefined, "부산의 실제 시간과 날씨를 따라 하늘이 바뀝니다"),
  );
  const colors = element("div", "background-swatches");
  const status = element("footer", "app-status sunken");
  const buttons = new Map<string, HTMLButtonElement>();

  const showSelection = (color: string): void => {
    const isLive = getDesktopMode() === "live";
    live.classList.toggle("sunken", isLive);
    live.classList.toggle("raised", !isLive);
    live.setAttribute("aria-pressed", String(isLive));
    desktopBackgrounds.forEach((background) => {
      const button = buttons.get(background.color);
      const selected = background.color === color;
      button?.classList.toggle("sunken", selected);
      button?.classList.toggle("raised", !selected);
      button?.setAttribute("aria-pressed", String(selected));
    });
    const background = desktopBackgrounds.find((candidate) => candidate.color === color) ?? defaultDesktopBackground;
    status.textContent = isLive ? "Busan Live selected" : `${background.label} selected`;
  };

  desktopBackgrounds.forEach(({ label, color }) => {
    const choice = element("div", "background-choice");
    const button = element("button", "background-swatch raised");
    button.type = "button";
    button.style.backgroundColor = color;
    button.setAttribute("aria-label", label);
    button.title = label;
    button.addEventListener("click", () => {
      setDesktopBackground(color);
      showSelection(color);
    });
    buttons.set(color, button);
    choice.append(button, element("span", undefined, label));
    colors.append(choice);
  });

  live.addEventListener("click", () => {
    setDesktopMode("live");
    showSelection(getDesktopBackground());
  });

  const reset = element("button", "classic-button raised background-reset", "Reset to Classic Teal");
  reset.type = "button";
  reset.addEventListener("click", () => {
    resetDesktopBackground();
    showSelection(defaultDesktopBackground.color);
  });
  panel.append(live, colors, reset);
  app.append(menuBar(["File", "Options", "Help"]), panel, status);
  showSelection(getDesktopBackground());
  return app;
}
