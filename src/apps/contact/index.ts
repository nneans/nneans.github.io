import { portfolio } from "../../config/portfolio";
import { appShell, element, externalLink, menuBar } from "../shared/dom";

export function renderContact(): HTMLElement {
  const app = appShell("contact-app");
  const form = element("form", "mail-form sunken");
  const contactCard = element("address", "mail-contact-card");
  const appendContact = (label: string, value: string, href: string): void => {
    const row = element("div");
    row.append(element("strong", undefined, `${label}: `), externalLink(value, href));
    contactCard.append(row);
  };
  const emailRow = element("div");
  emailRow.append(element("strong", undefined, "Email: "));
  portfolio.emails.forEach((email, index) => {
    if (index > 0) emailRow.append(document.createTextNode(", "));
    emailRow.append(externalLink(email, `mailto:${email}`));
  });
  contactCard.append(emailRow);
  appendContact("Phone", portfolio.phone, `tel:${portfolio.phoneHref}`);
  appendContact("GitHub", "github.com/nneans", portfolio.github);
  form.append(contactCard);

  const rows: [string, HTMLInputElement | HTMLTextAreaElement][] = [
    ["To:", Object.assign(element("input"), { value: portfolio.email, readOnly: true })],
    ["From:", Object.assign(element("input"), { placeholder: "you@example.com", type: "email" })],
    ["Subject:", Object.assign(element("input"), { value: "Hello from MingyunOS" })],
    ["Message:", Object.assign(element("textarea"), { placeholder: "Write a short message…", rows: 7 })],
  ];
  rows.forEach(([labelText, control]) => {
    const label = element("label", "mail-form__row");
    label.append(element("span", undefined, labelText), control);
    form.append(label);
  });

  const actions = element("div", "mail-form__actions");
  const send = element("button", "classic-button raised", "Send via email");
  send.type = "submit";
  actions.append(send);
  form.append(actions);
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const inputs = form.querySelectorAll<HTMLInputElement>("input");
    const message = form.querySelector<HTMLTextAreaElement>("textarea")?.value ?? "";
    const subject = inputs[2]?.value ?? "Hello from MingyunOS";
    window.location.href = `mailto:${portfolio.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
  });
  app.append(menuBar(["File", "Edit", "Insert", "Help"]), form);
  return app;
}
