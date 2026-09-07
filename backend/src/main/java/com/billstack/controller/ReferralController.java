package com.billstack.controller;

import com.billstack.common.ApiResponse;
import com.billstack.dto.ReferralStatsDto;
import com.billstack.security.UserPrincipal;
import com.billstack.service.ReferralService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/referrals")
public class ReferralController {

    private final ReferralService referralService;

    public ReferralController(ReferralService referralService) {
        this.referralService = referralService;
    }

    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<ReferralStatsDto>> getReferralStats(
            @AuthenticationPrincipal UserPrincipal currentUser,
            HttpServletRequest request
    ) {
        String baseUrl = request.getScheme() + "://" + request.getServerName() + (request.getServerPort() != 80 && request.getServerPort() != 443 ? ":" + request.getServerPort() : "");
        ReferralStatsDto stats = referralService.getReferralStats(currentUser.getId(), baseUrl);
        return ResponseEntity.ok(ApiResponse.success(stats));
    }

    @PostMapping("/track")
    public ResponseEntity<ApiResponse<Void>> trackReferral(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @RequestBody Map<String, String> body
    ) {
        String referralCode = body.get("referralCode");
        referralService.trackReferralSignup(referralCode, currentUser.getId());
        return ResponseEntity.ok(ApiResponse.success(null, "Referral tracked successfully"));
    }
}
