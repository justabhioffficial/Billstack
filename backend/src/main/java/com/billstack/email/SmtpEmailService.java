package com.billstack.email;

import jakarta.mail.internet.MimeMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Primary;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class SmtpEmailService implements EmailService {

    private static final Logger log = LoggerFactory.getLogger(SmtpEmailService.class);

    @Autowired(required = false)
    private JavaMailSender mailSender;

    @Value("${billstack.email.from:noreply@billstack.app}")
    private String fromEmail;

    @Value("${billstack.email.from-name:BillStack Expense Intelligence}")
    private String fromName;

    @Override
    @Async
    public void sendOtpEmail(String toEmail, String otpCode, String purpose) {
        log.info("Sending OTP Email via SMTP to: {} for purpose: {}", toEmail, purpose);
        String subject = "BillStack Security Verification OTP Code";
        String htmlBody = """
            <!DOCTYPE html>
            <html>
            <body style="font-family:sans-serif; background:#f8fafc; padding:24px;">
              <div style="max-width:500px; margin:0 auto; background:#ffffff; border:1px solid #e2e8f0; border-radius:12px; padding:24px;">
                <h3 style="color:#0f172a;">BillStack Verification Code</h3>
                <p>Your verification OTP code for %s is:</p>
                <div style="background:#f1f5f9; padding:16px; font-family:monospace; font-size:24px; font-weight:bold; text-align:center; border-radius:6px; letter-spacing:4px; color:#4f46e5;">
                  %s
                </div>
                <p style="font-size:12px; color:#64748b; margin-top:16px;">This code expires in 10 minutes.</p>
              </div>
            </body>
            </html>
            """.formatted(purpose, otpCode);
        sendHtmlMessage(toEmail, subject, htmlBody);
    }

    @Override
    @Async
    public void sendWelcomeEmail(String toEmail, String name) {
        log.info("Sending Welcome Email to: {}", toEmail);
        String subject = "Welcome to BillStack — Your AI Expense Management Workspace";

        String htmlBody = """
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="utf-8">
              <style>
                body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background-color: #f8fafc; color: #0f172a; margin: 0; padding: 24px; }
                .container { max-width: 580px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
                .header { background: linear-gradient(135deg, #1e1b4b 0%, #312e81 100%); padding: 36px 28px; text-align: center; color: #ffffff; }
                .body { padding: 32px 28px; line-height: 1.6; font-size: 15px; color: #334155; }
                .btn { display: inline-block; background: #4f46e5; color: #ffffff !important; text-decoration: none; padding: 12px 28px; border-radius: 8px; font-weight: bold; margin-top: 16px; }
                .footer { background: #f1f5f9; padding: 18px; text-align: center; font-size: 12px; color: #64748b; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1 style="margin:0; font-size:24px; font-weight:800;">Welcome to BillStack</h1>
                  <p style="margin:8px 0 0 0; color:#c7d2fe; font-size:14px;">Automated Receipt OCR & AI Expense Intelligence</p>
                </div>
                <div class="body">
                  <p>Hi <strong>%s</strong>,</p>
                  <p>Welcome to BillStack! Your account has been registered successfully. You now have access to real-time expense tracking, automated vendor categorizations, and CA audit exports.</p>
                  
                  <div style="background:#eef2ff; border-left:4px solid #4f46e5; padding:16px; margin:20px 0; border-radius:6px;">
                    <strong style="color:#1e1b4b;">Quick Start Checklist:</strong>
                    <ul style="margin:8px 0 0 0; padding-left:20px; color:#3730a3;">
                      <li>Scan or upload your first receipt bill</li>
                      <li>Check your automated category insights</li>
                      <li>Download the BillStack Mobile PWA for instant receipt scanning</li>
                    </ul>
                  </div>

                  <p style="text-align:center; margin-top: 24px;">
                    <a href="https://app.billstack.app" class="btn">Open BillStack Dashboard</a>
                  </p>
                </div>
                <div class="footer">
                  © 2026 BillStack Inc. • Smart Expense SaaS
                </div>
              </div>
            </body>
            </html>
            """.formatted(name != null ? name : "Member");

        sendHtmlMessage(toEmail, subject, htmlBody);
    }

    @Override
    @Async
    public void sendPasswordResetEmail(String toEmail, String resetToken) {
        log.info("Sending Password Reset Email to: {}", toEmail);
        String subject = "Reset Your BillStack Account Password";

        String htmlBody = """
            <!DOCTYPE html>
            <html>
            <body style="font-family:sans-serif; background:#f8fafc; padding:24px;">
              <div style="max-width:500px; margin:0 auto; background:#ffffff; border:1px solid #e2e8f0; border-radius:12px; padding:24px;">
                <h3 style="color:#0f172a;">Password Reset Request</h3>
                <p>We received a request to reset your password. Use the verification token below to proceed:</p>
                <div style="background:#f1f5f9; padding:12px; font-family:monospace; font-size:18px; font-weight:bold; text-align:center; border-radius:6px; letter-spacing:2px; color:#4f46e5;">
                  %s
                </div>
                <p style="font-size:12px; color:#64748b; margin-top:16px;">If you did not request a password reset, you can safely ignore this email.</p>
              </div>
            </body>
            </html>
            """.formatted(resetToken);

        sendHtmlMessage(toEmail, subject, htmlBody);
    }

    @Override
    @Async
    public void sendPaymentConfirmationEmail(String toEmail, String plan, String amount) {
        log.info("Sending Payment Confirmation Email to: {} for Plan: {}", toEmail, plan);
        String subject = "BillStack Payment Receipt — " + plan + " Plan Activated";

        String htmlBody = """
            <!DOCTYPE html>
            <html>
            <body style="font-family:sans-serif; background:#f8fafc; padding:24px;">
              <div style="max-width:520px; margin:0 auto; background:#ffffff; border:1px solid #e2e8f0; border-radius:12px; padding:28px;">
                <h2 style="color:#4f46e5; margin-top:0;">Payment Confirmed!</h2>
                <p>Thank you for subscribing to BillStack <strong>%s Plan</strong>.</p>
                <div style="background:#f8fafc; border:1px solid #e2e8f0; padding:16px; border-radius:8px; margin:16px 0;">
                  <div style="display:flex; justify-content:space-between; margin-bottom:8px;">
                    <span style="color:#64748b;">Plan:</span>
                    <strong style="color:#0f172a;">%s</strong>
                  </div>
                  <div style="display:flex; justify-content:space-between;">
                    <span style="color:#64748b;">Amount Paid:</span>
                    <strong style="color:#10b981;">₹%s</strong>
                  </div>
                </div>
                <p style="font-size:13px; color:#64748b;">Your subscription limits have been updated instantly.</p>
              </div>
            </body>
            </html>
            """.formatted(plan, plan, amount);

        sendHtmlMessage(toEmail, subject, htmlBody);
    }

    @Override
    @Async
    public void sendMonthlyReportSummaryEmail(String toEmail, String month, String totalSpent) {
        log.info("Sending Monthly Report Email to: {} for {}", toEmail, month);
        String subject = "BillStack Financial Summary — " + month;

        String htmlBody = """
            <!DOCTYPE html>
            <html>
            <body style="font-family:sans-serif; background:#f8fafc; padding:24px;">
              <div style="max-width:540px; margin:0 auto; background:#ffffff; border:1px solid #e2e8f0; border-radius:12px; padding:28px;">
                <h2 style="color:#0f172a; margin-top:0;">Monthly Financial Digest — %s</h2>
                <p>Your monthly expense summary for <strong>%s</strong> is ready.</p>
                <div style="background:#eef2ff; border:1px solid #c7d2fe; padding:20px; border-radius:10px; text-align:center;">
                  <span style="font-size:12px; color:#4f46e5; font-weight:bold; text-transform:uppercase;">Total Spent</span>
                  <div style="font-size:28px; font-weight:800; color:#1e1b4b; margin-top:4px;">₹%s</div>
                </div>
              </div>
            </body>
            </html>
            """.formatted(month, month, totalSpent);

        sendHtmlMessage(toEmail, subject, htmlBody);
    }

    @Override
    @Async
    public void sendWeeklyDigestEmail(String toEmail, String name, String summaryContent) {
        log.info("Sending Weekly Digest Email to: {}", toEmail);
        String subject = "BillStack Weekly Expense Intelligence Digest";

        String htmlBody = """
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="utf-8">
              <style>
                body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background-color: #f8fafc; color: #0f172a; margin: 0; padding: 24px; }
                .container { max-width: 580px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
                .header { background: #0f172a; padding: 28px; text-align: center; color: #ffffff; }
                .body { padding: 28px; line-height: 1.6; font-size: 14px; color: #334155; }
                .digest-box { background: #f8fafc; border: 1px solid #cbd5e1; padding: 16px; border-radius: 12px; font-family: monospace; white-space: pre-wrap; font-size: 13px; color: #1e293b; }
                .footer { background: #f1f5f9; padding: 16px; text-align: center; font-size: 12px; color: #64748b; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h2 style="margin:0; font-size:20px;">Weekly Expense Intelligence</h2>
                </div>
                <div class="body">
                  <p>Hi <strong>%s</strong>,</p>
                  <p>Here is your weekly expense digest summarizing recent bills and AI insights:</p>
                  <div class="digest-box">%s</div>
                </div>
                <div class="footer">
                  Sent automatically by BillStack Digest Engine
                </div>
              </div>
            </body>
            </html>
            """.formatted(name != null ? name : "Member", summaryContent);

        sendHtmlMessage(toEmail, subject, htmlBody);
    }

    private void sendHtmlMessage(String toEmail, String subject, String htmlContent) {
        if (mailSender == null) {
            log.info("[EMAIL DRY-RUN] MailSender bean unconfigured. To: {}, Subject: {}", toEmail, subject);
            return;
        }

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail, fromName);
            helper.setTo(toEmail);
            helper.setSubject(subject);
            helper.setText(htmlContent, true);

            mailSender.send(message);
            log.info("Transactional Email successfully sent to {}", toEmail);
        } catch (Exception e) {
            log.warn("Failed to dispatch transactional email to {} (dry-run fallback): {}", toEmail, e.getMessage());
        }
    }
}
