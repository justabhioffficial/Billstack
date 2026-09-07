package com.billstack.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "audit_logs", indexes = {
        @Index(name = "idx_audit_user_action", columnList = "user_id, action, created_at")
})
public class AuditLog {

    @Id
    private String id;

    @Column(name = "user_id")
    private String userId;

    @Column(nullable = false, length = 100)
    private String action;

    @Column(length = 255)
    private String target;

    @Column(name = "ip_address", length = 45)
    private String ipAddress;

    @Column(name = "request_id", length = 64)
    private String requestId;

    @Column(nullable = false, length = 20)
    private String status = "SUCCESS";

    @Column(columnDefinition = "TEXT")
    private String details;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    public AuditLog() {
        this.id = UUID.randomUUID().toString();
        this.createdAt = LocalDateTime.now();
    }

    public AuditLog(String userId, String action, String target, String ipAddress, String details) {
        this();
        this.userId = userId;
        this.action = action;
        this.target = target;
        this.ipAddress = ipAddress;
        this.status = "SUCCESS";
        this.details = details;
    }

    public AuditLog(String userId, String action, String target, String ipAddress, String requestId, String status, String details) {
        this();
        this.userId = userId;
        this.action = action;
        this.target = target;
        this.ipAddress = ipAddress;
        this.requestId = requestId;
        this.status = status != null ? status : "SUCCESS";
        this.details = details;
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

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
