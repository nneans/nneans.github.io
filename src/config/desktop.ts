import { appCatalog, type DesktopAppId } from "../apps/catalog";

export interface DesktopItem {
  id: string;
  label: string;
  icon: string;
  appId: DesktopAppId;
  column: number;
  row: number;
}

interface DesktopPlacement {
  appId: DesktopAppId;
  column: number;
  row: number;
}

const placements: DesktopPlacement[] = [
  { appId: "workArchive", column: 0, row: 0 },
  { appId: "about", column: 0, row: 1 },
  { appId: "cv", column: 0, row: 2 },
  { appId: "contact", column: 0, row: 3 },
  { appId: "kidPix", column: 1, row: 0 },
  { appId: "popCultureQuiz", column: 1, row: 1 },
  { appId: "games", column: 1, row: 2 },
  { appId: "backgrounds", column: 1, row: 3 },
  { appId: "clippyHelp", column: 1, row: 4 },
  { appId: "napster", column: 2, row: 0 },
  { appId: "nostalgiaMoments", column: 2, row: 1 },
  { appId: "timeTravel", column: 2, row: 2 },
  { appId: "recycleBin", column: 2, row: 3 },
];

const toKebabCase = (value: string): string => value.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);

export const desktopItems: DesktopItem[] = placements.map((placement) => {
  const metadata = appCatalog[placement.appId];
  return {
    ...placement,
    id: toKebabCase(placement.appId),
    label: metadata.desktopLabel,
    icon: metadata.icon,
  };
});
