package com.billstack.controller;

import com.billstack.common.ApiResponse;
import com.billstack.dto.CreateFeedbackRequest;
import com.billstack.dto.UserFeedbackDto;
import com.billstack.security.UserPrincipal;
import com.billstack.service.AuditService;
import com.billstack.service.FeedbackService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/feedback")
public class FeedbackController {

    private final FeedbackService feedbackService;
    private final AuditService auditService;

    public FeedbackController(FeedbackService feedbackService, AuditService auditService) {
        this.feedbackService = feedbackService;
        this.auditService = auditService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<UserFeedbackDto>> submitFeedback(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @RequestBody CreateFeedbackRequest request
    ) {
        UserFeedbackDto dto = feedbackService.submitFeedback(currentUser.getId(), request);
        auditService.logAction(currentUser.getId(), "USER_FEEDBACK_SUBMITTED", dto.getId(), null, null, "SUCCESS", request.getFeedbackType());
        return ResponseEntity.ok(ApiResponse.success(dto, "Feedback submitted successfully. Thank you for making BillStack better!"));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<UserFeedbackDto>>> getUserFeedback(
            @AuthenticationPrincipal UserPrincipal currentUser
    ) {
        List<UserFeedbackDto> feedbacks = feedbackService.getUserFeedback(currentUser.getId());
        return ResponseEntity.ok(ApiResponse.success(feedbacks));
    }
}
