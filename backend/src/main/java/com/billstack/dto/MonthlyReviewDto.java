package com.billstack.dto;

import java.math.BigDecimal;
import java.util.List;

public class MonthlyReviewDto {

    private String targetMonth;
    private String monthName;
    private BigDecimal totalExpenses;
    private long totalReceipts;
    private String biggestCategoryName;
    private BigDecimal biggestCategoryAmount;
    private String biggestPurchaseVendor;
    private BigDecimal biggestPurchaseAmount;
    private Double momChangePercentage;
    private int organizationScore;
    private long unresolvedReceiptsCount;
    private List<RecurringExpenseDto> recurringExpenses;
    private List<String> keyInsights;

    public MonthlyReviewDto() {}

    public String getTargetMonth() { return targetMonth; }
    public void setTargetMonth(String targetMonth) { this.targetMonth = targetMonth; }

    public String getMonthName() { return monthName; }
    public void setMonthName(String monthName) { this.monthName = monthName; }

    public BigDecimal getTotalExpenses() { return totalExpenses; }
    public void setTotalExpenses(BigDecimal totalExpenses) { this.totalExpenses = totalExpenses; }

    public long getTotalReceipts() { return totalReceipts; }
    public void setTotalReceipts(long totalReceipts) { this.totalReceipts = totalReceipts; }

    public String getBiggestCategoryName() { return biggestCategoryName; }
    public void setBiggestCategoryName(String biggestCategoryName) { this.biggestCategoryName = biggestCategoryName; }

    public BigDecimal getBiggestCategoryAmount() { return biggestCategoryAmount; }
    public void setBiggestCategoryAmount(BigDecimal biggestCategoryAmount) { this.biggestCategoryAmount = biggestCategoryAmount; }

    public String getBiggestPurchaseVendor() { return biggestPurchaseVendor; }
    public void setBiggestPurchaseVendor(String biggestPurchaseVendor) { this.biggestPurchaseVendor = biggestPurchaseVendor; }

    public BigDecimal getBiggestPurchaseAmount() { return biggestPurchaseAmount; }
    public void setBiggestPurchaseAmount(BigDecimal biggestPurchaseAmount) { this.biggestPurchaseAmount = biggestPurchaseAmount; }

    public Double getMomChangePercentage() { return momChangePercentage; }
    public void setMomChangePercentage(Double momChangePercentage) { this.momChangePercentage = momChangePercentage; }

    public int getOrganizationScore() { return organizationScore; }
    public void setOrganizationScore(int organizationScore) { this.organizationScore = organizationScore; }

    public long getUnresolvedReceiptsCount() { return unresolvedReceiptsCount; }
    public void setUnresolvedReceiptsCount(long unresolvedReceiptsCount) { this.unresolvedReceiptsCount = unresolvedReceiptsCount; }

    public List<RecurringExpenseDto> getRecurringExpenses() { return recurringExpenses; }
    public void setRecurringExpenses(List<RecurringExpenseDto> recurringExpenses) { this.recurringExpenses = recurringExpenses; }

    public List<String> getKeyInsights() { return keyInsights; }
    public void setKeyInsights(List<String> keyInsights) { this.keyInsights = keyInsights; }
}
