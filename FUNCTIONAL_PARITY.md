# RobbyOS ’96 functional reference status

This file records the phase-one reference build before Mingyun-specific customization begins.

## OS shell

- [x] Boot sequence and progress display
- [x] Selectable desktop icons
- [x] Double-click launch and mobile single-tap launch
- [x] Desktop icon dragging
- [x] Drop shortcuts into Recycle Bin and restore them
- [x] Draggable, focusable, overlapping windows
- [x] Minimize, maximize, restore, and close
- [x] Taskbar synchronization and active task toggling
- [x] Start menu with shared application registry
- [x] Live clock
- [x] Did You Know tip dialog and cycling tips
- [x] Sleep/wake debounce
- [x] State-reset restart without reloading the browser
- [x] Classic shutdown screen with restart
- [x] Responsive desktop grid and viewport-sized mobile windows

## Applications

- [x] Welcome
- [x] Selected Work explorer
- [x] About Me Notepad
- [x] What I Do
- [x] Now (2026)
- [x] Contact mail composer
- [x] Résumé/CV window preview
- [x] Kid Pix-style pixel painter
- [x] Multi-question Pop Culture Quiz
- [x] Cycling Clippy-style help assistant using original CSS artwork
- [x] AIMS buddy list and simulated conversation
- [x] Background selector
- [x] Napster-style searchable audio player
- [x] Nostalgia video player
- [x] Recycle Bin with restore action
- [x] Time Travel system-status window

## Games

- [x] Games launcher
- [x] Minesweeper
- [x] Pinball
- [x] Fishy
- [x] Copter
- [x] Snake
- [x] Blocks

## Deliberately excluded

The 1996 → 2026 installer, vortex, and modern-site transition remain excluded, as required by the original scope. The Time Travel application explains this boundary without starting the transition.

## Personalization boundary

The reference shell is enabled through `src/config/os.ts`. Personal identity and project content live in `src/config/portfolio.ts`; desktop labels and positions live in `src/config/desktop.ts`. The next phase can therefore replace the reference brand and applications one by one without rewriting the window manager or system shell.
