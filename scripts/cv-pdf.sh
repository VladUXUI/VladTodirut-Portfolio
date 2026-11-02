#!/bin/sh
# Prints /cv to the downloadable PDF. Needs the site running (pnpm dev or pnpm start).
# Usage: pnpm cv:pdf [url]
set -e

URL="${1:-http://localhost:3000/cv}"
OUT="public/Vlad-Todirut-Senior-Product-Designer-CV.pdf"
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"

"$CHROME" --headless --disable-gpu --no-pdf-header-footer --virtual-time-budget=8000 \
  --print-to-pdf="$OUT" "$URL" 2>/dev/null

echo "Saved $OUT"
