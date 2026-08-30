import { portfolio, type Project, type ProjectPreview } from "../../config/portfolio";
import { osConfig } from "../../config/os";
import { appShell, element, externalLink, menuBar } from "../shared/dom";
import { workArchiveFolders, type WorkArchiveFolder } from "./folders";

const archiveRoot = "C:\\Mingyun\\Work Archive";
const isMobileViewport = (): boolean => window.innerWidth <= osConfig.mobileBreakpoint;

function renderDocumentPreview(
  project: Project,
  preview: Extract<ProjectPreview, { type: "document" }>,
): HTMLElement {
  const viewer = element("section", "archive-document-viewer raised");
  viewer.tabIndex = 0;
  viewer.setAttribute("aria-label", `${project.title} document preview`);

  const toolbar = element("div", "archive-viewer-toolbar");
  const previous = element("button", "classic-button raised", "◀ Previous");
  previous.type = "button";
  const pageStatus = element("span", "archive-viewer-page sunken");
  const next = element("button", "classic-button raised", "Next ▶");
  next.type = "button";
  const expand = element("button", "classic-button raised", "⛶ Larger");
  expand.type = "button";
  const openPdf = externalLink("Open PDF ↗", preview.pdfUrl);
  openPdf.classList.add("classic-button", "raised", "archive-viewer-open");
  toolbar.append(previous, pageStatus, next, expand, openPdf);
  project.links
    .filter((link) => link.url !== preview.pdfUrl)
    .forEach((link) => {
      const anchor = externalLink(`${link.label} ${link.download ? "↓" : "↗"}`, link.url);
      anchor.classList.add("classic-button", "raised", "archive-viewer-open");
      if (link.download) {
        anchor.download = link.download;
        anchor.removeAttribute("target");
        anchor.removeAttribute("rel");
      }
      toolbar.append(anchor);
    });

  const stage = element("div", "archive-viewer-stage sunken");
  const image = element("img", "archive-viewer-image");
  image.draggable = false;
  stage.append(image);
  viewer.append(toolbar, stage);

  let pageIndex = 0;
  const updatePage = (): void => {
    const pageNumber = pageIndex + 1;
    image.src = `${preview.pageBaseUrl}/page-${String(pageNumber).padStart(3, "0")}.webp`;
    image.alt = `${project.title}, page ${pageNumber} of ${preview.pageCount}`;
    pageStatus.textContent = `${pageNumber} / ${preview.pageCount}`;
    previous.disabled = pageIndex === 0;
    next.disabled = pageIndex === preview.pageCount - 1;
  };

  const showPrevious = (): void => {
    if (pageIndex === 0) return;
    pageIndex -= 1;
    updatePage();
  };

  const showNext = (): void => {
    if (pageIndex >= preview.pageCount - 1) return;
    pageIndex += 1;
    updatePage();
  };

  previous.addEventListener("click", showPrevious);
  next.addEventListener("click", showNext);
  viewer.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") showPrevious();
    if (event.key === "ArrowRight") showNext();
  });
  expand.addEventListener("click", () => {
    if (document.fullscreenElement === viewer) {
      void document.exitFullscreen();
      return;
    }
    if (viewer.requestFullscreen) {
      void viewer.requestFullscreen().catch(() => window.open(preview.pdfUrl, "_blank", "noopener"));
      return;
    }
    window.open(preview.pdfUrl, "_blank", "noopener");
  });
  viewer.addEventListener("fullscreenchange", () => {
    expand.textContent = document.fullscreenElement === viewer ? "↙ Restore" : "⛶ Larger";
  });

  updatePage();
  return viewer;
}

function renderVideoPreview(
  project: Project,
  preview: Extract<ProjectPreview, { type: "video" }>,
): HTMLElement {
  const viewer = element("section", "archive-document-viewer archive-video-viewer raised");
  const toolbar = element("div", "archive-viewer-toolbar");
  const expand = element("button", "classic-button raised", "⛶ Larger");
  expand.type = "button";
  toolbar.append(element("strong", undefined, "Video Preview"), expand);

  const stage = element("div", "archive-viewer-stage sunken");
  const video = element("video", "archive-viewer-video");
  video.src = preview.url;
  video.controls = true;
  video.playsInline = true;
  video.preload = "metadata";
  if (preview.poster) video.poster = preview.poster;
  video.setAttribute("aria-label", `${project.title} video preview`);
  stage.append(video);
  viewer.append(toolbar, stage);

  expand.addEventListener("click", () => {
    if (document.fullscreenElement === viewer) {
      void document.exitFullscreen();
    } else if (viewer.requestFullscreen) {
      void viewer.requestFullscreen();
    }
  });
  return viewer;
}

