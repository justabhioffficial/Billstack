package com.billstack.dto;

import java.math.BigDecimal;
import java.util.List;

public class VendorAnalyticsDto {

    private String vendorName;
    private BigDecimal totalSpent;
    private long receiptCount;
    private BigDecimal averageTransaction;
    private BigDecimal highestTransaction;
    private BigDecimal currentMonthSpending;
    private BigDecimal previousMonthSpending;
    private BigDecimal yearlySpending;
    private boolean isRecurring;
    private List<ReceiptDto> recentReceipts;

    public VendorAnalyticsDto() {}

    public String getVendorName() { return vendorName; }
    public void setVendorName(String vendorName) { this.vendorName = vendorName; }

    public BigDecimal getTotalSpent() { return totalSpent; }
    public void setTotalSpent(BigDecimal totalSpent) { this.totalSpent = totalSpent; }

    public long getReceiptCount() { return receiptCount; }
    public void setReceiptCount(long receiptCount) { this.receiptCount = receiptCount; }

    public BigDecimal getAverageTransaction() { return averageTransaction; }
    public void setAverageTransaction(BigDecimal averageTransaction) { this.averageTransaction = averageTransaction; }

    public BigDecimal getHighestTransaction() { return highestTransaction; }
    public void setHighestTransaction(BigDecimal highestTransaction) { this.highestTransaction = highestTransaction; }

    public BigDecimal getCurrentMonthSpending() { return currentMonthSpending; }
    public void setCurrentMonthSpending(BigDecimal currentMonthSpending) { this.currentMonthSpending = currentMonthSpending; }

    public BigDecimal getPreviousMonthSpending() { return previousMonthSpending; }
    public void setPreviousMonthSpending(BigDecimal previousMonthSpending) { this.previousMonthSpending = previousMonthSpending; }

    public BigDecimal getYearlySpending() { return yearlySpending; }
    public void setYearlySpending(BigDecimal yearlySpending) { this.yearlySpending = yearlySpending; }

    public boolean isRecurring() { return isRecurring; }
    public void setRecurring(boolean recurring) { isRecurring = recurring; }

    public List<ReceiptDto> getRecentReceipts() { return recentReceipts; }
    public void setRecentReceipts(List<ReceiptDto> recentReceipts) { this.recentReceipts = recentReceipts; }
}
