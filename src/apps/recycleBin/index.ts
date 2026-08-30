import { recycleStore } from "../../os/recycleStore";
import { appShell, element, menuBar } from "../shared/dom";

const recycledFiles = [
  ["presentation_final_after_final.pptx", "PowerPoint Presentation", "8.7 MB"],
  ["untitled_47.ipynb", "Jupyter Notebook", "642 KB"],
  ["do_not_delete_important.txt", "Text Document", "1 KB"],
];

export function renderRecycleBin(): HTMLElement {
  const app = appShell("recycle-app");
  const address = element("div", "explorer-toolbar");
  address.append(element("span", undefined, "Address"), element("div", "explorer-address sunken", "Recycle Bin"));
  const content = element("div", "recycle-content");
  const status = element("footer", "app-status sunken");
  const render = (): void => {
    const list = element("table", "file-list sunken");
    const head = element("thead");
    const headRow = element("tr");
    ["Name", "Type", "Action"].forEach((label) => headRow.append(element("th", undefined, label)));
    head.append(headRow);
    const body = element("tbody");
    const desktopFiles = recycleStore.getItems();
    const rows = desktopFiles.length
      ? desktopFiles.map((item) => [item.label, "Desktop Shortcut", item.id] as const)
      : recycledFiles.map((file) => [file[0], file[1], ""] as const);
    rows.forEach(([name, type, itemId]) => {
      const row = element("tr");
      const nameCell = element("td", undefined, name);
      const image = element("img");
      image.src = "/icons/text.png";
      image.alt = "";
      image.draggable = false;
      nameCell.prepend(image);
      row.append(nameCell, element("td", undefined, type));
      const action = element("td");
      if (itemId) {
        const restore = element("button", "classic-button raised", "Restore");
        restore.type = "button";
        restore.addEventListener("click", () => recycleStore.restore(itemId));
        action.append(restore);
      } else action.textContent = "Archived";
      row.append(action);
      body.append(row);
    });
    list.append(head, body);
    content.replaceChildren(list);
    status.textContent = `${rows.length} object(s)`;
  };
  const unsubscribe = recycleStore.subscribe(render);
  app.addEventListener("app:dispose", unsubscribe, { once: true });
  app.append(menuBar(["File", "Edit", "View", "Help"]), address, content, status);
  return app;
}
