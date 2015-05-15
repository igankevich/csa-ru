#!/bin/sh

set -e

for i in "$@"; do
	tr -d '\r' < "$i" > /tmp/a
	mv /tmp/a $i
done
