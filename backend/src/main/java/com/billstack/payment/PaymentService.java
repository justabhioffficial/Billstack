package com.billstack.payment;

import com.billstack.dto.CheckoutResponseDto;
import com.billstack.entity.Payment;
import com.billstack.entity.Subscription;
import com.billstack.entity.User;

import java.math.BigDecimal;

public interface PaymentService {
    CheckoutResponseDto createOrder(User user, String plan, BigDecimal amount);
    boolean verifyPaymentSignature(String orderId, String paymentId, String signature);
    Subscription activateProSubscription(User user, String orderId, String paymentId);
    boolean verifyWebhookSignature(String payload, String signature);
    void handleWebhookEvent(String eventType, String payload);
}
