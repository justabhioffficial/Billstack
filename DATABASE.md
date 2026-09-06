# BillStack Database Schema Documentation

## Running with MySQL 8.x

### Option A: Via Docker Compose (Recommended)
Launch MySQL 8.0 & phpMyAdmin:
```bash
docker-compose up -d mysql phpmyadmin
```
- **MySQL Database Port**: `3306` (Database: `billstackdb`, User: `root` / Pass: `root`)
- **phpMyAdmin Web Interface**: [http://localhost:8081](http://localhost:8081)

### Option B: Local MySQL Server
Ensure MySQL 8.x service is running locally on port 3306 and create the database:
```sql
CREATE DATABASE IF NOT EXISTS billstackdb;
```

---

## Activating MySQL Profile in Spring Boot

To run the backend using MySQL, activate the `mysql` Spring profile:

```bash
cd backend
mvn spring-boot:run -Dspring-boot.run.profiles=mysql
```

Or set environment variables:
```env
SPRING_PROFILES_ACTIVE=mysql
DATABASE_URL=jdbc:mysql://localhost:3306/billstackdb?useSSL=false&allowPublicKeyRetrieval=true
DATABASE_USERNAME=root
DATABASE_PASSWORD=root
```


```
  ┌──────────────┐         ┌────────────────────┐         ┌──────────────┐
  │    users     │1       *│     receipts       │*       1│  categories  │
  ├──────────────┼─────────┼────────────────────┼─────────┼──────────────┤
  │ id (PK)      │         │ id (PK)            │         │ id (PK)      │
  │ email        │         │ user_id (FK)       │         │ user_id (FK) │
  │ password_hash│         │ category_id (FK)   │         │ name         │
  │ role         │         │ total_amount (DEC) │         │ icon, color  │
  └──────────────┘         │ tax_amount (DEC)   │         └──────────────┘
                           │ file_key           │
                           │ ocr_status         │
                           └────────────────────┘
```

## Monetary Decimal Standard
All financial amounts (`total_amount`, `tax_amount`, `amount` in payments) use `DECIMAL(12,2)` types. Floating-point numbers are strictly forbidden in database schemas and Java entities to prevent floating-point rounding inaccuracies.

## Performance Indexes Created
- `idx_receipts_user_date` (`user_id`, `receipt_date`)
- `idx_receipts_user_category` (`user_id`, `category_id`)
- `idx_receipts_user_vendor` (`user_id`, `vendor_name`)
- `idx_receipts_user_created` (`user_id`, `created_at`)
- `idx_usage_user_month` (`user_id`, `usage_month`)

## Concurrency Control
The `monthly_usage` table enforces a unique constraint on `(user_id, usage_month)`. Incrementing monthly usage executes inside a transaction using pessimistic write locks (`findForUpdate`) to guarantee concurrency safety during simultaneous file uploads.
