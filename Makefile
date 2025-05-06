# Environment and shell configuration
NODE_ENV ?= development
SHELL := bash
MAKEFLAGS += --no-print-directory

# Docker image configuration
TAG := $(shell git describe --tags --abbrev=0 2> /dev/null || echo 'latest')
IMG := ${NAME}:${TAG}
LATEST := ${NAME}:latest

# Docker Compose configuration
COMPOSE_FILE ?= compose.yaml
ifneq ("$(wildcard compose.$(NODE_ENV).yml)","")
	COMPOSE_FILE := $(COMPOSE_FILE):compose.$(NODE_ENV).yml
endif
ifneq ("$(wildcard compose.override.yaml)","")
	COMPOSE_FILE := $(COMPOSE_FILE):compose.override.yaml
endif

# DOCKER_COMPOSE = docker compose or docker-compose
DOCKER_COMPOSE ?= docker compose
export DOCKER_BUILDKIT=1
export COMPOSE_DOCKER_CLI_BUILD=1
export COMPOSE_FILE

### Docker

init: down build up

restart: down up

up:
	$(DOCKER_COMPOSE) up

stop:
	$(DOCKER_COMPOSE) stop

down:
	$(DOCKER_COMPOSE) down

build:
	$(DOCKER_COMPOSE) build --no-cache

next:
	$(DOCKER_COMPOSE) exec -it nextjs sh

db:
	$(DOCKER_COMPOSE) exec -it postgres psql -U artilink

### NPM

install:
	@$(DOCKER_COMPOSE) exec nextjs sh -c "px ci --legacy-peer-deps" 

clean:
	@$(DOCKER_COMPOSE) exec nextjs sh -c "px clean"

prisma-generate:
	@$(DOCKER_COMPOSE) exec nextjs sh -c "px prisma:generate"

prisma-push:
	@$(DOCKER_COMPOSE) exec nextjs sh -c "px prisma:push"

prisma-studio:
	@$(DOCKER_COMPOSE) exec nextjs sh -c "px prisma:studio"

prisma-seed:
	@$(DOCKER_COMPOSE) exec nextjs sh -c "px prisma:seed"

email:
	@$(DOCKER_COMPOSE) exec nextjs sh -c "px email:dev"

test:
	@$(DOCKER_COMPOSE) exec nextjs sh -c "px test"

