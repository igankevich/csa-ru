all:
	jekyll build
	./bin/generate-index.js
