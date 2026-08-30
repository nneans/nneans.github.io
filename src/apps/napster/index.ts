import { appShell, element, menuBar } from "../shared/dom";

const playlistUrl = "https://music.apple.com/kr/playlist/silence/pl.u-XkD0vNBTDK1lNbD";
const embedUrl = "https://embed.music.apple.com/kr/playlist/silence/pl.u-XkD0vNBTDK1lNbD";
const playlistTitle = "Now Playing on MingyunOS";

export function renderNapster(): HTMLElement {
  const app = appShell("napster-app");
  const header = element("div", "napster-header");
  header.append(element("strong", undefined, "N A P S T E R"), element("span", undefined, "MusicShare 1.0"));
  const search = element("div", "napster-search");
  const input = element("input");
  input.value = playlistTitle;
  input.readOnly = true;
  const button = element("button", "classic-button raised", "Open in Apple Music");
  button.type = "button";
  search.append(input, button);
  const table = element("table", "napster-results sunken");
  table.innerHTML = "<thead><tr><th>Playlist</th><th>Service</th><th>Status</th></tr></thead>";
  const body = element("tbody");
  const track = [playlistTitle, "Apple Music", "Streaming"];
  const row = element("tr");
  track.forEach((value) => row.append(element("td", undefined, value)));
  row.classList.add("is-selected");
  body.append(row);
  table.append(body);
  const player = element("iframe", "napster-embed sunken");
  player.src = embedUrl;
  player.title = `${playlistTitle} playlist on Apple Music`;
  player.loading = "lazy";
  player.allow = "autoplay *; encrypted-media *; fullscreen *";
  player.setAttribute("sandbox", "allow-forms allow-popups allow-same-origin allow-scripts allow-top-navigation-by-user-activation");
  button.addEventListener("click", () => window.open(playlistUrl, "_blank", "noopener,noreferrer"));
  app.append(
    menuBar(["File", "Library", "Actions", "Help"]),
    header,
    search,
    table,
    player,
    element("footer", "app-status sunken", `${playlistTitle} · streamed by Apple Music`),
  );
  return app;
}
