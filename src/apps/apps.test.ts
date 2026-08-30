// @vitest-environment happy-dom
import { afterEach, describe, expect, it } from "vitest";
import { desktopItems } from "../config/desktop";
import { appCatalog } from "./catalog";
import { apps } from "./registry";
import { renderBackgrounds } from "./backgrounds";
import { renderAbout } from "./about";
import { renderClippyHelp } from "./clippyHelp";
import { renderCv } from "./cv";
import { renderKidPix } from "./kidPix";
import { renderNostalgiaMoments } from "./nostalgiaMoments";
import { renderPopCultureQuiz } from "./popCultureQuiz";
import { renderTimeTravel } from "./timeTravel";
import { renderWorkArchive } from "./workArchive";

const testStorageData = new Map<string, string>();
const testStorage: Storage = {
  get length() {
    return testStorageData.size;
  },
  clear: () => testStorageData.clear(),
  getItem: (key) => testStorageData.get(key) ?? null,
  key: (index) => [...testStorageData.keys()][index] ?? null,
  removeItem: (key) => testStorageData.delete(key),
  setItem: (key, value) => testStorageData.set(key, String(value)),
};
Object.defineProperty(window, "localStorage", { configurable: true, value: testStorage });

afterEach(() => {
  document.body.replaceChildren();
  document.documentElement.style.removeProperty("--desktop-bg");
  window.localStorage.clear();
});

