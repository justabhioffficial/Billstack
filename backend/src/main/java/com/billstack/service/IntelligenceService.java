package com.billstack.service;

import com.billstack.dto.*;
import com.billstack.entity.Category;
import com.billstack.entity.Receipt;
import com.billstack.repository.CategoryRepository;
import com.billstack.repository.ReceiptRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
public class IntelligenceService {

    private final ReceiptRepository receiptRepository;
    private final CategoryRepository categoryRepository;

    public IntelligenceService(ReceiptRepository receiptRepository, CategoryRepository categoryRepository) {
        this.receiptRepository = receiptRepository;
        this.categoryRepository = categoryRepository;
    }

    @Transactional(readOnly = true)
    public MonthlyIntelligenceDto getMonthlyIntelligence(String userId, String monthStr) {
        YearMonth ym = parseYearMonth(monthStr);
        LocalDate start = ym.atDay(1);
        LocalDate end = ym.atEndOfMonth();

        // Target Month Data
        List<Receipt> receipts = receiptRepository.findByUserIdAndReceiptDateBetweenOrderByReceiptDateAsc(userId, start, end);
        BigDecimal totalSpent = receiptRepository.sumTotalByUserIdAndDateRange(userId, start, end);

        // Previous Month Data
        YearMonth prevYm = ym.minusMonths(1);
        LocalDate prevStart = prevYm.atDay(1);
        LocalDate prevEnd = prevYm.atEndOfMonth();
        BigDecimal prevTotalSpent = receiptRepository.sumTotalByUserIdAndDateRange(userId, prevStart, prevEnd);

        MonthlyIntelligenceDto dto = new MonthlyIntelligenceDto();
        dto.setTargetMonth(ym.toString());
        dto.setMonthName(ym.format(DateTimeFormatter.ofPattern("MMMM yyyy")));
        dto.setTotalExpenses(totalSpent != null ? totalSpent : BigDecimal.ZERO);
        dto.setTotalReceipts(receipts.size());

        long categorized = receipts.stream().filter(r -> r.getCategoryId() != null && !r.getCategoryId().trim().isEmpty() && !"cat-other".equals(r.getCategoryId())).count();
        dto.setCategorizedReceipts(categorized);
        dto.setUncategorizedReceipts(receipts.size() - categorized);

        if (!receipts.isEmpty()) {
            BigDecimal avg = totalSpent.divide(BigDecimal.valueOf(receipts.size()), 2, RoundingMode.HALF_UP);
            dto.setAverageReceiptAmount(avg);

            Receipt maxReceipt = receipts.stream().filter(r -> r.getTotalAmount() != null).max(Comparator.comparing(Receipt::getTotalAmount)).orElse(null);
            if (maxReceipt != null) {
                dto.setLargestExpenseAmount(maxReceipt.getTotalAmount());
                dto.setLargestExpenseVendor(maxReceipt.getVendorName() != null ? maxReceipt.getVendorName() : "Unknown");
            }

            Receipt minReceipt = receipts.stream().filter(r -> r.getTotalAmount() != null).min(Comparator.comparing(Receipt::getTotalAmount)).orElse(null);
            if (minReceipt != null) {
                dto.setSmallestExpenseAmount(minReceipt.getTotalAmount());
                dto.setSmallestExpenseVendor(minReceipt.getVendorName() != null ? minReceipt.getVendorName() : "Unknown");
            }
        } else {
            dto.setAverageReceiptAmount(BigDecimal.ZERO);
            dto.setLargestExpenseAmount(BigDecimal.ZERO);
            dto.setLargestExpenseVendor("None");
            dto.setSmallestExpenseAmount(BigDecimal.ZERO);
            dto.setSmallestExpenseVendor("None");
        }

        // MoM Change Calculation
        if (prevTotalSpent != null && prevTotalSpent.compareTo(BigDecimal.ZERO) > 0) {
            double delta = totalSpent.subtract(prevTotalSpent).doubleValue();
            double pct = (delta / prevTotalSpent.doubleValue()) * 100.0;
            dto.setMomChangePercentage(BigDecimal.valueOf(pct).setScale(1, RoundingMode.HALF_UP).doubleValue());
            dto.setMomChangeStatus(pct > 0.5 ? "INCREASED" : (pct < -0.5 ? "DECREASED" : "STABLE"));
        } else {
            dto.setMomChangePercentage(0.0);
            dto.setMomChangeStatus("STABLE");
        }

        // Organization Percentage
        int orgPct = receipts.isEmpty() ? 100 : (int) Math.round(((double) categorized / receipts.size()) * 100.0);
        dto.setOrganizationPercentage(orgPct);

        // Time Saved (~2.67 min per receipt)
        long totalMins = Math.round(receipts.size() * 2.67);
        long hours = totalMins / 60;
        long mins = totalMins % 60;
        dto.setEstimatedTimeSaved(hours > 0 ? String.format("~%dh %dm", hours, mins) : String.format("~%dm", mins));

        // Category Breakdown Extended
        dto.setCategoryBreakdown(getCategoryBreakdown(userId, ym.toString()));

        // Natural Language Insights
        List<String> insights = generateInsights(dto, receipts, prevTotalSpent);
        dto.setNaturalLanguageInsights(insights);

        return dto;
    }

