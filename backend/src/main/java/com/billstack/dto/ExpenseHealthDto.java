package com.billstack.dto;

import java.util.List;

public class ExpenseHealthDto {

    private int score; // 0 to 100
    private String statusLabel; // e.g. "Excellent", "Good", "Needs Attention"
    private int categorizationRate; // percentage
    private int validAmountRate;
    private int reviewedRate;
    private int validVendorRate;
    private long unresolvedCount;
    private long duplicateWarningCount;
    private List<String> positiveFactors;
    private List<String> warningFactors;

    public ExpenseHealthDto() {}

    public int getScore() { return score; }
    public void setScore(int score) { this.score = score; }

    public String getStatusLabel() { return statusLabel; }
    public void setStatusLabel(String statusLabel) { this.statusLabel = statusLabel; }

    public int getCategorizationRate() { return categorizationRate; }
    public void setCategorizationRate(int categorizationRate) { this.categorizationRate = categorizationRate; }

    public int getValidAmountRate() { return validAmountRate; }
    public void setValidAmountRate(int validAmountRate) { this.validAmountRate = validAmountRate; }

    public int getReviewedRate() { return reviewedRate; }
    public void setReviewedRate(int reviewedRate) { this.reviewedRate = reviewedRate; }

    public int getValidVendorRate() { return validVendorRate; }
    public void setValidVendorRate(int validVendorRate) { this.validVendorRate = validVendorRate; }

    public long getUnresolvedCount() { return unresolvedCount; }
    public void setUnresolvedCount(long unresolvedCount) { this.unresolvedCount = unresolvedCount; }

    public long getDuplicateWarningCount() { return duplicateWarningCount; }
    public void setDuplicateWarningCount(long duplicateWarningCount) { this.duplicateWarningCount = duplicateWarningCount; }

    public List<String> getPositiveFactors() { return positiveFactors; }
    public void setPositiveFactors(List<String> positiveFactors) { this.positiveFactors = positiveFactors; }

    public List<String> getWarningFactors() { return warningFactors; }
    public void setWarningFactors(List<String> warningFactors) { this.warningFactors = warningFactors; }
}
