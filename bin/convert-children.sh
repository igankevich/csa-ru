#!/bin/sh

tmp=$(mktemp)
for file in "$@"; do
if ! grep 'layout: children' $file >/dev/null 2>&1; then
title=$(sed -rne 's:\s*<title>\s*(.*)\s*</title>.*:\1:p' $file)
{
cat << EOF
---
layout: children
title: $title
---
EOF
sed -rne '/<!--\s+Тело/,/<!--\s+@@/p' $file
} > $tmp
mv $tmp $file
fi
done
