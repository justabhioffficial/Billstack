# BillStack Environment Variables Reference

Create a `.env` file or export these environment variables in your deployment environment.

```env
# Server Properties
PORT=8080
SPRING_PROFILES_ACTIVE=dev

# Database Configuration
DATABASE_URL=jdbc:mysql://localhost:3306/billstackdb?useSSL=true
DATABASE_USERNAME=billstack_user
DATABASE_PASSWORD=secure_password_123

# JWT Configuration
JWT_SECRET=9a6f8b12c4e5d6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1
JWT_EXPIRATION_MS=86400000
JWT_REFRESH_EXPIRATION_MS=604800000

# CORS Configuration
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000

# Storage Provider (local or s3)
STORAGE_TYPE=local
STORAGE_LOCAL_DIR=uploads
S3_ENDPOINT=https://s3.amazonaws.com
S3_BUCKET=billstack-receipts-prod
S3_ACCESS_KEY=your_aws_access_key
S3_SECRET_KEY=your_aws_secret_key
S3_REGION=ap-south-1

# OCR Provider (mock or vision or textract)
OCR_PROVIDER=mock
OCR_API_KEY=your_ocr_provider_key

# Razorpay Payments Integration
RAZORPAY_KEY_ID=rzp_live_your_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret

# Email Integration (mock or resend)
EMAIL_PROVIDER=mock
EMAIL_API_KEY=re_123456789
```
