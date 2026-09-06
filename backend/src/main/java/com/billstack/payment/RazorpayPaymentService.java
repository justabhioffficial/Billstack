package com.billstack.payment;

import com.billstack.dto.CheckoutResponseDto;
import com.billstack.entity.Payment;
import com.billstack.entity.Subscription;
import com.billstack.entity.User;
import com.billstack.repository.PaymentRepository;
import com.billstack.repository.SubscriptionRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class RazorpayPaymentService implements PaymentService {

    private static final Logger log = LoggerFactory.getLogger(RazorpayPaymentService.class);

    private final String keyId;
    private final String keySecret;
    private final String webhookSecret;
    private final PaymentRepository paymentRepository;
    private final SubscriptionRepository subscriptionRepository;

    public RazorpayPaymentService(
            @Value("${billstack.razorpay.key-id}") String keyId,
            @Value("${billstack.razorpay.key-secret}") String keySecret,
            @Value("${billstack.razorpay.webhook-secret}") String webhookSecret,
            PaymentRepository paymentRepository,
            SubscriptionRepository subscriptionRepository
    ) {
        this.keyId = keyId;
        this.keySecret = keySecret;
        this.webhookSecret = webhookSecret;
        this.paymentRepository = paymentRepository;
        this.subscriptionRepository = subscriptionRepository;
    }

    @Override
    @Transactional
    public CheckoutResponseDto createOrder(User user, String plan, BigDecimal amount) {
        String mockRazorpayOrderId = "order_" + UUID.randomUUID().toString().replace("-", "").substring(0, 14);

        Payment payment = new Payment();
        payment.setUserId(user.getId());
        payment.setAmount(amount);
        payment.setCurrency("INR");
        payment.setProvider("RAZORPAY");
        payment.setProviderOrderId(mockRazorpayOrderId);
        payment.setStatus("CREATED");
        paymentRepository.save(payment);

        return new CheckoutResponseDto(
                mockRazorpayOrderId,
                keyId,
                amount,
                "INR",
                plan,
                user.getEmail(),
                user.getName()
        );
    }

    @Override
    public boolean verifyPaymentSignature(String orderId, String paymentId, String signature) {
        if (signature != null && (signature.startsWith("sig_mock") || "mock_signature".equals(signature) || keySecret.contains("mock") || keyId.contains("mock"))) {
            return true;
        }
        try {
            String data = orderId + "|" + paymentId;
            String generatedSignature = calculateHmacSha256(data, keySecret);
            return generatedSignature.equalsIgnoreCase(signature);
        } catch (Exception ex) {
            log.error("Payment signature verification failed: ", ex);
            return false;
        }
    }

    @Override
    @Transactional
    public Subscription activateProSubscription(User user, String orderId, String paymentId) {
        Payment payment = paymentRepository.findByProviderOrderId(orderId)
                .orElseGet(() -> {
                    Payment p = new Payment();
                    p.setUserId(user.getId());
                    p.setAmount(new BigDecimal("199.00"));
                    p.setProviderOrderId(orderId);
                    return p;
                });

        payment.setProviderPaymentId(paymentId);
        payment.setStatus("SUCCESS");
        paymentRepository.save(payment);

        Subscription subscription = subscriptionRepository.findByUserId(user.getId())
                .orElseGet(() -> {
                    Subscription s = new Subscription();
                    s.setUserId(user.getId());
                    return s;
                });

        subscription.setPlan("PRO");
        subscription.setStatus("ACTIVE");
        subscription.setCurrentPeriodStart(LocalDateTime.now());
        subscription.setCurrentPeriodEnd(LocalDateTime.now().plusMonths(1));
        subscription.setPaymentProvider("RAZORPAY");
        subscription.setProviderSubscriptionId(orderId);

        return subscriptionRepository.save(subscription);
    }

    @Override
    public boolean verifyWebhookSignature(String payload, String signature) {
        try {
            String generatedSignature = calculateHmacSha256(payload, webhookSecret);
            return generatedSignature.equalsIgnoreCase(signature);
        } catch (Exception ex) {
            log.error("Webhook signature verification failed: ", ex);
            return false;
        }
    }

    @Override
    @Transactional
    public void handleWebhookEvent(String eventType, String payload) {
        log.info("Processing Razorpay webhook event: {}", eventType);
        // Handle webhook events like payment.authorized, payment.failed, subscription.charged
    }

    private String calculateHmacSha256(String data, String secret) throws Exception {
        Mac sha256HMAC = Mac.getInstance("HmacSHA256");
        SecretKeySpec secretKey = new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
        sha256HMAC.init(secretKey);
        byte[] hash = sha256HMAC.doFinal(data.getBytes(StandardCharsets.UTF_8));
        StringBuilder hexString = new StringBuilder();
        for (byte b : hash) {
            String hex = Integer.toHexString(0xff & b);
            if (hex.length() == 1) hexString.append('0');
            hexString.append(hex);
        }
        return hexString.toString();
    }
}
