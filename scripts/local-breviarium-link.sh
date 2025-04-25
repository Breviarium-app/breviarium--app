cd ./node_modules/breviarium/ || exit
rm -r dist || true
ln -s ../../../breviarium--core/dist/ dist
echo "linked locally breviarium--core library! ✅"