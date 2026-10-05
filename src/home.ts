import { workArchiveFolders, type WorkArchiveFolder } from "./apps/workArchive/folders";
import { portfolio, type Project } from "./config/portfolio";

const sections = [
  ["about", "About Me", "info"],
  ["news", "News", "note"],
  ["publications", "Publications", "text"],
  ["awards", "Awards", "paint"],
  ["projects", "Projects", "directory"],
  ["study", "Study", "help"],
  ["education", "Education", "start"],
  ["experience", "Experience", "briefcase"],
] as const;

type SectionId = (typeof sections)[number][0];

const newestFirst = (a: Project, b: Project) => b.completedAt.localeCompare(a.completedAt);

/** Projects filed under the given Work Archive folders (and their subfolders), newest first. */
function archived(...folderIds: string[]): Project[] {
  const ids: string[] = [];
  const collect = (folders: WorkArchiveFolder[], inside: boolean) => folders.forEach((folder) => {
    const match = inside || folderIds.includes(folder.id);
    if (match) ids.push(...folder.projectIds);
    collect(folder.folders ?? [], match);
  });
  collect(workArchiveFolders, false);
  return portfolio.projects.filter((item) => ids.includes(item.id)).sort(newestFirst);
}

/** Returns the section a home URL points to, or null for the top of the page. */
export function homeSectionId(hash: string): SectionId | null {
  const requested = hash.replace(/^#\/?/, "");
  return sections.find(([id]) => id === requested)?.[0] ?? null;
}

export function setActiveSection(home: HTMLElement, id: string): void {
  home.querySelectorAll<HTMLAnchorElement>("[data-home-link]").forEach((anchor) => {
    if (anchor.dataset.homeLink === id) anchor.setAttribute("aria-current", "location");
    else anchor.removeAttribute("aria-current");
  });
  const title = sections.find(([sectionId]) => sectionId === id)?.[1];
  const label = home.querySelector(".home-document-label");
  if (label && title) label.textContent = `${portfolio.name} — ${title}`;
}

function el<K extends keyof HTMLElementTagNameMap>(tag: K, className?: string, text?: string): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text) node.textContent = text;
  return node;
}

function link(text: string, href: string, className = ""): HTMLAnchorElement {
  const node = el("a", className, text);
  node.href = href;
  if (/^https?:/.test(href)) {
    node.target = "_blank";
    node.rel = "noopener noreferrer";
  }
  return node;
}

function icon(name: string): HTMLImageElement {
  const image = el("img", "home-icon");
  image.src = `/icons/${name}.png`;
  image.alt = "";
  return image;
}

function section(content: HTMLElement, id: SectionId): HTMLElement {
  const [, title, iconName] = sections.find(([sectionId]) => sectionId === id)!;
  const node = el("section", "home-section");
  node.id = id;
  node.dataset.homeSection = id;
  const heading = el("h2");
  heading.append(icon(iconName), document.createTextNode(title));
  node.append(heading);
  content.append(node);
  return node;
}

/** A one-line list item that starts with an italic date, e.g. "2026.08: text". */
function datedItem(date: string, ...content: (Node | string)[]): HTMLLIElement {
  const item = el("li");
  item.append(el("em", "home-date", date), " ", ...content);
  return item;
}

function authorLine(authors: string): HTMLElement {
  const line = el("p");
  authors.split(portfolio.name).forEach((part, index) => {
    if (index > 0) line.append(el("strong", "", portfolio.name));
    line.append(part);
  });
  return line;
}

function publication(project: Project): HTMLElement {
  const paper = el("article", "home-paper");
  if (project.figure) {
    const figure = el("figure", "home-paper__figure");
    const image = el("img");
    image.src = project.figure.src;
    image.alt = project.figure.alt;
    image.loading = "lazy";
    if (project.venue) figure.append(el("span", "home-paper__venue", project.venue));
    figure.append(image);
    paper.append(figure);
  }
  const copy = el("div", "home-paper__copy");
  copy.append(el("h3", "", project.title));
  if (project.authors) copy.append(authorLine(project.authors));
  if (project.status) copy.append(el("p", "home-paper__status", project.status));
  paper.append(copy);
  return paper;
}

function createSidebar(): HTMLElement {
  const sidebar = el("aside", "home-sidebar");
  const title = el("div", "home-panel-title", "Profile");
  title.prepend(icon("info"));
  const photo = el("img", "home-profile-photo");
  photo.src = "/assets/about/mingyun-kang.jpg";
  photo.alt = portfolio.name;
  const contacts = el("ul", "home-profile-contacts");
  ([
    ["world", document.createTextNode("Busan, Korea")],
    ["mail", link("Email", `mailto:${portfolio.email}`)],
    ["bash", link("GitHub", portfolio.github)],
  ] as const).forEach(([iconName, content]) => {
    const item = el("li");
    item.append(icon(iconName), content);
    contacts.append(item);
  });
  sidebar.append(
    title,
    photo,
    el("p", "home-profile-name", portfolio.name),
    el("p", "home-profile-school", "Pusan National University"),
    el("p", "home-profile-role", "Master's student, Industrial Data Engineering"),
    contacts,
  );
  return sidebar;
}

