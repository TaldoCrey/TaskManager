#!/bin/bash
cd backend-java

sudo docker compose up -d 

sudo ./mvnw spring-boot:run