package com.billstack.dto;

import com.billstack.entity.UserReferral;

public class ReferralDto {
    private String id;
    private String referrerId;
    private String referredId;
    private String referralCode;
    private String status;
    private String rewardGranted;
    private String createdAt;
    private String activatedAt;

    public ReferralDto() {}

    public static ReferralDto fromEntity(UserReferral ref) {
        ReferralDto dto = new ReferralDto();
        dto.setId(ref.getId());
        dto.setReferrerId(ref.getReferrerId());
        dto.setReferredId(ref.getReferredId());
        dto.setReferralCode(ref.getReferralCode());
        dto.setStatus(ref.getStatus());
        dto.setRewardGranted(ref.getRewardGranted());
        dto.setCreatedAt(ref.getCreatedAt() != null ? ref.getCreatedAt().toString() : null);
        dto.setActivatedAt(ref.getActivatedAt() != null ? ref.getActivatedAt().toString() : null);
        return dto;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getReferrerId() { return referrerId; }
    public void setReferrerId(String referrerId) { this.referrerId = referrerId; }

    public String getReferredId() { return referredId; }
    public void setReferredId(String referredId) { this.referredId = referredId; }

    public String getReferralCode() { return referralCode; }
    public void setReferralCode(String referralCode) { this.referralCode = referralCode; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getRewardGranted() { return rewardGranted; }
    public void setRewardGranted(String rewardGranted) { this.rewardGranted = rewardGranted; }

    public String getCreatedAt() { return createdAt; }
    public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }

    public String getActivatedAt() { return activatedAt; }
    public void setActivatedAt(String activatedAt) { this.activatedAt = activatedAt; }
}
