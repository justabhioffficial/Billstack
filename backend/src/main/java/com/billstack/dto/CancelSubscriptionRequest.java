package com.billstack.dto;

public class CancelSubscriptionRequest {
    private String reason; // TOO_EXPENSIVE, NOT_USING_ENOUGH, MISSING_FEATURE, OCR_ISSUES, OTHER
    private String feedback;

    public CancelSubscriptionRequest() {}

    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }

    public String getFeedback() { return feedback; }
    public void setFeedback(String feedback) { this.feedback = feedback; }
}
