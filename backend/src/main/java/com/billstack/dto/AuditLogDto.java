package com.billstack.dto;

import com.billstack.entity.AuditLog;

public class AuditLogDto {
    private String id;
    private String userId;
    private String action;
    private String target;
    private String ipAddress;
    private String requestId;
    private String status;
    private String details;
    private String createdAt;

    public AuditLogDto() {}

    public static AuditLogDto fromEntity(AuditLog log) {
        AuditLogDto dto = new AuditLogDto();
        dto.setId(log.getId());
        dto.setUserId(log.getUserId());
        dto.setAction(log.getAction());
        dto.setTarget(log.getTarget());
        dto.setIpAddress(log.getIpAddress());
        dto.setRequestId(log.getRequestId());
        dto.setStatus(log.getStatus());
        dto.setDetails(log.getDetails());
        dto.setCreatedAt(log.getCreatedAt() != null ? log.getCreatedAt().toString() : null);
        return dto;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getAction() { return action; }
    public void setAction(String action) { this.action = action; }

    public String getTarget() { return target; }
    public void setTarget(String target) { this.target = target; }

    public String getIpAddress() { return ipAddress; }
    public void setIpAddress(String ipAddress) { this.ipAddress = ipAddress; }

    public String getRequestId() { return requestId; }
    public void setRequestId(String requestId) { this.requestId = requestId; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getDetails() { return details; }
    public void setDetails(String details) { this.details = details; }

    public String getCreatedAt() { return createdAt; }
    public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }
}
