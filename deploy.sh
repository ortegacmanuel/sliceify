#!/usr/bin/env bash
set -euo pipefail

# Load env vars from file if present (default: .env.deploy)
ENV_FILE="${ENV_FILE:-.env.deploy}"
if [ -f "$ENV_FILE" ]; then
  echo "Loading environment from $ENV_FILE"
  set -a
  . "$ENV_FILE"
  set +a
fi

BRANCH="${BRANCH:-main}"
DEPLOY_HOST="${DEPLOY_HOST:?DEPLOY_HOST is required}"
DEPLOY_USER="${DEPLOY_USER:-root}"
DEPLOY_PATH="${DEPLOY_PATH:?DEPLOY_PATH is required}"

echo "Switching to $BRANCH branch"
git checkout "$BRANCH"

echo "Pulling latest changes"
git pull

echo "Ensuring Node.js version 20.19.0 via nvm (if available)"
# Load nvm if present
if [ -z "${NVM_DIR:-}" ]; then
  if [ -d "$HOME/.nvm" ]; then
    export NVM_DIR="$HOME/.nvm"
  fi
fi
if [ -n "${NVM_DIR:-}" ] && [ -s "$NVM_DIR/nvm.sh" ]; then
  # shellcheck source=/dev/null
  . "$NVM_DIR/nvm.sh"
  nvm install 20.19.0 >/dev/null
  nvm use 20.19.0
else
  echo "nvm not found; skipping Node version switch. Make sure Node >= 20.19 is active."
fi

echo "Installing dependencies"
npm ci

echo "Building the app"
npm run build

echo "Deploying files to server"
if [ -n "${SSH_PORT:-}" ]; then
  scp -P "$SSH_PORT" -r dist/* "${DEPLOY_USER}@${DEPLOY_HOST}:${DEPLOY_PATH}"
else
  scp -r dist/* "${DEPLOY_USER}@${DEPLOY_HOST}:${DEPLOY_PATH}"
fi

echo "Done"