describe("interactive application registry", () => {
  it("maps every desktop item to the matching app catalog entry", () => {
    expect(new Set(desktopItems.map((item) => item.appId)).size).toBe(desktopItems.length);
    desktopItems.forEach((item) => {
      const metadata = appCatalog[item.appId];
      expect(apps[item.appId]).toBeDefined();
      expect(item.label).toBe(metadata.desktopLabel);
      expect(item.icon).toBe(metadata.icon);
    });
  });

  it("renders every registered application without an exception", () => {
    const rendered = Object.values(apps).map((definition) => definition.render());
    expect(rendered).toHaveLength(20);
    rendered.forEach((app) => app.dispatchEvent(new CustomEvent("app:dispose")));
  });

  it("renders the About Me portrait, education, and introduction", () => {
    const app = renderAbout();
    expect(app.querySelector<HTMLImageElement>(".about-photo-frame img")?.src).toContain(
      "/assets/about/mingyun-kang.jpg",
    );
    expect([...app.querySelectorAll(".about-education__item time")].map((item) => item.textContent)).toEqual([
      "2022.03–2026.08",
      "2026.08–Present",
    ]);
    expect(app.querySelector(".about-copy")?.textContent).toContain("HI👋👋, I'm Mingyun Kang.");
  });

  it("renders the research CV with publications, presentations, and awards", () => {
    const app = renderCv();
    expect([...app.querySelectorAll("h2")].map((heading) => heading.textContent)).toEqual([
      "Profile",
      "Education",
      "Publications",
      "Conference Presentations",
      "Awards",
    ]);
    expect(app.textContent).toContain("Accepted at ICICIC 2026");
    expect(app.textContent).toContain("ASPAI 2026");
    expect(app.textContent).toContain("Best Paper Runner-up Award");
    expect(app.querySelectorAll(".resume-entry--award")).toHaveLength(5);
    expect([...app.querySelectorAll(".resume-award-label")].map((label) => label.textContent)).toEqual([
      "장려상",
      "우수상",
      "장려상",
      "우수상",
      "장려상",
    ]);
  });

  it("paints a Kid Pix cell with the selected color", () => {
    const app = renderKidPix();
    document.body.append(app);
    const red = [...app.querySelectorAll<HTMLButtonElement>(".kidpix-color")].find((button) => button.title === "#ff0000");
    const cell = app.querySelector<HTMLElement>(".pixel-cell");
    red?.click();
    cell?.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true, pointerId: 1 }));
    expect(cell?.style.background).toBe("#ff0000");
    app.dispatchEvent(new CustomEvent("app:dispose"));
  });

  it("scores the first pop-culture answer and advances", () => {
    const app = renderPopCultureQuiz();
    const firstAnswer = app.querySelector<HTMLButtonElement>(".quiz-options button");
    firstAnswer?.click();
    expect(app.querySelector(".quiz-answer")?.textContent).toBe("Correct!");
    const next = [...app.querySelectorAll<HTMLButtonElement>(".quiz-options button")].at(-1);
    next?.click();
    expect(app.querySelector(".quiz-progress")?.textContent).toContain("Question 2");
  });

  it("saves and resets the selected desktop background", () => {
    const app = renderBackgrounds();
    const midnight = [...app.querySelectorAll<HTMLButtonElement>(".background-swatch")].find(
      (button) => button.title === "Midnight Blue",
    );
    midnight?.click();
    expect(document.documentElement.style.getPropertyValue("--desktop-bg")).toBe("#000080");
    expect(midnight?.getAttribute("aria-pressed")).toBe("true");

    app.querySelector<HTMLButtonElement>(".background-reset")?.click();
    expect(document.documentElement.style.getPropertyValue("--desktop-bg")).toBe("");
    expect(app.querySelector(".app-status")?.textContent).toContain("Classic Teal");
  });

  it("cycles through Clippy help tips", () => {
    const app = renderClippyHelp();
    expect(app.querySelector(".app-status")?.textContent).toBe("Tip 1 of 6");
    app.querySelector<HTMLButtonElement>(".assistant-bubble button")?.click();
    expect(app.querySelector(".app-status")?.textContent).toBe("Tip 2 of 6");
    expect(app.querySelector(".assistant-bubble p")?.textContent).toContain("Double-click");
  });

  it("renders the retro Nostalgia video playlist and controls", () => {
    const app = renderNostalgiaMoments();
    expect(app.querySelectorAll(".nostalgia-list-item")).toHaveLength(2);
    expect(app.querySelector(".nostalgia-now-playing")?.textContent).toContain("살자 제발");
    expect(app.querySelector<HTMLVideoElement>("video")?.controls).toBe(false);
    expect(app.querySelector(".app-status")?.textContent).toContain("1 of 2");
    app.querySelector<HTMLButtonElement>('[aria-label="Next video"]')?.click();
    expect(app.querySelector(".nostalgia-now-playing")?.textContent).toContain("살자 제발 2");
    expect(app.querySelector(".app-status")?.textContent).toContain("2 of 2");
  });

  it("opens the year-grouped Time Travel photo gallery", () => {
    const app = renderTimeTravel();
    expect([...app.querySelectorAll(".time-travel-year-heading > span")].map((heading) => heading.textContent)).toEqual([
      "2026",
      "2025",
    ]);
    expect(app.querySelectorAll(".time-travel-gallery-card")).toHaveLength(40);
    expect(app.querySelectorAll(".time-travel-gallery-card--wide")).toHaveLength(11);
    expect(app.querySelectorAll(".time-travel-gallery-card--large")).toHaveLength(1);
    expect(app.querySelectorAll(".time-travel-gallery-card--tall")).toHaveLength(26);
    expect(
      [...app.querySelectorAll<HTMLElement>(".time-travel-year-section:first-child .time-travel-photo-row:first-child .time-travel-gallery-card")]
        .map((card) => card.dataset.entryId),
    ).toEqual(["fukuoka-2026", "fukuoka-2026", "fukuoka-2026"]);
    expect(
      [...app.querySelectorAll<HTMLElement>(".time-travel-year-section:first-child .time-travel-photo-row:nth-child(2) .time-travel-gallery-card")]
        .map((card) => card.dataset.entryId),
    ).toEqual(["fukuoka-2026", "fukuoka-2026", "veterans-data-award-2026"]);
    expect(
      [...app.querySelectorAll<HTMLElement>(".time-travel-year-section:first-child .time-travel-photo-row:nth-child(3) .time-travel-gallery-card")]
        .map((card) => card.dataset.entryId),
    ).toEqual(["aspai-2026", "aspai-2026", "graduation-address-2026"]);
    expect(app.querySelector<HTMLElement>('[data-entry-id="mukho-2026"] .time-travel-card-overlay strong')?.textContent).toBe(
      "2026.01.30",
    );
    expect(app.querySelector<HTMLButtonElement>('[data-entry-id="sports-day-2026"]')?.textContent).toContain(
      "2026.05.08",
    );
    expect(
      app.querySelector<HTMLElement>('[data-entry-id="hyukjun-birthday-2026"] .time-travel-card-overlay span')
        ?.textContent,
    ).toBe("Hyukjun's Birthday Party");

    app.querySelector<HTMLButtonElement>('[data-entry-id="mukho-2026"]')?.click();
    expect(app.querySelector(".time-travel-lightbox")?.hasAttribute("hidden")).toBe(false);
    expect(app.querySelector(".time-travel-viewer__titlebar")?.textContent).toContain("2026.01.30");
    expect(app.querySelector<HTMLImageElement>(".time-travel-viewer__stage img")?.src).toContain(
      "2026-01-30-mukho.jpg",
    );
    app.querySelector<HTMLButtonElement>('[aria-label="Next photo"]')?.click();
    expect(app.querySelector<HTMLImageElement>(".time-travel-viewer__stage img")?.src).toContain(
      "seongju.jpg",
    );
    app.querySelector<HTMLButtonElement>('[aria-label="Close photo viewer"]')?.click();
    expect(app.querySelector(".time-travel-lightbox")?.hasAttribute("hidden")).toBe(true);
  });

  it("opens Work Archive folders in the configured order", () => {
    const app = renderWorkArchive();
    const labels = [...app.querySelectorAll(".project-folder span")].map((label) => label.textContent);
    expect(labels).toEqual([
      "Publications",
      "Presentations",
      "Competitions",
      "Industry Projects",
      "Side Projects",
    ]);
    expect(app.querySelector(".folder-content-date")?.textContent).toBe("2026.07");
    expect(app.querySelector(".folder-content-title")?.textContent).toContain("PaCT");

    const publications = [...app.querySelectorAll<HTMLButtonElement>(".project-folder")].find(
      (button) => button.textContent === "Publications",
    );
    publications?.dispatchEvent(new MouseEvent("dblclick", { bubbles: true }));
    expect(app.querySelector(".project-details__authors")?.textContent).toBe(
      "Authors: Mingyun Kang, Yongjae Lee, Kibeom Park, Hyerim Bae*",
    );
    expect(app.querySelector(".project-details__status")?.textContent).toBe(
      "Accepted at ICICIC 2026",
    );
    app.querySelector<HTMLButtonElement>(".explorer-up")?.click();

    const presentations = [...app.querySelectorAll<HTMLButtonElement>(".project-folder")].find(
      (button) => button.textContent === "Presentations",
    );
    presentations?.click();
    expect(app.querySelectorAll(".folder-content-group")).toHaveLength(2);
    expect(
      [...app.querySelectorAll<HTMLElement>(".folder-content-group")].map((group) => group.dataset.contentType),
    ).toEqual(["folder", "files"]);
    expect(
      [...app.querySelectorAll(".folder-content-heading strong")].map((heading) => heading.textContent),
    ).toEqual(["📁 Newcomer Study", "▤ Files"]);
    presentations?.dispatchEvent(new MouseEvent("dblclick", { bubbles: true }));
    expect(app.querySelector(".explorer-address")?.textContent).toContain("Presentations");
    expect(app.querySelector(".app-status")?.textContent).toBe("2 object(s)");
    expect(
      [...app.querySelectorAll(".project-folder span")].map((item) => item.textContent),
    ).toEqual([
      "Newcomer Study",
      "2026.08 PaCHITA: A Patched Channel-Independent Transformer for Business Process Anomaly Detection",
    ]);
    expect(
      [...app.querySelectorAll(".folder-content-title")].map((item) => item.textContent),
    ).toEqual([
      "Data-Aware LSTM for Predictive Process Monitoring",
      "Time-Series Clustering Study",
    ]);

    app.querySelectorAll<HTMLButtonElement>(".project-folder")[1]?.click();
    expect(app.querySelector(".project-details__status")?.textContent).toContain("ASPAI 2026");
    expect(app.querySelector(".archive-viewer-page")?.textContent).toBe("1 / 28");

    app.querySelector<HTMLButtonElement>(".project-folder")?.dispatchEvent(
      new MouseEvent("dblclick", { bubbles: true }),
    );
    expect(app.querySelector(".explorer-address")?.textContent).toContain("Presentations\\Newcomer Study");
    expect(app.querySelector(".app-status")?.textContent).toBe("2 object(s)");
    expect(app.querySelector(".archive-viewer-page")?.textContent).toBe("1 / 25");
    expect(app.querySelector<HTMLImageElement>(".archive-viewer-image")?.src).toContain("page-001.webp");
    expect(app.querySelector(".project-details__links")).toBeNull();
    app.querySelectorAll<HTMLButtonElement>(".archive-viewer-toolbar button")[1]?.click();
    expect(app.querySelector(".archive-viewer-page")?.textContent).toBe("2 / 25");
    expect(app.querySelector<HTMLImageElement>(".archive-viewer-image")?.src).toContain("page-002.webp");

    app.querySelector<HTMLButtonElement>(".explorer-up")?.click();
    expect(app.querySelector(".explorer-address")?.textContent).toBe("C:\\Mingyun\\Work Archive\\Presentations");
    app.querySelector<HTMLButtonElement>(".explorer-up")?.click();
    expect(app.querySelector(".explorer-address")?.textContent).toBe("C:\\Mingyun\\Work Archive");

    const competitions = [...app.querySelectorAll<HTMLButtonElement>(".project-folder")].find(
      (button) => button.textContent === "Competitions",
    );
    competitions?.click();
    expect(
      [...app.querySelectorAll(".folder-content-title")].slice(0, 2).map((item) => item.textContent),
    ).toEqual([
      "2026년 보훈 공공데이터·AI 활용 아이디어 공모전",
      "KOSSDA 2026 대학생 데이터 시각화 공모전",
    ]);
    expect(
      [...app.querySelectorAll(".folder-content-list .project-award-label")].map((item) => item.textContent),
    ).toEqual(["장려상", "우수상", "장려상", "우수상", "장려상"]);
    competitions?.dispatchEvent(new MouseEvent("dblclick", { bubbles: true }));
    expect(app.querySelector(".project-folder span")?.textContent).toBe(
      "2026.08 2026년 보훈 공공데이터·AI 활용 아이디어 공모전",
    );
    expect(app.querySelector(".project-details__meta")?.textContent).toContain(
      "2026.08| AI 기반 준보훈병원 입지 및 커버리지 분석장려상",
    );
    app.querySelectorAll<HTMLButtonElement>(".project-folder")[1]?.click();
    expect(app.querySelector(".project-details__award")).toBeNull();
    expect(app.querySelector(".project-details__meta .project-award-label")?.textContent).toBe("우수상");
    expect(app.querySelector(".app-status")?.textContent).toBe("6 object(s)");
    app.querySelectorAll<HTMLButtonElement>(".project-folder")[4]?.click();
    expect(
      [...app.querySelectorAll<HTMLAnchorElement>(".archive-viewer-toolbar a")].map((link) => link.textContent),
    ).toEqual(["Open PDF ↗", "GitHub ↗"]);

    app.querySelector<HTMLButtonElement>(".explorer-up")?.click();

    const industryProjects = [...app.querySelectorAll<HTMLButtonElement>(".project-folder")].find(
      (button) => button.textContent === "Industry Projects",
    );
    industryProjects?.dispatchEvent(new MouseEvent("dblclick", { bubbles: true }));
    expect(app.querySelector(".project-folder span")?.textContent).toBe(
      "2026.07 AI 동작분석 기반 현장 표준작업지도서 구축",
    );
    expect(app.querySelector(".archive-viewer-page")?.textContent).toBe("1 / 18");
    expect(app.querySelector(".app-status")?.textContent).toBe("2 object(s)");
  });
});
