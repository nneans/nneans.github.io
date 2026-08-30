import { portfolio } from "../../config/portfolio";
import { appShell, element, externalLink, menuBar } from "../shared/dom";

const projectById = (id: string) => {
  const project = portfolio.projects.find((item) => item.id === id);
  if (!project) throw new Error(`Missing CV project: ${id}`);
  return project;
};

const publicationIds = ["pact"];
const presentationIds = ["aspai-pachita"];
const awardIds = [
  "veterans-hospital-analysis",
  "minimum-wage-impact-analysis",
  "wind-power",
  "pressure-index",
  "family-policy",
];

function appendResearchRow(page: HTMLElement, projectId: string): void {
  const project = projectById(projectId);
  const row = element("div", "resume-entry");
  const main = element("div", "resume-entry__main");
  main.append(element("strong", undefined, project.title));
  if (project.authors) main.append(element("span", "resume-entry__authors", project.authors));
  if (project.status) main.append(element("span", "resume-entry__status", project.status));
  row.append(main, element("time", undefined, project.completedAt));
  page.append(row);
}

function appendAwardRow(page: HTMLElement, projectId: string): void {
  const project = projectById(projectId);
  const row = element("div", "resume-entry resume-entry--award");
  const main = element("div", "resume-entry__main");
  const heading = element("div", "resume-entry__heading");
  heading.append(
    element("strong", undefined, project.title),
    element("span", "resume-award-label", project.awardLabel),
  );
  main.append(heading);
  if (project.entryTitle) main.append(element("span", undefined, project.entryTitle));
  row.append(main, element("time", undefined, project.completedAt));
  page.append(row);
}

export function renderCv(): HTMLElement {
  const app = appShell("resume-app");
  const toolbar = element("div", "resume-toolbar");
  const printButton = element("button", "classic-button raised", "Print…");
  printButton.type = "button";
  printButton.addEventListener("click", () => window.print());
  toolbar.append(printButton, element("span", undefined, "CV Preview · Updated 2026.08"));

  const page = element("article", "resume-page sunken");
  page.append(element("h1", undefined, portfolio.name), element("p", "resume-role", portfolio.role));
  const headerContact = element("p", "resume-header-contact");
  headerContact.append(
    document.createTextNode(`${portfolio.location} · `),
    externalLink(portfolio.email, `mailto:${portfolio.email}`),
    document.createTextNode(` · ${portfolio.phone} · `),
    externalLink("github.com/nneans", portfolio.github),
  );
  page.append(headerContact);

  page.append(element("h2", undefined, "Profile"), element("p", undefined, portfolio.about));
  page.append(element("h2", undefined, "Education"));
  portfolio.education.forEach((education) => {
    const row = element("div", "resume-entry");
    const main = element("div", "resume-entry__main");
    main.append(element("strong", undefined, education.degree), element("span", undefined, education.school));
    row.append(main, element("time", undefined, education.period));
    page.append(row);
  });

  page.append(element("h2", undefined, "Publications"));
  publicationIds.forEach((id) => appendResearchRow(page, id));

  page.append(element("h2", undefined, "Conference Presentations"));
  presentationIds.forEach((id) => appendResearchRow(page, id));

  page.append(element("h2", undefined, "Awards"));
  awardIds.forEach((id) => appendAwardRow(page, id));

  app.append(menuBar(["File", "View", "Document", "Help"]), toolbar, page);
  return app;
}
