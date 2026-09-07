package com.billstack.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "beta_user_cohorts")
public class BetaUserCohort {

    @Id
    private String id;

    @Column(name = "user_id", nullable = false, unique = true)
    private String userId;

    @Column(name = "cohort_phase", nullable = false, length = 20)
    private String cohortPhase = "PHASE_1"; // PHASE_1 (10), PHASE_2 (25), PHASE_3 (50), PHASE_4 (100)

    @Column(name = "feature_flags", columnDefinition = "TEXT")
    private String featureFlags;

    @Column(name = "onboarding_completed", nullable = false)
    private boolean onboardingCompleted = false;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    public BetaUserCohort() {
        this.id = UUID.randomUUID().toString();
        this.createdAt = LocalDateTime.now();
    }

    public BetaUserCohort(String userId, String cohortPhase, String featureFlags) {
        this();
        this.userId = userId;
        this.cohortPhase = cohortPhase != null ? cohortPhase : "PHASE_1";
        this.featureFlags = featureFlags;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getCohortPhase() { return cohortPhase; }
    public void setCohortPhase(String cohortPhase) { this.cohortPhase = cohortPhase; }

    public String getFeatureFlags() { return featureFlags; }
    public void setFeatureFlags(String featureFlags) { this.featureFlags = featureFlags; }

    public boolean isOnboardingCompleted() { return onboardingCompleted; }
    public void setOnboardingCompleted(boolean onboardingCompleted) { this.onboardingCompleted = onboardingCompleted; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
