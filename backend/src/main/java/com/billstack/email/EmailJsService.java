package com.billstack.email;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

import org.springframework.context.annotation.Primary;

@Service
@Primary
public class EmailJsService implements EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailJsService.class);

    @Value("${emailjs.service_id:service_zfp3r8v}")
    private String serviceId;

    @Value("${emailjs.template_id:template_u6mt7c3}")
    private String templateId;

    @Value("${emailjs.user_id:Y3j9_ZBMDfTDd6LWa}")
    private String userId;

    @Value("${emailjs.accessToken:q_hUIWS2mmPPeynaaHXWS}")
    private String accessToken;

    private final RestTemplate restTemplate;

    public EmailJsService() {
        this.restTemplate = new RestTemplate();
    }

    public void sendOtpEmail(String toEmail, String otpCode, String purpose) {
        String subject = switch (purpose) {
            case "REGISTRATION_VERIFICATION" -> "Verify Your BillStack Account OTP";
            case "LOGIN" -> "Your BillStack Login OTP";
            case "PASSWORD_RESET" -> "Reset Your BillStack Password OTP";
            default -> "Your BillStack Security Code";
        };

        String message = "Your BillStack verification code is: " + otpCode + ". This code expires in 10 minutes.";
        sendEmailJsWithOtp(toEmail, subject, message, otpCode);
    }

    private void sendEmailJs(String toEmail, String subject, String messageContent) {
        sendEmailJsWithOtp(toEmail, subject, messageContent, "");
    }

    private void sendEmailJsWithOtp(String toEmail, String subject, String messageContent, String otpCode) {
        logger.info("[EmailJS] Sending email to: {} | Subject: {}", toEmail, subject);

        try {
            String url = "https://api.emailjs.com/api/v1.0/email/send";
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            Map<String, Object> templateParams = new HashMap<>();
            templateParams.put("email", toEmail);
            templateParams.put("to_email", toEmail);
            templateParams.put("to_name", toEmail);
            templateParams.put("subject", subject);
            templateParams.put("message", messageContent);
            if (otpCode != null && !otpCode.isEmpty()) {
                templateParams.put("otp", otpCode);
                templateParams.put("code", otpCode);
                templateParams.put("otp_code", otpCode);
                templateParams.put("passcode", otpCode);
            }

            Map<String, Object> body = new HashMap<>();
            body.put("service_id", serviceId);
            body.put("template_id", templateId);
            body.put("user_id", userId);
            if (accessToken != null && !accessToken.trim().isEmpty()) {
                body.put("accessToken", accessToken);
            }
            body.put("template_params", templateParams);

            HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);
            restTemplate.postForEntity(url, request, String.class);
            logger.info("[EmailJS] Email dispatched successfully to {}", toEmail);
        } catch (Exception e) {
            logger.warn("[EmailJS] REST dispatch failed: {}. Logging email content locally for verification.", e.getMessage());
            logger.info("=== EMAIL LOCAL LOG ===\nTO: {}\nSUBJECT: {}\nCONTENT: {}\n======================", toEmail, subject, messageContent);
        }
    }

    @Override
    public void sendWelcomeEmail(String toEmail, String name) {
        sendEmailJs(toEmail, "Welcome to BillStack!", "Hi " + name + ", welcome to BillStack expense management!");
    }

    @Override
    public void sendPasswordResetEmail(String toEmail, String resetToken) {
        sendEmailJs(toEmail, "BillStack Password Reset Request", "Your password reset code is: " + resetToken);
    }

    @Override
    public void sendPaymentConfirmationEmail(String toEmail, String plan, String amount) {
        sendEmailJs(toEmail, "BillStack Payment Confirmation", "Your payment for " + plan + " (₹" + amount + ") was received successfully.");
    }

    @Override
    public void sendMonthlyReportSummaryEmail(String toEmail, String month, String totalSpent) {
        sendEmailJs(toEmail, "BillStack Monthly Summary (" + month + ")", "Your total expense for " + month + " was ₹" + totalSpent);
    }

    @Override
    public void sendWeeklyDigestEmail(String toEmail, String name, String summaryContent) {
        sendEmailJs(toEmail, "BillStack Weekly Digest", summaryContent);
    }
}
