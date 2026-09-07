package com.billstack.dto;

public class WeeklySummaryDto {
    private String weekStartDate;
    private String weekEndDate;
    private double totalWeeklySpent;
    private long totalWeeklyTransactions;
    private String topCategoryName;
    private double topCategoryAmount;
    private String largestExpenseVendor;
    private double largestExpenseAmount;
    private double wowPercentageChange; // Week over week change %
    private long receiptsNeedingReview;
    private long potentialRecurringCount;
    private String weeklySummaryInsight;

    public WeeklySummaryDto() {}

    public String getWeekStartDate() { return weekStartDate; }
    public void setWeekStartDate(String weekStartDate) { this.weekStartDate = weekStartDate; }

    public String getWeekEndDate() { return weekEndDate; }
    public void setWeekEndDate(String weekEndDate) { this.weekEndDate = weekEndDate; }

    public double getTotalWeeklySpent() { return totalWeeklySpent; }
    public void setTotalWeeklySpent(double totalWeeklySpent) { this.totalWeeklySpent = totalWeeklySpent; }

    public long getTotalWeeklyTransactions() { return totalWeeklyTransactions; }
    public void setTotalWeeklyTransactions(long totalWeeklyTransactions) { this.totalWeeklyTransactions = totalWeeklyTransactions; }

    public String getTopCategoryName() { return topCategoryName; }
    public void setTopCategoryName(String topCategoryName) { this.topCategoryName = topCategoryName; }

    public double getTopCategoryAmount() { return topCategoryAmount; }
    public void setTopCategoryAmount(double topCategoryAmount) { this.topCategoryAmount = topCategoryAmount; }

    public String getLargestExpenseVendor() { return largestExpenseVendor; }
    public void setLargestExpenseVendor(String largestExpenseVendor) { this.largestExpenseVendor = largestExpenseVendor; }

    public double getLargestExpenseAmount() { return largestExpenseAmount; }
    public void setLargestExpenseAmount(double largestExpenseAmount) { this.largestExpenseAmount = largestExpenseAmount; }

    public double getWowPercentageChange() { return wowPercentageChange; }
    public void setWowPercentageChange(double wowPercentageChange) { this.wowPercentageChange = wowPercentageChange; }

    public long getReceiptsNeedingReview() { return receiptsNeedingReview; }
    public void setReceiptsNeedingReview(long receiptsNeedingReview) { this.receiptsNeedingReview = receiptsNeedingReview; }

    public long getPotentialRecurringCount() { return potentialRecurringCount; }
    public void setPotentialRecurringCount(long potentialRecurringCount) { this.potentialRecurringCount = potentialRecurringCount; }

    public String getWeeklySummaryInsight() { return weeklySummaryInsight; }
    public void setWeeklySummaryInsight(String weeklySummaryInsight) { this.weeklySummaryInsight = weeklySummaryInsight; }
}
