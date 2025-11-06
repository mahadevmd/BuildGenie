# Build stage
FROM maven:3.9-eclipse-temurin-17 AS builder
WORKDIR /workspace
COPY pom.xml /workspace/pom.xml
COPY src /workspace/src
RUN mvn -f /workspace/pom.xml -DskipTests clean package

# Runtime stage
FROM eclipse-temurin:17-jre
WORKDIR /app
COPY --from=builder /workspace/target/*-SNAPSHOT.jar /app/app.jar

# Default port (Railway will set PORT)
ENV PORT=8080
EXPOSE 8080

# Use shell form to expand PORT env var
ENTRYPOINT ["sh", "-c", "java -jar /app/app.jar --server.port=${PORT}"]