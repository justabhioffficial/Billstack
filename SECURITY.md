# BillStack Security Specification

## 1. Authentication & Session Security
- **Passwords**: Hashed with strong BCrypt rounds before persistence. Plaintext passwords are never stored or logged.
- **JWT Architecture**: Stateless JWT access tokens signed with HMAC-SHA256. Short-lived access tokens (24h) and secure refresh tokens (7d).
- **Sensitive Output Prevention**: Hashes, JWT secrets, and database credentials are excluded from API DTOs and logging frameworks.

## 2. Row-Level Data Isolation (Multi-Tenancy)
- All user-owned entities (Receipts, Categories, Rules, Subscriptions) enforce explicit `userId` filtering in Spring Data JPA queries.
- User A cannot access User B's receipt by tampering with URL parameters (`/api/v1/receipts/{id}`). Unauthorized access attempts return `401 Unauthorized` or `404 Not Found`.

## 3. File Storage Security
- **MIME & Magic Bytes**: Incoming file uploads are strictly limited to `image/jpeg`, `image/png`, and `application/pdf`. File sizes exceeding 10MB are rejected at the edge.
- **Path Traversal Prevention**: Original filenames are sanitized and replaced with generated UUID file keys (`user_id/uuid.ext`). Uploaded files are served with controlled Content-Disposition headers.

## 4. Payment Verification Security
- Razorpay signatures are verified on the backend using HMAC-SHA256 (`order_id + "|" + payment_id` signed with `RAZORPAY_KEY_SECRET`). Frontend payment status is never trusted blindly.
- Webhook endpoints verify signatures before processing subscription events.
