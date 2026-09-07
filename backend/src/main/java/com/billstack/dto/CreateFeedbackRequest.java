package com.billstack.dto;

public class CreateFeedbackRequest {
    private String feedbackType; // BUG_REPORT, FEATURE_SUGGESTION, OCR_CORRECTION, COPILOT_FEEDBACK, GENERAL
    private String featureArea;
    private Integer rating;
    private String message;

    public CreateFeedbackRequest() {}

    public String getFeedbackType() { return feedbackType; }
    public void setFeedbackType(String feedbackType) { this.feedbackType = feedbackType; }

    public String getFeatureArea() { return featureArea; }
    public void setFeatureArea(String featureArea) { this.featureArea = featureArea; }

    public Integer getRating() { return rating; }
    public void setRating(Integer rating) { this.rating = rating; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
}
