#!/bin/sh

outfile=$(mktemp)
jekyll=$(which jekyll)
ruby-prof --mode=wall --file=$outfile $jekyll build
echo "Profiling data: $outfile"
#dot -T pdf -o jekyll-prof.pdf $outfile
