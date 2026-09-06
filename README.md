# BillStack — Production-Ready SaaS Application

> **"Turn photos and digital bills into clean, organized, tax-ready expense reports."**

BillStack is a production-ready expense management SaaS application designed for Indian freelancers, creators, and solo professionals.

---

## 🚀 Quick Start Guide (Local Setup)

### Prerequisites
- **Java**: 21+
- **Node.js**: 20+ (with npm 10+)
- **Database**: MySQL 8.x (or H2 in-memory mode for instant dev testing)

---

### 1. Backend Setup (Spring Boot)
```bash
cd backend
mvn spring-boot:run
# API server starts at http://localhost:8080
# OpenAPI / Swagger UI documentation at http://localhost:8080/swagger-ui.html
# H2 Console (in dev mode) at http://localhost:8080/h2-console
```

### 2. Frontend Setup (React + TypeScript)
```bash
cd frontend
npm install
npm run dev
# Frontend application runs at http://localhost:5173
```

---

## 📂 Project Architecture

```
billstack/
├── backend/                  # Java Spring Boot 3 REST API
│   ├── src/main/java/com/billstack/
│   │   ├── config/           # Security, CORS, Swagger OpenAPI
│   │   ├── controller/       # Auth, Receipts, Reports, Export, Billing, Admin REST Controllers
│   │   ├── dto/              # Request/Response Data Transfer Objects
│   │   ├── entity/           # JPA Entities (User, Receipt, Subscription, Payment, etc.)
│   │   ├── ocr/              # OCR Service Abstraction & Regex Field Parsing Engine
│   │   ├── payment/          # Payment Service Abstraction (Razorpay + Webhook Verification)
│   │   ├── repository/       # Spring Data JPA Repositories
│   │   ├── security/         # Stateless JWT Authentication & UserPrincipal
│   │   ├── service/          # Business logic, Concurrency-safe Usage Limits, Export
│   │   └── storage/          # S3-compatible & Local Storage Abstraction
│   └── src/main/resources/
│       ├── application.yml   # Base environment properties
│       └── db/migration/     # Flyway V1 SQL schema migration
├── frontend/                 # React 18 + TypeScript + Vite + Tailwind CSS
│   ├── src/
│   │   ├── components/       # Financial UI design system (Navbar, Sidebar, Badges, UploadModal)
│   │   ├── contexts/         # AuthContext state management
│   │   ├── pages/
│   │   │   ├── Public/       # Landing, Pricing, About, FAQ, Privacy, Terms
│   │   │   ├── Auth/         # Login, Register, Forgot Password
│   │   │   └── App/          # Dashboard, Receipts, Review, Categories, Reports, Billing, Admin
│   │   └── services/         # Axios client with JWT auto-retry refresh token interceptor
└── docs/                     # Architectural & Deployment Documentation
```

---

## 🛡️ Core Production Capabilities

1. **OCR Processing Pipeline**: Validates incoming file signatures (JPG, PNG, PDF), stores securely, extracts vendor, receipt date, tax numbers (CGST/SGST/IGST), currency, and payment modes with confidence scoring.
2. **Rule-Based Categorization**: Pre-seeded Indian vendor keyword maps (Swiggy, Uber, AWS, Airtel, Reliance Digital) overridden by custom user-defined vendor patterns.
3. **Usage Limits & Concurrency**: Concurrency-safe monthly upload limit tracking (20 receipts/month on Free plan, unlimited on Pro).
4. **Razorpay Payments**: Backend-controlled payment flow with HMAC-SHA256 signature verification and webhook authentication.
5. **Tax Exports**: One-click CSV and formatted Excel (.xlsx) exports.

---

## 📜 Documentation Index
- [ARCHITECTURE.md](file:///c:/all%20codes/cu%20projects%20sem%206/munna/onebanc%20Assingment/complete%20java%20%20interview%20ready%20files/billstack/ARCHITECTURE.md)
- [API.md](file:///c:/all%20codes/cu%20projects%20sem%206/munna/onebanc%20Assingment/complete%20java%20%20interview%20ready%20files/billstack/API.md)
- [DATABASE.md](file:///c:/all%20codes/cu%20projects%20sem%206/munna/onebanc%20Assingment/complete%20java%20%20interview%20ready%20files/billstack/DATABASE.md)
- [DEPLOYMENT.md](file:///c:/all%20codes/cu%20projects%20sem%206/munna/onebanc%20Assingment/complete%20java%20%20interview%20ready%20files/billstack/DEPLOYMENT.md)
- [SECURITY.md](file:///c:/all%20codes/cu%20projects%20sem%206/munna/onebanc%20Assingment/complete%20java%20%20interview%20ready%20files/billstack/SECURITY.md)
- [ENVIRONMENT.md](file:///c:/all%20codes/cu%20projects%20sem%206/munna/onebanc%20Assingment/complete%20java%20%20interview%20ready%20files/billstack/ENVIRONMENT.md)
- [TESTING.md](file:///c:/all%20codes/cu%20projects%20sem%206/munna/onebanc%20Assingment/complete%20java%20%20interview%20ready%20files/billstack/TESTING.md)
- [PRODUCT.md](file:///c:/all%20codes/cu%20projects%20sem%206/munna/onebanc%20Assingment/complete%20java%20%20interview%20ready%20files/billstack/PRODUCT.md)
