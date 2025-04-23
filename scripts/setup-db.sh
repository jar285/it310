#!/bin/bash

# Start PostgreSQL database using Docker
echo "Starting PostgreSQL database..."
docker run --name tutor-trend-postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_USER=postgres -e POSTGRES_DB=tutor-trend -p 5432:5432 -d postgres:latest

# Wait for database to be ready
echo "Waiting for database to be ready..."
sleep 5

# Run Prisma migrations
echo "Running Prisma migrations..."
npx prisma migrate deploy

# Create test user
echo "Creating test user..."
npx ts-node scripts/create-test-user.ts

echo "Setup complete!"
echo "You can now login with:"
echo "Email: test@example.com"
echo "Password: password123"
