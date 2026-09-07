package com.billstack.controller;

import com.billstack.common.ApiResponse;
import com.billstack.dto.ExpenseHealthDto;
import com.billstack.dto.MonthlyIntelligenceDto;
import com.billstack.security.UserPrincipal;
import com.billstack.service.IntelligenceService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/v1/intelligence")
public class IntelligenceController {

    private final IntelligenceService intelligenceService;
    private final com.billstack.service.WeeklyDigestService weeklyDigestService;

    public IntelligenceController(
            IntelligenceService intelligenceService,
            com.billstack.service.WeeklyDigestService weeklyDigestService
    ) {
        this.intelligenceService = intelligenceService;
        this.weeklyDigestService = weeklyDigestService;
    }

    @GetMapping("/monthly")
    public ResponseEntity<ApiResponse<MonthlyIntelligenceDto>> getMonthlyIntelligence(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @RequestParam(value = "year", required = false) Integer year,
            @RequestParam(value = "month", required = false) Integer month
    ) {
        LocalDate now = LocalDate.now();
        int targetYear = (year != null) ? year : now.getYear();
        int targetMonth = (month != null) ? month : now.getMonthValue();
        String monthStr = String.format("%04d-%02d", targetYear, targetMonth);

        MonthlyIntelligenceDto intelligence = intelligenceService.getMonthlyIntelligence(currentUser.getId(), monthStr);
        return ResponseEntity.ok(ApiResponse.success(intelligence));
    }

    @GetMapping("/health")
    public ResponseEntity<ApiResponse<ExpenseHealthDto>> getExpenseHealth(
            @AuthenticationPrincipal UserPrincipal currentUser
    ) {
        ExpenseHealthDto health = intelligenceService.getExpenseHealth(currentUser.getId());
        return ResponseEntity.ok(ApiResponse.success(health));
    }

    @GetMapping("/weekly-summary")
    public ResponseEntity<ApiResponse<com.billstack.dto.WeeklySummaryDto>> getWeeklySummary(
            @AuthenticationPrincipal UserPrincipal currentUser
    ) {
        com.billstack.dto.WeeklySummaryDto summary = weeklyDigestService.getWeeklySummary(currentUser.getId());
        return ResponseEntity.ok(ApiResponse.success(summary));
    }
}

