package com.billstack.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "user_milestones", uniqueConstraints = {
    @UniqueConstraint(name = "uk_user_milestone", columnNames = {"user_id", "milestone_key"})
})
public class UserMilestone {

    @Id
    private String id;

    @Column(name = "user_id", nullable = false)
    private String userId;

    @Column(name = "milestone_key", nullable = false, length = 50)
    private String milestoneKey;

    @Column(nullable = false)
    private String title;

    @Column(length = 512)
    private String description;

    @Column(name = "achieved_at", nullable = false, updatable = false)
    private LocalDateTime achievedAt = LocalDateTime.now();

    public UserMilestone() {
        this.id = java.util.UUID.randomUUID().toString();
    }

    public UserMilestone(String userId, String milestoneKey, String title, String description) {
        this();
        this.userId = userId;
        this.milestoneKey = milestoneKey;
        this.title = title;
        this.description = description;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getMilestoneKey() { return milestoneKey; }
    public void setMilestoneKey(String milestoneKey) { this.milestoneKey = milestoneKey; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public LocalDateTime getAchievedAt() { return achievedAt; }
    public void setAchievedAt(LocalDateTime achievedAt) { this.achievedAt = achievedAt; }
}
