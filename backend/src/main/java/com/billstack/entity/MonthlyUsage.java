package com.billstack.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "monthly_usage", uniqueConstraints = {
    @UniqueConstraint(name = "uk_user_usage_month", columnNames = {"user_id", "usage_month"})
})
public class MonthlyUsage {

    @Id
    private String id;

    @Column(name = "user_id", nullable = false)
    private String userId;

    @Column(name = "usage_month", nullable = false, length = 7)
    private String yearMonth; // Format: YYYY-MM

    @Column(name = "receipt_count", nullable = false)
    private int receiptCount = 0;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        if (id == null) id = UUID.randomUUID().toString();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public MonthlyUsage() {}

    public MonthlyUsage(String userId, String yearMonth, int receiptCount) {
        this.userId = userId;
        this.yearMonth = yearMonth;
        this.receiptCount = receiptCount;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getYearMonth() { return yearMonth; }
    public void setYearMonth(String yearMonth) { this.yearMonth = yearMonth; }

    public int getReceiptCount() { return receiptCount; }
    public void setReceiptCount(int receiptCount) { this.receiptCount = receiptCount; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
