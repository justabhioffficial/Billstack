# BillStack Production Deployment Guide

## Production Architecture Diagram

```
                        ┌─────────────────────────────────────┐
                        │          Cloudflare CDN / DNS       │
                        │       (app.billstack.com)           │
                        └──────────────────┬──────────────────┘
                                           │
                                           ▼
                        ┌─────────────────────────────────────┐
                        │          Frontend Host              │
                        │     (Vercel / Netlify / NGINX)      │
                        └──────────────────┬──────────────────┘
                                           │ HTTPS / API Calls
                                           ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                              Spring Boot Container Host                                │
│                                (Docker / AWS ECS / Render)                             │
│                                                                                        │
│   ┌─────────────────────┐       ┌──────────────────────┐      ┌────────────────────┐   │
│   │  Spring Boot API    │───────▶   S3 Storage Bucket  │      │  Razorpay Gateway  │   │
│   │  (Port 8080)        │       │ (Cloudflare R2/AWS)  │      │   & Webhooks       │   │
│   └──────────┬──────────┘       └──────────────────────┘      └────────────────────┘   │
└──────────────┼─────────────────────────────────────────────────────────────────────────┘
               │ Database Connection (SSL)
               ▼
    ┌────────────────────┐
    │ Managed MySQL DB   │
    │ (AWS RDS / Aiven)  │
    └────────────────────┘
```

## Step 1: Database Migration
Ensure the managed MySQL database is provisioned. When Spring Boot launches with `SPRING_PROFILES_ACTIVE=prod`, Flyway automatically applies `V1__initial_schema.sql` migrations.

## Step 2: Build Production Artifacts

### Backend JAR Build:
```bash
cd backend
mvn clean package -DskipTests
# Produces target/billstack-api-1.0.0.jar
```

### Frontend Static Build:
```bash
cd frontend
npm run build
# Produces static dist/ directory ready for NGINX or Vercel
```

## Step 3: Run Spring Boot Container
```bash
java -jar -Dspring.profiles.active=prod target/billstack-api-1.0.0.jar
```
