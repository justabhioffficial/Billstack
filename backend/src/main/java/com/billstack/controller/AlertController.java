package com.billstack.controller;

import com.billstack.common.ApiResponse;
import com.billstack.dto.ExpenseAlertDto;
import com.billstack.entity.UserNotificationPreferences;
import com.billstack.security.UserPrincipal;
import com.billstack.service.AlertService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/alerts")
public class AlertController {

    private final AlertService alertService;

    public AlertController(AlertService alertService) {
        this.alertService = alertService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<ExpenseAlertDto>>> getAlerts(
            @AuthenticationPrincipal UserPrincipal currentUser
    ) {
        List<ExpenseAlertDto> alerts = alertService.getActiveAlerts(currentUser.getId());
        return ResponseEntity.ok(ApiResponse.success(alerts));
    }

    @PostMapping("/{alertId}/dismiss")
    public ResponseEntity<ApiResponse<Void>> dismissAlert(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @PathVariable String alertId
    ) {
        alertService.dismissAlert(currentUser.getId(), alertId);
        return ResponseEntity.ok(ApiResponse.success(null, "Alert dismissed successfully"));
    }

    @GetMapping("/preferences")
    public ResponseEntity<ApiResponse<UserNotificationPreferences>> getPreferences(
            @AuthenticationPrincipal UserPrincipal currentUser
    ) {
        UserNotificationPreferences preferences = alertService.getPreferences(currentUser.getId());
        return ResponseEntity.ok(ApiResponse.success(preferences));
    }

    @PutMapping("/preferences")
    public ResponseEntity<ApiResponse<UserNotificationPreferences>> updatePreferences(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @RequestBody UserNotificationPreferences updatedPreferences
    ) {
        UserNotificationPreferences preferences = alertService.updatePreferences(currentUser.getId(), updatedPreferences);
        return ResponseEntity.ok(ApiResponse.success(preferences, "Notification preferences updated successfully"));
    }
}
