package com.billstack.controller;

import com.billstack.common.ApiResponse;
import com.billstack.common.PagedResponse;
import com.billstack.dto.AdminStatsDto;
import com.billstack.dto.AuditLogDto;
import com.billstack.dto.HealthStatusDto;
import com.billstack.dto.UserFeedbackDto;
import com.billstack.entity.AuditLog;
import com.billstack.security.UserPrincipal;
import com.billstack.service.*;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final AdminService adminService;
    private final SystemHealthService systemHealthService;
    private final AuditService auditService;
    private final FeedbackService feedbackService;
    private final ProductAnalyticsService analyticsService;
    private final FounderDashboardService founderDashboardService;

    public AdminController(
            AdminService adminService,
            SystemHealthService systemHealthService,
            AuditService auditService,
            FeedbackService feedbackService,
            ProductAnalyticsService analyticsService,
            FounderDashboardService founderDashboardService
    ) {
        this.adminService = adminService;
        this.systemHealthService = systemHealthService;
        this.auditService = auditService;
        this.feedbackService = feedbackService;
        this.analyticsService = analyticsService;
        this.founderDashboardService = founderDashboardService;
    }

    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<AdminStatsDto>> getAdminStats() {
        AdminStatsDto stats = adminService.getAdminStats();
        return ResponseEntity.ok(ApiResponse.success(stats));
    }

    @GetMapping("/founder-metrics")
    public ResponseEntity<ApiResponse<com.billstack.dto.FounderMetricsDto>> getFounderMetrics() {
        com.billstack.dto.FounderMetricsDto metrics = founderDashboardService.getFounderMetrics();
        return ResponseEntity.ok(ApiResponse.success(metrics));
    }

    @GetMapping("/health")
    public ResponseEntity<ApiResponse<HealthStatusDto>> getSystemHealth() {
        HealthStatusDto health = systemHealthService.checkSystemHealth();
        return ResponseEntity.ok(ApiResponse.success(health));
    }

    @GetMapping("/audit-logs")
    public ResponseEntity<ApiResponse<PagedResponse<AuditLogDto>>> getAuditLogs(
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "20") int size
    ) {
        Page<AuditLog> pageRes = auditService.getLogs(page, size);
        List<AuditLogDto> dtos = pageRes.getContent().stream().map(AuditLogDto::fromEntity).collect(Collectors.toList());
        PagedResponse<AuditLogDto> response = new PagedResponse<>(
                dtos, pageRes.getNumber(), pageRes.getSize(), pageRes.getTotalElements(), pageRes.getTotalPages(), pageRes.isLast()
        );
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/feedback")
    public ResponseEntity<ApiResponse<PagedResponse<UserFeedbackDto>>> getAllFeedback(
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "15") int size,
            @RequestParam(value = "status", required = false) String status
    ) {
        Page<UserFeedbackDto> response = feedbackService.getAllFeedback(page, size, status);
        PagedResponse<UserFeedbackDto> paged = new PagedResponse<>(
                response.getContent(), response.getNumber(), response.getSize(), response.getTotalElements(), response.getTotalPages(), response.isLast()
        );
        return ResponseEntity.ok(ApiResponse.success(paged));
    }

    @PutMapping("/feedback/{id}/status")
    public ResponseEntity<ApiResponse<UserFeedbackDto>> updateFeedbackStatus(
            @PathVariable String id,
            @RequestParam String status,
            @RequestParam(required = false) String adminNotes,
            @AuthenticationPrincipal UserPrincipal currentUser
    ) {
        UserFeedbackDto updated = feedbackService.updateFeedbackStatus(id, status, adminNotes);
        auditService.logAction(currentUser.getId(), "ADMIN_FEEDBACK_RESOLVED", id, null, null, "SUCCESS", "Feedback status changed to " + status);
        return ResponseEntity.ok(ApiResponse.success(updated, "Feedback status updated"));
    }

    @GetMapping("/analytics/funnel")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getActivationFunnel() {
        Map<String, Object> funnel = analyticsService.getActivationFunnel();
        return ResponseEntity.ok(ApiResponse.success(funnel));
    }
}

