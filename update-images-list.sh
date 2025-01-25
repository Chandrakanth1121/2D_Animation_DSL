#!/bin/bash
ls images/*.png images/*.jpg images/*.jpeg images/*.gif 2>/dev/null | awk -F/ '{print "\"" $NF "\","}' | sed '$ s/,$//' | sed '1s/^/[\n/' | sed '$s/$/\n]/' > images-list.json
echo "images-list.json updated!"