    @Transactional(readOnly = true)
    public List<CategoryBreakdownExtendedDto> getCategoryBreakdown(String userId, String monthStr) {
        YearMonth ym = parseYearMonth(monthStr);
        LocalDate start = ym.atDay(1);
        LocalDate end = ym.atEndOfMonth();

        YearMonth prevYm = ym.minusMonths(1);
        LocalDate prevStart = prevYm.atDay(1);
        LocalDate prevEnd = prevYm.atEndOfMonth();

        List<Object[]> currentAgg = receiptRepository.aggregateByCategory(userId, start, end);
        List<Object[]> prevAgg = receiptRepository.aggregateByCategory(userId, prevStart, prevEnd);

        Map<String, BigDecimal> prevCategoryMap = new HashMap<>();
        for (Object[] row : prevAgg) {
            String catId = (String) row[0];
            BigDecimal sum = (BigDecimal) row[1];
            if (catId != null) prevCategoryMap.put(catId, sum);
        }

        BigDecimal grandTotal = receiptRepository.sumTotalByUserIdAndDateRange(userId, start, end);
        if (grandTotal == null) grandTotal = BigDecimal.ZERO;

        List<CategoryBreakdownExtendedDto> result = new ArrayList<>();
        Map<String, Category> categoryCache = getCategoryMap();

        for (Object[] row : currentAgg) {
            String catId = (String) row[0];
            BigDecimal sum = (BigDecimal) row[1];
            long count = ((Number) row[2]).longValue();

            Category cat = catId != null ? categoryCache.get(catId) : null;
            String name = cat != null ? cat.getName() : "Uncategorized";
            String color = cat != null ? cat.getColor() : "#64748B";
            String icon = cat != null ? cat.getIcon() : "Grid";

            double pctShare = grandTotal.compareTo(BigDecimal.ZERO) > 0 ?
                    sum.divide(grandTotal, 4, RoundingMode.HALF_UP).doubleValue() * 100.0 : 0.0;

            Double momChange = null;
            BigDecimal prevSum = prevCategoryMap.get(catId);
            if (prevSum != null && prevSum.compareTo(BigDecimal.ZERO) > 0) {
                double diff = sum.subtract(prevSum).doubleValue();
                momChange = BigDecimal.valueOf((diff / prevSum.doubleValue()) * 100.0).setScale(1, RoundingMode.HALF_UP).doubleValue();
            }

            result.add(new CategoryBreakdownExtendedDto(
                    catId != null ? catId : "uncategorized",
                    name, color, icon, sum,
                    BigDecimal.valueOf(pctShare).setScale(1, RoundingMode.HALF_UP).doubleValue(),
                    count, momChange
            ));
        }

        result.sort((a, b) -> b.getAmount().compareTo(a.getAmount()));
        return result;
    }

