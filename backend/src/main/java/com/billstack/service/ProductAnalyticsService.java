package com.billstack.service;

import com.billstack.entity.ProductAnalyticsEvent;
import com.billstack.repository.ProductAnalyticsEventRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ProductAnalyticsService {

    private final ProductAnalyticsEventRepository analyticsRepository;

    public ProductAnalyticsService(ProductAnalyticsEventRepository analyticsRepository) {
        this.analyticsRepository = analyticsRepository;
    }

    @Transactional
    public void trackEvent(String userId, String eventName, String sessionId, String propertiesJson) {
        try {
            ProductAnalyticsEvent event = new ProductAnalyticsEvent(userId, eventName, sessionId, propertiesJson);
            analyticsRepository.save(event);
        } catch (Exception e) {
            System.err.println("Failed to log product analytics event: " + e.getMessage());
        }
    }

    @Transactional(readOnly = true)
    public Map<String, Object> getActivationFunnel() {
        Map<String, Object> funnel = new HashMap<>();
        long signups = analyticsRepository.countByEventName("user_registered");
        long logins = analyticsRepository.countByEventName("user_logged_in");
        long uploads = analyticsRepository.countByEventName("receipt_uploaded");
        long reviews = analyticsRepository.countByEventName("receipt_reviewed");
        long askQueries = analyticsRepository.countByEventName("ask_billstack_used");
        long upgrades = analyticsRepository.countByEventName("subscription_upgraded");

        funnel.put("signups", signups);
        funnel.put("logins", logins);
        funnel.put("uploads", uploads);
        funnel.put("reviews", reviews);
        funnel.put("askQueries", askQueries);
        funnel.put("upgrades", upgrades);

        double activationRate = signups > 0 ? ((double) uploads / signups) * 100.0 : 0.0;
        funnel.put("activationRatePercent", Math.round(activationRate * 10.0) / 10.0);

        return funnel;
    }

    @Transactional(readOnly = true)
    public Map<String, Long> getEventCountsSince(int days) {
        LocalDateTime sinceDate = LocalDateTime.now().minusDays(days);
        List<Object[]> rows = analyticsRepository.countEventsByGroupSince(sinceDate);
        Map<String, Long> counts = new HashMap<>();
        for (Object[] row : rows) {
            counts.put((String) row[0], ((Number) row[1]).longValue());
        }
        return counts;
    }
}
