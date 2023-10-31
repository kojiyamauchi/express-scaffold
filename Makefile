SHELL=/bin/bash

.PHONY: ssl
ssl:
	make -C apps dev_ssl

.PHONY: build
build:
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

.PHONY: mysql
mysql:
	docker compose exec mysql /bin/bash