function createHeader(): HTMLElement {
  const header = el("header", "home-header");
  const inner = el("div", "home-header__inner");
  const brand = link(portfolio.name, "#home", "home-brand");
  brand.prepend(icon("start"));
  const nav = el("nav", "home-nav");
  nav.setAttribute("aria-label", "Sections");
  sections.forEach(([id, title]) => {
    const anchor = link(title, `#/${id}`);
    anchor.dataset.homeLink = id;
    nav.append(anchor);
  });
  const desktop = link("Desktop", "#desktop", "home-desktop-link classic-button raised");
  desktop.prepend(icon("update"));
  inner.append(brand, nav, desktop);
  header.append(inner);
  return header;
}

function createContent(): HTMLElement {
  const content = el("main", "home-content");
  const documentTitle = el("div", "home-panel-title home-document-title");
  documentTitle.append(icon("text"), el("span", "home-document-label"));
  content.append(documentTitle);

  const about = section(content, "about");
  const [beforeLab, afterLab] = portfolio.introduction.split("BAE LAB");
  const introduction = el("p");
  introduction.append(beforeLab, link("BAE LAB", portfolio.labUrl), afterLab);
  const interests = el("ul");
  portfolio.interests.forEach((interest) => interests.append(el("li", "", interest)));
  about.append(
    el("p", "home-greeting", `Hi! 👋 I'm ${portfolio.name}.`),
    introduction,
    el("h3", "home-subheading", "🔬 Research Interests"),
    interests,
  );

  const news = section(content, "news");
  const newsList = el("ul");
  portfolio.news.forEach((item) => newsList.append(datedItem(`${item.date}:`, item.text)));
  news.append(newsList);

  const publications = section(content, "publications");
  portfolio.projects.filter((item) => item.venue).sort(newestFirst)
    .forEach((item) => publications.append(publication(item)));

  const awards = section(content, "awards");
  const awardList = el("ul");
  archived("competitions").filter((item) => item.awardLabel).forEach((item) => {
    const entry: (Node | string)[] = [el("strong", "", item.entryTitle || item.title)];
    if (item.entryTitle) entry.push(", ", el("span", "home-muted", item.title));
    awardList.append(datedItem(item.completedAt, ...entry, " ", el("span", "home-award", item.awardLabel!)));
  });
  awards.append(awardList);

  const projects = section(content, "projects");
  const projectList = el("ul");
  archived("industry-projects").forEach((item) => {
    const entry: (Node | string)[] = [el("strong", "", item.title)];
    if (item.partner) entry.push(", ", el("span", "home-muted", item.partner));
    projectList.append(datedItem(item.period, ...entry));
  });
  projects.append(projectList);

  const study = section(content, "study");
  const studyList = el("ul");
  archived("newcomer-study").forEach((item) => {
    studyList.append(datedItem(item.period, el("strong", "", item.title), " — ", el("span", "home-muted", item.description)));
  });
  study.append(studyList);

  const education = section(content, "education");
  const educationList = el("ul");
  portfolio.education.forEach((item) => {
    const entry = el("li");
    entry.append(el("strong", "", item.degree), `, ${item.school} (${item.period})`);
    if (item.note) {
      const detail = el("ul");
      detail.append(el("li", "", item.note));
      entry.append(detail);
    }
    educationList.append(entry);
  });
  education.append(educationList);

  const experience = section(content, "experience");
  const experienceList = el("ul");
  portfolio.experience.forEach((item) => {
    experienceList.append(datedItem(`${item.period},`, `${item.organization} · ${item.role}`));
  });
  experience.append(experienceList);

  return content;
}

/** Highlights the navigation link of the section currently under the sticky header. */
function trackActiveSection(home: HTMLElement): void {
  let queued = false;
  const update = () => {
    queued = false;
    if (home.hidden) return;
    const frames = [...home.querySelectorAll<HTMLElement>("[data-home-section]")];
    const header = home.querySelector<HTMLElement>(".home-header");
    const line = (header?.offsetHeight ?? 0) + 40;
    const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
    const current = atBottom
      ? frames[frames.length - 1]
      : frames.filter((frame) => frame.getBoundingClientRect().top <= line).pop() ?? frames[0];
    if (current) setActiveSection(home, current.dataset.homeSection!);
  };
  window.addEventListener("scroll", () => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(update);
  }, { passive: true });
}

export function createHome(): HTMLElement {
  const home = el("div", "portfolio-home");
  home.id = "home";
  const layout = el("div", "home-layout");
  layout.append(createSidebar(), createContent());
  home.append(createHeader(), layout, el("footer", "home-footer", `${portfolio.name} · ${portfolio.email}`));
  setActiveSection(home, homeSectionId(window.location.hash) ?? "about");
  trackActiveSection(home);
  return home;
}
