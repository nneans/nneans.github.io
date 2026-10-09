// @vitest-environment happy-dom
import { afterEach, expect, it } from "vitest";
import { portfolio } from "./config/portfolio";
import { createHome, homeSectionId, setActiveSection } from "./home";

afterEach(() => window.history.replaceState(null, "", "/"));

const sectionIds = (home: HTMLElement) =>
  [...home.querySelectorAll<HTMLElement>("[data-home-section]")].map((section) => section.dataset.homeSection);

it("shows every section on one page, each with a matching navigation link", () => {
  const home = createHome();
  const links = [...home.querySelectorAll<HTMLAnchorElement>("[data-home-link]")];
  expect(sectionIds(home)).toEqual(["about", "news", "publications", "awards", "projects", "study", "education", "experience"]);
  expect(links.map((anchor) => anchor.dataset.homeLink)).toEqual(sectionIds(home));
  expect(home.querySelectorAll("[data-home-section][hidden]")).toHaveLength(0);
  links.forEach((anchor) => expect(homeSectionId(anchor.hash)).toBe(anchor.dataset.homeLink));
});

it("marks exactly one navigation link as the current section", () => {
  window.history.replaceState(null, "", "/#/publications");
  const home = createHome();
  expect(home.querySelector("[aria-current]")?.getAttribute("href")).toBe("#/publications");
  setActiveSection(home, "news");
  expect(home.querySelectorAll("[aria-current]")).toHaveLength(1);
  expect(home.querySelector("[aria-current]")?.getAttribute("href")).toBe("#/news");
});

it("treats the brand link and unknown hashes as the top of the page", () => {
  expect(homeSectionId("#home")).toBeNull();
  expect(homeSectionId("#/unknown")).toBeNull();
  expect(homeSectionId("")).toBeNull();
});

it("shows each publication with its architecture figure, newest first", () => {
  const papers = [...createHome().querySelectorAll(".home-paper")];
  const published = portfolio.projects.filter((item) => item.venue);
  expect(papers).toHaveLength(published.length);
  expect(papers.map((paper) => paper.querySelector("h3")?.textContent)).toEqual(
    [...published].sort((a, b) => b.completedAt.localeCompare(a.completedAt)).map((item) => item.title),
  );
  papers.forEach((paper) => {
    expect(paper.querySelector(".home-paper__figure img")?.getAttribute("src")).toMatch(/architecture\.webp$/);
  });
});

it("splits awards, industry projects and study material into separate sections", () => {
  const home = createHome();
  const titlesIn = (id: string) => [...home.querySelectorAll(`#${id} li > strong`)].map((node) => node.textContent);
  expect(titlesIn("study")).toContain("Data-Aware LSTM for Predictive Process Monitoring");
  expect(titlesIn("projects")).not.toContain("Data-Aware LSTM for Predictive Process Monitoring");
  expect(titlesIn("awards")).toContain("풍력 발전량 예측");
  expect(titlesIn("awards").some((title) => title?.startsWith("뽀뽀"))).toBe(false);
  expect(titlesIn("projects")).toEqual([
    "이커머스 리뷰 데이터 자동 수집 및 AI 기반 긍·부정 카테고리 분류 대시보드 구축",
    "AI 동작분석 기반 현장 표준작업지도서 구축",
    "한식 레시피 정량 분석 및 AI 기반 맛 모듈 구조화 기획 프로젝트",
  ]);
  expect(home.querySelector("#projects")?.textContent).toContain("고모텍(주)");
  ["awards", "projects", "study"].forEach((id) => expect(home.querySelectorAll(`#${id} a`)).toHaveLength(0));
  expect(home.querySelectorAll("#news li")).toHaveLength(portfolio.news.length);
});
