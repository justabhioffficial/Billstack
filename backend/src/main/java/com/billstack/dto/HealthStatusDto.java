package com.billstack.dto;

import java.util.Map;

public class HealthStatusDto {
    private String overallStatus; // HEALTHY, DEGRADED, FAILING
    private Map<String, String> components; // database, ocrEngine, storage, payments, emailSystem
    private long activeUsers;
    private long totalReceipts;
    private double ocrSuccessRate;
    private String timestamp;

    public HealthStatusDto() {}

    public HealthStatusDto(String overallStatus, Map<String, String> components, long activeUsers, long totalReceipts, double ocrSuccessRate, String timestamp) {
        this.overallStatus = overallStatus;
        this.components = components;
        this.activeUsers = activeUsers;
        this.totalReceipts = totalReceipts;
        this.ocrSuccessRate = ocrSuccessRate;
        this.timestamp = timestamp;
    }

    public String getOverallStatus() { return overallStatus; }
    public void setOverallStatus(String overallStatus) { this.overallStatus = overallStatus; }

    public Map<String, String> getComponents() { return components; }
    public void setComponents(Map<String, String> components) { this.components = components; }

    public long getActiveUsers() { return activeUsers; }
    public void setActiveUsers(long activeUsers) { this.activeUsers = activeUsers; }

    public long getTotalReceipts() { return totalReceipts; }
    public void setTotalReceipts(long totalReceipts) { this.totalReceipts = totalReceipts; }

    public double getOcrSuccessRate() { return ocrSuccessRate; }
    public void setOcrSuccessRate(double ocrSuccessRate) { this.ocrSuccessRate = ocrSuccessRate; }

    public String getTimestamp() { return timestamp; }
    public void setTimestamp(String timestamp) { this.timestamp = timestamp; }
}
