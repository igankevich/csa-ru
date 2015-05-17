all: validate
	jekyll build
	./bin/generate-index.js

validate:
	html5validator --root _site

validate2:
	./bin/validate-2.sh
