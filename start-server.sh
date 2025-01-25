#!/bin/bash

# Update the images-list.json file
./update-images-list.sh

# Check if the update script ran successfully
if [ $? -eq 0 ]; then
  echo "Images list updated. Starting HTTP server..."
  npx http-server
else
  echo "Failed to update images list. HTTP server will not start."
  exit 1
fi

