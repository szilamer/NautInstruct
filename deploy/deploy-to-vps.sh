#!/usr/bin/env bash
# NautInstruct kézi deploy a Hetzner VPS-re.
# Használat: ./deploy/deploy-to-vps.sh [VPS_IP]
# Előfeltétel: működő `ssh root@VPS_IP` (kulcs alapú belépés) és Docker a szerveren.
set -euo pipefail

VPS="${1:-23.88.58.202}"
REMOTE_DIR="/root/nautinstruct"
ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"

echo "=== NautInstruct deploy → $VPS ($REMOTE_DIR) ==="

echo "1) Forrás feltöltése (rsync)…"
rsync -avz --delete \
  --exclude node_modules --exclude dist --exclude .git --exclude '*.tsbuildinfo' \
  "$ROOT_DIR/" "root@$VPS:$REMOTE_DIR/"

echo "2) Build + indítás (docker compose)…"
ssh "root@$VPS" "cd $REMOTE_DIR && docker compose up -d --build"

echo "3) Health check…"
sleep 3
ssh "root@$VPS" "curl -sf -o /dev/null -w 'HTTP %{http_code}\n' http://127.0.0.1:8090/ || echo 'nem válaszol'"

echo "=== Kész. Elérés: http://$VPS:8090/ ==="
