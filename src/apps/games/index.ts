import { appShell, element, menuBar } from "../shared/dom";

type Cleanup = () => void;

function gameFrame(title: string, instructions: string): { app: HTMLElement; arena: HTMLElement; status: HTMLElement; addCleanup: (cleanup: Cleanup) => void } {
  const app = appShell("game-app");
  const heading = element("div", "game-heading");
  heading.append(element("strong", undefined, title), element("span", undefined, instructions));
  const arena = element("div", "game-arena sunken");
  const status = element("footer", "app-status sunken", "Ready");
  const cleanups: Cleanup[] = [];
  app.addEventListener("app:dispose", () => cleanups.forEach((cleanup) => cleanup()), { once: true });
  app.append(menuBar(["Game", "Options", "Help"]), heading, arena, status);
  return { app, arena, status, addCleanup: (cleanup) => cleanups.push(cleanup) };
}

export function renderGamesLauncher(): HTMLElement {
  const app = appShell("games-launcher");
  const panel = element("section", "game-launcher-panel sunken");
  panel.append(element("h1", undefined, "Games"), element("p", undefined, "Choose a game:"));
  [
    ["mines", "Minesweeper", "Avoid ten hidden mines."],
    ["pinball", "Pinball", "Keep the ball above the paddle."],
    ["fishy", "Fishy", "Catch as many fish as you can."],
    ["copter", "Copter", "Hold to climb, release to descend."],
    ["snake", "Snake", "Eat data blocks and keep growing."],
    ["blocks", "Blocks", "Hit the flashing block quickly."],
  ].forEach(([appId, label, description]) => {
    const button = element("button", "game-launcher-item");
    button.type = "button";
    const image = element("img");
    image.src = "/icons/dice.png";
    image.alt = "";
    image.draggable = false;
    const copy = element("span");
    copy.append(element("strong", undefined, label), element("small", undefined, description));
    button.append(image, copy);
    button.addEventListener("dblclick", () => document.dispatchEvent(new CustomEvent("os:open-app", { detail: appId })));
    button.addEventListener("click", () => button.focus());
    button.addEventListener("pointerup", (event) => {
      if (event.pointerType !== "mouse") document.dispatchEvent(new CustomEvent("os:open-app", { detail: appId }));
    });
    button.addEventListener("keydown", (event) => {
      if (event.key === "Enter") document.dispatchEvent(new CustomEvent("os:open-app", { detail: appId }));
    });
    panel.append(button);
  });
  app.append(menuBar(["Game", "View", "High Scores", "Help"]), panel, element("footer", "app-status sunken", "6 game(s) installed"));
  return app;
}

export function renderMines(): HTMLElement {
  const { app, arena, status } = gameFrame("Minesweeper", "Left click reveals · right click flags");
  arena.classList.add("mines-grid");
  const size = 9;
  const mineCount = 10;
  const mines = new Set<number>();
  while (mines.size < mineCount) mines.add(Math.floor(Math.random() * size * size));
  let revealed = 0;
  let over = false;
  const cells: HTMLButtonElement[] = [];

  const nearby = (cellIndex: number): number[] => {
    const x = cellIndex % size;
    const y = Math.floor(cellIndex / size);
    const output: number[] = [];
    for (let dy = -1; dy <= 1; dy += 1) for (let dx = -1; dx <= 1; dx += 1) {
      const nx = x + dx;
      const ny = y + dy;
      if ((dx || dy) && nx >= 0 && nx < size && ny >= 0 && ny < size) output.push(ny * size + nx);
    }
    return output;
  };
  const reveal = (cellIndex: number): void => {
    const cell = cells[cellIndex];
    if (over || cell.disabled || cell.dataset.flagged === "true") return;
    cell.disabled = true;
    cell.classList.add("is-revealed");
    if (mines.has(cellIndex)) {
      cell.textContent = "*";
      over = true;
      status.textContent = "Boom! Game over.";
      mines.forEach((mine) => { cells[mine].textContent = "*"; });
      return;
    }
    revealed += 1;
    const count = nearby(cellIndex).filter((candidate) => mines.has(candidate)).length;
    cell.textContent = count ? String(count) : "";
    if (!count) nearby(cellIndex).forEach(reveal);
    if (revealed === size * size - mineCount) { over = true; status.textContent = "You cleared the field!"; }
    else status.textContent = `${revealed} cleared · ${mineCount} mines`;
  };
  for (let index = 0; index < size * size; index += 1) {
    const cell = element("button", "mine-cell raised");
    cell.type = "button";
    cell.setAttribute("aria-label", `Cell ${index + 1}`);
    cell.addEventListener("click", () => reveal(index));
    cell.addEventListener("contextmenu", (event) => {
      event.preventDefault();
      if (cell.disabled || over) return;
      const flagged = cell.dataset.flagged !== "true";
      cell.dataset.flagged = String(flagged);
      cell.textContent = flagged ? "!" : "";
    });
    cells.push(cell);
    arena.append(cell);
  }
  status.textContent = `${mineCount} mines`;
  return app;
}