function renderProjectPreview(project: Project): HTMLElement | null {
  if (!project.preview) return null;
  return project.preview.type === "document"
    ? renderDocumentPreview(project, project.preview)
    : renderVideoPreview(project, project.preview);
}

function renderProjectDetails(project: Project): HTMLElement {
  const details = element("article", "project-details");
  const title = element("h2", undefined, project.title);
  const completedAt = element("p", "project-details__meta");
  completedAt.append(document.createTextNode(project.completedAt));
  if (project.entryTitle) {
    completedAt.append(element("span", "project-entry-title", `| ${project.entryTitle}`));
  }
  if (project.awardLabel) {
    completedAt.append(element("span", "project-award-label", project.awardLabel));
  }
  const description = element("p", undefined, project.description);
  const stack = element("p", "project-details__stack", `Tools: ${project.stack.join(" · ")}`);
  details.append(title, completedAt, description);
  if (project.authors) {
    const authors = element("p", "project-details__authors");
    authors.append(element("strong", undefined, "Authors: "), document.createTextNode(project.authors));
    details.append(authors);
  }
  if (project.status) {
    details.append(element("p", "project-details__status", project.status));
  }
  details.append(stack);
  const previewPdfUrl = project.preview?.type === "document" ? project.preview.pdfUrl : null;
  const detailLinks = previewPdfUrl ? [] : project.links;
  if (detailLinks.length) {
    const links = element("div", "project-details__links");
    detailLinks.forEach((link) => {
      const anchor = externalLink(`${link.label} ${link.download ? "↓" : "↗"}`, link.url);
      if (link.download) {
        anchor.download = link.download;
        anchor.removeAttribute("target");
        anchor.removeAttribute("rel");
      }
      links.append(anchor);
    });
    details.append(links);
  }
  const mediaPreview = renderProjectPreview(project);
  if (mediaPreview) details.append(mediaPreview);
  return details;
}

