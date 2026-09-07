package com.billstack.dto;

import java.util.Map;

public class FounderMetricsDto {
    // User Growth Metrics
    private long totalUsers;
    private long newUsersThisMonth;
    private long activeUsersMonthly;
    private long activeUsersDaily;
    private double activationRatePercentage; // % who uploaded first receipt
    private double retentionRate7Day;
    private double retentionRate30Day;

    // Financial Metrics
    private double monthlyRecurringRevenue;
    private double annualRecurringRevenue;
    private long activePaidSubscriptions;
    private double freeToPaidConversionRate;
    private double averageRevenuePerUser;

    // Retention & Churn
    private long totalCancellations;
    private double churnRatePercentage;
    private Map<String, Long> cancellationReasonsBreakdown;

    // Viral Referrals
    private long totalReferralInvites;
    private long activatedReferrals;
    private double referralConversionRate;

    // System Activity
    private long totalReceiptsProcessed;
    private long totalCopilotQueries;
    private String generatedTimestamp;

    public FounderMetricsDto() {}

    // Getters and Setters
    public long getTotalUsers() { return totalUsers; }
    public void setTotalUsers(long totalUsers) { this.totalUsers = totalUsers; }

    public long getNewUsersThisMonth() { return newUsersThisMonth; }
    public void setNewUsersThisMonth(long newUsersThisMonth) { this.newUsersThisMonth = newUsersThisMonth; }

    public long getActiveUsersMonthly() { return activeUsersMonthly; }
    public void setActiveUsersMonthly(long activeUsersMonthly) { this.activeUsersMonthly = activeUsersMonthly; }

    public long getActiveUsersDaily() { return activeUsersDaily; }
    public void setActiveUsersDaily(long activeUsersDaily) { this.activeUsersDaily = activeUsersDaily; }

    public double getActivationRatePercentage() { return activationRatePercentage; }
    public void setActivationRatePercentage(double activationRatePercentage) { this.activationRatePercentage = activationRatePercentage; }

    public double getRetentionRate7Day() { return retentionRate7Day; }
    public void setRetentionRate7Day(double retentionRate7Day) { this.retentionRate7Day = retentionRate7Day; }

    public double getRetentionRate30Day() { return retentionRate30Day; }
    public void setRetentionRate30Day(double retentionRate30Day) { this.retentionRate30Day = retentionRate30Day; }

    public double getMonthlyRecurringRevenue() { return monthlyRecurringRevenue; }
    public void setMonthlyRecurringRevenue(double monthlyRecurringRevenue) { this.monthlyRecurringRevenue = monthlyRecurringRevenue; }

    public double getAnnualRecurringRevenue() { return annualRecurringRevenue; }
    public void setAnnualRecurringRevenue(double annualRecurringRevenue) { this.annualRecurringRevenue = annualRecurringRevenue; }

    public long getActivePaidSubscriptions() { return activePaidSubscriptions; }
    public void setActivePaidSubscriptions(long activePaidSubscriptions) { this.activePaidSubscriptions = activePaidSubscriptions; }

    public double getFreeToPaidConversionRate() { return freeToPaidConversionRate; }
    public void setFreeToPaidConversionRate(double freeToPaidConversionRate) { this.freeToPaidConversionRate = freeToPaidConversionRate; }

    public double getAverageRevenuePerUser() { return averageRevenuePerUser; }
    public void setAverageRevenuePerUser(double averageRevenuePerUser) { this.averageRevenuePerUser = averageRevenuePerUser; }

    public long getTotalCancellations() { return totalCancellations; }
    public void setTotalCancellations(long totalCancellations) { this.totalCancellations = totalCancellations; }

    public double getChurnRatePercentage() { return churnRatePercentage; }
    public void setChurnRatePercentage(double churnRatePercentage) { this.churnRatePercentage = churnRatePercentage; }

    public Map<String, Long> getCancellationReasonsBreakdown() { return cancellationReasonsBreakdown; }
    public void setCancellationReasonsBreakdown(Map<String, Long> cancellationReasonsBreakdown) { this.cancellationReasonsBreakdown = cancellationReasonsBreakdown; }

    public long getTotalReferralInvites() { return totalReferralInvites; }
    public void setTotalReferralInvites(long totalReferralInvites) { this.totalReferralInvites = totalReferralInvites; }

    public long getActivatedReferrals() { return activatedReferrals; }
    public void setActivatedReferrals(long activatedReferrals) { this.activatedReferrals = activatedReferrals; }

    public double getReferralConversionRate() { return referralConversionRate; }
    public void setReferralConversionRate(double referralConversionRate) { this.referralConversionRate = referralConversionRate; }

    public long getTotalReceiptsProcessed() { return totalReceiptsProcessed; }
    public void setTotalReceiptsProcessed(long totalReceiptsProcessed) { this.totalReceiptsProcessed = totalReceiptsProcessed; }

    public long getTotalCopilotQueries() { return totalCopilotQueries; }
    public void setTotalCopilotQueries(long totalCopilotQueries) { this.totalCopilotQueries = totalCopilotQueries; }

    public String getGeneratedTimestamp() { return generatedTimestamp; }
    public void setGeneratedTimestamp(String generatedTimestamp) { this.generatedTimestamp = generatedTimestamp; }
}
