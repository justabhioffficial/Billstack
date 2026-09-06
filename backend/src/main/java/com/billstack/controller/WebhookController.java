package com.billstack.controller;

import com.billstack.payment.PaymentService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/webhooks")
public class WebhookController {

    private static final Logger log = LoggerFactory.getLogger(WebhookController.class);
    private final PaymentService paymentService;

    public WebhookController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @PostMapping("/razorpay")
    public ResponseEntity<String> handleRazorpayWebhook(
            @RequestBody String payload,
            @RequestHeader(value = "X-Razorpay-Signature", required = false) String signature,
            @RequestHeader(value = "X-Razorpay-Event", required = false) String eventType
    ) {
        log.info("Received Razorpay webhook event: {}", eventType);

        if (signature != null && !paymentService.verifyWebhookSignature(payload, signature)) {
            log.warn("Razorpay webhook signature verification failed!");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid signature");
        }

        paymentService.handleWebhookEvent(eventType != null ? eventType : "payment.authorized", payload);
        return ResponseEntity.ok("Webhook received");
    }
}