    @Transactional(readOnly = true)
    public ExpenseHealthDto getExpenseHealth(String userId) {
        long totalCount = receiptRepository.countByUserId(userId);
        if (totalCount == 0) {
            ExpenseHealthDto empty = new ExpenseHealthDto();
            empty.setScore(100);
            empty.setStatusLabel("Excellent");
            empty.setCategorizationRate(100);
            empty.setValidAmountRate(100);
            empty.setReviewedRate(100);
            empty.setValidVendorRate(100);
            empty.setUnresolvedCount(0);
            empty.setDuplicateWarningCount(0);
            empty.setPositiveFactors(List.of("All uploaded receipts are fully organized and reviewed."));
            empty.setWarningFactors(Collections.emptyList());
            return empty;
        }

        List<Receipt> receipts = receiptRepository.findByUserId(userId);
        long categorized = receipts.stream().filter(r -> r.getCategoryId() != null && !"cat-other".equals(r.getCategoryId())).count();
        long validAmounts = receipts.stream().filter(r -> r.getTotalAmount() != null && r.getTotalAmount().compareTo(BigDecimal.ZERO) > 0).count();
        long reviewed = receipts.stream().filter(r -> "COMPLETED".equals(r.getOcrStatus())).count();
        long validVendors = receipts.stream().filter(r -> r.getVendorName() != null && !r.getVendorName().trim().isEmpty() && !"Unknown Vendor".equals(r.getVendorName())).count();
        long unresolved = receipts.stream().filter(r -> "NEEDS_REVIEW".equals(r.getOcrStatus()) || "FAILED".equals(r.getOcrStatus())).count();

        int catRate = (int) Math.round(((double) categorized / totalCount) * 100);
        int amtRate = (int) Math.round(((double) validAmounts / totalCount) * 100);
        int revRate = (int) Math.round(((double) reviewed / totalCount) * 100);
        int venRate = (int) Math.round(((double) validVendors / totalCount) * 100);

        // Deterministic Score Calculation (max 100)
        int score = (int) Math.round((catRate * 0.30) + (revRate * 0.25) + (amtRate * 0.25) + (venRate * 0.20));
        score = Math.max(0, Math.min(100, score));

        ExpenseHealthDto dto = new ExpenseHealthDto();
        dto.setScore(score);
        dto.setStatusLabel(score >= 85 ? "Excellent" : (score >= 70 ? "Good" : "Needs Attention"));
        dto.setCategorizationRate(catRate);
        dto.setValidAmountRate(amtRate);
        dto.setReviewedRate(revRate);
        dto.setValidVendorRate(venRate);
        dto.setUnresolvedCount(unresolved);

        List<String> pos = new ArrayList<>();
        List<String> warn = new ArrayList<>();

        if (catRate >= 80) pos.add(String.format("✓ %d%% receipts categorized", catRate));
        else warn.add(String.format("⚠ %d%% receipts remain uncategorized", 100 - catRate));

        if (amtRate >= 90) pos.add(String.format("✓ %d%% have verified amounts", amtRate));
        else warn.add(String.format("⚠ %d%% receipts missing verified amounts", 100 - amtRate));

        if (revRate >= 80) pos.add(String.format("✓ %d%% OCR records reviewed", revRate));
        else warn.add(String.format("⚠ %d receipts need manual review", unresolved));

        dto.setPositiveFactors(pos);
        dto.setWarningFactors(warn);

        return dto;
    }

    @Transactional(readOnly = true)
    public Map<String, Object> getTimeSaved(String userId) {
        long totalCount = receiptRepository.countByUserId(userId);
        long totalMins = Math.round(totalCount * 2.67);
        long hours = totalMins / 60;
        long mins = totalMins % 60;

        Map<String, Object> res = new HashMap<>();
        res.put("totalReceiptsProcessed", totalCount);
        res.put("minutesSaved", totalMins);
        res.put("formattedTimeSaved", hours > 0 ? String.format("%dh %dm", hours, mins) : String.format("%dm", mins));
        res.put("disclaimer", "Estimated time saved based on manual entry baseline (~2m 40s per receipt).");
        return res;
    }

    private List<String> generateInsights(MonthlyIntelligenceDto dto, List<Receipt> receipts, BigDecimal prevTotal) {
        List<String> insights = new ArrayList<>();

        if (dto.getMomChangePercentage() != null && Math.abs(dto.getMomChangePercentage()) > 1.0) {
            if (dto.getMomChangePercentage() > 0) {
                insights.add(String.format("Total spending increased by %.1f%% compared with last month.", dto.getMomChangePercentage()));
            } else {
                insights.add(String.format("Total spending decreased by %.1f%% compared with last month.", Math.abs(dto.getMomChangePercentage())));
            }
        }

        if (!dto.getCategoryBreakdown().isEmpty()) {
            CategoryBreakdownExtendedDto topCat = dto.getCategoryBreakdown().get(0);
            insights.add(String.format("%s was your largest expense category (₹%.2f, %.1f%% of total).", topCat.getCategoryName(), topCat.getAmount(), topCat.getPercentageShare()));
        }

        if (dto.getLargestExpenseAmount() != null && dto.getLargestExpenseAmount().compareTo(BigDecimal.ZERO) > 0) {
            insights.add(String.format("Largest single expense was ₹%.2f at %s.", dto.getLargestExpenseAmount(), dto.getLargestExpenseVendor()));
        }

        if (dto.getUncategorizedReceipts() > 0) {
            insights.add(String.format("%d receipts require categorization for accurate tax reporting.", dto.getUncategorizedReceipts()));
        }

        return insights;
    }

    private Map<String, Category> getCategoryMap() {
        Map<String, Category> map = new HashMap<>();
        for (Category c : categoryRepository.findAll()) {
            map.put(c.getId(), c);
        }
        return map;
    }

    private YearMonth parseYearMonth(String monthStr) {
        if (monthStr != null && monthStr.matches("\\d{4}-\\d{2}")) {
            return YearMonth.parse(monthStr);
        }
        return YearMonth.now();
    }
}
