# BillStack Production Deployment Guide

## 🏗️ Production Architecture Diagram

```
                        ┌─────────────────────────────────────┐
                        │          Cloudflare CDN / DNS       │
                        │       (app.billstack.com)           │
                        └──────────────────┬──────────────────┘
                                           │
                                           ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                              Full-Stack Container Host                                 │
│                                (Docker / AWS ECS / Render)                             │
│                                                                                        │
│   ┌───────────────────────┐      ┌────────────────────────┐    ┌───────────────────┐   │
│   │  Frontend (NGINX)     │─────▶│  Spring Boot API       │───▶│  MySQL 8.0 DB     │   │
│   │  (Port 80/5173)       │      │  (Port 8080)           │    │  (Port 3306)      │   │
│   └───────────────────────┘      └────────────────────────┘    └───────────────────┘   │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 🐳 Option 1: Full-Stack Docker Deployment (Recommended)

Run Frontend, Backend API, MySQL 8.0, and phpMyAdmin with a single command:

```bash
docker-compose up -d --build
```

### Accessing Services
- **Web App Frontend**: [http://localhost](http://localhost) (Port 80)
- **Backend REST API**: [http://localhost:8080](http://localhost:8080)
- **Swagger Documentation**: [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)
- **phpMyAdmin Database Manager**: [http://localhost:8081](http://localhost:8081)

---

## ☁️ Option 2: Cloud PaaS Deployment (Render / Railway / Vercel)

### Step 1: Push Code to GitHub
Your repository is connected to:
`https://github.com/justabhioffficial/Billstack.git`

### Step 2: Deploy Database & Backend (Railway / Render)
1. Create a new project on [Railway.app](https://railway.app) or [Render.com](https://render.com).
2. Add a **MySQL Database** plugin.
3. Connect your GitHub repository `justabhioffficial/Billstack`.
4. Set the Root Directory to `backend/`.
5. Environment Variables to configure:
   ```env
   SPRING_PROFILES_ACTIVE=mysql
   DATABASE_URL=jdbc:mysql://<MYSQL_HOST>:<PORT>/<DATABASE>?useSSL=false
   DATABASE_USERNAME=<DB_USER>
   DATABASE_PASSWORD=<DB_PASSWORD>
   RAZORPAY_KEY_ID=<YOUR_KEY>
   RAZORPAY_KEY_SECRET=<YOUR_SECRET>
   ```

### Step 3: Deploy Frontend (Vercel / Netlify)
1. Go to [Vercel](https://vercel.com).
2. Import repository `justabhioffficial/Billstack`.
3. Set Framework Preset to **Vite**.
4. Set Root Directory to `frontend`.
5. Click **Deploy**!

