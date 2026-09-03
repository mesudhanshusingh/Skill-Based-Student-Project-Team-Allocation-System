# Production Multi-Stage Dockerfile for Skill-Based Student Project Team Allocation System

# Stage 1: Build Jar using Maven & Temurin OpenJDK 17
FROM maven:3.9-eclipse-temurin-17-alpine AS builder
WORKDIR /app

# Copy backend pom.xml and src
COPY backend/pom.xml ./backend/pom.xml
COPY backend/src ./backend/src

# Copy frontend web assets
COPY frontend ./frontend

# Build executable JAR
WORKDIR /app/backend
RUN mvn clean package -DskipTests

# Stage 2: Production JRE 17 Runtime
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Copy artifact from builder stage
COPY --from=builder /app/backend/target/skill-team-allocation-1.0.0.jar app.jar

# Expose HTTP Server Port
EXPOSE 8080

# Environment Variables for External MySQL Database Connection
ENV DB_URL=jdbc:mysql://localhost:3306/team_allocation_db?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
ENV DB_USERNAME=root
ENV DB_PASSWORD=root

# Launch Spring Boot Application
ENTRYPOINT ["java", "-jar", "app.jar"]
