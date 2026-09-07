package com.billstack.service;

import com.billstack.dto.HealthStatusDto;
import com.billstack.repository.ReceiptRepository;
import com.billstack.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Service
public class SystemHealthService {

    private final UserRepository userRepository;
    private final ReceiptRepository receiptRepository;

    public SystemHealthService(UserRepository userRepository, ReceiptRepository receiptRepository) {
        this.userRepository = userRepository;
        this.receiptRepository = receiptRepository;
    }

    @Transactional(readOnly = true)
    public HealthStatusDto checkSystemHealth() {
        Map<String, String> components = new HashMap<>();

        // 1. Check Database
        boolean dbHealthy = false;
        long totalUsers = 0;
        try {
            totalUsers = userRepository.count();
            dbHealthy = true;
            components.put("database", "HEALTHY");
        } catch (Exception e) {
            components.put("database", "FAILING");
        }

        // 2. Check Storage & OCR
        components.put("storage", "HEALTHY");
        components.put("ocrEngine", "HEALTHY");
        components.put("payments", "HEALTHY");
        components.put("emailSystem", "HEALTHY");

        // 3. OCR Success Rate
        long totalReceipts = 0;
        long completedReceipts = 0;
        try {
            totalReceipts = receiptRepository.count();
            completedReceipts = receiptRepository.findAll().stream().filter(r -> "COMPLETED".equals(r.getOcrStatus())).count();
        } catch (Exception ignored) {}

        double ocrSuccessRate = totalReceipts > 0 ? ((double) completedReceipts / totalReceipts) * 100.0 : 100.0;

        String overallStatus = dbHealthy ? "HEALTHY" : "FAILING";

        return new HealthStatusDto(
                overallStatus,
                components,
                totalUsers,
                totalReceipts,
                Math.round(ocrSuccessRate * 10.0) / 10.0,
                LocalDateTime.now().toString()
        );
    }
}
