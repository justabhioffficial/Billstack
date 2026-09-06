# BillStack Architecture Documentation

BillStack is built as a **Modular Monolith** to maximize reliability, performance, and developer velocity for an MVP SaaS without microservice overhead.

```
                           ┌─────────────────────────────────────┐
                           │          React 18 + TS Frontend     │
                           │   (Landing, Auth, App, Dashboard)   │
                           └──────────────────┬──────────────────┘
                                              │ REST API (JSON)
                                              ▼
┌──────────────────────────────────────────────────────────────────────────────────────────────┐
│                                   Spring Boot 3 REST Server                                  │
│                                                                                              │
│  ┌───────────────────────────┐ ┌───────────────────────────┐ ┌───────────────────────────┐  │
│  │     Security Filter       │ │     Controller Layer      │ │     Global Exception      │  │
│  │   (Stateless JWT / CORS)  │ │   (/api/v1/receipts, etc) │ │     & Validation Handler  │  │
│  └─────────────┬─────────────┘ └─────────────┬─────────────┘ └───────────────────────────┘  │
│                │                             │                                              │
│                └─────────────────────────────┼──────────────────────────────┐               │
│                                              ▼                              │               │
│                              ┌───────────────────────────────┐              │               │
│                              │         Service Layer         │              │               │
│                              │  (Receipts/Auth/Reports/Usage)│              │               │
│                              └───────────────┬───────────────┘              │               │
│                                              │                              │               │
│         ┌───────────────────────┬────────────┴─────────┬────────────────────┼────────────┐  │
│         ▼                       ▼                      ▼                    ▼            ▼  │
│  ┌──────────────┐     ┌──────────────────┐  ┌──────────────────┐  ┌───────────┐  ┌──────┐ │
│  │ Storage      │     │ OCR Provider     │  │ Payment Provider │  │ Email     │  │ JPA  │ │
│  │ Service      │     │ Service          │  │ Service          │  │ Service   │  │ Repo │ │
│  │ (Local / S3) │     │ (Vision / Mock)  │  │ (Razorpay/Mock)  │  │ (Mock/SES)│  └───┬──┘ │
│  └──────────────┘     └──────────────────┘  └──────────────────┘  └───────────┘      │    │
└──────────────────────────────────────────────────────────────────────────────────────┼────┘
                                                                                       │
                                                                                       ▼
                                                                              ┌─────────────────┐
                                                                              │     MySQL 8.x   │
                                                                              │ (Flyway Schema) │
                                                                              └─────────────────┘
```

## Layer Architecture Breakdown

### 1. Presentation Layer (Frontend)
- **Framework**: React 18 with TypeScript and Vite.
- **Routing**: Client-side React Router v6 with `ProtectedRoute` and `AdminRoute` wrappers.
- **State**: React `AuthContext` for JWT lifecycle management and active session persistence.
- **HTTP Client**: Axios with request authorization interceptors and automated 401 refresh token retry interceptors.

### 2. Security Layer (Backend)
- **Framework**: Spring Security 6 configured in STATELESS mode.
- **Authentication**: Bearer JWT tokens with HMAC-SHA256 signature verification.
- **Data Scoping**: Every controller method enforces strict user ownership checks (`findByIdAndUserId`) to prevent unauthorized cross-tenant resource access.

### 3. Business & Processing Pipelines
- **Receipt Ingestion**:
  `Upload` -> `File Integrity & MIME Check` -> `Usage Limit Verification` -> `Private Object Storage` -> `OCR Text Extraction` -> `Indian Format Regex Parsing` -> `Rule-based Categorization` -> `Status Assignment (NEEDS_REVIEW vs COMPLETED)`
- **Concurrency Control**: Pessimistic locking and atomic DB incrementing on `monthly_usage` table ensures free-plan limits (20 uploads/month) cannot be bypassed by race conditions.
- **Razorpay Abstraction**: Abstracted `PaymentService` interface allowing seamless switching between sandbox mock, Razorpay live checkout, or future Stripe integrations.
