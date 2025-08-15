# Optional: Serve Angular dev server over HTTPS directly

1) Ensure you have certs in `./certs` created via mkcert (see certs/README.md).
2) Mount certs into the `web` service in your `docker-compose.yml`:
   ```yaml
   services:
     web:
       volumes:
         - ./apps/web:/usr/src/app
         - web_node_modules:/usr/src/app/node_modules
         - ./certs:/certs:ro
       ports:
         - "4443:4443"
   ```
3) Add a script in `apps/web/package.json`:
   ```json
   { "scripts": { "start:https": "ng serve --host 0.0.0.0 --port 4443 --ssl true --ssl-key /certs/localhost-key.pem --ssl-cert /certs/localhost.pem --proxy-config proxy.conf.json --poll 2000" } }
   ```
4) Run:
   ```bash
   docker compose run --rm -p 4443:4443 web sh -lc "npm run start:https"
   # Browse https://localhost:4443
   ```
