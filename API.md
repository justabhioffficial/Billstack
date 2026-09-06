# BillStack REST API Specification

All endpoints are prefixed with `/api/v1`.

## Authentication Endpoint (`/api/v1/auth`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/auth/register` | Register new user account | No |
| `POST` | `/auth/login` | Authenticate user & receive JWT tokens | No |
| `POST` | `/auth/refresh` | Refresh access token using refresh token | No |
| `POST` | `/auth/logout` | Revoke refresh token and terminate session | Yes |

## Profile Endpoint (`/api/v1/me`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/me` | Get authenticated user profile | Yes |
| `PUT` | `/me` | Update name, business type, country, currency | Yes |

## Receipts Endpoint (`/api/v1/receipts`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/receipts` | Upload receipt image/PDF for OCR processing | Yes |
| `GET` | `/receipts` | Filter, search & paginate receipts | Yes |
| `GET` | `/receipts/{id}` | Get receipt details & extracted fields | Yes |
| `PUT` | `/receipts/{id}` | Edit extracted receipt values & status | Yes |
| `DELETE` | `/receipts/{id}` | Delete receipt & remove file from storage | Yes |
| `GET` | `/receipts/files/{userId}/{filename}` | Stream receipt image/PDF resource | Yes |

## Categories & Rules (`/api/v1/categories`, `/api/v1/categorization-rules`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/categories` | List available system & custom categories | Yes |
| `POST` | `/categories` | Create custom expense category | Yes |
| `GET` | `/categorization-rules` | List user custom auto-tagging rules | Yes |
| `POST` | `/categorization-rules` | Add custom vendor rule | Yes |
| `DELETE` | `/categorization-rules/{id}` | Remove custom vendor rule | Yes |

## Reports & Exports (`/api/v1/reports`, `/api/v1/exports`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/reports/monthly` | Get monthly spending & category analytics | Yes |
| `GET` | `/exports/receipts.csv` | Download tax-ready CSV spreadsheet | Yes |
| `GET` | `/exports/receipts.xlsx` | Download formatted Excel (.xlsx) file | Yes |

## Billing & Payments (`/api/v1/subscription`, `/api/v1/webhooks`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/subscription` | Get plan status, usage count & limits | Yes |
| `POST` | `/subscription/checkout` | Create Razorpay order for Pro upgrade | Yes |
| `POST` | `/subscription/verify` | Verify Razorpay payment & activate Pro | Yes |
| `POST` | `/webhooks/razorpay` | Handle Razorpay server-to-server webhooks | Signature Verified |

## Admin Dashboard (`/api/v1/admin`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/admin/stats` | System users, MRR, OCR failures, MRR stats | Admin Role |
