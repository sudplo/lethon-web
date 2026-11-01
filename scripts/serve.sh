#!/usr/bin/env bash
# Sirve out/ bajo /lethon-web (como en GitHub Pages) en http://localhost:8080
set -e
rm -rf /tmp/srv && mkdir -p /tmp/srv/lethon-web
cp -r "$(dirname "$0")/../out/." /tmp/srv/lethon-web/
cd /tmp/srv && exec python3 -m http.server 8080 --bind 127.0.0.1
