package com.billstack.dto;

import com.billstack.entity.UserFeedback;

public class UserFeedbackDto {
    private String id;
    private String userId;
    private String feedbackType;
    private String featureArea;
    private Integer rating;
    private String message;
    private String status;
    private String adminNotes;
    private String createdAt;
    private String resolvedAt;

    public UserFeedbackDto() {}

    public static UserFeedbackDto fromEntity(UserFeedback fb) {
        UserFeedbackDto dto = new UserFeedbackDto();
        dto.setId(fb.getId());
        dto.setUserId(fb.getUserId());
        dto.setFeedbackType(fb.getFeedbackType());
        dto.setFeatureArea(fb.getFeatureArea());
        dto.setRating(fb.getRating());
        dto.setMessage(fb.getMessage());
        dto.setStatus(fb.getStatus());
        dto.setAdminNotes(fb.getAdminNotes());
        dto.setCreatedAt(fb.getCreatedAt() != null ? fb.getCreatedAt().toString() : null);
        dto.setResolvedAt(fb.getResolvedAt() != null ? fb.getResolvedAt().toString() : null);
        return dto;
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

    public String getCreatedAt() { return createdAt; }
    public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }

    public String getResolvedAt() { return resolvedAt; }
    public void setResolvedAt(String resolvedAt) { this.resolvedAt = resolvedAt; }
}
