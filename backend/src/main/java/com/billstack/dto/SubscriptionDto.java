package com.billstack.dto;

import com.billstack.entity.Subscription;

public class SubscriptionDto {
    private String id;
    private String userId;
    private String plan;
    private String status;
    private String currentPeriodStart;
    private String currentPeriodEnd;
    private int monthlyUsageCount;
    private int monthlyLimit;
    private boolean isLimitReached;
    private long daysRemaining;

    public SubscriptionDto() {}

    public static SubscriptionDto fromEntity(Subscription sub, int usageCount, int limit) {
        SubscriptionDto dto = new SubscriptionDto();
        dto.setId(sub.getId());
        dto.setUserId(sub.getUserId());
        dto.setPlan(sub.getPlan());
        dto.setStatus(sub.getStatus());
        dto.setCurrentPeriodStart(sub.getCurrentPeriodStart() != null ? sub.getCurrentPeriodStart().toString() : null);
        dto.setCurrentPeriodEnd(sub.getCurrentPeriodEnd() != null ? sub.getCurrentPeriodEnd().toString() : null);
        dto.setMonthlyUsageCount(usageCount);
        dto.setMonthlyLimit(limit);

        boolean isProActive = "PRO".equalsIgnoreCase(sub.getPlan())
                && "ACTIVE".equalsIgnoreCase(sub.getStatus())
                && sub.getCurrentPeriodEnd() != null
                && sub.getCurrentPeriodEnd().isAfter(java.time.LocalDateTime.now());

        if (isProActive) {
            long daysLeft = java.time.Duration.between(java.time.LocalDateTime.now(), sub.getCurrentPeriodEnd()).toDays();
            dto.setDaysRemaining(Math.max(0, daysLeft));
            dto.setLimitReached(false);
        } else {
            dto.setDaysRemaining(0);
            dto.setLimitReached(usageCount >= limit);
        }

        return dto;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getPlan() { return plan; }
    public void setPlan(String plan) { this.plan = plan; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getCurrentPeriodStart() { return currentPeriodStart; }
    public void setCurrentPeriodStart(String currentPeriodStart) { this.currentPeriodStart = currentPeriodStart; }

    public String getCurrentPeriodEnd() { return currentPeriodEnd; }
    public void setCurrentPeriodEnd(String currentPeriodEnd) { this.currentPeriodEnd = currentPeriodEnd; }

    public int getMonthlyUsageCount() { return monthlyUsageCount; }
    public void setMonthlyUsageCount(int monthlyUsageCount) { this.monthlyUsageCount = monthlyUsageCount; }

    public int getMonthlyLimit() { return monthlyLimit; }
    public void setMonthlyLimit(int monthlyLimit) { this.monthlyLimit = monthlyLimit; }

    public boolean isLimitReached() { return isLimitReached; }
    public void setLimitReached(boolean limitReached) { isLimitReached = limitReached; }

    public long getDaysRemaining() { return daysRemaining; }
    public void setDaysRemaining(long daysRemaining) { this.daysRemaining = daysRemaining; }
}
