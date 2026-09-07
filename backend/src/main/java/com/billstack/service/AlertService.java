package com.billstack.service;

import com.billstack.common.exception.ResourceNotFoundException;
import com.billstack.dto.ExpenseAlertDto;
import com.billstack.entity.ExpenseAlert;
import com.billstack.entity.Receipt;
import com.billstack.entity.UserNotificationPreferences;
import com.billstack.repository.ExpenseAlertRepository;
import com.billstack.repository.ReceiptRepository;
import com.billstack.repository.UserNotificationPreferencesRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.*;

@Service
public class AlertService {

    private final ExpenseAlertRepository alertRepository;
    private final ReceiptRepository receiptRepository;
    private final UserNotificationPreferencesRepository preferencesRepository;

    public AlertService(
            ExpenseAlertRepository alertRepository,
            ReceiptRepository receiptRepository,
            UserNotificationPreferencesRepository preferencesRepository
    ) {
        this.alertRepository = alertRepository;
        this.receiptRepository = receiptRepository;
        this.preferencesRepository = preferencesRepository;
    }

    @Transactional
    public List<ExpenseAlertDto> getActiveAlerts(String userId) {
        // Automatically evaluate smart spending alerts on fetch
        evaluateSmartAlerts(userId);
        List<ExpenseAlert> alerts = alertRepository.findByUserIdAndIsDismissedFalseOrderByCreatedAtDesc(userId);
        return alerts.stream().map(ExpenseAlertDto::fromEntity).toList();
    }

    @Transactional
    public ExpenseAlertDto markAsRead(String alertId, String userId) {
        ExpenseAlert alert = alertRepository.findByIdAndUserId(alertId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Alert not found with id: " + alertId));
        alert.setRead(true);
        alert = alertRepository.save(alert);
        return ExpenseAlertDto.fromEntity(alert);
    }

    @Transactional
    public ExpenseAlertDto dismissAlert(String alertId, String userId) {
        ExpenseAlert alert = alertRepository.findByIdAndUserId(alertId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Alert not found with id: " + alertId));
        alert.setDismissed(true);
        alert = alertRepository.save(alert);
        return ExpenseAlertDto.fromEntity(alert);
    }

    @Transactional
    public UserNotificationPreferences getPreferences(String userId) {
        return preferencesRepository.findByUserId(userId)
                .orElseGet(() -> preferencesRepository.save(new UserNotificationPreferences(userId)));
    }

    @Transactional
    public UserNotificationPreferences updatePreferences(String userId, UserNotificationPreferences updated) {
        UserNotificationPreferences existing = getPreferences(userId);
        existing.setMonthlySummaryEmail(updated.isMonthlySummaryEmail());
        existing.setSpendingAlertsEmail(updated.isSpendingAlertsEmail());
        existing.setRecurringAlertsEmail(updated.isRecurringAlertsEmail());
        return preferencesRepository.save(existing);
    }

    @Transactional
    public void evaluateSmartAlerts(String userId) {
        YearMonth ym = YearMonth.now();
        LocalDate start = ym.atDay(1);
        LocalDate end = ym.atEndOfMonth();

        // 1. Check MoM Spending Spike (>25% increase)
        BigDecimal currentSpent = receiptRepository.sumTotalByUserIdAndDateRange(userId, start, end);
        YearMonth prevYm = ym.minusMonths(1);
        BigDecimal prevSpent = receiptRepository.sumTotalByUserIdAndDateRange(userId, prevYm.atDay(1), prevYm.atEndOfMonth());

        if (currentSpent != null && prevSpent != null && prevSpent.compareTo(BigDecimal.valueOf(100)) > 0) {
            double delta = currentSpent.subtract(prevSpent).doubleValue();
            double pct = (delta / prevSpent.doubleValue()) * 100.0;

            if (pct >= 25.0) {
                String title = String.format("%s Spending Spike Alert", ym.getMonth().name());
                String msg = String.format("Your spending in %s (₹%.2f) is %.1f%% higher than last month (₹%.2f).",
                        ym.getMonth().name(), currentSpent, pct, prevSpent);

                if (!alertRepository.existsSimilarAlert(userId, "SPENDING_SPIKE", title)) {
                    alertRepository.save(new ExpenseAlert(userId, title, msg, "SPENDING_SPIKE", "WARNING"));
                }
            }
        }

        // 2. Check Unreviewed Receipts Accumulating (>5 unreviewed)
        List<Receipt> userReceipts = receiptRepository.findByUserId(userId);
        long unreviewedCount = userReceipts.stream().filter(r -> "NEEDS_REVIEW".equals(r.getOcrStatus()) || "FAILED".equals(r.getOcrStatus())).count();

        if (unreviewedCount >= 5) {
            String title = "Receipts Requiring Review";
            String msg = String.format("You have %d receipts waiting for review. Completing them improves your Expense Health Score.", unreviewedCount);

            if (!alertRepository.existsSimilarAlert(userId, "UNREVIEWED_COUNT", title)) {
                alertRepository.save(new ExpenseAlert(userId, title, msg, "UNREVIEWED_COUNT", "INFO"));
            }
        }

        // 3. Unusually Large Expense (>2.5x monthly average)
        if (!userReceipts.isEmpty()) {
            double avgAmount = userReceipts.stream()
                    .filter(r -> r.getTotalAmount() != null)
                    .mapToDouble(r -> r.getTotalAmount().doubleValue())
                    .average().orElse(0.0);

            if (avgAmount > 0) {
                double threshold = avgAmount * 2.5;
                for (Receipt r : userReceipts) {
                    if (r.getTotalAmount() != null && r.getTotalAmount().doubleValue() >= threshold && r.getReceiptDate() != null && !r.getReceiptDate().isBefore(start)) {
                        String title = String.format("Unusually Large Expense: %s", r.getVendorName() != null ? r.getVendorName() : "Receipt");
                        String msg = String.format("Transaction of ₹%.2f on %s is significantly higher than your average receipt amount (₹%.2f).",
                                r.getTotalAmount(), r.getReceiptDate(), avgAmount);

                        if (!alertRepository.existsSimilarAlert(userId, "LARGE_EXPENSE", title)) {
                            alertRepository.save(new ExpenseAlert(userId, title, msg, "LARGE_EXPENSE", "INFO"));
                        }
                    }
                }
            }
        }
    }
}
