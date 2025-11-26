# Multi-stage build for React frontend
FROM node:18-alpine AS frontend-builder

WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci --only=production

COPY frontend/ ./
RUN npm run build

# Backend build stage
FROM maven:3.8-openjdk-11 AS backend-builder

WORKDIR /app
COPY backend/pom.xml .
RUN mvn dependency:resolve

COPY backend/src ./src
RUN mvn clean package -DskipTests

# Production stage
FROM openjdk:11-jre-slim

WORKDIR /app

# Copy backend JAR
COPY --from=backend-builder /app/target/*.jar app.jar

# Copy frontend build
COPY --from=frontend-builder /app/frontend/build ./static

# Expose port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:8080/actuator/health || exit 1

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]