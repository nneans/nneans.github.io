import { renderAbout } from "./about";
import { renderBackgrounds } from "./backgrounds";
import { appCatalog, type AppId, type AppMetadata } from "./catalog";
import { renderClippyHelp } from "./clippyHelp";
import { renderContact } from "./contact";
import { renderCv } from "./cv";
import {
  renderBlocks,
  renderCopter,
  renderFishy,
  renderGamesLauncher,
  renderMines,
  renderPinball,
  renderSnake,
} from "./games";
import { renderKidPix } from "./kidPix";
import { renderNapster } from "./napster";
import { renderNostalgiaMoments } from "./nostalgiaMoments";
import { renderPopCultureQuiz } from "./popCultureQuiz";
import { renderRecycleBin } from "./recycleBin";
import { renderTimeTravel } from "./timeTravel";
import { renderWelcome } from "./welcome";
import { renderWorkArchive } from "./workArchive";

export interface AppDefinition extends AppMetadata {
  id: AppId;
  singleInstance: boolean;
  render: () => HTMLElement;
}

const renderers: Record<AppId, () => HTMLElement> = {
  welcome: renderWelcome,
  workArchive: renderWorkArchive,
  about: renderAbout,
  contact: renderContact,
  cv: renderCv,
  kidPix: renderKidPix,
  popCultureQuiz: renderPopCultureQuiz,
  clippyHelp: renderClippyHelp,
  games: renderGamesLauncher,
  backgrounds: renderBackgrounds,
  napster: renderNapster,
  nostalgiaMoments: renderNostalgiaMoments,
  timeTravel: renderTimeTravel,
  recycleBin: renderRecycleBin,
  mines: renderMines,
  pinball: renderPinball,
  fishy: renderFishy,
  copter: renderCopter,
  snake: renderSnake,
  blocks: renderBlocks,
};

export const apps = Object.fromEntries(
  (Object.keys(appCatalog) as AppId[]).map((id) => [id, { id, ...appCatalog[id], singleInstance: true, render: renderers[id] }]),
) as Record<AppId, AppDefinition>;

export function getAppDefinition(appId: string): AppDefinition {
  const app = apps[appId as AppId];
  if (!app) throw new Error(`Unknown application: ${appId}`);
  return app;
}