export function renderWorkArchive(): HTMLElement {
  const app = appShell("explorer-app");
  const toolbar = element("div", "explorer-toolbar");
  const upButton = element("button", "explorer-up", "↑ Up");
  upButton.type = "button";
  upButton.disabled = true;
  const address = element("div", "explorer-address sunken", archiveRoot);
  toolbar.append(upButton, element("span", undefined, "Address"), address);

  const content = element("div", "explorer-content");
  const folders = element("div", "project-folders sunken");
  folders.setAttribute("role", "listbox");
  folders.setAttribute("aria-label", "Work Archive contents");
  const preview = element("div", "project-preview sunken");
  const status = element("footer", "app-status sunken");
  let folderPath: WorkArchiveFolder[] = [];

  const replacePreview = (content: HTMLElement): void => {
    preview.replaceChildren(content);
    preview.scrollTop = 0;
  };

  const setSelection = (button: HTMLButtonElement): void => {
    folders.querySelectorAll("button").forEach((candidate) => candidate.setAttribute("aria-selected", "false"));
    button.setAttribute("aria-selected", "true");
  };

  const selectProject = (project: Project, button: HTMLButtonElement): void => {
    setSelection(button);
    replacePreview(renderProjectDetails(project));
  };

  const createArchiveButton = (label: string): HTMLButtonElement => {
    const button = element("button", "project-folder");
    button.type = "button";
    button.setAttribute("role", "option");
    button.setAttribute("aria-selected", "false");
    const image = element("img");
    image.src = "/icons/directory.png";
    image.alt = "";
    image.draggable = false;
    button.append(image, element("span", undefined, label));
    return button;
  };

  const connectFolderButton = (
    button: HTMLButtonElement,
    select: () => void,
    open: () => void,
  ): void => {
    button.addEventListener("click", () => {
      if (!isMobileViewport()) {
        select();
        return;
      }
      open();
    });
    button.addEventListener("dblclick", open);
  };

  const projectsFor = (folder: WorkArchiveFolder): Project[] =>
    folder.projectIds
      .map((id) => portfolio.projects.find((project) => project.id === id))
      .filter((project): project is NonNullable<typeof project> => project !== undefined)
      .sort((a, b) => {
        const byDate = b.completedAt.localeCompare(a.completedAt);
        return byDate || folder.projectIds.indexOf(a.id) - folder.projectIds.indexOf(b.id);
      });

  const projectsInTree = (folder: WorkArchiveFolder): Project[] => [
    ...projectsFor(folder),
    ...(folder.folders ?? []).flatMap(projectsInTree),
  ];

  const renderProjectList = (projects: Project[]): HTMLUListElement => {
    const list = element("ul", "folder-content-list");
    projects.forEach((project) => {
      const item = element("li");
      item.append(element("span", "folder-content-date", project.completedAt));
      item.append(element("span", "folder-content-title", project.title));
      if (project.awardLabel) {
        item.append(element("span", "project-award-label", project.awardLabel));
      }
      list.append(item);
    });
    return list;
  };

  const renderFolderSummary = (folder: WorkArchiveFolder): HTMLElement => {
    const details = element("article", "project-details folder-details");
    const childFolders = folder.folders ?? [];
    const allProjects = projectsInTree(folder);
    const folderCount = childFolders.length;
    const fileCount = allProjects.length;
    const countParts = [
      folderCount ? `${folderCount} folder${folderCount === 1 ? "" : "s"}` : "",
      `${fileCount} file${fileCount === 1 ? "" : "s"}`,
    ].filter(Boolean);

    details.append(
      element("h2", undefined, folder.label),
      element("p", "project-details__meta", countParts.join(" · ")),
      element("p", "folder-details__description", folder.description),
      element("h3", undefined, "Contents"),
    );

    const contents = element("div", "folder-content-preview");
    childFolders.forEach((childFolder) => {
      const group = element("section", "folder-content-group folder-content-group--folder");
      group.dataset.contentType = "folder";
      const childProjects = projectsInTree(childFolder);
      const heading = element("div", "folder-content-heading");
      heading.append(
        element("strong", undefined, `📁 ${childFolder.label}`),
        element("span", undefined, `${childProjects.length} file${childProjects.length === 1 ? "" : "s"}`),
      );
      group.append(heading, renderProjectList(childProjects));
      contents.append(group);
    });
    const directProjects = projectsFor(folder);
    if (directProjects.length) {
      const group = element("section", "folder-content-group folder-content-group--files");
      group.dataset.contentType = "files";
      const heading = element("div", "folder-content-heading");
      heading.append(
        element("strong", undefined, "▤ Files"),
        element("span", undefined, `${directProjects.length} file${directProjects.length === 1 ? "" : "s"}`),
      );
      group.append(heading, renderProjectList(directProjects));
      contents.append(group);
    }
    if (!childFolders.length && !directProjects.length) {
      contents.append(element("p", "explorer-empty", "This folder is empty."));
    }
    details.append(contents);
    return details;
  };

  function renderRoot(): void {
    folderPath = [];
    folders.replaceChildren();
    address.textContent = archiveRoot;
    upButton.disabled = true;

    workArchiveFolders.forEach((folder, index) => {
      const button = createArchiveButton(folder.label);
      button.dataset.folderId = folder.id;
      button.setAttribute("aria-selected", String(index === 0));
      const openFolder = (): void => {
        folderPath = [folder];
        renderFolder(folder);
      };
      connectFolderButton(button, () => {
        setSelection(button);
        replacePreview(renderFolderSummary(folder));
      }, openFolder);
      folders.append(button);
    });

    const firstFolder = workArchiveFolders[0];
    replacePreview(
      firstFolder
        ? renderFolderSummary(firstFolder)
        : element("p", "explorer-empty", "This folder is empty."),
    );
    status.textContent = `${workArchiveFolders.length} object(s)`;
  }

  function renderFolder(folder: WorkArchiveFolder): void {
    const childFolders = folder.folders ?? [];
    const projects = projectsFor(folder);
    folders.replaceChildren();
    address.textContent = `${archiveRoot}\\${folderPath.map((part) => part.label).join("\\")}`;
    upButton.disabled = false;

    childFolders.forEach((childFolder, index) => {
      const button = createArchiveButton(childFolder.label);
      button.dataset.folderId = childFolder.id;
      button.setAttribute("aria-selected", String(index === 0));
      const openFolder = (): void => {
        folderPath.push(childFolder);
        renderFolder(childFolder);
      };
      connectFolderButton(button, () => {
        setSelection(button);
        replacePreview(renderFolderSummary(childFolder));
      }, openFolder);
      folders.append(button);
    });

    projects.forEach((project, index) => {
      const button = createArchiveButton(`${project.completedAt} ${project.title}`);
      button.dataset.projectId = project.id;
      button.setAttribute("aria-selected", String(childFolders.length === 0 && index === 0));
      button.addEventListener("click", () => selectProject(project, button));
      button.addEventListener("dblclick", () => selectProject(project, button));
      folders.append(button);
    });

    replacePreview(
      childFolders[0]
        ? renderFolderSummary(childFolders[0])
        : projects[0]
          ? renderProjectDetails(projects[0])
          : renderFolderSummary(folder),
    );
    status.textContent = `${childFolders.length + projects.length} object(s)`;
  }

  upButton.addEventListener("click", () => {
    if (folderPath.length <= 1) {
      renderRoot();
      return;
    }
    folderPath.pop();
    const parentFolder = folderPath.at(-1);
    if (parentFolder) renderFolder(parentFolder);
  });

  content.append(folders, preview);
  app.append(menuBar(["File", "Edit", "View", "Tools", "Help"]), toolbar, content, status);
  renderRoot();
  return app;
}
