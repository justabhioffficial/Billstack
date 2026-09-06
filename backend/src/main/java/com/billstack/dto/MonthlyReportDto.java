package com.billstack.dto;

import java.math.BigDecimal;
import java.util.List;

public class MonthlyReportDto {

    private String yearMonth;
    private BigDecimal totalExpenses;
    private BigDecimal businessExpenses;
    private BigDecimal personalExpenses;
    private long totalReceiptsCount;
    private String topCategoryName;
    private List<CategoryBreakdownDto> categoryBreakdown;
    private List<VendorBreakdownDto> vendorBreakdown;
    private List<SpendingTrendDto> monthlyTrend;

    public MonthlyReportDto() {}

    public String getYearMonth() { return yearMonth; }
    public void setYearMonth(String yearMonth) { this.yearMonth = yearMonth; }

    public BigDecimal getTotalExpenses() { return totalExpenses; }
    public void setTotalExpenses(BigDecimal totalExpenses) { this.totalExpenses = totalExpenses; }

    public BigDecimal getBusinessExpenses() { return businessExpenses; }
    public void setBusinessExpenses(BigDecimal businessExpenses) { this.businessExpenses = businessExpenses; }

    public BigDecimal getPersonalExpenses() { return personalExpenses; }
    public void setPersonalExpenses(BigDecimal personalExpenses) { this.personalExpenses = personalExpenses; }

    public long getTotalReceiptsCount() { return totalReceiptsCount; }
    public void setTotalReceiptsCount(long totalReceiptsCount) { this.totalReceiptsCount = totalReceiptsCount; }

    public String getTopCategoryName() { return topCategoryName; }
    public void setTopCategoryName(String topCategoryName) { this.topCategoryName = topCategoryName; }

    public List<CategoryBreakdownDto> getCategoryBreakdown() { return categoryBreakdown; }
    public void setCategoryBreakdown(List<CategoryBreakdownDto> categoryBreakdown) { this.categoryBreakdown = categoryBreakdown; }

    public List<VendorBreakdownDto> getVendorBreakdown() { return vendorBreakdown; }
    public void setVendorBreakdown(List<VendorBreakdownDto> vendorBreakdown) { this.vendorBreakdown = vendorBreakdown; }

    public List<SpendingTrendDto> getMonthlyTrend() { return monthlyTrend; }
    public void setMonthlyTrend(List<SpendingTrendDto> monthlyTrend) { this.monthlyTrend = monthlyTrend; }
}
