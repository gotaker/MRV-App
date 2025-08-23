#!/usr/bin/env sh
set -eu

: "${API_ORIGIN:=http://api:3000}"
: "${SERVER_NAME:=_}"
: "${APP_ROOT:=/usr/share/nginx/html}"

envsubst '$API_ORIGIN $SERVER_NAME $APP_ROOT'   < /etc/nginx/templates/default.conf.template   > /etc/nginx/conf.d/default.conf

echo "[entrypoint] API_ORIGIN=$API_ORIGIN SERVER_NAME=$SERVER_NAME"
