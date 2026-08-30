import { tips } from "../../config/os";
import { appShell, element, menuBar } from "../shared/dom";

export function renderClippyHelp(): HTMLElement {
  const app = appShell("help-app");
  const panel = element("section", "help-panel sunken");
  const buddy = element("div", "assistant-character");
  buddy.setAttribute("aria-hidden", "true");
  buddy.append(element("i"), element("i"));
  const bubble = element("div", "assistant-bubble");
  const copy = element("p", undefined, tips[0]);
  const next = element("button", "classic-button raised", "Next tip →");
  next.type = "button";
  let index = 0;
  const status = element("footer", "app-status sunken", `Tip 1 of ${tips.length}`);
  next.addEventListener("click", () => {
    index = (index + 1) % tips.length;
    copy.textContent = tips[index];
    status.textContent = `Tip ${index + 1} of ${tips.length}`;
  });
  bubble.append(element("strong", undefined, "It looks like you're exploring a portfolio."), copy, next);
  panel.append(buddy, bubble);
  app.append(menuBar(["File", "Topics", "Help"]), panel, status);
  return app;
}
