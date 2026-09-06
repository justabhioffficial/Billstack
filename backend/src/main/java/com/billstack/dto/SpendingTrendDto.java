package com.billstack.dto;

import java.math.BigDecimal;

public class SpendingTrendDto {
    private String dateOrMonth;
    private BigDecimal amount;
    private BigDecimal businessAmount;
    private BigDecimal personalAmount;

    public SpendingTrendDto() {}

    public SpendingTrendDto(String dateOrMonth, BigDecimal amount, BigDecimal businessAmount, BigDecimal personalAmount) {
        this.dateOrMonth = dateOrMonth;
        this.amount = amount;
        this.businessAmount = businessAmount;
        this.personalAmount = personalAmount;
    }

    public String getDateOrMonth() { return dateOrMonth; }
    public void setDateOrMonth(String dateOrMonth) { this.dateOrMonth = dateOrMonth; }

    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }

    public BigDecimal getBusinessAmount() { return businessAmount; }
    public void setBusinessAmount(BigDecimal businessAmount) { this.businessAmount = businessAmount; }

    public BigDecimal getPersonalAmount() { return personalAmount; }
    public void setPersonalAmount(BigDecimal personalAmount) { this.personalAmount = personalAmount; }
}