export function renderSnake(): HTMLElement {
  const { app, arena, status, addCleanup } = gameFrame("Snake", "Focus the board and use arrow keys");
  arena.classList.add("snake-grid");
  arena.tabIndex = 0;
  const width = 18;
  const height = 12;
  const cells = Array.from({ length: width * height }, () => element("span", "snake-cell"));
  arena.append(...cells);
  let snake = [Math.floor(width * height / 2), Math.floor(width * height / 2) - 1];
  let direction = 1;
  let food = 24;
  let score = 0;
  let timer: number | undefined;
  const render = (): void => {
    cells.forEach((cell) => { cell.className = "snake-cell"; });
    snake.forEach((position) => cells[position]?.classList.add("is-snake"));
    cells[food]?.classList.add("is-food");
  };
  const stop = (message: string): void => {
    if (timer !== undefined) window.clearInterval(timer);
    timer = undefined;
    status.textContent = message;
  };
  const tick = (): void => {
    const head = snake[0];
    const x = head % width;
    if ((direction === 1 && x === width - 1) || (direction === -1 && x === 0)) { stop(`Game over · Score ${score}`); return; }
    const next = head + direction;
    if (next < 0 || next >= width * height || snake.includes(next)) { stop(`Game over · Score ${score}`); return; }
    snake.unshift(next);
    if (next === food) {
      score += 1;
      do food = Math.floor(Math.random() * width * height); while (snake.includes(food));
    } else snake.pop();
    status.textContent = `Score ${score}`;
    render();
  };
  arena.addEventListener("keydown", (event) => {
    const directions: Record<string, number> = { ArrowRight: 1, ArrowLeft: -1, ArrowUp: -width, ArrowDown: width };
    const nextDirection = directions[event.key];
    if (nextDirection !== undefined && nextDirection !== -direction) {
      direction = nextDirection;
      event.preventDefault();
      if (timer === undefined) timer = window.setInterval(tick, 155);
    }
  });
  addCleanup(() => { if (timer !== undefined) window.clearInterval(timer); });
  render();
  status.textContent = "Click the board, then press an arrow key";
  return app;
}

export function renderFishy(): HTMLElement {
  const { app, arena, status, addCleanup } = gameFrame("Fishy", "Catch the moving fish");
  arena.classList.add("fishy-arena");
  const fish = element("button", "fish-target", "><>");
  fish.type = "button";
  fish.setAttribute("aria-label", "Catch fish");
  arena.append(fish);
  let score = 0;
  const move = (): void => {
    fish.style.left = `${8 + Math.random() * 78}%`;
    fish.style.top = `${8 + Math.random() * 72}%`;
  };
  fish.addEventListener("click", () => { score += 1; status.textContent = `Fish caught: ${score}`; move(); });
  const timer = window.setInterval(move, 720);
  addCleanup(() => window.clearInterval(timer));
  move();
  return app;
}

