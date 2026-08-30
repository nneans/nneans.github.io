import { portfolio } from "../../config/portfolio";
import { appShell, element, externalLink, menuBar } from "../shared/dom";

export function renderAbout(): HTMLElement {
  const app = appShell("notepad-app");
  const documentPanel = element("article", "notepad-document about-document sunken");
  const layout = element("div", "about-layout");
  const profile = element("aside", "about-profile");
  const photoFrame = element("figure", "about-photo-frame raised");
  const photo = element("img");
  photo.src = "/assets/about/mingyun-kang.jpg";
  photo.alt = "Portrait of Mingyun Kang";
  photoFrame.append(photo);

  const education = element("div", "about-education");
  [...portfolio.education].reverse().forEach((item) => {
    const entry = element("section", "about-education__item");
    entry.append(
      element("time", undefined, item.period),
      element("strong", undefined, item.degree),
      element("span", undefined, item.school),
    );
    education.append(entry);
  });
  profile.append(photoFrame, education);

  const copy = element("div", "notepad-copy about-copy");
  portfolio.aboutMe.forEach((paragraph) => {
    const line = element("p");
    const [beforeLab, afterLab] = paragraph.split("BAE LAB");
    if (afterLab === undefined) line.textContent = paragraph;
    else {
      line.append(
        document.createTextNode(beforeLab),
        externalLink("BAE LAB", portfolio.labUrl),
        document.createTextNode(afterLab),
      );
    }
    copy.append(line);
  });
  layout.append(profile, copy);
  documentPanel.append(layout);
  const status = element("footer", "app-status sunken", "Ln 1, Col 1");
  app.append(menuBar(["File", "Edit", "Search", "Help"]), documentPanel, status);
  return app;
}
