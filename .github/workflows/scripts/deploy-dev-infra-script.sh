#!/bin/bash
set -e
cd ~/inhu-backend

if [ "$DEPENDENCY_CHANGED" = "true" ]; then
  echo "Dependencies changed. Running atomic npm install..."
  # 1. Create temporary directory for atomic npm install
  NPM_TEMP="npm_temp_$(date +%s)"
  mkdir -p "$NPM_TEMP"
  cp package.json package-lock.json "$NPM_TEMP/"

  # 2. Install dependencies in temporary directory
  cd "$NPM_TEMP"
  npm ci
  cd ..

  # 3. Atomic switch of node_modules
  mv node_modules node_modules_old || true
  mv "$NPM_TEMP/node_modules" ./node_modules

  # 4. Cleanup
  rm -rf "$NPM_TEMP" node_modules_old
fi

if [ "$DB_DOWN_FLAG" = "true" ]; then
    npm run dev-infra:psql:down
    npm run dev-infra:psql:up
    until docker exec inhu-dev-postgres psql -U inhu_admin -d inhu -c "SELECT 1;" >/dev/null 2>&1; do
        sleep 1
    done
    npm run prisma:generate
    npm run seed
fi

if [ "$USER_CHANGED" != "true" ] && [ "$ADMIN_CHANGED" != "true" ] && [ "$BATCH_CHANGED" != "true" ]; then
    pm2 reload inhu-backend-user-dev
    pm2 reload inhu-backend-admin-dev
    # pm2 reload inhu-backend-batch-dev
fi