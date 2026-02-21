# Deployment Guide for Beyondtee

This project is containerized and ready for deployment. You have two primary services (Backend API, Frontend Web) and a database requirement (Postgres).

## 🚀 Quick Start (Production Test)

To run the full production stack locally using Docker Compose:

1. **Ensure Docker is running.**
2. **Prepare the Database Schema:**
   > [!IMPORTANT]
   > For production (Docker/Cloud), you **MUST** update `backend/prisma/schema.prisma` to use PostgreSQL instead of SQLite.
   
   Change this:
   ```prisma
   datasource db {
     provider = "sqlite" // Change to "postgresql"
     url      = env("DATABASE_URL")
   }
   ```
3. **Run the production compose file:**
   ```bash
   docker-compose -f docker-compose.prod.yml up --build -d
   ```
4. **Access the App:**
   - Frontend: [http://localhost:3000](http://localhost:3000)
   - Backend: [http://localhost:3001](http://localhost:3001)

## 📦 Cloud Deployment Options

### Option 1: Railway / Render (Easiest)
These platforms can auto-detect the `Dockerfile` in each directory.

*   **Backend**: Point the service to the `backend/` directory. It will use the `backend/Dockerfile`.
    *   Add Environment Variables: `DATABASE_URL` (use a managed Postgres), `AWS_...`, `STRIPE_...`
*   **Web**: Point the service to the `web/` directory. It will use the `web/Dockerfile`.
    *   Add Environment Variables: `NEXT_PUBLIC_API_URL` (URL of your deployed backend), `NEXTAUTH_SECRET`, etc.

### Option 2: AWS / DigitalOcean / VPS
You can deploy the images built from the Dockerfiles to any generic container registry (ECR, Docker Hub) and run them on ECS, App Runner, or a raw VPS.

## 🛠 Variables

Ensure these variables are set in your production environment:

**Backend:**
*   `DATABASE_URL`: Connection string for PostgreSQL.
*   `AWS_BUCKET_NAME`, `AWS_REGION`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY` (For S3 uploads)
*   `STRIPE_SECRET_KEY`

**Frontend:**
*   `NEXT_PUBLIC_API_URL`: Full URL to your production backend.
*   `NEXTAUTH_SECRET`: A random string for session security.

## 📋 Pre-Deployment Checklist
- [ ] **Prisma Provider**: Switched `schema.prisma` to `postgresql`.
- [ ] **Environment Secrets**: All keys (Stripe, AWS) are set in the cloud provider.
- [ ] **Build Check**: storage confirmed `npm run build` passes for both `web` and `backend`.
