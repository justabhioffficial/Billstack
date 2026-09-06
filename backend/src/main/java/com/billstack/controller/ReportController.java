package com.billstack.controller;

import com.billstack.common.ApiResponse;
import com.billstack.dto.MonthlyReportDto;
import com.billstack.security.UserPrincipal;
import com.billstack.service.ReportService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/reports")
public class ReportController {

    private final ReportService reportService;

    public ReportController(ReportService reportService) {
        this.reportService = reportService;
    }

    @GetMapping("/monthly")
    public ResponseEntity<ApiResponse<MonthlyReportDto>> getMonthlyReport(
            @RequestParam(value = "month", required = false) String yearMonth,
            @AuthenticationPrincipal UserPrincipal currentUser
    ) {
        MonthlyReportDto report = reportService.getMonthlyReport(currentUser.getId(), yearMonth);
        return ResponseEntity.ok(ApiResponse.success(report));
    }
}
