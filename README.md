# MingyunOS '96

Mingyun Kang's Windows 95-inspired portfolio. The desktop applications include
the Work Archive, About Me, CV, contact details, music, videos, games, and a
photo-based Time Travel archive.

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
