package com.billstack.service;

import com.billstack.dto.*;
import com.billstack.entity.Category;
import com.billstack.entity.Receipt;
import com.billstack.repository.CategoryRepository;
import com.billstack.repository.ReceiptRepository;
import com.billstack.storage.StorageService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
public class MonthlyReviewService {

    private final ReceiptRepository receiptRepository;
    private final CategoryRepository categoryRepository;
    private final StorageService storageService;
    private final IntelligenceService intelligenceService;

    public MonthlyReviewService(
            ReceiptRepository receiptRepository,
            CategoryRepository categoryRepository,
            StorageService storageService,
            IntelligenceService intelligenceService
    ) {
        this.receiptRepository = receiptRepository;
        this.categoryRepository = categoryRepository;
        this.storageService = storageService;
        this.intelligenceService = intelligenceService;
    }

    @Transactional(readOnly = true)
    public MonthlyReviewDto getMonthlyReview(String userId, String monthStr) {
        YearMonth ym = parseYearMonth(monthStr);
        LocalDate start = ym.atDay(1);
        LocalDate end = ym.atEndOfMonth();

        List<Receipt> receipts = receiptRepository.findByUserIdAndReceiptDateBetweenOrderByReceiptDateAsc(userId, start, end);
        BigDecimal totalSpent = receiptRepository.sumTotalByUserIdAndDateRange(userId, start, end);

        MonthlyReviewDto dto = new MonthlyReviewDto();
        dto.setTargetMonth(ym.toString());
        dto.setMonthName(ym.format(DateTimeFormatter.ofPattern("MMMM yyyy")));
        dto.setTotalExpenses(totalSpent != null ? totalSpent : BigDecimal.ZERO);
        dto.setTotalReceipts(receipts.size());

        // Top Category
        List<Object[]> catAgg = receiptRepository.aggregateByCategory(userId, start, end);
        if (!catAgg.isEmpty()) {
            Object[] topRow = catAgg.get(0);
            String catId = (String) topRow[0];
            BigDecimal catSum = (BigDecimal) topRow[1];
            Category cat = catId != null ? categoryRepository.findById(catId).orElse(null) : null;
            dto.setBiggestCategoryName(cat != null ? cat.getName() : "Uncategorized");
            dto.setBiggestCategoryAmount(catSum);
        } else {
            dto.setBiggestCategoryName("None");
            dto.setBiggestCategoryAmount(BigDecimal.ZERO);
        }

        // Top Purchase
        Receipt maxPurchase = receipts.stream().filter(r -> r.getTotalAmount() != null).max(Comparator.comparing(Receipt::getTotalAmount)).orElse(null);
        if (maxPurchase != null) {
            dto.setBiggestPurchaseVendor(maxPurchase.getVendorName() != null ? maxPurchase.getVendorName() : "Unknown Vendor");
            dto.setBiggestPurchaseAmount(maxPurchase.getTotalAmount());
        } else {
            dto.setBiggestPurchaseVendor("None");
            dto.setBiggestPurchaseAmount(BigDecimal.ZERO);
        }

        // MoM Change
        YearMonth prevYm = ym.minusMonths(1);
        BigDecimal prevSpent = receiptRepository.sumTotalByUserIdAndDateRange(userId, prevYm.atDay(1), prevYm.atEndOfMonth());
        if (prevSpent != null && prevSpent.compareTo(BigDecimal.ZERO) > 0 && totalSpent != null) {
            double diff = totalSpent.subtract(prevSpent).doubleValue();
            double pct = (diff / prevSpent.doubleValue()) * 100.0;
            dto.setMomChangePercentage(BigDecimal.valueOf(pct).setScale(1, RoundingMode.HALF_UP).doubleValue());
        } else {
            dto.setMomChangePercentage(0.0);
        }

        ExpenseHealthDto health = intelligenceService.getExpenseHealth(userId);
        dto.setOrganizationScore(health.getScore());

        long unresolved = receipts.stream().filter(r -> "NEEDS_REVIEW".equals(r.getOcrStatus()) || "FAILED".equals(r.getOcrStatus())).count();
        dto.setUnresolvedReceiptsCount(unresolved);

        dto.setKeyInsights(List.of(
                String.format("%s total expenditure: ₹%.2f across %d receipts.", dto.getMonthName(), dto.getTotalExpenses(), dto.getTotalReceipts()),
                String.format("Expense Organization Score is currently %d/100 (%s).", health.getScore(), health.getStatusLabel()),
                unresolved > 0 ? String.format("%d receipts require review before tax submission.", unresolved) : "All monthly receipts are fully reviewed and verified."
        ));

        return dto;
    }

