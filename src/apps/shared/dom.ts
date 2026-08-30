export function element<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  className?: string,
  text?: string,
): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

export function appShell(className: string): HTMLElement {
  return element("div", `app-shell ${className}`);
}

export function menuBar(items = ["File", "Edit", "View", "Help"]): HTMLElement {
  const menu = element("nav", "app-menu");
  menu.setAttribute("aria-label", "Application menu");
  items.forEach((item) => menu.append(element("button", "app-menu__item", item)));
  return menu;
}

export function externalLink(label: string, url: string): HTMLAnchorElement {
  const link = element("a", "classic-link", label);
  link.href = url;
  link.target = "_blank";
  link.rel = "noreferrer";
  return link;
}
