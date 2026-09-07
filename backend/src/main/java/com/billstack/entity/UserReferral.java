package com.billstack.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "user_referrals")
public class UserReferral {

    @Id
    private String id;

    @Column(name = "referrer_id", nullable = false)
    private String referrerId;

    @Column(name = "referred_id", unique = true)
    private String referredId;

    @Column(name = "referral_code", nullable = false)
    private String referralCode;

    @Column(name = "status", nullable = false)
    private String status; // PENDING, ACTIVATED, REWARDED

    @Column(name = "reward_granted")
    private String rewardGranted;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "activated_at")
    private LocalDateTime activatedAt;

    public UserReferral() {
        this.id = UUID.randomUUID().toString();
        this.createdAt = LocalDateTime.now();
        this.status = "PENDING";
    }

    public UserReferral(String referrerId, String referralCode) {
        this();
        this.referrerId = referrerId;
        this.referralCode = referralCode;
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

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getActivatedAt() { return activatedAt; }
    public void setActivatedAt(LocalDateTime activatedAt) { this.activatedAt = activatedAt; }
}
