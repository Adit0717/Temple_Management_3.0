#!/bin/bash

# Script to run TMS frontend and backend containers

echo "Starting Ram Mandir Backend..."
docker run -d -p 3001:3001 --name tms-backend-container tms-backend

echo "Starting Ram Mandir Frontend (CRA)..."
docker run -p 3000:3000 --name tms-frontend-container tms-frontend

echo "Both containers are now running!"
docker ps --filter "name=tms-"

