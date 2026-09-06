package com.billstack.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Map;

public class OcrResultDto {

    private String rawText;
    private String vendorName;
    private LocalDate receiptDate;
    private BigDecimal totalAmount;
    private BigDecimal taxAmount;
    private String currency = "INR";
    private String receiptNumber;
    private String paymentMode;
    private BigDecimal overallConfidence;
    private Map<String, BigDecimal> fieldConfidences;

    public OcrResultDto() {}

    public String getRawText() { return rawText; }
    public void setRawText(String rawText) { this.rawText = rawText; }

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

    public BigDecimal getOverallConfidence() { return overallConfidence; }
    public void setOverallConfidence(BigDecimal overallConfidence) { this.overallConfidence = overallConfidence; }

    public Map<String, BigDecimal> getFieldConfidences() { return fieldConfidences; }
    public void setFieldConfidences(Map<String, BigDecimal> fieldConfidences) { this.fieldConfidences = fieldConfidences; }
}
