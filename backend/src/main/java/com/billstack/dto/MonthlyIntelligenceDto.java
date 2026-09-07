package com.billstack.dto;

import java.math.BigDecimal;
import java.util.List;

public class MonthlyIntelligenceDto {

    private String targetMonth; // e.g. "2026-09"
    private String monthName;   // e.g. "September 2026"
    private BigDecimal totalExpenses;
    private long totalReceipts;
    private long categorizedReceipts;
    private long uncategorizedReceipts;
    private BigDecimal averageReceiptAmount;
    private BigDecimal largestExpenseAmount;
    private String largestExpenseVendor;
    private BigDecimal smallestExpenseAmount;
    private String smallestExpenseVendor;
    private Double momChangePercentage;
    private String momChangeStatus; // "INCREASED", "DECREASED", "STABLE"
    private int organizationPercentage;
    private String estimatedTimeSaved; // e.g. "~2h 21m"
    private List<CategoryBreakdownExtendedDto> categoryBreakdown;
    private List<String> naturalLanguageInsights;

    public MonthlyIntelligenceDto() {}

    public String getTargetMonth() { return targetMonth; }
    public void setTargetMonth(String targetMonth) { this.targetMonth = targetMonth; }

    public String getMonthName() { return monthName; }
    public void setMonthName(String monthName) { this.monthName = monthName; }

    public BigDecimal getTotalExpenses() { return totalExpenses; }
    public void setTotalExpenses(BigDecimal totalExpenses) { this.totalExpenses = totalExpenses; }

    public long getTotalReceipts() { return totalReceipts; }
    public void setTotalReceipts(long totalReceipts) { this.totalReceipts = totalReceipts; }

    public long getCategorizedReceipts() { return categorizedReceipts; }
    public void setCategorizedReceipts(long categorizedReceipts) { this.categorizedReceipts = categorizedReceipts; }

    public long getUncategorizedReceipts() { return uncategorizedReceipts; }
    public void setUncategorizedReceipts(long uncategorizedReceipts) { this.uncategorizedReceipts = uncategorizedReceipts; }

    public BigDecimal getAverageReceiptAmount() { return averageReceiptAmount; }
    public void setAverageReceiptAmount(BigDecimal averageReceiptAmount) { this.averageReceiptAmount = averageReceiptAmount; }

    public BigDecimal getLargestExpenseAmount() { return largestExpenseAmount; }
    public void setLargestExpenseAmount(BigDecimal largestExpenseAmount) { this.largestExpenseAmount = largestExpenseAmount; }

    public String getLargestExpenseVendor() { return largestExpenseVendor; }
    public void setLargestExpenseVendor(String largestExpenseVendor) { this.largestExpenseVendor = largestExpenseVendor; }

    public BigDecimal getSmallestExpenseAmount() { return smallestExpenseAmount; }
    public void setSmallestExpenseAmount(BigDecimal smallestExpenseAmount) { this.smallestExpenseAmount = smallestExpenseAmount; }

    public String getSmallestExpenseVendor() { return smallestExpenseVendor; }
    public void setSmallestExpenseVendor(String smallestExpenseVendor) { this.smallestExpenseVendor = smallestExpenseVendor; }

    public Double getMomChangePercentage() { return momChangePercentage; }
    public void setMomChangePercentage(Double momChangePercentage) { this.momChangePercentage = momChangePercentage; }

    public String getMomChangeStatus() { return momChangeStatus; }
    public void setMomChangeStatus(String momChangeStatus) { this.momChangeStatus = momChangeStatus; }

    public int getOrganizationPercentage() { return organizationPercentage; }
    public void setOrganizationPercentage(int organizationPercentage) { this.organizationPercentage = organizationPercentage; }

    public String getEstimatedTimeSaved() { return estimatedTimeSaved; }
    public void setEstimatedTimeSaved(String estimatedTimeSaved) { this.estimatedTimeSaved = estimatedTimeSaved; }

    public List<CategoryBreakdownExtendedDto> getCategoryBreakdown() { return categoryBreakdown; }
    public void setCategoryBreakdown(List<CategoryBreakdownExtendedDto> categoryBreakdown) { this.categoryBreakdown = categoryBreakdown; }

    public List<String> getNaturalLanguageInsights() { return naturalLanguageInsights; }
    public void setNaturalLanguageInsights(List<String> naturalLanguageInsights) { this.naturalLanguageInsights = naturalLanguageInsights; }
}
