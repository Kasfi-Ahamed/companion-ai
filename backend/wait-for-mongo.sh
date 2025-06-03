#!/bin/bash

# Wait for MongoDB to be ready before starting backend
until nc -z mongo 27017; do
  echo "Waiting for MongoDB..."
  sleep 1
done

echo "✅ MongoDB is up. Starting app..."
exec "$@"
