package com.billstack.controller;

import com.billstack.common.ApiResponse;
import com.billstack.dto.CheckoutResponseDto;
import com.billstack.dto.SubscriptionDto;
import com.billstack.entity.Subscription;
import com.billstack.entity.User;
import com.billstack.payment.PaymentService;
import com.billstack.repository.SubscriptionRepository;
import com.billstack.repository.UserRepository;
import com.billstack.security.UserPrincipal;
import com.billstack.service.UsageLimitService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/subscription")
public class SubscriptionController {

    private final SubscriptionRepository subscriptionRepository;
    private final UserRepository userRepository;
    private final UsageLimitService usageLimitService;
    private final PaymentService paymentService;
    private final com.billstack.repository.SubscriptionCancellationRepository cancellationRepository;

    public SubscriptionController(
            SubscriptionRepository subscriptionRepository,
            UserRepository userRepository,
            UsageLimitService usageLimitService,
            PaymentService paymentService,
            com.billstack.repository.SubscriptionCancellationRepository cancellationRepository
    ) {
        this.subscriptionRepository = subscriptionRepository;
        this.userRepository = userRepository;
        this.usageLimitService = usageLimitService;
        this.paymentService = paymentService;
        this.cancellationRepository = cancellationRepository;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<SubscriptionDto>> getSubscription(@AuthenticationPrincipal UserPrincipal currentUser) {
        Subscription sub = subscriptionRepository.findByUserId(currentUser.getId()).orElseGet(() -> {
            Subscription s = new Subscription();
            s.setUserId(currentUser.getId());
            s.setPlan("FREE");
            s.setStatus("ACTIVE");
            return s;
        });

        int usageCount = usageLimitService.getCurrentMonthUsage(currentUser.getId());
        int limit = usageLimitService.getMonthlyLimit(currentUser.getId());

        return ResponseEntity.ok(ApiResponse.success(SubscriptionDto.fromEntity(sub, usageCount, limit)));
    }

    @PostMapping("/checkout")
    public ResponseEntity<ApiResponse<CheckoutResponseDto>> createCheckoutOrder(
            @RequestBody Map<String, String> body,
            @AuthenticationPrincipal UserPrincipal currentUser
    ) {
        User user = userRepository.findById(currentUser.getId()).orElseThrow();
        String plan = body.getOrDefault("plan", "PRO");
        BigDecimal amount = "YEARLY".equalsIgnoreCase(body.get("billingCycle")) ? new BigDecimal("1999.00") : new BigDecimal("199.00");

        CheckoutResponseDto checkout = paymentService.createOrder(user, plan, amount);
        return ResponseEntity.ok(ApiResponse.success(checkout, "Order created successfully"));
    }

    @PostMapping("/verify")
    public ResponseEntity<ApiResponse<SubscriptionDto>> verifyPayment(
            @RequestBody Map<String, String> payload,
            @AuthenticationPrincipal UserPrincipal currentUser
    ) {
        String orderId = payload.get("razorpay_order_id");
        String paymentId = payload.get("razorpay_payment_id");
        String signature = payload.get("razorpay_signature");

        boolean isValid = paymentService.verifyPaymentSignature(orderId, paymentId, signature);
        if (!isValid) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Invalid payment signature verification failed", "PAYMENT_VERIFICATION_FAILED"));
        }

        User user = userRepository.findById(currentUser.getId()).orElseThrow();
        Subscription activatedSub = paymentService.activateProSubscription(user, orderId, paymentId);

        int usageCount = usageLimitService.getCurrentMonthUsage(currentUser.getId());
        int limit = usageLimitService.getMonthlyLimit(currentUser.getId());

        return ResponseEntity.ok(ApiResponse.success(SubscriptionDto.fromEntity(activatedSub, usageCount, limit), "Pro Subscription activated successfully!"));
    }

    @PostMapping("/cancel")
    public ResponseEntity<ApiResponse<SubscriptionDto>> cancelSubscription(
            @RequestBody com.billstack.dto.CancelSubscriptionRequest request,
            @AuthenticationPrincipal UserPrincipal currentUser
    ) {
        Subscription sub = subscriptionRepository.findByUserId(currentUser.getId()).orElseThrow();
        String oldPlan = sub.getPlan();
        sub.setPlan("FREE");
        sub.setStatus("CANCELLED");
        subscriptionRepository.save(sub);

        com.billstack.entity.SubscriptionCancellation cancellation = new com.billstack.entity.SubscriptionCancellation(
                currentUser.getId(),
                request.getReason() != null ? request.getReason() : "OTHER",
                request.getFeedback(),
                oldPlan
        );
        cancellationRepository.save(cancellation);

        int usageCount = usageLimitService.getCurrentMonthUsage(currentUser.getId());
        int limit = usageLimitService.getMonthlyLimit(currentUser.getId());

        return ResponseEntity.ok(ApiResponse.success(SubscriptionDto.fromEntity(sub, usageCount, limit), "Subscription cancelled. You have been placed on the Free tier."));
    }
}

