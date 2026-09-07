package com.billstack.dto;

import java.util.List;

public class ReferralStatsDto {
    private String referralCode;
    private String referralLink;
    private long totalInvites;
    private long activatedReferrals;
    private long pendingReferrals;
    private String currentRewardBonus;
    private List<ReferralDto> referralHistory;

    public ReferralStatsDto() {}

    public String getReferralCode() { return referralCode; }
    public void setReferralCode(String referralCode) { this.referralCode = referralCode; }

    public String getReferralLink() { return referralLink; }
    public void setReferralLink(String referralLink) { this.referralLink = referralLink; }

    public long getTotalInvites() { return totalInvites; }
    public void setTotalInvites(long totalInvites) { this.totalInvites = totalInvites; }

    public long getActivatedReferrals() { return activatedReferrals; }
    public void setActivatedReferrals(long activatedReferrals) { this.activatedReferrals = activatedReferrals; }

    public long getPendingReferrals() { return pendingReferrals; }
    public void setPendingReferrals(long pendingReferrals) { this.pendingReferrals = pendingReferrals; }

    public String getCurrentRewardBonus() { return currentRewardBonus; }
    public void setCurrentRewardBonus(String currentRewardBonus) { this.currentRewardBonus = currentRewardBonus; }

    public List<ReferralDto> getReferralHistory() { return referralHistory; }
    public void setReferralHistory(List<ReferralDto> referralHistory) { this.referralHistory = referralHistory; }
}
