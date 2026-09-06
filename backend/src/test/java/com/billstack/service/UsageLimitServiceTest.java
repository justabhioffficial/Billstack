package com.billstack.service;

import com.billstack.common.exception.LimitExceededException;
import com.billstack.entity.MonthlyUsage;
import com.billstack.entity.Subscription;
import com.billstack.repository.MonthlyUsageRepository;
import com.billstack.repository.SubscriptionRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;

class UsageLimitServiceTest {

    private SubscriptionRepository subscriptionRepository;
    private MonthlyUsageRepository monthlyUsageRepository;
    private UsageLimitService usageLimitService;

    @BeforeEach
    void setUp() {
        subscriptionRepository = Mockito.mock(SubscriptionRepository.class);
        monthlyUsageRepository = Mockito.mock(MonthlyUsageRepository.class);
        usageLimitService = new UsageLimitService(subscriptionRepository, monthlyUsageRepository, 20);
    }

    @Test
    void testFreeUserUnderLimit() {
        Subscription freeSub = new Subscription();
        freeSub.setPlan("FREE");
        freeSub.setStatus("ACTIVE");
        when(subscriptionRepository.findByUserId("u1")).thenReturn(Optional.of(freeSub));

        MonthlyUsage usage = new MonthlyUsage("u1", "2026-09", 5);
        when(monthlyUsageRepository.findForUpdate(anyString(), anyString())).thenReturn(Optional.of(usage));

        assertDoesNotThrow(() -> usageLimitService.checkAndIncrementUsage("u1"));
        assertEquals(6, usage.getReceiptCount());
    }

    @Test
    void testFreeUserExceedsLimitThrowsException() {
        Subscription freeSub = new Subscription();
        freeSub.setPlan("FREE");
        freeSub.setStatus("ACTIVE");
        when(subscriptionRepository.findByUserId("u1")).thenReturn(Optional.of(freeSub));

        MonthlyUsage usage = new MonthlyUsage("u1", "2026-09", 20);
        when(monthlyUsageRepository.findForUpdate(anyString(), anyString())).thenReturn(Optional.of(usage));

        assertThrows(LimitExceededException.class, () -> usageLimitService.checkAndIncrementUsage("u1"));
    }

    @Test
    void testProUserBypassesLimit() {
        Subscription proSub = new Subscription();
        proSub.setPlan("PRO");
        proSub.setStatus("ACTIVE");
        when(subscriptionRepository.findByUserId("u1")).thenReturn(Optional.of(proSub));

        MonthlyUsage usage = new MonthlyUsage("u1", "2026-09", 150);
        when(monthlyUsageRepository.findForUpdate(anyString(), anyString())).thenReturn(Optional.of(usage));

        assertDoesNotThrow(() -> usageLimitService.checkAndIncrementUsage("u1"));
        assertEquals(151, usage.getReceiptCount());
    }
}
