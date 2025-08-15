# Local TLS Certs for Dev

We use `mkcert` to create a trusted localhost certificate.

## macOS
brew install mkcert nss
mkcert -install
mkcert -cert-file ./certs/localhost.pem -key-file ./certs/localhost-key.pem "localhost" 127.0.0.1 ::1

## Start proxy + apps
docker compose up -d caddy web api
# open https://localhost
