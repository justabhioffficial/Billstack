package com.billstack.controller;

import com.billstack.common.ApiResponse;
import com.billstack.dto.CaReviewDto;
import com.billstack.dto.MonthlyReviewDto;
import com.billstack.security.UserPrincipal;
import com.billstack.service.MonthlyReviewService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/v1")
public class MonthlyReviewController {

    private final MonthlyReviewService monthlyReviewService;

    public MonthlyReviewController(MonthlyReviewService monthlyReviewService) {
        this.monthlyReviewService = monthlyReviewService;
    }

    @GetMapping("/monthly-review")
    public ResponseEntity<ApiResponse<MonthlyReviewDto>> getMonthlyReview(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @RequestParam(value = "year", required = false) Integer year,
            @RequestParam(value = "month", required = false) Integer month
    ) {
        LocalDate now = LocalDate.now();
        int targetYear = (year != null) ? year : now.getYear();
        int targetMonth = (month != null) ? month : now.getMonthValue();
        String monthStr = String.format("%04d-%02d", targetYear, targetMonth);

        MonthlyReviewDto review = monthlyReviewService.getMonthlyReview(currentUser.getId(), monthStr);
        return ResponseEntity.ok(ApiResponse.success(review));
    }

    @GetMapping("/ca-review")
    public ResponseEntity<ApiResponse<CaReviewDto>> getCaReview(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @RequestParam(value = "year", required = false) Integer year,
            @RequestParam(value = "month", required = false) Integer month
    ) {
        LocalDate now = LocalDate.now();
        int targetYear = (year != null) ? year : now.getYear();
        int targetMonth = (month != null) ? month : now.getMonthValue();
        String monthStr = String.format("%04d-%02d", targetYear, targetMonth);

        CaReviewDto review = monthlyReviewService.getCaReview(currentUser.getId(), monthStr);
        return ResponseEntity.ok(ApiResponse.success(review));
    }
}
