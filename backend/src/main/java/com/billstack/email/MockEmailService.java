package com.billstack.email;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class MockEmailService implements EmailService {

    private static final Logger log = LoggerFactory.getLogger(MockEmailService.class);

    @Override
    public void sendWelcomeEmail(String toEmail, String name) {
        log.info("[EMAIL MOCK] Welcome to BillStack sent to {} ({})", name, toEmail);
    }

    @Override
    public void sendPasswordResetEmail(String toEmail, String resetToken) {
        log.info("[EMAIL MOCK] Password reset link sent to {}: token={}", toEmail, resetToken);
    }

    @Override
    public void sendPaymentConfirmationEmail(String toEmail, String plan, String amount) {
        log.info("[EMAIL MOCK] Payment confirmation sent to {}: Plan={}, Amount=₹{}", toEmail, plan, amount);
    }

    @Override
    public void sendMonthlyReportSummaryEmail(String toEmail, String month, String totalSpent) {
        log.info("[EMAIL MOCK] Monthly report summary sent to {}: Month={}, Total Spent=₹{}", toEmail, month, totalSpent);
    }

    @Override
    public void sendWeeklyDigestEmail(String toEmail, String name, String summaryContent) {
        log.info("[EMAIL MOCK] Weekly expense digest sent to {} ({}): content len={}", name, toEmail, summaryContent != null ? summaryContent.length() : 0);
    }
}
