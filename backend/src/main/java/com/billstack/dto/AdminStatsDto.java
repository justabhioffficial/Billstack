package com.billstack.dto;

import java.math.BigDecimal;

public class AdminStatsDto {
    private long totalUsers;
    private long totalReceipts;
    private long failedOcrCount;
    private long freeUsersCount;
    private long proUsersCount;
    private BigDecimal monthlyRecurringRevenue;
    private long failedPaymentsCount;

    public AdminStatsDto() {}

    public long getTotalUsers() { return totalUsers; }
    public void setTotalUsers(long totalUsers) { this.totalUsers = totalUsers; }

    public long getTotalReceipts() { return totalReceipts; }
    public void setTotalReceipts(long totalReceipts) { this.totalReceipts = totalReceipts; }

    public long getFailedOcrCount() { return failedOcrCount; }
    public void setFailedOcrCount(long failedOcrCount) { this.failedOcrCount = failedOcrCount; }

    public long getFreeUsersCount() { return freeUsersCount; }
    public void setFreeUsersCount(long freeUsersCount) { this.freeUsersCount = freeUsersCount; }

    public long getProUsersCount() { return proUsersCount; }
    public void setProUsersCount(long proUsersCount) { this.proUsersCount = proUsersCount; }

    public BigDecimal getMonthlyRecurringRevenue() { return monthlyRecurringRevenue; }
    public void setMonthlyRecurringRevenue(BigDecimal monthlyRecurringRevenue) { this.monthlyRecurringRevenue = monthlyRecurringRevenue; }

    public long getFailedPaymentsCount() { return failedPaymentsCount; }
    public void setFailedPaymentsCount(long failedPaymentsCount) { this.failedPaymentsCount = failedPaymentsCount; }
}
