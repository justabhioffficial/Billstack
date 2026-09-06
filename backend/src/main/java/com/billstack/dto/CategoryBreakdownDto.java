package com.billstack.dto;

import java.math.BigDecimal;

public class CategoryBreakdownDto {
    private String categoryId;
    private String categoryName;
    private String color;
    private BigDecimal amount;
    private long count;
    private double percentage;

    public CategoryBreakdownDto() {}

    public CategoryBreakdownDto(String categoryId, String categoryName, String color, BigDecimal amount, long count, double percentage) {
        this.categoryId = categoryId;
        this.categoryName = categoryName;
        this.color = color;
        this.amount = amount;
        this.count = count;
        this.percentage = percentage;
    }

    public String getCategoryId() { return categoryId; }
    public void setCategoryId(String categoryId) { this.categoryId = categoryId; }

    public String getCategoryName() { return categoryName; }
    public void setCategoryName(String categoryName) { this.categoryName = categoryName; }

    public String getColor() { return color; }
    public void setColor(String color) { this.color = color; }

    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }

    public long getCount() { return count; }
    public void setCount(long count) { this.count = count; }

    public double getPercentage() { return percentage; }
    public void setPercentage(double percentage) { this.percentage = percentage; }
}
