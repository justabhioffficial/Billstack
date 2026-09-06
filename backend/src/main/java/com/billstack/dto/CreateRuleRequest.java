package com.billstack.dto;

import jakarta.validation.constraints.NotBlank;

public class CreateRuleRequest {

    @NotBlank(message = "Vendor pattern is required")
    private String vendorPattern;

    @NotBlank(message = "Category is required")
    private String categoryId;

    private Boolean active = true;

    public CreateRuleRequest() {}

    public String getVendorPattern() { return vendorPattern; }
    public void setVendorPattern(String vendorPattern) { this.vendorPattern = vendorPattern; }

    public String getCategoryId() { return categoryId; }
    public void setCategoryId(String categoryId) { this.categoryId = categoryId; }

    public Boolean getActive() { return active; }
    public void setActive(Boolean active) { this.active = active; }
}
