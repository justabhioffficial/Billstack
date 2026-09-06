package com.billstack.dto;

import java.math.BigDecimal;

public class CheckoutResponseDto {
    private String orderId;
    private String razorpayKeyId;
    private BigDecimal amount;
    private String currency;
    private String plan;
    private String userEmail;
    private String userName;

    public CheckoutResponseDto() {}

    public CheckoutResponseDto(String orderId, String razorpayKeyId, BigDecimal amount, String currency, String plan, String userEmail, String userName) {
        this.orderId = orderId;
        this.razorpayKeyId = razorpayKeyId;
        this.amount = amount;
        this.currency = currency;
        this.plan = plan;
        this.userEmail = userEmail;
        this.userName = userName;
    }

    public String getOrderId() { return orderId; }
    public void setOrderId(String orderId) { this.orderId = orderId; }

    public String getRazorpayKeyId() { return razorpayKeyId; }
    public void setRazorpayKeyId(String razorpayKeyId) { this.razorpayKeyId = razorpayKeyId; }

    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }

    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }

    public String getPlan() { return plan; }
    public void setPlan(String plan) { this.plan = plan; }

    public String getUserEmail() { return userEmail; }
    public void setUserEmail(String userEmail) { this.userEmail = userEmail; }

    public String getUserName() { return userName; }
    public void setUserName(String userName) { this.userName = userName; }
}
