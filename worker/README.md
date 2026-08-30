# MingyunOS HIT API

This Cloudflare Worker stores one HIT per browser UUID in D1.

## Local development

```sh
npm run worker:migrate:local
npm run worker:dev
```

Set `VITE_HIT_COUNTER_API_URL=http://localhost:8787` in `.env.local` when
testing the portfolio against the local Worker.

## First remote deployment

1. Authenticate Wrangler with `npx wrangler login`.
2. Create D1 with `npx wrangler d1 create mingyun-os-hits`.
3. Replace the placeholder `database_id` in `wrangler.jsonc` with the returned ID.
4. Run `npm run worker:migrate:remote`.
5. Run `npm run worker:deploy`.
6. Add the deployed URL to the GitHub repository variable
   `VITE_HIT_COUNTER_API_URL`.

The Worker GitHub workflow is manual because CI also requires repository
secrets named `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID`.
