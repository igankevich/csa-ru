#!/bin/sh

tmp=$(mktemp)
for file in "$@"; do
if ! grep 'layout: children' $file >/dev/null 2>&1; then
title=$(sed -rne 's:\s*<title>\s*(.*)\s*</title>.*:\1:p' $file)
sed -rne '/<!--\s+Тело/,/<!--\s+@@/p' $file
echo ""
echo "File: $file"
echo "Is this OK?"
read ans
if [ "$ans" = "y" ]; then
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
fi
done
