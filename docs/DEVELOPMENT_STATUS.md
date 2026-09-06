# BillStack Development Status & Audit Log

## Current Status: Checkpoint 8 Complete (Core Functionality Reliability & Golden Path Verified)

### 📌 System Architecture & Configuration
- **Backend**: Spring Boot 3.3.4 (Java 21/23) running on Render ([https://mybillstack.onrender.com](https://mybillstack.onrender.com)) & Local ([http://localhost:8080](http://localhost:8080)).
- **Frontend**: React 18 + TypeScript + Vite running on Netlify ([https://mybillstack.netlify.app](https://mybillstack.netlify.app)) & Local ([http://localhost:5173](http://localhost:5173)).
- **Database**: MySQL 8.0 running on Render with Flyway Schema Migrations (`V1__initial_schema.sql`) and H2 for Dev/Testing.
- **Security**: Stateless JWT Authentication, Magic Bytes File Header Validation, BCrypt Password Encoding, CORS Universal Patterns.

---

### 📋 Checkpoints Verification Matrix

| Checkpoint | Status | Verification Details |
| :--- | :--- | :--- |
| **1. Authentication & DB** | ✅ PASSED | User registration, Login, JWT access/refresh token rotation, Password hashing, H2/MySQL Flyway migration. |
| **2. Receipt Ingestion** | ✅ PASSED | Multi-format upload (JPG, PNG, PDF <= 10MB), Magic Bytes file header validation, local/S3 storage abstraction, secure file serving. |
| **3. OCR Extraction** | ✅ PASSED | Regex field extraction engine (Vendor, Date, Amount, Tax with CGST/SGST summation, Payment mode, Confidence scoring). |
| **4. Categorization** | ✅ PASSED | Pre-seeded Indian vendor categories, user-defined categorization rule priority, manual receipt review override. |
| **5. Dashboard & Reports** | ✅ PASSED | Monthly spending aggregations, spending trends, total receipt count queries, category/vendor breakdown. |
| **6. CSV/Excel Export** | ✅ PASSED | Backend-authoritative CSV export with RFC 4180 escaping and Apache POI formatted Excel (.xlsx) export. |
| **7. Razorpay Integration** | ✅ PASSED | Free tier monthly upload limit enforcement (20 receipts/month), Razorpay payment integration, Webhook signature verification. |
| **8. Core Reliability** | ✅ PASSED | Golden Path automated integration suite (`GoldenPathIntegrationTest.java`) passed with 100% success (7/7 tests passed). |

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

#### Bug 4: Magic Bytes Security Validation Missing
- **Root Cause**: Upload validation relied solely on MIME type & filename extension, allowing renamed executables (e.g. `malicious.exe` renamed to `.jpg`) to pass.
- **Fix**: Implemented `validateMagicBytes(MultipartFile file)` in `ReceiptService.java` checking binary header signatures for PNG (`89 50 4E 47`), JPEG (`FF D8 FF`), and PDF (`%PDF`).
- **Files Changed**: `ReceiptService.java`.
- **Status**: FIXED & VERIFIED.

#### Bug 5: Monthly Report Total Receipts Count Miscalculation
- **Root Cause**: `ReportService.getMonthlyReport` did not populate `totalReceiptsCount` field on `MonthlyReportDto`, returning 0 count.
- **Fix**: Added `countByUserIdAndDateRange` query in `ReceiptRepository` and updated `ReportService.java` to explicitly populate `totalReceiptsCount`.
- **Files Changed**: `ReceiptRepository.java`, `ReportService.java`.
- **Status**: FIXED & VERIFIED.
