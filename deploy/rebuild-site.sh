#!/usr/bin/env bash
# Пересобирает сайт NewEra с актуальными товарами из админки.
# Запускать на сервере после изменений в админке или после git pull: bash ~/newera/deploy/rebuild-site.sh
set -euo pipefail
cd ~/newera
sudo docker run --rm -u "$(id -u):$(id -g)" \
  --network newera_internal \
  -e HOME=/tmp -e COREPACK_ENABLE_DOWNLOAD_PROMPT=0 \
  -e PRODUCTS_API_URL=http://newera-backend:8000 \
  -e NEXT_PUBLIC_SITE_URL=https://mynewerastore.ru \
  -v "$PWD/frontend:/app" -w /app node:22-alpine \
  sh -c "corepack pnpm install --frozen-lockfile && rm -rf .next/cache && corepack pnpm build"
echo "Товаров на сайте: $(ls frontend/out/products/*.html 2>/dev/null | wc -l)"
grep -o '/media/[^"]*' frontend/out/index.html | head -3 || true
sudo docker compose -f ~/newera/deploy/docker-compose.yml restart newera-web
