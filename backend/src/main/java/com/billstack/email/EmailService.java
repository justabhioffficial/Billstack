package com.billstack.email;

public interface EmailService {
    void sendWelcomeEmail(String toEmail, String name);
    void sendPasswordResetEmail(String toEmail, String resetToken);
    void sendPaymentConfirmationEmail(String toEmail, String plan, String amount);
    void sendMonthlyReportSummaryEmail(String toEmail, String month, String totalSpent);
}
