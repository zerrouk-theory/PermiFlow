#!/usr/bin/env bash
set -euo pipefail

APP_URL=${NEXT_PUBLIC_APP_URL:-"http://localhost:3000"}

declare -a routes=(
  "$APP_URL/api/score"
  "$APP_URL/api/bets"
)

for route in "${routes[@]}"; do
  echo "Checking $route"
  http_code=$(curl -s -o /dev/null -w "%{http_code}" "$route")
  if [[ "$http_code" != "200" ]]; then
    echo "Route $route failed with status $http_code"
    exit 1
  fi
done

echo "All endpoints healthy ✔️"
