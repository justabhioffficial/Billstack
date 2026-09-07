package com.billstack.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "user_notification_preferences")
public class UserNotificationPreferences {

    @Id
    private String id;

    @Column(name = "user_id", nullable = false, unique = true)
    private String userId;

    @Column(name = "monthly_summary_email", nullable = false)
    private boolean monthlySummaryEmail = true;

    @Column(name = "spending_alerts_email", nullable = false)
    private boolean spendingAlertsEmail = true;

    @Column(name = "recurring_alerts_email", nullable = false)
    private boolean recurringAlertsEmail = true;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt = LocalDateTime.now();

    public UserNotificationPreferences() {
        this.id = java.util.UUID.randomUUID().toString();
    }

    public UserNotificationPreferences(String userId) {
        this();
        this.userId = userId;
    }

    @PreUpdate
    public void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public boolean isMonthlySummaryEmail() { return monthlySummaryEmail; }
    public void setMonthlySummaryEmail(boolean monthlySummaryEmail) { this.monthlySummaryEmail = monthlySummaryEmail; }

    public boolean isSpendingAlertsEmail() { return spendingAlertsEmail; }
    public void setSpendingAlertsEmail(boolean spendingAlertsEmail) { this.spendingAlertsEmail = spendingAlertsEmail; }

    public boolean isRecurringAlertsEmail() { return recurringAlertsEmail; }
    public void setRecurringAlertsEmail(boolean recurringAlertsEmail) { this.recurringAlertsEmail = recurringAlertsEmail; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