    @Transactional(readOnly = true)
    public CaReviewDto getCaReview(String userId, String monthStr) {
        YearMonth ym = parseYearMonth(monthStr);
        LocalDate start = ym.atDay(1);
        LocalDate end = ym.atEndOfMonth();

        List<Receipt> receipts = receiptRepository.findByUserIdAndReceiptDateBetweenOrderByReceiptDateAsc(userId, start, end);

        BigDecimal totalMonthExpenses = receipts.stream()
                .map(r -> r.getTotalAmount() != null ? r.getTotalAmount() : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal totalClaimableTax = receipts.stream()
                .map(r -> r.getTaxAmount() != null ? r.getTaxAmount() : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        long missingVendor = receipts.stream().filter(r -> r.getVendorName() == null || r.getVendorName().trim().isEmpty() || "Unknown Vendor".equals(r.getVendorName())).count();
        long missingDate = receipts.stream().filter(r -> r.getReceiptDate() == null).count();
        long missingAmount = receipts.stream().filter(r -> r.getTotalAmount() == null || r.getTotalAmount().compareTo(BigDecimal.ZERO) <= 0).count();
        long missingCategory = receipts.stream().filter(r -> r.getCategoryId() == null || "cat-other".equals(r.getCategoryId())).count();

        List<ReceiptDto> issueDtos = new ArrayList<>();
        String nextIssueId = null;

        for (Receipt r : receipts) {
            boolean hasIssue = (r.getVendorName() == null || r.getVendorName().trim().isEmpty() || "Unknown Vendor".equals(r.getVendorName()))
                    || (r.getTotalAmount() == null || r.getTotalAmount().compareTo(BigDecimal.ZERO) <= 0)
                    || (r.getReceiptDate() == null)
                    || (r.getCategoryId() == null || "cat-other".equals(r.getCategoryId()))
                    || ("NEEDS_REVIEW".equals(r.getOcrStatus()) || "FAILED".equals(r.getOcrStatus()));

            if (hasIssue) {
                if (nextIssueId == null) {
                    nextIssueId = r.getId();
                }
                issueDtos.add(mapToDto(r));
            }
        }

        long flaggedCount = issueDtos.size();
        long totalCount = receipts.size();
        long verifiedCount = Math.max(0, totalCount - flaggedCount);
        double cleanPercentage = totalCount > 0 ? ((double) verifiedCount / totalCount) * 100.0 : 100.0;
        boolean isCleanAndReady = (flaggedCount == 0);

        List<String> complianceNotes = new ArrayList<>();
        if (isCleanAndReady) {
            complianceNotes.add("All uploaded receipts are 100% verified, categorized, and audit-ready for CA filing.");
        } else {
            if (missingCategory > 0) complianceNotes.add(String.format("%d receipts are uncategorized. Categorization is required for correct GST tax deduction.", missingCategory));
            if (missingVendor > 0) complianceNotes.add(String.format("%d receipts have missing or unverified vendor names.", missingVendor));
            if (missingAmount > 0) complianceNotes.add(String.format("%d receipts require verified total amounts.", missingAmount));
        }

        CaReviewDto dto = new CaReviewDto();
        dto.setTargetMonth(ym.toString());
        dto.setMonthName(ym.format(DateTimeFormatter.ofPattern("MMMM yyyy")));
        dto.setTotalMonthExpenses(totalMonthExpenses);
        dto.setTotalClaimableTax(totalClaimableTax);
        dto.setTotalReceipts(totalCount);
        dto.setVerifiedCount(verifiedCount);
        dto.setFlaggedCount(flaggedCount);
        dto.setCleanPercentage(cleanPercentage);
        dto.setCleanAndReady(isCleanAndReady);
        dto.setNextIssueReceiptId(nextIssueId);
        dto.setIssueReceipts(issueDtos);
        dto.setComplianceNotes(complianceNotes);

        dto.setMissingVendorCount(missingVendor);
        dto.setMissingDateCount(missingDate);
        dto.setMissingAmountCount(missingAmount);
        dto.setMissingCategoryCount(missingCategory);

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

    private YearMonth parseYearMonth(String monthStr) {
        if (monthStr != null && monthStr.matches("\\d{4}-\\d{2}")) {
            return YearMonth.parse(monthStr);
        }
        return YearMonth.now();
    }
}
