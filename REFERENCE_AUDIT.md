# RobbyOS ’96 Reference Audit

Audit date: 2026-08-22 (Asia/Seoul)

## Scope and evidence

This audit covers only the 1996 desktop portion of Robby Yeager's portfolio. The implementation is a clean-room recreation: the public page was inspected for visible structure, dimensions, wording, and interaction behavior; no proprietary source, CSS, JavaScript, or artwork is copied into this project.

Evidence used:

- Current public page at `https://robbyyeager.com/`
- Search-indexed page structure and labels
- The supplied implementation brief

The in-app visual browser was unavailable in this session. Exact values marked **observed** were visible in the public page response; values marked **reconstruction** are deliberately chosen Windows 95/98 approximations.

## Desktop

- **Observed:** teal desktop; the current page uses a subtly varied teal field, while this build intentionally uses the flatter Windows 95 `#008080` requested in the brief.
- **Observed:** desktop ends above a fixed 34 px taskbar.
- **Observed:** icons occupy 84 px-wide slots and flow vertically with an 88 px row pitch before starting a new column.
- **Observed:** labels are white, approximately 12 px, with a one-pixel dark text shadow. Selected labels use navy blue.
- **Observed:** desktop items are selectable, draggable, and launch on double click; mobile uses a single tap and a static grid.
- **Reconstruction:** 40 × 40 rendered pixel icons from a locally bundled MIT-licensed icon set. No emoji or proprietary Windows assets are used.

## Taskbar

- **Observed:** fixed to the viewport bottom, 34 px high, gray `#c0c0c0`, with a raised outer bevel.
- **Observed:** Start and task buttons are 26 px high. Tasks are capped near 180 px wide.
- **Observed:** active Start/task buttons use a sunken bevel. The clock is at the far right in a recessed well.
- **Observed:** the reference includes an “Update to 2026” control. It is disabled here through configuration because the requested scope excludes the 2026 transition.
- **Reconstruction:** a small CSS four-pane mark replaces the reference's decorative star and keeps the build free of a modern icon set.

## Windows

- **Observed:** gray `#c0c0c0` surface, very small title controls, compact padding, and a navy-to-blue active title bar on the current reference.
- **Observed:** inactive windows use a gray title bar; windows disappear immediately when minimized and stay represented in the taskbar.
- **Observed:** content often uses a white recessed panel inside the gray shell.
- **Reconstruction:** this build uses a flat navy active title bar, matching the supplied 1996 brief more closely than the current reference gradient.
- **Reconstruction:** a two-pixel outer bevel and one-pixel nested highlights create the classic raised frame without modern blur shadows.
- Windows open with staggered centered offsets, focus on pointer interaction, support minimize/maximize/close, and remain partially visible inside the usable viewport.

## System UI

- **Observed:** black boot screen, large RobbyOS ’96 logo, blue segmented progress bar, subtitle, and “Starting RobbyOS…” status.
- **Observed:** Start menu is about 220 px wide, opens 4 px from the left and immediately above the taskbar, and includes a vertical navy/blue brand strip.
- **Observed:** Start categories mirror desktop apps and include Restart, Sleep, and Shut Down.
- **Observed:** sleep/screen-saver state says “Move the mouse or press a key to wake…”.
- **Observed:** the shutdown screen is black with a restart affordance.
- **Observed:** a “Did you know?” helper cycles tips through “Next tip →”.
- **Reconstruction:** the helper is implemented as a movable OS dialog instead of reproducing the reference's proprietary character illustration.

## Responsive behavior

- **Observed:** the reference switches around 760 px to a static icon grid and disables desktop-style dragging.
- **Reconstruction:** this build uses the same breakpoint intent, fits windows to the viewport, makes icons single-tap launchers, and keeps the taskbar operable at 390 × 844.

## Fidelity guardrails

- No rounded cards, glass, Material icons, modern dashboard layout, heavy gradients, or spring animation.
- Window/menu open and close are immediate; only boot progress and the sleep overlay use restrained motion.
- All desktop entries, apps, system labels, projects, and OS preferences are configuration-driven.
