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