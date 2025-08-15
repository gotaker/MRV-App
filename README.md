# SSL Add-on for MRV Dev Env

This bundle adds HTTPS locally using **Traefik** as a reverse proxy, and includes an optional guide to serve Angular directly over HTTPS.

## Files
- `docker-compose.https.yml` — Compose override defining the Traefik service and routing rules
- `traefik/traefik.yml` & `traefik/dynamic.yml` — Traefik configs (uses the certificate from ./certs)
- `certs/README.md` — how to create trusted certs via mkcert
- `ANGULAR_HTTPS.md` — optional direct-HTTPS for Angular dev server

## Usage
1. Create trusted localhost certs (`certs/README.md`).
2. Start Traefik + apps:
   ```bash
   docker compose -f docker-compose.yml -f docker-compose.https.yml --profile traefik up -d traefik web api
   ```
3. Open **https://localhost** (Angular) and **http://localhost:8080** (Traefik dashboard).

