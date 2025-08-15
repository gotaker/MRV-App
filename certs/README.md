# Local TLS Certs for Dev (mkcert)

We use `mkcert` to create a trusted localhost certificate.

## macOS
brew install mkcert nss
mkcert -install
mkcert -cert-file ./certs/localhost.pem -key-file ./certs/localhost-key.pem "localhost" 127.0.0.1 ::1

## Start HTTPS proxy
docker compose -f docker-compose.yml -f docker-compose.https.yml --profile traefik up -d traefik web api

# Browse https://localhost  (Angular) and http://localhost:8080 (Traefik dashboard)
