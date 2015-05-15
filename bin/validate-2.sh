#!/bin/sh

find _site -type f -name '*.html' -and -not -path '*children*' \
	-exec ./bin/html5check.py -e -g --service=http://localhost:8080/ \{\} \;
