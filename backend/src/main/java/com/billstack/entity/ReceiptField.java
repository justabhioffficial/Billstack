package com.billstack.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "receipt_fields")
public class ReceiptField {

    @Id
    private String id;

    @Column(name = "receipt_id", nullable = false)
    private String receiptId;

    @Column(name = "field_name", nullable = false)
    private String fieldName;

    @Column(name = "field_value", length = 512)
    private String fieldValue;

    @Column(precision = 5, scale = 2)
    private BigDecimal confidence;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        if (id == null) id = UUID.randomUUID().toString();
        createdAt = LocalDateTime.now();
    }

    public ReceiptField() {}

    public ReceiptField(String receiptId, String fieldName, String fieldValue, BigDecimal confidence) {
        this.receiptId = receiptId;
        this.fieldName = fieldName;
        this.fieldValue = fieldValue;
        this.confidence = confidence;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getReceiptId() { return receiptId; }
    public void setReceiptId(String receiptId) { this.receiptId = receiptId; }

    public String getFieldName() { return fieldName; }
    public void setFieldName(String fieldName) { this.fieldName = fieldName; }

    public String getFieldValue() { return fieldValue; }
    public void setFieldValue(String fieldValue) { this.fieldValue = fieldValue; }

    public BigDecimal getConfidence() { return confidence; }
    public void setConfidence(BigDecimal confidence) { this.confidence = confidence; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
