#!/bin/bash


set -e


echo "Building Spring Boot services..."


services=(

  auth-service

  customer-service

  partner-service

  bike-service

  admin-service

  api-gateway

)


for service in "${services[@]}"; do

  echo "Building $service..."

  (cd ./backend/$service && ./mvnw clean package -DskipTests)

done


echo "Building Docker images..."

docker compose build --no-cache


echo "Starting containers..."

docker compose up

