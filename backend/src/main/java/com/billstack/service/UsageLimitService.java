package com.billstack.service;

import com.billstack.common.exception.LimitExceededException;
import com.billstack.entity.MonthlyUsage;
import com.billstack.entity.Subscription;
import com.billstack.repository.MonthlyUsageRepository;
import com.billstack.repository.SubscriptionRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Optional;

@Service
public class UsageLimitService {

    private final SubscriptionRepository subscriptionRepository;
    private final MonthlyUsageRepository monthlyUsageRepository;
    private final int freePlanLimit;

    public UsageLimitService(
            SubscriptionRepository subscriptionRepository,
            MonthlyUsageRepository monthlyUsageRepository,
            @Value("${billstack.limits.free-plan-monthly-limit:20}") int freePlanLimit
    ) {
        this.subscriptionRepository = subscriptionRepository;
        this.monthlyUsageRepository = monthlyUsageRepository;
        this.freePlanLimit = freePlanLimit;
    }

    @Transactional
    public void checkAndIncrementUsage(String userId) {
        String currentYearMonth = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyy-MM"));

        Subscription subscription = subscriptionRepository.findByUserId(userId)
                .orElseGet(() -> {
                    Subscription newSub = new Subscription();
                    newSub.setUserId(userId);
                    newSub.setPlan("FREE");
                    newSub.setStatus("ACTIVE");
                    newSub.setCurrentPeriodStart(LocalDate.now().atStartOfDay());
                    newSub.setCurrentPeriodEnd(LocalDate.now().plusYears(1).atStartOfDay());
                    return subscriptionRepository.save(newSub);
                });

        boolean isPro = "PRO".equalsIgnoreCase(subscription.getPlan())
                && "ACTIVE".equalsIgnoreCase(subscription.getStatus())
                && (subscription.getCurrentPeriodEnd() == null || subscription.getCurrentPeriodEnd().isAfter(java.time.LocalDateTime.now()));

        Optional<MonthlyUsage> usageOpt = monthlyUsageRepository.findForUpdate(userId, currentYearMonth);
        MonthlyUsage usage;
        if (usageOpt.isPresent()) {
            usage = usageOpt.get();
        } else {
            usage = new MonthlyUsage(userId, currentYearMonth, 0);
            usage = monthlyUsageRepository.save(usage);
        }

        if (!isPro && usage.getReceiptCount() >= freePlanLimit) {
            throw new LimitExceededException("You have reached your 20 free receipt upload limit for this month. Upgrade to Pro for ₹99 to get 30 days of unlimited receipt uploads!");
        }

        usage.setReceiptCount(usage.getReceiptCount() + 1);
        monthlyUsageRepository.save(usage);
    }

    public int getCurrentMonthUsage(String userId) {
        String currentYearMonth = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyy-MM"));
        return monthlyUsageRepository.findByUserIdAndYearMonth(userId, currentYearMonth)
                .map(MonthlyUsage::getReceiptCount)
                .orElse(0);
    }

    public int getMonthlyLimit(String userId) {
        Subscription subscription = subscriptionRepository.findByUserId(userId).orElse(null);
        boolean isPro = subscription != null
                && "PRO".equalsIgnoreCase(subscription.getPlan())
                && "ACTIVE".equalsIgnoreCase(subscription.getStatus())
                && (subscription.getCurrentPeriodEnd() == null || subscription.getCurrentPeriodEnd().isAfter(java.time.LocalDateTime.now()));
        if (isPro) {
            return Integer.MAX_VALUE; // Unlimited
        }
        return freePlanLimit;
    }
}
