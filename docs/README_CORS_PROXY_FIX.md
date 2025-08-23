# CORS/Proxy Fix Patch

This patch removes CORS errors in dev by proxying `/api` from the Angular dev server (4200) to your backend (3000).

## Files

- `proxy.conf.json` — proxies `/api` → `http://localhost:3000`, rewrites `/api/kpis` → `/kpis`.
- `src/app/kpis/kpis.service.ts` — calls `'/api/kpis'` (works with the proxy).
- `scripts/apply-proxy.cjs` — injects `--proxy-config proxy.conf.json` into `npm start`.

## Apply

```powershell
Expand-Archive .\mrv-cors-proxy-fix-2025-08-23.zip -DestinationPath . -Force
node scripts\apply-proxy.cjs
```

## Run

```powershell
# start your backend on http://localhost:3000 (or adjust proxy.conf.json)
npm start
# open http://127.0.0.1:4200/
```

## Notes

- If you already use an environment-based API URL, you can keep it but ensure it points to `/api` in dev.
- For Docker, expose the backend service to the dev container network and set target accordingly (e.g. `http://api:3000`). Update `proxy.conf.json` `target` to match.
