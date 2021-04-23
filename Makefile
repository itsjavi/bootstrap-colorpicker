default: build

install:
	docker-compose run --rm app npm install

test:
	docker-compose run --rm app npm test

start:
	docker-compose up -d

stop:
	docker-compose stop

dev:start
	open http://localhost:5000

down:
	docker-compose down

build:
	docker-compose build
	docker-compose run --rm app npm run build

.PHONY: build data dist
