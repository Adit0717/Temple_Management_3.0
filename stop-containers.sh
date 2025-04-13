#!/bin/bash

echo "Stopping TMS containers..."

# Stop the containers
docker stop tms-frontend-container tms-backend-container 2>/dev/null

# Remove the containers
docker rm tms-frontend-container tms-backend-container 2>/dev/null

echo "Containers stopped and removed.
