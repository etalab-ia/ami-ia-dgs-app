#!/bin/bash
docker build -t dgs-webapp:latest .
docker run -p 4242:80 -d dgs-webapp:latest
