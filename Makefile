all: index

index: build
	./bin/index.js

build:
	jekyll build

validate:
	html5validator --root _site

validate2:
	./bin/validate-2.sh
