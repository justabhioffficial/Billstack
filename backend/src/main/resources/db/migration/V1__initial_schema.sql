-- BillStack Initial Database Schema Migration (MySQL compatible)

CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(36) PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    business_type VARCHAR(100),
    country VARCHAR(100) NOT NULL DEFAULT 'India',
    currency VARCHAR(10) NOT NULL DEFAULT 'INR',
    role VARCHAR(20) NOT NULL DEFAULT 'USER',
    email_verified BOOLEAN NOT NULL DEFAULT FALSE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS refresh_tokens (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    token_hash VARCHAR(255) NOT NULL,
    expires_at DATETIME NOT NULL,
    revoked_at DATETIME NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS subscriptions (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    plan VARCHAR(20) NOT NULL DEFAULT 'FREE',
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    current_period_start DATETIME NOT NULL,
    current_period_end DATETIME NOT NULL,
    payment_provider VARCHAR(50) NOT NULL DEFAULT 'RAZORPAY',
    provider_customer_id VARCHAR(255) NULL,
    provider_subscription_id VARCHAR(255) NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS payments (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    subscription_id VARCHAR(36) NULL,
    provider VARCHAR(50) NOT NULL DEFAULT 'RAZORPAY',
    provider_order_id VARCHAR(255) NULL,
    provider_payment_id VARCHAR(255) NULL,
    amount DECIMAL(12, 2) NOT NULL,
    currency VARCHAR(10) NOT NULL DEFAULT 'INR',
    status VARCHAR(20) NOT NULL DEFAULT 'CREATED',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (subscription_id) REFERENCES subscriptions(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS categories (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NULL,
    name VARCHAR(100) NOT NULL,
    icon VARCHAR(50) NULL,
    color VARCHAR(20) NULL,
    is_default BOOLEAN NOT NULL DEFAULT FALSE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS categorization_rules (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    vendor_pattern VARCHAR(255) NOT NULL,
    category_id VARCHAR(36) NOT NULL,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS receipts (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    vendor_name VARCHAR(255) NULL,
    receipt_date DATE NULL,
    total_amount DECIMAL(12, 2) NULL,
    tax_amount DECIMAL(12, 2) NULL,
    currency VARCHAR(10) NOT NULL DEFAULT 'INR',
    receipt_number VARCHAR(100) NULL,
    payment_mode VARCHAR(50) NULL,
    category_id VARCHAR(36) NULL,
    is_business BOOLEAN NOT NULL DEFAULT TRUE,
    file_key VARCHAR(512) NOT NULL,
    original_filename VARCHAR(255) NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    file_size BIGINT NOT NULL,
    source VARCHAR(20) NOT NULL DEFAULT 'WEB',
    ocr_status VARCHAR(30) NOT NULL DEFAULT 'UPLOADED',
    ocr_raw_text TEXT NULL,
    overall_confidence DECIMAL(5, 2) NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS receipt_fields (
    id VARCHAR(36) PRIMARY KEY,
    receipt_id VARCHAR(36) NOT NULL,
    field_name VARCHAR(50) NOT NULL,
    field_value VARCHAR(512) NULL,
    confidence DECIMAL(5, 2) NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (receipt_id) REFERENCES receipts(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS monthly_usage (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    usage_month VARCHAR(7) NOT NULL,
    receipt_count INT NOT NULL DEFAULT 0,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT uk_user_usage_month UNIQUE (user_id, usage_month),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS audit_logs (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NULL,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id VARCHAR(36) NULL,
    metadata TEXT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Seed Default Expense Categories
INSERT INTO categories (id, user_id, name, icon, color, is_default, created_at, updated_at) VALUES
('cat-sw-tools', NULL, 'Software & Tools', 'Cpu', '#2563EB', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('cat-internet-phone', NULL, 'Internet & Phone', 'Wifi', '#0D9488', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('cat-travel', NULL, 'Travel', 'Navigation', '#D97706', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('cat-food', NULL, 'Food & Dining', 'Utensils', '#DC2626', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('cat-equipment', NULL, 'Equipment', 'Monitor', '#7C3AED', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('cat-marketing', NULL, 'Marketing & Advertising', 'Megaphone', '#DB2777', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('cat-office-supplies', NULL, 'Office Supplies', 'Package', '#4F46E5', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('cat-prof-services', NULL, 'Professional Services', 'Briefcase', '#059669', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('cat-education', NULL, 'Education & Books', 'BookOpen', '#0284C7', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('cat-utilities', NULL, 'Utilities', 'Zap', '#EA580C', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('cat-other', NULL, 'Other Expenses', 'Grid', '#64748B', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Performance Indexes
CREATE INDEX idx_receipts_user_date ON receipts(user_id, receipt_date);
CREATE INDEX idx_receipts_user_category ON receipts(user_id, category_id);
CREATE INDEX idx_receipts_user_vendor ON receipts(user_id, vendor_name);
CREATE INDEX idx_receipts_user_created ON receipts(user_id, created_at);
CREATE INDEX idx_usage_user_month ON monthly_usage(user_id, usage_month);
