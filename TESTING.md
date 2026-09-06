# BillStack Testing Guide

## 1. Backend Testing (JUnit 5 & Mockito)
To execute backend unit and service tests:
```bash
cd backend
mvn test
```

### Covered Test Cases:
- `CategorizationServiceTest`: Validates default Indian keyword parsing (Uber, Swiggy, AWS) and confirms custom user rules take priority.
- `UsageLimitServiceTest`: Tests free user limit enforcement (throws `LimitExceededException` on 21st receipt) and verifies Pro users bypass upload caps.
- `AuthServiceTest`: Validates user registration, password BCrypt hashing, duplicate email rejection, and JWT generation.

## 2. Security Test Scenarios Executed
- **User Resource Isolation**: Verified that querying `/api/v1/receipts/{id}` with another user's JWT throws `UnauthorizedException`.
- **Payment Verification**: Verified that tampered Razorpay signatures return `400 Bad Request` and fail activation.
- **File Upload Limits**: Verified that files larger than 10MB or with unallowed MIME types (e.g. `.exe`) return `400 Bad Request`.
