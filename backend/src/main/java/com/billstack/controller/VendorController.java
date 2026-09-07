package com.billstack.controller;

import com.billstack.common.ApiResponse;
import com.billstack.dto.VendorAnalyticsDto;
import com.billstack.security.UserPrincipal;
import com.billstack.service.VendorService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/vendors")
public class VendorController {

    private final VendorService vendorService;

    public VendorController(VendorService vendorService) {
        this.vendorService = vendorService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<VendorAnalyticsDto>>> getVendorAnalytics(
            @AuthenticationPrincipal UserPrincipal currentUser
    ) {
        List<VendorAnalyticsDto> vendors = vendorService.getAllVendorAnalytics(currentUser.getId());
        return ResponseEntity.ok(ApiResponse.success(vendors));
    }
}
