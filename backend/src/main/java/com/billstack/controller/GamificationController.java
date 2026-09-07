package com.billstack.controller;

import com.billstack.common.ApiResponse;
import com.billstack.dto.StreakDto;
import com.billstack.dto.UserMilestoneDto;
import com.billstack.security.UserPrincipal;
import com.billstack.service.GamificationService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/gamification")
public class GamificationController {

    private final GamificationService gamificationService;

    public GamificationController(GamificationService gamificationService) {
        this.gamificationService = gamificationService;
    }

    @GetMapping("/streaks")
    public ResponseEntity<ApiResponse<StreakDto>> getStreaks(
            @AuthenticationPrincipal UserPrincipal currentUser
    ) {
        StreakDto streaks = gamificationService.getStreaks(currentUser.getId());
        return ResponseEntity.ok(ApiResponse.success(streaks));
    }

    @GetMapping("/milestones")
    public ResponseEntity<ApiResponse<List<UserMilestoneDto>>> getMilestones(
            @AuthenticationPrincipal UserPrincipal currentUser
    ) {
        List<UserMilestoneDto> milestones = gamificationService.getMilestones(currentUser.getId());
        return ResponseEntity.ok(ApiResponse.success(milestones));
    }
}
