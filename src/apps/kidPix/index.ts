import { appShell, element, menuBar } from "../shared/dom";

const palette = ["#000000", "#ffffff", "#ff0000", "#ffff00", "#00aa00", "#00ffff", "#0000ff", "#ff00ff"];

export function renderKidPix(): HTMLElement {
  const app = appShell("kidpix-app");
  const toolbar = element("div", "kidpix-toolbar");
  const canvas = element("div", "pixel-canvas sunken");
  canvas.setAttribute("role", "application");
  canvas.setAttribute("aria-label", "Pixel drawing area");
  let color = palette[0];
  let drawing = false;

  palette.forEach((value) => {
    const swatch = element("button", "kidpix-color raised");
    swatch.type = "button";
    swatch.style.background = value;
    swatch.title = value;
    swatch.setAttribute("aria-label", `Use ${value}`);
    swatch.addEventListener("click", () => {
      color = value;
      toolbar.querySelectorAll(".kidpix-color").forEach((candidate) => candidate.classList.remove("sunken"));
      swatch.classList.add("sunken");
    });
    toolbar.append(swatch);
  });

  const erase = element("button", "classic-button raised", "Eraser");
  erase.type = "button";
  erase.addEventListener("click", () => { color = "#ffffff"; });
  const clear = element("button", "classic-button raised", "Clear");
  clear.type = "button";
  toolbar.append(erase, clear);

  const paint = (cell: HTMLElement): void => { cell.style.background = color; };
  for (let index = 0; index < 28 * 18; index += 1) {
    const cell = element("span", "pixel-cell");
    cell.addEventListener("pointerdown", (event) => {
      drawing = true;
      paint(cell);
      event.preventDefault();
    });
    cell.addEventListener("pointerenter", () => { if (drawing) paint(cell); });
    cell.addEventListener("pointermove", () => { if (drawing) paint(cell); });
    cell.addEventListener("pointerup", () => { drawing = false; });
    canvas.append(cell);
  }
  const stopDrawing = (): void => { drawing = false; };
  document.addEventListener("pointerup", stopDrawing);
  app.addEventListener("app:dispose", () => document.removeEventListener("pointerup", stopDrawing), { once: true });
  clear.addEventListener("click", () => canvas.querySelectorAll<HTMLElement>(".pixel-cell").forEach((cell) => { cell.style.background = "#fff"; }));
  app.append(menuBar(["File", "Edit", "Goodies", "Help"]), toolbar, canvas, element("footer", "app-status sunken", "Click and drag to paint"));
  return app;
}
