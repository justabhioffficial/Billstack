package com.billstack.dto;

import java.math.BigDecimal;
import java.util.List;

public class CaReviewDto {

    private String targetMonth;
    private String monthName;
    private BigDecimal totalMonthExpenses;
    private BigDecimal totalClaimableTax;
    private long totalReceipts;
    private long verifiedCount;
    private long flaggedCount;
    private double cleanPercentage;
    private boolean isCleanAndReady;
    private String nextIssueReceiptId;
    private List<ReceiptDto> issueReceipts;
    private List<String> complianceNotes;

    private long missingVendorCount;
    private long missingDateCount;
    private long missingAmountCount;
    private long missingCategoryCount;

    public CaReviewDto() {}

    public String getTargetMonth() { return targetMonth; }
    public void setTargetMonth(String targetMonth) { this.targetMonth = targetMonth; }

    public String getMonthName() { return monthName; }
    public void setMonthName(String monthName) { this.monthName = monthName; }

    public BigDecimal getTotalMonthExpenses() { return totalMonthExpenses; }
    public void setTotalMonthExpenses(BigDecimal totalMonthExpenses) { this.totalMonthExpenses = totalMonthExpenses; }

    public BigDecimal getTotalClaimableTax() { return totalClaimableTax; }
    public void setTotalClaimableTax(BigDecimal totalClaimableTax) { this.totalClaimableTax = totalClaimableTax; }

    public long getTotalReceipts() { return totalReceipts; }
    public void setTotalReceipts(long totalReceipts) { this.totalReceipts = totalReceipts; }

    public long getVerifiedCount() { return verifiedCount; }
    public void setVerifiedCount(long verifiedCount) { this.verifiedCount = verifiedCount; }

    public long getFlaggedCount() { return flaggedCount; }
    public void setFlaggedCount(long flaggedCount) { this.flaggedCount = flaggedCount; }

    public double getCleanPercentage() { return cleanPercentage; }
    public void setCleanPercentage(double cleanPercentage) { this.cleanPercentage = cleanPercentage; }

    public boolean isCleanAndReady() { return isCleanAndReady; }
    public void setCleanAndReady(boolean cleanAndReady) { isCleanAndReady = cleanAndReady; }

    public String getNextIssueReceiptId() { return nextIssueReceiptId; }
    public void setNextIssueReceiptId(String nextIssueReceiptId) { this.nextIssueReceiptId = nextIssueReceiptId; }

    public List<ReceiptDto> getIssueReceipts() { return issueReceipts; }
    public void setIssueReceipts(List<ReceiptDto> issueReceipts) { this.issueReceipts = issueReceipts; }

    public List<String> getComplianceNotes() { return complianceNotes; }
    public void setComplianceNotes(List<String> complianceNotes) { this.complianceNotes = complianceNotes; }

    public long getMissingVendorCount() { return missingVendorCount; }
    public void setMissingVendorCount(long missingVendorCount) { this.missingVendorCount = missingVendorCount; }

    public long getMissingDateCount() { return missingDateCount; }
    public void setMissingDateCount(long missingDateCount) { this.missingDateCount = missingDateCount; }

    public long getMissingAmountCount() { return missingAmountCount; }
    public void setMissingAmountCount(long missingAmountCount) { this.missingAmountCount = missingAmountCount; }

    public long getMissingCategoryCount() { return missingCategoryCount; }
    public void setMissingCategoryCount(long missingCategoryCount) { this.missingCategoryCount = missingCategoryCount; }
}
