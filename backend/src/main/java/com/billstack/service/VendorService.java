package com.billstack.service;

import com.billstack.dto.ReceiptDto;
import com.billstack.dto.VendorAnalyticsDto;
import com.billstack.entity.Category;
import com.billstack.entity.Receipt;

import com.billstack.repository.CategoryRepository;
import com.billstack.repository.ReceiptRepository;
import com.billstack.repository.RecurringExpenseRepository;
import com.billstack.storage.StorageService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.*;

@Service
public class VendorService {

    private final ReceiptRepository receiptRepository;
    private final CategoryRepository categoryRepository;
    private final RecurringExpenseRepository recurringExpenseRepository;
    private final StorageService storageService;

    public VendorService(
            ReceiptRepository receiptRepository,
            CategoryRepository categoryRepository,
            RecurringExpenseRepository recurringExpenseRepository,
            StorageService storageService
    ) {
        this.receiptRepository = receiptRepository;
        this.categoryRepository = categoryRepository;
        this.recurringExpenseRepository = recurringExpenseRepository;
        this.storageService = storageService;
    }

    @Transactional(readOnly = true)
    public List<VendorAnalyticsDto> getAllVendorAnalytics(String userId) {
        List<Object[]> rows = receiptRepository.aggregateVendorStats(userId);
        List<VendorAnalyticsDto> dtos = new ArrayList<>();

        for (Object[] row : rows) {
            String vendorName = (String) row[0];
            long count = ((Number) row[1]).longValue();
            BigDecimal totalSpent = (BigDecimal) row[2];
            BigDecimal avgTrans = BigDecimal.valueOf(((Number) row[3]).doubleValue()).setScale(2, RoundingMode.HALF_UP);
            BigDecimal maxTrans = (BigDecimal) row[4];

            VendorAnalyticsDto dto = getVendorAnalytics(userId, vendorName, count, totalSpent, avgTrans, maxTrans);
            dtos.add(dto);
        }

        return dtos;
    }

    @Transactional(readOnly = true)
    public VendorAnalyticsDto getVendorAnalyticsByName(String userId, String vendorName) {
        List<Receipt> vendorReceipts = receiptRepository.findByUserIdAndVendorName(userId, vendorName);
        if (vendorReceipts.isEmpty()) {
            VendorAnalyticsDto empty = new VendorAnalyticsDto();
            empty.setVendorName(vendorName);
            empty.setTotalSpent(BigDecimal.ZERO);
            empty.setReceiptCount(0);
            empty.setAverageTransaction(BigDecimal.ZERO);
            empty.setHighestTransaction(BigDecimal.ZERO);
            empty.setCurrentMonthSpending(BigDecimal.ZERO);
            empty.setPreviousMonthSpending(BigDecimal.ZERO);
            empty.setYearlySpending(BigDecimal.ZERO);
            empty.setRecentReceipts(Collections.emptyList());
            return empty;
        }

        long count = vendorReceipts.size();
        BigDecimal totalSpent = vendorReceipts.stream().map(r -> r.getTotalAmount() != null ? r.getTotalAmount() : BigDecimal.ZERO).reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal avgTrans = totalSpent.divide(BigDecimal.valueOf(count), 2, RoundingMode.HALF_UP);
        BigDecimal maxTrans = vendorReceipts.stream().map(r -> r.getTotalAmount() != null ? r.getTotalAmount() : BigDecimal.ZERO).max(BigDecimal::compareTo).orElse(BigDecimal.ZERO);

        return getVendorAnalytics(userId, vendorName, count, totalSpent, avgTrans, maxTrans);
    }

    private VendorAnalyticsDto getVendorAnalytics(String userId, String vendorName, long count, BigDecimal totalSpent, BigDecimal avgTrans, BigDecimal maxTrans) {
        YearMonth currentYm = YearMonth.now();
        LocalDate currStart = currentYm.atDay(1);
        LocalDate currEnd = currentYm.atEndOfMonth();

        YearMonth prevYm = currentYm.minusMonths(1);
        LocalDate prevStart = prevYm.atDay(1);
        LocalDate prevEnd = prevYm.atEndOfMonth();

        LocalDate yearStart = LocalDate.of(currentYm.getYear(), 1, 1);
        LocalDate yearEnd = LocalDate.of(currentYm.getYear(), 12, 31);

        List<Receipt> vendorReceipts = receiptRepository.findByUserIdAndVendorName(userId, vendorName);

        BigDecimal currMonthSpent = vendorReceipts.stream()
                .filter(r -> r.getReceiptDate() != null && !r.getReceiptDate().isBefore(currStart) && !r.getReceiptDate().isAfter(currEnd))
                .map(r -> r.getTotalAmount() != null ? r.getTotalAmount() : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal prevMonthSpent = vendorReceipts.stream()
                .filter(r -> r.getReceiptDate() != null && !r.getReceiptDate().isBefore(prevStart) && !r.getReceiptDate().isAfter(prevEnd))
                .map(r -> r.getTotalAmount() != null ? r.getTotalAmount() : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal yearSpent = vendorReceipts.stream()
                .filter(r -> r.getReceiptDate() != null && !r.getReceiptDate().isBefore(yearStart) && !r.getReceiptDate().isAfter(yearEnd))
                .map(r -> r.getTotalAmount() != null ? r.getTotalAmount() : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        boolean isRecurring = recurringExpenseRepository.findByUserIdAndVendorNameIgnoreCase(userId, vendorName).isPresent();

        List<ReceiptDto> recentDtos = vendorReceipts.stream().limit(5).map(this::mapToDto).toList();

        VendorAnalyticsDto dto = new VendorAnalyticsDto();
        dto.setVendorName(vendorName);
        dto.setTotalSpent(totalSpent);
        dto.setReceiptCount(count);
        dto.setAverageTransaction(avgTrans);
        dto.setHighestTransaction(maxTrans);
        dto.setCurrentMonthSpending(currMonthSpent);
        dto.setPreviousMonthSpending(prevMonthSpent);
        dto.setYearlySpending(yearSpent);
        dto.setRecurring(isRecurring);
        dto.setRecentReceipts(recentDtos);

        return dto;
    }

    private ReceiptDto mapToDto(Receipt receipt) {
        String categoryName = "Other";
        String categoryColor = "#64748B";

        if (receipt.getCategoryId() != null) {
            Optional<Category> catOpt = categoryRepository.findById(receipt.getCategoryId());
            if (catOpt.isPresent()) {
                categoryName = catOpt.get().getName();
                categoryColor = catOpt.get().getColor();
            }
        }

        String fileUrl = storageService.getFileUrl(receipt.getFileKey());
        return ReceiptDto.fromEntity(receipt, categoryName, categoryColor, fileUrl);
    }
}
