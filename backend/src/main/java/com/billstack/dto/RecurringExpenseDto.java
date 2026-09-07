package com.billstack.dto;

import com.billstack.entity.RecurringExpense;
import java.math.BigDecimal;
import java.time.LocalDate;

public class RecurringExpenseDto {

    private String id;
    private String vendorName;
    private BigDecimal averageAmount;
    private String categoryId;
    private String categoryName;
    private String frequency;
    private String status;
    private LocalDate lastDetectedDate;
    private int occurrenceCount;

    public RecurringExpenseDto() {}

    public static RecurringExpenseDto fromEntity(RecurringExpense entity, String categoryName) {
        RecurringExpenseDto dto = new RecurringExpenseDto();
        dto.setId(entity.getId());
        dto.setVendorName(entity.getVendorName());
        dto.setAverageAmount(entity.getAverageAmount());
        dto.setCategoryId(entity.getCategoryId());
        dto.setCategoryName(categoryName != null ? categoryName : "Uncategorized");
        dto.setFrequency(entity.getFrequency());
        dto.setStatus(entity.getStatus());
        dto.setLastDetectedDate(entity.getLastDetectedDate());
        dto.setOccurrenceCount(entity.getOccurrenceCount());
        return dto;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getVendorName() { return vendorName; }
    public void setVendorName(String vendorName) { this.vendorName = vendorName; }

    public BigDecimal getAverageAmount() { return averageAmount; }
    public void setAverageAmount(BigDecimal averageAmount) { this.averageAmount = averageAmount; }

    public String getCategoryId() { return categoryId; }
    public void setCategoryId(String categoryId) { this.categoryId = categoryId; }

    public String getCategoryName() { return categoryName; }
    public void setCategoryName(String categoryName) { this.categoryName = categoryName; }

    public String getFrequency() { return frequency; }
    public void setFrequency(String frequency) { this.frequency = frequency; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDate getLastDetectedDate() { return lastDetectedDate; }
    public void setLastDetectedDate(LocalDate lastDetectedDate) { this.lastDetectedDate = lastDetectedDate; }

    public int getOccurrenceCount() { return occurrenceCount; }
    public void setOccurrenceCount(int occurrenceCount) { this.occurrenceCount = occurrenceCount; }
}
