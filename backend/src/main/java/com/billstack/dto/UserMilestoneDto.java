package com.billstack.dto;

import com.billstack.entity.UserMilestone;
import java.time.LocalDateTime;

public class UserMilestoneDto {

    private String id;
    private String milestoneKey;
    private String title;
    private String description;
    private LocalDateTime achievedAt;

    public UserMilestoneDto() {}

    public static UserMilestoneDto fromEntity(UserMilestone entity) {
        UserMilestoneDto dto = new UserMilestoneDto();
        dto.setId(entity.getId());
        dto.setMilestoneKey(entity.getMilestoneKey());
        dto.setTitle(entity.getTitle());
        dto.setDescription(entity.getDescription());
        dto.setAchievedAt(entity.getAchievedAt());
        return dto;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getMilestoneKey() { return milestoneKey; }
    public void setMilestoneKey(String milestoneKey) { this.milestoneKey = milestoneKey; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public LocalDateTime getAchievedAt() { return achievedAt; }
    public void setAchievedAt(LocalDateTime achievedAt) { this.achievedAt = achievedAt; }
}
