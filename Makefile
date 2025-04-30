current-dir := $(dir $(abspath $(lastword $(MAKEFILE_LIST))))
SHELL = /bin/sh

help: ## show make targets
	@awk 'BEGIN {FS = ":.*?## "} /[a-zA-Z_-]+:.*?## / {sub("\\\\n",sprintf("\n%22c"," "), $$2);printf " \033[36m%-20s\033[0m  %s\n", $$1, $$2}' $(MAKEFILE_LIST)

install: ## install deps
	@npm i

run: ## build package
	@npm run dev

build: ## build to dist folder
	@npm run build

test: ## execute tests
	@npm run test

local-breviarium: ## link local breviarium
	@./scripts/local-breviarium-link.sh

remote-breviarium: ## link remote (npm) breviarium
	npm i breviarium


android-project: ## install android folder
	@npx cap add android

ios-project: ## install ios folder
	@npx cap add ios

ios-project-update: ## update ios dependencies
	@ionic cap update ios

ios-project-open-ide: ## open ios IDE - xcode
	@npx cap open ios

sync-android: ## sync current data to android folder
	@ionic cap sync android

sync-ios: ## sync current data to ios folder
	@ionic cap sync ios

sync-all: build
	npx cap sync

check-java-version: ## check java version
	@cd deploy && ./check-java-version.sh

build-release-android: check-java-version sync-android ## build release for Android
	cd deploy && ./build-release-android.sh

build-release-ios: sync-ios ## build release for iOS
	cd deploy && ./build-release-ios.sh
