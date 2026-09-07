package com.billstack.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "user_feedback", indexes = {
        @Index(name = "idx_feedback_user_status", columnList = "user_id, status")
})
public class UserFeedback {

    @Id
    private String id;

    @Column(name = "user_id", nullable = false)
    private String userId;

    @Column(name = "feedback_type", nullable = false, length = 50)
    private String feedbackType; // BUG_REPORT, FEATURE_SUGGESTION, OCR_CORRECTION, COPILOT_FEEDBACK, GENERAL

    @Column(name = "feature_area", length = 50)
    private String featureArea;

    private Integer rating; // 1 to 5 stars or helpful indicator

    @Column(nullable = false, columnDefinition = "TEXT")
    private String message;

    @Column(nullable = false, length = 20)
    private String status = "PENDING"; // PENDING, IN_REVIEW, RESOLVED, CLOSED

    @Column(name = "admin_notes", columnDefinition = "TEXT")
    private String adminNotes;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "resolved_at")
    private LocalDateTime resolvedAt;

    public UserFeedback() {
        this.id = UUID.randomUUID().toString();
        this.createdAt = LocalDateTime.now();
    }

    public UserFeedback(String userId, String feedbackType, String featureArea, Integer rating, String message) {
        this();
        this.userId = userId;
        this.feedbackType = feedbackType;
        this.featureArea = featureArea;
        this.rating = rating;
        this.message = message;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getFeedbackType() { return feedbackType; }
    public void setFeedbackType(String feedbackType) { this.feedbackType = feedbackType; }

    public String getFeatureArea() { return featureArea; }
    public void setFeatureArea(String featureArea) { this.featureArea = featureArea; }

    public Integer getRating() { return rating; }
    public void setRating(Integer rating) { this.rating = rating; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getAdminNotes() { return adminNotes; }
    public void setAdminNotes(String adminNotes) { this.adminNotes = adminNotes; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getResolvedAt() { return resolvedAt; }
    public void setResolvedAt(LocalDateTime resolvedAt) { this.resolvedAt = resolvedAt; }
}
