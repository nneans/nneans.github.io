import { osConfig } from "../../config/os";
import { appShell, element, menuBar } from "../shared/dom";

export function renderWelcome(): HTMLElement {
  const app = appShell("welcome-app");
  const panel = element("section", "welcome-panel sunken");
  const image = element("img");
  image.src = "/icons/start.png";
  image.alt = "";
  image.draggable = false;
  const copy = element("div");
  copy.append(
    element("h1", undefined, `Welcome to ${osConfig.name} ${osConfig.version}`),
    element("p", undefined, "A portfolio desktop where every icon opens a real application."),
    element("p", undefined, "Double-click an icon, drag windows by their title bars, and use Start for system controls."),
  );
  panel.append(image, copy);
  app.append(menuBar(["File", "Tour", "Help"]), panel);
  return app;
}
