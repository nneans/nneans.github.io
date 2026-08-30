import { appShell, element, menuBar } from "../shared/dom";
import {
  timeTravelEntries,
  type TimeTravelCategory,
  type TimeTravelEntry,
  type TimeTravelPhoto,
} from "./entries";

type MemoryFilter = "All" | TimeTravelCategory;

interface GalleryFrame {
  key: string;
  entry: TimeTravelEntry;
  photo: TimeTravelPhoto;
  photoIndex: number;
}

const filters: MemoryFilter[] = ["All", "Travel", "Conference", "Field Trip", "Event"];
const layoutRatios: Record<TimeTravelPhoto["layout"], number> = {
  standard: 4 / 3,
  wide: 16 / 10,
  tall: 3 / 4,
  large: 5 / 4,
};

function thumbnailSrc(source: string): string {
  return source
    .replace("/assets/time-travel/", "/assets/time-travel/thumbs/")
    .replace(/\.(jpe?g|png)$/i, ".webp");
}

export function renderTimeTravel(): HTMLElement {
  const app = appShell("time-travel-app");
  const toolbar = element("div", "time-travel-toolbar raised");
  const archiveLabel = element("strong", "time-travel-year", "MEMORY ARCHIVE");
  const filterGroup = element("div", "time-travel-filters");
  const gallery = element("main", "time-travel-gallery sunken");
  const lightbox = element("div", "time-travel-lightbox");
  const status = element("footer", "app-status sunken");
  let selectedFilter: MemoryFilter = "All";
  let openFrameKey: string | undefined;
  const imageObserver = "IntersectionObserver" in window
    ? new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const image = entry.target as HTMLImageElement;
        const source = image.dataset.src;
        if (source) image.src = source;
        observer.unobserve(image);
      });
    }, { root: gallery, rootMargin: "300px 0px" })
    : undefined;

  lightbox.hidden = true;
  lightbox.setAttribute("role", "dialog");
  lightbox.setAttribute("aria-modal", "true");
  lightbox.setAttribute("aria-label", "Photo viewer");

  function visibleEntries(): TimeTravelEntry[] {
    return selectedFilter === "All"
      ? timeTravelEntries
      : timeTravelEntries.filter((entry) => entry.category === selectedFilter);
  }

  function visibleFrames(): GalleryFrame[] {
    return visibleEntries()
      .flatMap((entry) =>
        entry.photos.map((photo, photoIndex) => ({
          key: `${entry.id}-${photoIndex}`,
          entry,
          photo,
          photoIndex,
        })),
      )
      .sort((a, b) => b.photo.date.localeCompare(a.photo.date));
  }

  function closeLightbox(): void {
    openFrameKey = undefined;
    lightbox.hidden = true;
    lightbox.replaceChildren();
  }

  function openLightbox(frameKey: string): void {
    const frames = visibleFrames();
    const frameIndex = frames.findIndex((frame) => frame.key === frameKey);
    if (frameIndex < 0) return;
    const frame = frames[frameIndex];
    openFrameKey = frame.key;

    const viewer = element("section", "time-travel-viewer raised");
    const titleBar = element("header", "time-travel-viewer__titlebar");
    const title = element("strong", undefined, `Photo Viewer — ${frame.photo.date}`);
    const closeButton = element("button", "time-travel-viewer__close raised", "×");
    closeButton.type = "button";
    closeButton.setAttribute("aria-label", "Close photo viewer");
    closeButton.addEventListener("click", closeLightbox);
    titleBar.append(title, closeButton);

    const photoStage = element("div", "time-travel-viewer__stage sunken");
    const image = element("img");
    image.decoding = "async";
    image.src = frame.photo.src;
    image.alt = frame.photo.alt;
    photoStage.append(image);

    const details = element("div", "time-travel-viewer__details");
    const copy = element("div");
    copy.append(
      element("strong", undefined, frame.photo.title),
      element("p", undefined, `${frame.entry.location}, ${frame.entry.country}`),
      element("p", undefined, frame.photo.description),
    );

    const controls = element("div", "time-travel-viewer__controls");
    const previous = element("button", "classic-button raised", "◀ Previous");
    const counter = element("span", "sunken", `${frameIndex + 1} / ${frames.length}`);
    const next = element("button", "classic-button raised", "Next ▶");
    previous.type = "button";
    next.type = "button";
    previous.setAttribute("aria-label", "Previous photo");
    next.setAttribute("aria-label", "Next photo");
    previous.addEventListener("click", () => openLightbox(frames[(frameIndex - 1 + frames.length) % frames.length].key));
    next.addEventListener("click", () => openLightbox(frames[(frameIndex + 1) % frames.length].key));
    controls.append(previous, counter, next);
    details.append(copy, controls);

    viewer.append(titleBar, photoStage, details);
    lightbox.replaceChildren(viewer);
    lightbox.hidden = false;
    closeButton.focus();
  }

  function renderFilters(): void {
    filterGroup.replaceChildren();
    filters.forEach((filter) => {
      const button = element("button", "classic-button raised", filter);
      button.type = "button";
      button.setAttribute("aria-pressed", String(selectedFilter === filter));
      if (selectedFilter === filter) button.classList.add("is-active");
      button.addEventListener("click", () => {
        selectedFilter = filter;
        closeLightbox();
        renderFilters();
        renderGallery();
      });
      filterGroup.append(button);
    });
  }

  function renderGallery(): void {
    const frames = visibleFrames();
    const years = [...new Set(frames.map((frame) => frame.photo.date.slice(0, 4)))];
    imageObserver?.disconnect();
    gallery.replaceChildren();

    if (!frames.length) {
      const empty = element("section", "time-travel-gallery-empty");
      empty.append(
        element("strong", undefined, "NO PHOTOS FOUND"),
        element("p", undefined, "This section is ready for future memories."),
      );
      gallery.append(empty);
    }

    years.forEach((year) => {
      const section = element("section", "time-travel-year-section");
      const heading = element("h1", "time-travel-year-heading");
      heading.append(
        element("span", undefined, year),
        element("small", undefined, `C:\\MINGYUN\\MEMORIES\\${year}`),
      );
      const grid = element("div", "time-travel-photo-grid");
      const yearFrames = frames.filter((frame) => frame.photo.date.slice(0, 4) === year);

      for (let rowStart = 0; rowStart < yearFrames.length; rowStart += 3) {
        const rowFrames = yearFrames.slice(rowStart, rowStart + 3);
        const row = element("div", "time-travel-photo-row");
        row.dataset.photoCount = String(rowFrames.length);
        if (rowFrames.length < 3) row.classList.add("time-travel-photo-row--incomplete");

        rowFrames.forEach((frame) => {
          const card = element("button", "time-travel-gallery-card raised");
          card.classList.add(`time-travel-gallery-card--${frame.photo.layout ?? "standard"}`);
          card.style.setProperty("--time-travel-photo-ratio", String(layoutRatios[frame.photo.layout]));
          card.type = "button";
          card.dataset.entryId = frame.entry.id;
          card.dataset.frameKey = frame.key;
          card.setAttribute("aria-label", `Open ${frame.photo.title}, ${frame.photo.date}`);
          const image = element("img");
          image.alt = frame.photo.alt;
          image.loading = "lazy";
          image.decoding = "async";
          image.dataset.src = thumbnailSrc(frame.photo.src);
          const applyPhotoRatio = (): void => {
            if (!image.naturalWidth || !image.naturalHeight) return;
            card.style.setProperty("--time-travel-photo-ratio", String(image.naturalWidth / image.naturalHeight));
          };
          image.addEventListener("load", applyPhotoRatio, { once: true });
          if (imageObserver) imageObserver.observe(image);
          else {
            const source = image.dataset.src;
            if (source) image.src = source;
          }
          const overlay = element("span", "time-travel-card-overlay");
          overlay.append(
            element("strong", undefined, frame.photo.date),
            element("span", undefined, frame.photo.title),
            element("small", undefined, `${frame.entry.location} · ${frame.entry.category}`),
          );
          card.append(image, overlay);
          card.addEventListener("click", () => openLightbox(frame.key));
          row.append(card);
        });

        grid.append(row);
      }

      section.append(heading, grid);
      gallery.append(section);
    });

    status.textContent = `${selectedFilter} · ${years.length} ${years.length === 1 ? "year" : "years"} · ${frames.length} ${frames.length === 1 ? "photo" : "photos"}`;
  }

  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) closeLightbox();
  });
  app.addEventListener("app:dispose", () => imageObserver?.disconnect(), { once: true });
  app.addEventListener("keydown", (event) => {
    if (lightbox.hidden || !openFrameKey) return;
    if (event.key === "Escape") closeLightbox();
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      const frames = visibleFrames();
      const currentIndex = frames.findIndex((frame) => frame.key === openFrameKey);
      const direction = event.key === "ArrowLeft" ? -1 : 1;
      openLightbox(frames[(currentIndex + direction + frames.length) % frames.length].key);
    }
  });

  toolbar.append(archiveLabel, filterGroup);
  app.append(
    menuBar(["File", "Years", "View", "Help"]),
    element("p", "time-travel-intro", "Places I went, things I presented, and moments I wanted to keep."),
    toolbar,
    gallery,
    status,
    lightbox,
  );
  renderFilters();
  renderGallery();
  return app;
}
