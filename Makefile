SHELL=/bin/bash

.PHONY: ssl
ssl:
	make -C apps dev_ssl

.PHONY: build
build:
	yarn build:client
	docker compose build

.PHONY: up
up:
	docker compose up

.PHONY: stop
stop:
	docker compose stop

.PHONY: down
down:
	docker compose down

.PHONY: app
app:
	docker compose exec -it application sh

.PHONY: mysql
mysql:
	docker compose exec mysql /bin/bash

.PHONY: act
act:
	act -j ${JOB} -W .github/workflows/ci-local-test.yml -P ubuntu-latest=node:22

