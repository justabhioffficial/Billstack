package com.billstack.dto;

import java.math.BigDecimal;

public class VendorBreakdownDto {
    private String vendorName;
    private BigDecimal amount;
    private long count;

    public VendorBreakdownDto() {}

    public VendorBreakdownDto(String vendorName, BigDecimal amount, long count) {
        this.vendorName = vendorName;
        this.amount = amount;
        this.count = count;
    }

    public String getVendorName() { return vendorName; }
    public void setVendorName(String vendorName) { this.vendorName = vendorName; }

    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }

    public long getCount() { return count; }
    public void setCount(long count) { this.count = count; }
}
