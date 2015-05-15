for i in "$@"; do
echo '0a
---
layout: page
---
.
w' | ed "$i"
done
