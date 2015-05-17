#!/bin/sh

tmp=$(mktemp)
for f in "$@"; do
	echo "Converting $f"
	iconv -f koi8r -t utf8 $f >$tmp
	mv $tmp $f
done
