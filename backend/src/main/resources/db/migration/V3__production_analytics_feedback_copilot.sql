-- BillStack V3 Production Analytics, Audit Logging, User Feedback & Beta System Schema Migration

CREATE TABLE IF NOT EXISTS audit_logs (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NULL,
    action VARCHAR(100) NOT NULL,
    target VARCHAR(255) NULL,
    ip_address VARCHAR(45) NULL,
    request_id VARCHAR(64) NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'SUCCESS',
    details TEXT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS product_analytics_events (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NULL,
    event_name VARCHAR(100) NOT NULL,
    session_id VARCHAR(64) NULL,
    properties_json TEXT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS user_feedback (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    feedback_type VARCHAR(50) NOT NULL,
    feature_area VARCHAR(50) NULL,
    rating INT NULL,
    message TEXT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    admin_notes TEXT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    resolved_at DATETIME NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS beta_user_cohorts (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL UNIQUE,
    cohort_phase VARCHAR(20) NOT NULL DEFAULT 'PHASE_1',
    feature_flags TEXT NULL,
    onboarding_completed BOOLEAN NOT NULL DEFAULT FALSE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Performance & Audit Indexes
CREATE INDEX idx_audit_user_action ON audit_logs(user_id, action, created_at);
CREATE INDEX idx_analytics_event_date ON product_analytics_events(event_name, created_at);
CREATE INDEX idx_feedback_user_status ON user_feedback(user_id, status);
CREATE INDEX idx_receipts_user_date_status ON receipts(user_id, receipt_date, ocr_status);
