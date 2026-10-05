# Mingyun Kang — Portfolio

The main page presents Mingyun Kang's research, publications, projects, awards,
education, and contact details in a Windows 95-inspired layout. Select **Enter
Desktop** to open the original MingyunOS '96 experience. The desktop applications
include the Work Archive, About Me, CV, contact details, music, videos, games,
and a photo-based Time Travel archive. **Home** on the desktop taskbar returns
to the main page.

The main-page layout follows the masthead, author sidebar, reading column,
and publication rows in [Thrillcrazyer's academic homepage](https://github.com/Thrillcrazyer/Thrillcrazyer.github.io).
Its fonts, colors, borders, buttons, and icons share the existing desktop's
Windows 95 design tokens.
All sections — About Me, News, Publications, Awards, Projects, Study,
Education, and Experience — sit on one scrolling page. The top navigation
scrolls to a section and highlights the one in view; section URLs such as
`/#/publications` support direct links. Publications show a thumbnail of the
paper's architecture figure. Awards, Projects, and Study follow the Work
Archive's folders (`src/apps/workArchive/folders.ts`); their PDFs stay in the
Work Archive. Home-page content such as news, venues, and figures lives in
`src/config/portfolio.ts` alongside the desktop apps' data.

## Local development

```sh
npm install
npm run dev
```

Run the test suite and production build with:

```sh
npm test
npm run build
```

## HIT counter

The shared HIT counter uses a Cloudflare Worker and D1. See
[`worker/README.md`](worker/README.md) for local development, migrations, and
deployment instructions. Without `VITE_HIT_COUNTER_API_URL`, the interface
falls back to browser-local storage.

## Deployment

The Vite site is built and deployed to GitHub Pages by
`.github/workflows/deploy.yml`. The HIT API is deployed separately to
Cloudflare Workers.
