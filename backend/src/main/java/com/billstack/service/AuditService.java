package com.billstack.service;

import com.billstack.entity.AuditLog;
import com.billstack.repository.AuditLogRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class AuditService {

    private final AuditLogRepository auditLogRepository;

    public AuditService(AuditLogRepository auditLogRepository) {
        this.auditLogRepository = auditLogRepository;
    }

    @Transactional
    public void logAction(String userId, String action, String target, String ipAddress, String requestId, String status, String details) {
        try {
            AuditLog log = new AuditLog(userId, action, target, ipAddress, requestId, status, details);
            auditLogRepository.save(log);
        } catch (Exception e) {
            // Prevent audit failures from crashing primary business requests
            System.err.println("Failed to save audit log: " + e.getMessage());
        }
    }

    @Transactional(readOnly = true)
    public Page<AuditLog> getLogs(int page, int size) {
        return auditLogRepository.findAllByOrderByCreatedAtDesc(PageRequest.of(page, size));
    }

    @Transactional(readOnly = true)
    public List<AuditLog> getUserLogs(String userId) {
        return auditLogRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }
}
