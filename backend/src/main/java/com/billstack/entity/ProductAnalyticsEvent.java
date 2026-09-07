package com.billstack.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "product_analytics_events", indexes = {
        @Index(name = "idx_analytics_event_date", columnList = "event_name, created_at")
})
public class ProductAnalyticsEvent {

    @Id
    private String id;

    @Column(name = "user_id")
    private String userId;

    @Column(name = "event_name", nullable = false, length = 100)
    private String eventName;

    @Column(name = "session_id", length = 64)
    private String sessionId;

    @Column(name = "properties_json", columnDefinition = "TEXT")
    private String propertiesJson;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    public ProductAnalyticsEvent() {
        this.id = UUID.randomUUID().toString();
        this.createdAt = LocalDateTime.now();
    }

    public ProductAnalyticsEvent(String userId, String eventName, String sessionId, String propertiesJson) {
        this();
        this.userId = userId;
        this.eventName = eventName;
        this.sessionId = sessionId;
        this.propertiesJson = propertiesJson;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getEventName() { return eventName; }
    public void setEventName(String eventName) { this.eventName = eventName; }

    public String getSessionId() { return sessionId; }
    public void setSessionId(String sessionId) { this.sessionId = sessionId; }

    public String getPropertiesJson() { return propertiesJson; }
    public void setPropertiesJson(String propertiesJson) { this.propertiesJson = propertiesJson; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
