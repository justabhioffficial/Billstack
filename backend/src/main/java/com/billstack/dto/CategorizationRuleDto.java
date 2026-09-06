package com.billstack.dto;

import com.billstack.entity.CategorizationRule;

public class CategorizationRuleDto {
    private String id;
    private String vendorPattern;
    private String categoryId;
    private String categoryName;
    private boolean active;
    private String createdAt;

    public CategorizationRuleDto() {}

    public static CategorizationRuleDto fromEntity(CategorizationRule rule, String categoryName) {
        CategorizationRuleDto dto = new CategorizationRuleDto();
        dto.setId(rule.getId());
        dto.setVendorPattern(rule.getVendorPattern());
        dto.setCategoryId(rule.getCategoryId());
        dto.setCategoryName(categoryName);
        dto.setActive(rule.isActive());
        dto.setCreatedAt(rule.getCreatedAt() != null ? rule.getCreatedAt().toString() : null);
        return dto;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getVendorPattern() { return vendorPattern; }
    public void setVendorPattern(String vendorPattern) { this.vendorPattern = vendorPattern; }

    public String getCategoryId() { return categoryId; }
    public void setCategoryId(String categoryId) { this.categoryId = categoryId; }

    public String getCategoryName() { return categoryName; }
    public void setCategoryName(String categoryName) { this.categoryName = categoryName; }

    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }

    public String getCreatedAt() { return createdAt; }
    public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }
}
