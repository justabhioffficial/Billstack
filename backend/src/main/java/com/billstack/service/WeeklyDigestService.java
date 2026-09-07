package com.billstack.service;

import com.billstack.dto.WeeklySummaryDto;
import com.billstack.entity.Category;
import com.billstack.entity.Receipt;
import com.billstack.repository.CategoryRepository;
import com.billstack.repository.ReceiptRepository;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.temporal.TemporalAdjusters;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class WeeklyDigestService {

    private final ReceiptRepository receiptRepository;
    private final CategoryRepository categoryRepository;

    public WeeklyDigestService(ReceiptRepository receiptRepository, CategoryRepository categoryRepository) {
        this.receiptRepository = receiptRepository;
        this.categoryRepository = categoryRepository;
    }

    public WeeklySummaryDto getWeeklySummary(String userId) {
        LocalDate today = LocalDate.now();
        LocalDate startOfWeek = today.with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY));
        LocalDate endOfWeek = today.with(TemporalAdjusters.nextOrSame(DayOfWeek.SUNDAY));

        LocalDate startOfLastWeek = startOfWeek.minusWeeks(1);
        LocalDate endOfLastWeek = endOfWeek.minusWeeks(1);

        List<Receipt> thisWeekReceipts = receiptRepository.findByUserIdAndReceiptDateBetween(userId, startOfWeek, endOfWeek);
        List<Receipt> lastWeekReceipts = receiptRepository.findByUserIdAndReceiptDateBetween(userId, startOfLastWeek, endOfLastWeek);

        double thisWeekTotal = thisWeekReceipts.stream()
                .mapToDouble(r -> r.getTotalAmount() != null ? r.getTotalAmount().doubleValue() : 0.0)
                .sum();

        double lastWeekTotal = lastWeekReceipts.stream()
                .mapToDouble(r -> r.getTotalAmount() != null ? r.getTotalAmount().doubleValue() : 0.0)
                .sum();

        double wowChange = lastWeekTotal > 0 ? ((thisWeekTotal - lastWeekTotal) / lastWeekTotal) * 100.0 : 0.0;

        // Group by Category ID
        Map<String, Double> categoryTotals = thisWeekReceipts.stream()
                .filter(r -> r.getCategoryId() != null)
                .collect(Collectors.groupingBy(Receipt::getCategoryId, Collectors.summingDouble(r -> r.getTotalAmount() != null ? r.getTotalAmount().doubleValue() : 0.0)));

        String topCatName = "General / Other";
        double topCatAmount = 0.0;
        if (!categoryTotals.isEmpty()) {
            Map.Entry<String, Double> maxEntry = categoryTotals.entrySet().stream()
                    .max(Map.Entry.comparingByValue())
                    .orElse(null);
            if (maxEntry != null) {
                topCatAmount = maxEntry.getValue();
                Optional<Category> cat = categoryRepository.findById(maxEntry.getKey());
                if (cat.isPresent()) {
                    topCatName = cat.get().getName();
                }
            }
        }

        // Largest Expense
        Receipt maxReceipt = thisWeekReceipts.stream()
                .max((r1, r2) -> Double.compare(
                        r1.getTotalAmount() != null ? r1.getTotalAmount().doubleValue() : 0,
                        r2.getTotalAmount() != null ? r2.getTotalAmount().doubleValue() : 0
                ))
                .orElse(null);

        String largestVendor = maxReceipt != null && maxReceipt.getVendorName() != null ? maxReceipt.getVendorName() : "N/A";
        double largestAmount = maxReceipt != null && maxReceipt.getTotalAmount() != null ? maxReceipt.getTotalAmount().doubleValue() : 0.0;

        long unreviewedCount = thisWeekReceipts.stream()
                .filter(r -> "NEEDS_REVIEW".equalsIgnoreCase(r.getOcrStatus()) || r.getCategoryId() == null)
                .count();

        WeeklySummaryDto dto = new WeeklySummaryDto();
        dto.setWeekStartDate(startOfWeek.toString());
        dto.setWeekEndDate(endOfWeek.toString());
        dto.setTotalWeeklySpent(thisWeekTotal);
        dto.setTotalWeeklyTransactions(thisWeekReceipts.size());
        dto.setTopCategoryName(topCatName);
        dto.setTopCategoryAmount(topCatAmount);
        dto.setLargestExpenseVendor(largestVendor);
        dto.setLargestExpenseAmount(largestAmount);
        dto.setWowPercentageChange(Math.round(wowChange * 10.0) / 10.0);
        dto.setReceiptsNeedingReview(unreviewedCount);
        dto.setPotentialRecurringCount(0);

        if (thisWeekReceipts.isEmpty()) {
            dto.setWeeklySummaryInsight("No expenses recorded yet this week. Upload your bills to track weekly spending trends.");
        } else {
            dto.setWeeklySummaryInsight(String.format(java.util.Locale.US, "You spent ₹%,.2f across %d receipt%s this week. Top category is %s.", thisWeekTotal, thisWeekReceipts.size(), thisWeekReceipts.size() > 1 ? "s" : "", topCatName));
        }

        return dto;
    }
}
