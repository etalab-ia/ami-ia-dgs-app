#!/bin/bash
docker build -f Dockerfile_local -t dgs-webapp:latest .
docker run -p 4242:4242 -d dgs-webapp:latest
