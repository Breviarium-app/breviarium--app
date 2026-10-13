SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
APP_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
CORE_DIST="$(cd "$APP_ROOT/../breviarium--core/dist" && pwd)" || exit

cd "$APP_ROOT/node_modules/breviarium/" || exit
rm -r dist || true
ln -s "$CORE_DIST" dist
echo "linked locally breviarium--core library! ✅"