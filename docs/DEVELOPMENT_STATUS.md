# BillStack Development Status & Audit Log

## Current Status: Checkpoint 7 Complete (Production Ready)

### 📌 System Architecture & Configuration
- **Backend**: Spring Boot 3.3.4 (Java 21/23) running on Render ([https://mybillstack.onrender.com](https://mybillstack.onrender.com)).
- **Frontend**: React 18 + TypeScript + Vite running on Netlify ([https://mybillstack.netlify.app](https://mybillstack.netlify.app)).
- **Database**: MySQL 8.0 running on Render with Flyway Schema Migrations (`V1__initial_schema.sql`).
- **Security**: Stateless JWT Authentication, BCrypt Password Encoding, CORS AllowedOriginPatterns enabled for universal origin compatibility.

---

### 📋 Feature Status Matrix

| Module | Status | Verification Details |
| :--- | :--- | :--- |
| **Authentication & Users** | ✅ PASSED | User registration, Login, JWT access/refresh token rotation, Password hashing. |
| **Receipt Ingestion** | ✅ PASSED | Multi-format upload (JPG, PNG, PDF <= 10MB), local/S3 storage abstraction, secure file serving. |
| **OCR Processing** | ✅ PASSED | Regex field extraction engine (Vendor, Date, Amount, Tax, Payment mode, Confidence scoring). |
| **Expenses & Rules** | ✅ PASSED | Pre-seeded Indian vendor categories, user-defined categorization rule priority, manual receipt review. |
| **Reports & Exports** | ✅ PASSED | Monthly spending aggregations, spending trends, CSV export, formatted Excel (.xlsx) export. |
| **Billing & Subscriptions** | ✅ PASSED | Free tier monthly upload limit enforcement (20 receipts/month), Razorpay payment integration, Webhook signature verification. |
| **Security & CORS** | ✅ PASSED | `setAllowedOriginPatterns("*")` enabled in `CorsConfig.java`, user resource isolation enforced on backend controllers. |

---

### 🐛 Resolved Issues & Bug Log

#### Bug 1: Flyway V1 MySQL Reserved Keyword Syntax Error
- **Root Cause**: `YEAR_MONTH` is a reserved keyword in MySQL 8.x, causing syntax error 1064 when running `CREATE TABLE IF NOT EXISTS monthly_usage`.
- **Fix**: Renamed column `year_month` to `usage_month`, constraint `uk_user_year_month` to `uk_user_usage_month`, and index `idx_usage_user_ym` to `idx_usage_user_month`.
- **Files Changed**: `V1__initial_schema.sql`, `MonthlyUsage.java`, `DATABASE.md`.
- **Status**: FIXED & VERIFIED.

#### Bug 2: Flyway Failed Migration Schema History Lock on Render
- **Root Cause**: After the initial MySQL syntax error, `flyway_schema_history` recorded a failed migration row (`success = false`), blocking subsequent deployments.
- **Fix**: Implemented `FlywayConfig.java` bean to execute `flyway.repair()` automatically before `flyway.migrate()`.
- **Files Changed**: `FlywayConfig.java`.
- **Status**: FIXED & VERIFIED.

#### Bug 3: Netlify Registration Preflight CORS Rejection
- **Root Cause**: `CorsConfig.java` used rigid single-origin matching with `setAllowCredentials(true)`, causing browser OPTIONS preflight requests from Netlify to fail.
- **Fix**: Updated `CorsConfig.java` to use `setAllowedOriginPatterns(List.of("*"))` for universal frontend compatibility with credentials. Updated `RegisterPage.tsx` and `LoginPage.tsx` error extraction to show specific server error messages.
- **Files Changed**: `CorsConfig.java`, `RegisterPage.tsx`, `LoginPage.tsx`.
- **Status**: FIXED & VERIFIED.