export function renderBlocks(): HTMLElement {
  const { app, arena, status, addCleanup } = gameFrame("Blocks", "Click the flashing block before it moves");
  arena.classList.add("blocks-grid");
  const cells = Array.from({ length: 25 }, (_, index) => {
    const cell = element("button", "block-cell raised");
    cell.type = "button";
    cell.setAttribute("aria-label", `Block ${index + 1}`);
    arena.append(cell);
    return cell;
  });
  let active = 0;
  let score = 0;
  const choose = (): void => {
    cells[active].classList.remove("is-target");
    active = Math.floor(Math.random() * cells.length);
    cells[active].classList.add("is-target");
  };
  cells.forEach((cell, index) => cell.addEventListener("click", () => {
    if (index === active) { score += 1; status.textContent = `Score ${score}`; choose(); }
    else { score = Math.max(0, score - 1); status.textContent = `Miss · Score ${score}`; }
  }));
  const timer = window.setInterval(choose, 900);
  addCleanup(() => window.clearInterval(timer));
  choose();
  return app;
}

export function renderCopter(): HTMLElement {
  const { app, arena, status, addCleanup } = gameFrame("Copter", "Hold mouse or Space to climb");
  arena.classList.add("copter-arena");
  arena.tabIndex = 0;
  const copter = element("span", "copter", "➤");
  const obstacle = element("span", "copter-obstacle");
  arena.append(copter, obstacle);
  let y = 80;
  let velocity = 0;
  let obstacleX = 320;
  let lift = false;
  let score = 0;
  let ended = false;
  const setLift = (value: boolean): void => { lift = value; };
  arena.addEventListener("pointerdown", () => setLift(true));
  arena.addEventListener("pointerup", () => setLift(false));
  arena.addEventListener("pointerleave", () => setLift(false));
  arena.addEventListener("keydown", (event) => { if (event.code === "Space") { setLift(true); event.preventDefault(); } });
  arena.addEventListener("keyup", (event) => { if (event.code === "Space") setLift(false); });
  const timer = window.setInterval(() => {
    if (ended) return;
    velocity += lift ? -0.75 : 0.5;
    velocity = Math.max(-5, Math.min(5, velocity));
    y += velocity;
    obstacleX -= 5;
    if (obstacleX < -24) { obstacleX = arena.clientWidth || 340; score += 1; }
    copter.style.top = `${y}px`;
    obstacle.style.left = `${obstacleX}px`;
    status.textContent = `Distance ${score}`;
    if (y < 0 || y > (arena.clientHeight || 190) - 22 || (obstacleX < 56 && obstacleX > 24 && y > 105)) {
      ended = true;
      status.textContent = `Crashed · Distance ${score}`;
    }
  }, 35);
  addCleanup(() => window.clearInterval(timer));
  return app;
}

export function renderPinball(): HTMLElement {
  const { app, arena, status, addCleanup } = gameFrame("Pinball", "Move paddle with ← and →");
  arena.classList.add("pinball-arena");
  arena.tabIndex = 0;
  const ball = element("span", "pinball-ball");
  const paddle = element("span", "pinball-paddle");
  arena.append(ball, paddle);
  let x = 100;
  let y = 30;
  let vx = 2.7;
  let vy = 2.4;
  let paddleX = 90;
  let score = 0;
  const movePaddle = (delta: number): void => {
    paddleX = Math.max(0, Math.min((arena.clientWidth || 330) - 70, paddleX + delta));
    paddle.style.left = `${paddleX}px`;
  };
  arena.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") movePaddle(-20);
    if (event.key === "ArrowRight") movePaddle(20);
  });
  const timer = window.setInterval(() => {
    const width = arena.clientWidth || 330;
    const height = arena.clientHeight || 210;
    x += vx;
    y += vy;
    if (x <= 0 || x >= width - 14) vx *= -1;
    if (y <= 0) vy = Math.abs(vy);
    if (y >= height - 32 && y <= height - 18 && x >= paddleX - 8 && x <= paddleX + 72) {
      vy = -Math.abs(vy);
      score += 1;
    }
    if (y > height) { x = width / 2; y = 20; vy = 2.4; score = 0; }
    ball.style.transform = `translate(${x}px, ${y}px)`;
    status.textContent = `Score ${score}`;
  }, 24);
  addCleanup(() => window.clearInterval(timer));
  movePaddle(0);
  return app;
}
