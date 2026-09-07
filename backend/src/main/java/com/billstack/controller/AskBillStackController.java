package com.billstack.controller;

import com.billstack.common.ApiResponse;
import com.billstack.dto.AskQueryRequest;
import com.billstack.dto.AskQueryResponse;
import com.billstack.security.UserPrincipal;
import com.billstack.service.AskBillStackService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/ask")
public class AskBillStackController {

    private final AskBillStackService askBillStackService;

    public AskBillStackController(AskBillStackService askBillStackService) {
        this.askBillStackService = askBillStackService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<AskQueryResponse>> processQuery(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @RequestBody AskQueryRequest request
    ) {
        AskQueryResponse response = askBillStackService.processQuery(currentUser.getId(), request);
        return ResponseEntity.ok(ApiResponse.success(response));
    }
}
