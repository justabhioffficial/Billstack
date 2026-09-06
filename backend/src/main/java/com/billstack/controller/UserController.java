package com.billstack.controller;

import com.billstack.common.ApiResponse;
import com.billstack.dto.UpdateUserRequest;
import com.billstack.dto.UserDto;
import com.billstack.security.UserPrincipal;
import com.billstack.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/me")
public class UserController {

    private final AuthService authService;
    private final com.billstack.service.SampleDataService sampleDataService;

    public UserController(AuthService authService, com.billstack.service.SampleDataService sampleDataService) {
        this.authService = authService;
        this.sampleDataService = sampleDataService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<UserDto>> getCurrentUser(@AuthenticationPrincipal UserPrincipal currentUser) {
        UserDto user = authService.getUserProfile(currentUser.getId());
        return ResponseEntity.ok(ApiResponse.success(user));
    }

    @PutMapping
    public ResponseEntity<ApiResponse<UserDto>> updateProfile(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @RequestBody UpdateUserRequest request
    ) {
        UserDto user = authService.updateUserProfile(currentUser.getId(), request);
        return ResponseEntity.ok(ApiResponse.success(user, "Profile updated successfully"));
    }

    @PostMapping("/seed-past-data")
    public ResponseEntity<ApiResponse<String>> seedPastData(@AuthenticationPrincipal UserPrincipal currentUser) {
        sampleDataService.seedPastMonthsData(currentUser.getId());
        return ResponseEntity.ok(ApiResponse.success("Successfully seeded past 5 months of receipt data", "Past 5-month sample data generated"));
    }
}
