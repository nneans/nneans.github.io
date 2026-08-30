import { osConfig } from "../config/os";

export interface AppMetadata {
  title: string;
  icon: string;
  defaultWidth: number;
  defaultHeight: number;
  minWidth?: number;
  minHeight?: number;
  desktopLabel?: string;
  showInStartMenu?: boolean;
}

const icon = (name: string): string => `/icons/${name}.png`;

export const appCatalog = {
  welcome: { title: `Welcome to ${osConfig.name}`, icon: icon("start"), defaultWidth: 520, defaultHeight: 330 },
  workArchive: { title: "Work Archive", desktopLabel: "Work Archive", icon: icon("directory"), defaultWidth: 900, defaultHeight: 620, showInStartMenu: true },
  about: { title: "About Me.txt — Notepad", desktopLabel: "About Me", icon: icon("note"), defaultWidth: 580, defaultHeight: 430, showInStartMenu: true },
  contact: { title: "New Message — Contact", desktopLabel: "Contact", icon: icon("mail"), defaultWidth: 520, defaultHeight: 410, showInStartMenu: true },
  cv: { title: "CV.pdf", desktopLabel: "CV.pdf", icon: icon("text"), defaultWidth: 640, defaultHeight: 520, showInStartMenu: true },
  kidPix: { title: "Kid Pix", desktopLabel: "Kid Pix", icon: icon("paint"), defaultWidth: 660, defaultHeight: 520, showInStartMenu: true },
  popCultureQuiz: { title: "Pop Culture Quiz", desktopLabel: "Pop Culture Quiz", icon: icon("help"), defaultWidth: 500, defaultHeight: 390, showInStartMenu: true },
  clippyHelp: { title: `${osConfig.name} Help`, desktopLabel: "Clippy Help", icon: icon("info"), defaultWidth: 500, defaultHeight: 360 },
  games: { title: "Games", desktopLabel: "Games", icon: icon("dice"), defaultWidth: 520, defaultHeight: 430, showInStartMenu: true },
  backgrounds: { title: "Desktop Backgrounds", desktopLabel: "Backgrounds", icon: icon("image"), defaultWidth: 500, defaultHeight: 350, showInStartMenu: true },
  napster: { title: "Napster", desktopLabel: "Napster", icon: icon("music"), defaultWidth: 580, defaultHeight: 550, showInStartMenu: true },
  nostalgiaMoments: { title: "Nostalgia Moments — Media Player", desktopLabel: "Nostalgia Moments", icon: icon("video"), defaultWidth: 720, defaultHeight: 520, showInStartMenu: true },
  timeTravel: { title: "Time Travel — Memory Navigator", desktopLabel: "Time Travel", icon: icon("world"), defaultWidth: 820, defaultHeight: 590, minWidth: 620, minHeight: 460, showInStartMenu: true },
  recycleBin: { title: "Recycle Bin", desktopLabel: "Recycle Bin", icon: icon("trash"), defaultWidth: 540, defaultHeight: 360 },
  mines: { title: "Minesweeper", icon: icon("dice"), defaultWidth: 360, defaultHeight: 420 },
  pinball: { title: "Pinball", icon: icon("dice"), defaultWidth: 430, defaultHeight: 390 },
  fishy: { title: "Fishy", icon: icon("dice"), defaultWidth: 430, defaultHeight: 360 },
  copter: { title: "Copter", icon: icon("dice"), defaultWidth: 450, defaultHeight: 370 },
  snake: { title: "Snake", icon: icon("dice"), defaultWidth: 470, defaultHeight: 400 },
  blocks: { title: "Blocks", icon: icon("dice"), defaultWidth: 400, defaultHeight: 410 },
} as const satisfies Record<string, AppMetadata>;

export type AppId = keyof typeof appCatalog;
export type DesktopAppId = {
  [K in AppId]: (typeof appCatalog)[K] extends { desktopLabel: string } ? K : never;
}[AppId];
