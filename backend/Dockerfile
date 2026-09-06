# Step 1: Build stage with Maven and OpenJDK 21
FROM maven:3.9.6-eclipse-temurin-21-alpine AS builder
WORKDIR /app

# Copy pom.xml and download dependencies (cached layer)
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy source code and build production JAR
COPY src ./src
RUN mvn package -DskipTests

# Step 2: Runtime stage
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Create non-root user and uploads directory
RUN addgroup -S billstack && adduser -S billstack -G billstack && mkdir -p /app/uploads && chown -R billstack:billstack /app

USER billstack

# Copy executable JAR from builder stage
COPY --from=builder /app/target/billstack-api-1.0.0.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-XX:+UseG1GC", "-XX:TieredStopAtLevel=1", "-XX:MaxRAMPercentage=75.0", "-Djava.security.egd=file:/dev/./urandom", "-Dspring.profiles.active=${SPRING_PROFILES_ACTIVE:mysql}", "-jar", "app.jar"]
