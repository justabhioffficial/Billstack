package com.billstack.service;

import com.billstack.dto.AdminStatsDto;
import com.billstack.repository.PaymentRepository;
import com.billstack.repository.ReceiptRepository;
import com.billstack.repository.SubscriptionRepository;
import com.billstack.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Service
public class AdminService {

    private final UserRepository userRepository;
    private final ReceiptRepository receiptRepository;
    private final SubscriptionRepository subscriptionRepository;
    private final PaymentRepository paymentRepository;

    public AdminService(
            UserRepository userRepository,
            ReceiptRepository receiptRepository,
            SubscriptionRepository subscriptionRepository,
            PaymentRepository paymentRepository
    ) {
        this.userRepository = userRepository;
        this.receiptRepository = receiptRepository;
        this.subscriptionRepository = subscriptionRepository;
        this.paymentRepository = paymentRepository;
    }

    @Transactional(readOnly = true)
    public AdminStatsDto getAdminStats() {
        AdminStatsDto stats = new AdminStatsDto();
        stats.setTotalUsers(userRepository.count());
        stats.setTotalReceipts(receiptRepository.count());
        stats.setFailedOcrCount(receiptRepository.countByOcrStatus("FAILED"));
        stats.setFreeUsersCount(subscriptionRepository.countByPlanAndStatus("FREE", "ACTIVE"));

        long proCount = subscriptionRepository.countByPlanAndStatus("PRO", "ACTIVE");
        stats.setProUsersCount(proCount);
        stats.setMonthlyRecurringRevenue(BigDecimal.valueOf(proCount * 199L));
        stats.setFailedPaymentsCount(paymentRepository.countByStatus("FAILED"));

        return stats;
    }
}
