package com.billstack.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "subscription_cancellations")
public class SubscriptionCancellation {

    @Id
    private String id;

    @Column(name = "user_id", nullable = false)
    private String userId;

    @Column(name = "reason", nullable = false)
    private String reason;

    @Column(name = "feedback", columnDefinition = "TEXT")
    private String feedback;

    @Column(name = "plan_cancelled", nullable = false)
    private String planCancelled;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    public SubscriptionCancellation() {
        this.id = UUID.randomUUID().toString();
        this.createdAt = LocalDateTime.now();
    }

    public SubscriptionCancellation(String userId, String reason, String feedback, String planCancelled) {
        this();
        this.userId = userId;
        this.reason = reason;
        this.feedback = feedback;
        this.planCancelled = planCancelled;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }

    public String getFeedback() { return feedback; }
    public void setFeedback(String feedback) { this.feedback = feedback; }

    public String getPlanCancelled() { return planCancelled; }
    public void setPlanCancelled(String planCancelled) { this.planCancelled = planCancelled; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
