package com.billstack.dto;

import java.math.BigDecimal;

public class CategoryBreakdownExtendedDto {

    private String categoryId;
    private String categoryName;
    private String categoryColor;
    private String categoryIcon;
    private BigDecimal amount;
    private double percentageShare;
    private long receiptCount;
    private Double momChangePercentage;

    public CategoryBreakdownExtendedDto() {}

    public CategoryBreakdownExtendedDto(String categoryId, String categoryName, String categoryColor, String categoryIcon, BigDecimal amount, double percentageShare, long receiptCount, Double momChangePercentage) {
        this.categoryId = categoryId;
        this.categoryName = categoryName;
        this.categoryColor = categoryColor;
        this.categoryIcon = categoryIcon;
        this.amount = amount;
        this.percentageShare = percentageShare;
        this.receiptCount = receiptCount;
        this.momChangePercentage = momChangePercentage;
    }

    public String getCategoryId() { return categoryId; }
    public void setCategoryId(String categoryId) { this.categoryId = categoryId; }

    public String getCategoryName() { return categoryName; }
    public void setCategoryName(String categoryName) { this.categoryName = categoryName; }

    public String getCategoryColor() { return categoryColor; }
    public void setCategoryColor(String categoryColor) { this.categoryColor = categoryColor; }

    public String getCategoryIcon() { return categoryIcon; }
    public void setCategoryIcon(String categoryIcon) { this.categoryIcon = categoryIcon; }

    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }

    public double getPercentageShare() { return percentageShare; }
    public void setPercentageShare(double percentageShare) { this.percentageShare = percentageShare; }

    public long getReceiptCount() { return receiptCount; }
    public void setReceiptCount(long receiptCount) { this.receiptCount = receiptCount; }

    public Double getMomChangePercentage() { return momChangePercentage; }
    public void setMomChangePercentage(Double momChangePercentage) { this.momChangePercentage = momChangePercentage; }
}
