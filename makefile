SHELL := /bin/bash
.ONESHELL:
.SHELLFLAGS := -euo pipefail -c

ROOT_DIR   := $(CURDIR)
PORTAL_DIR := $(ROOT_DIR)/apps/portal
E2E_DIR    := $(ROOT_DIR)/e2e

APP_URL      := http://localhost:8080
WAIT_TIMEOUT := 120000

.PHONY: setup docker-up docker-down app open headless

setup:
	npm ci
	docker compose up -d
	npm run db-generate
	npm run db-migrate-dev
	npm run db-seed

docker-up:
	docker compose pull
	docker compose up -d

docker-down:
	docker compose down

# 👇 Run the portal app only (foreground)
app:
	npm --prefix "$(PORTAL_DIR)" run dev

open: docker-up
	trap 'echo ""; echo "Stopping portal dev server..."; [[ -n "$$PORTAL_PID" ]] && kill $$PORTAL_PID 2>/dev/null || true' EXIT

	# Start portal dev server in background
	npm --prefix "$(PORTAL_DIR)" run dev & \
	PORTAL_PID=$$!

	# Wait for app to be reachable
	npx --yes wait-on --timeout $(WAIT_TIMEOUT) "$(APP_URL)"

	# Open Cypress
	npm --prefix "$(E2E_DIR)" run cy:open

headless: docker-up
	trap 'echo ""; echo "Stopping portal dev server..."; [[ -n "$$PORTAL_PID" ]] && kill $$PORTAL_PID 2>/dev/null || true' EXIT

	# Start portal dev server in background
	npm --prefix "$(PORTAL_DIR)" run dev & \
	PORTAL_PID=$$!

	# Wait for app to be reachable
	npx --yes wait-on --timeout $(WAIT_TIMEOUT) "$(APP_URL)"

	# Run Cypress headless
	npm --prefix "$(E2E_DIR)" run cy:ci:local
