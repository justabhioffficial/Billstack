package com.billstack.dto;

import com.billstack.entity.ExpenseAlert;
import java.time.LocalDateTime;

public class ExpenseAlertDto {

    private String id;
    private String title;
    private String message;
    private String alertType;
    private String severity;
    private boolean isRead;
    private boolean isDismissed;
    private String metadata;
    private LocalDateTime createdAt;

    public ExpenseAlertDto() {}

    public static ExpenseAlertDto fromEntity(ExpenseAlert entity) {
        ExpenseAlertDto dto = new ExpenseAlertDto();
        dto.setId(entity.getId());
        dto.setTitle(entity.getTitle());
        dto.setMessage(entity.getMessage());
        dto.setAlertType(entity.getAlertType());
        dto.setSeverity(entity.getSeverity());
        dto.setRead(entity.isRead());
        dto.setDismissed(entity.isDismissed());
        dto.setMetadata(entity.getMetadata());
        dto.setCreatedAt(entity.getCreatedAt());
        return dto;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public String getAlertType() { return alertType; }
    public void setAlertType(String alertType) { this.alertType = alertType; }

    public String getSeverity() { return severity; }
    public void setSeverity(String severity) { this.severity = severity; }

    public boolean isRead() { return isRead; }
    public void setRead(boolean read) { isRead = read; }

    public boolean isDismissed() { return isDismissed; }
    public void setDismissed(boolean dismissed) { isDismissed = dismissed; }

    public String getMetadata() { return metadata; }
    public void setMetadata(String metadata) { this.metadata = metadata; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
