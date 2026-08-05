#!/bin/bash


# Exit immediately if any command fails

set -e


echo "========================================"

echo "íº€ Starting Build & Deployment Process"

echo "========================================"


echo "í³¦ Step 1: Compiling and packaging microservices (Skipping Tests)..."

./mvnw clean package -DskipTests


echo "í°³ Step 2: Building Docker images..."

docker compose build


# Using -d to run containers in the background so your terminal doesn't lock up

echo "í´„ Step 3: Starting Docker containers..."

docker compose up

