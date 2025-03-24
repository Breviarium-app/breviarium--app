#!/bin/sh

# Define file paths
file="./android/app/build.gradle"
fileIOS="./ios/App/App.xcodeproj/project.pbxproj"

# Get the current version from package.json
VERSION=$(node -p "require('./package.json').version")

# Increment versionCode and versionName - Android
awk '/versionCode/ {match($0, /^[ \t]+/); indent = substr($0, RSTART, RLENGTH); print indent $1, $2 + 1; next}1' "$file" > temp && mv temp "$file"
awk -v ver="$VERSION" '{sub(/versionName "[^"]+"/, "versionName \"" ver "\"")}1' "$file" > temp && mv temp "$file"
echo "Android version updated"

# Increment versionName for iOS
awk -v ver="$VERSION" '{gsub(/CURRENT_PROJECT_VERSION = [0-9]+\.[0-9]+\.[0-9]+;/, "CURRENT_PROJECT_VERSION = " ver ";")}1' $fileIOS > temp && mv temp $fileIOS
echo "iOS version updated"
echo "Version updated: $VERSION"
