install:
	npm ci
	npm ci --prefix frontend

build:
	npm run build --prefix frontend

start:
	npx start-server -s ./frontend/dist
