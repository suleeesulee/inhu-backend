#!/bin/bash
set -e

SERVICE_NAME=$1
TAR_FILE=deploy-$SERVICE_NAME.tar.gz
TARGET_DIR="dist/apps/$SERVICE_NAME-server"

cd ~/inhu-backend

# 1. Create temporary directory for atomic deployment
DEPLOY_TEMP="deploy_temp_${SERVICE_NAME}_$(date +%s)"
mkdir -p "$DEPLOY_TEMP"

# 2. Extract files to temporary directory
tar -xzf "$TAR_FILE" -C "$DEPLOY_TEMP" --strip-components=1
rm "$TAR_FILE"

# 3. Atomic switch of the service dist directory
mkdir -p "$(dirname "$TARGET_DIR")"
mv "$TARGET_DIR" "${TARGET_DIR}_old" || true
mv "$DEPLOY_TEMP" "$TARGET_DIR"

# 4. Reload PM2 (now points to new files)
pm2 reload "inhu-backend-$SERVICE_NAME-dev"

# 5. Cleanup
rm -rf "${TARGET_DIR}_old"
