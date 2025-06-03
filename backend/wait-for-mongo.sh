#!/bin/sh

echo "⏳ Waiting for MongoDB to start..."

until nc -z mongodb 27017; do
  sleep 1
done

echo "✅ MongoDB is up. Starting the server..."
