package com.billstack.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public class UpdateReceiptRequest {

    private String vendorName;
    private LocalDate receiptDate;
    private BigDecimal totalAmount;
    private BigDecimal taxAmount;
    private String currency;
    private String receiptNumber;
    private String paymentMode;
    private String categoryId;
    private Boolean isBusiness;
    private String ocrStatus;

    public UpdateReceiptRequest() {}

    public String getVendorName() { return vendorName; }
    public void setVendorName(String vendorName) { this.vendorName = vendorName; }

    public LocalDate getReceiptDate() { return receiptDate; }
    public void setReceiptDate(LocalDate receiptDate) { this.receiptDate = receiptDate; }

    public BigDecimal getTotalAmount() { return totalAmount; }
    public void setTotalAmount(BigDecimal totalAmount) { this.totalAmount = totalAmount; }

    public BigDecimal getTaxAmount() { return taxAmount; }
    public void setTaxAmount(BigDecimal taxAmount) { this.taxAmount = taxAmount; }

    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }

    public String getReceiptNumber() { return receiptNumber; }
    public void setReceiptNumber(String receiptNumber) { this.receiptNumber = receiptNumber; }

    public String getPaymentMode() { return paymentMode; }
    public void setPaymentMode(String paymentMode) { this.paymentMode = paymentMode; }

    public String getCategoryId() { return categoryId; }
    public void setCategoryId(String categoryId) { this.categoryId = categoryId; }

    public Boolean getIsBusiness() { return isBusiness; }
    public void setIsBusiness(Boolean isBusiness) { this.isBusiness = isBusiness; }

    public String getOcrStatus() { return ocrStatus; }
    public void setOcrStatus(String ocrStatus) { this.ocrStatus = ocrStatus; }
}
