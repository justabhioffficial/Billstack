package com.billstack.dto;

import com.billstack.entity.Receipt;
import java.math.BigDecimal;

public class ReceiptDto {
    private String id;
    private String userId;
    private String vendorName;
    private String receiptDate;
    private BigDecimal totalAmount;
    private BigDecimal taxAmount;
    private String currency;
    private String receiptNumber;
    private String paymentMode;
    private String categoryId;
    private String categoryName;
    private String categoryColor;
    private boolean isBusiness;
    private String fileKey;
    private String originalFilename;
    private String mimeType;
    private long fileSize;
    private String source;
    private String ocrStatus;
    private String ocrRawText;
    private BigDecimal overallConfidence;
    private String fileUrl;
    private String createdAt;

    public ReceiptDto() {}

    public static ReceiptDto fromEntity(Receipt receipt, String categoryName, String categoryColor, String fileUrl) {
        ReceiptDto dto = new ReceiptDto();
        dto.setId(receipt.getId());
        dto.setUserId(receipt.getUserId());
        dto.setVendorName(receipt.getVendorName());
        dto.setReceiptDate(receipt.getReceiptDate() != null ? receipt.getReceiptDate().toString() : null);
        dto.setTotalAmount(receipt.getTotalAmount());
        dto.setTaxAmount(receipt.getTaxAmount());
        dto.setCurrency(receipt.getCurrency());
        dto.setReceiptNumber(receipt.getReceiptNumber());
        dto.setPaymentMode(receipt.getPaymentMode());
        dto.setCategoryId(receipt.getCategoryId());
        dto.setCategoryName(categoryName);
        dto.setCategoryColor(categoryColor);
        dto.setBusiness(receipt.isBusiness());
        dto.setFileKey(receipt.getFileKey());
        dto.setOriginalFilename(receipt.getOriginalFilename());
        dto.setMimeType(receipt.getMimeType());
        dto.setFileSize(receipt.getFileSize());
        dto.setSource(receipt.getSource());
        dto.setOcrStatus(receipt.getOcrStatus());
        dto.setOcrRawText(receipt.getOcrRawText());
        dto.setOverallConfidence(receipt.getOverallConfidence());
        dto.setFileUrl(fileUrl);
        dto.setCreatedAt(receipt.getCreatedAt() != null ? receipt.getCreatedAt().toString() : null);
        return dto;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getVendorName() { return vendorName; }
    public void setVendorName(String vendorName) { this.vendorName = vendorName; }

    public String getReceiptDate() { return receiptDate; }
    public void setReceiptDate(String receiptDate) { this.receiptDate = receiptDate; }

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

    public String getCategoryName() { return categoryName; }
    public void setCategoryName(String categoryName) { this.categoryName = categoryName; }

    public String getCategoryColor() { return categoryColor; }
    public void setCategoryColor(String categoryColor) { this.categoryColor = categoryColor; }

    public boolean isBusiness() { return isBusiness; }
    public void setBusiness(boolean isBusiness) { this.isBusiness = isBusiness; }

    public String getFileKey() { return fileKey; }
    public void setFileKey(String fileKey) { this.fileKey = fileKey; }

    public String getOriginalFilename() { return originalFilename; }
    public void setOriginalFilename(String originalFilename) { this.originalFilename = originalFilename; }

    public String getMimeType() { return mimeType; }
    public void setMimeType(String mimeType) { this.mimeType = mimeType; }

    public long getFileSize() { return fileSize; }
    public void setFileSize(long fileSize) { this.fileSize = fileSize; }

    public String getSource() { return source; }
    public void setSource(String source) { this.source = source; }

    public String getOcrStatus() { return ocrStatus; }
    public void setOcrStatus(String ocrStatus) { this.ocrStatus = ocrStatus; }

    public String getOcrRawText() { return ocrRawText; }
    public void setOcrRawText(String ocrRawText) { this.ocrRawText = ocrRawText; }

    public BigDecimal getOverallConfidence() { return overallConfidence; }
    public void setOverallConfidence(BigDecimal overallConfidence) { this.overallConfidence = overallConfidence; }

    public String getFileUrl() { return fileUrl; }
    public void setFileUrl(String fileUrl) { this.fileUrl = fileUrl; }

    public String getCreatedAt() { return createdAt; }
    public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }
}
