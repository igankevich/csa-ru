#!/bin/sh

for f in "$@"; do
	pdftotext -enc Latin1 $f - | iconv -f cp1251 -t utf8 >$f.txt
done
