#!/bin/sh
# Wait until MongoDB is available
until nc -z mongo 27017; do
  echo "⏳ Waiting for MongoDB..."
  sleep 2
done

echo "✅ MongoDB is up!"
exec "$@"
