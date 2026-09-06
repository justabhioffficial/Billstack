package com.billstack.ocr;

import com.billstack.dto.OcrResultDto;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Component
public class ReceiptTextParser {

    private static final List<Pattern> DATE_PATTERNS = Arrays.asList(
            Pattern.compile("(\\d{2}[-/.]\\d{2}[-/.]\\d{4})"),
            Pattern.compile("(\\d{4}[-/.]\\d{2}[-/.]\\d{2})"),
            Pattern.compile("(\\d{1,2}\\s+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\\s+\\d{4})", Pattern.CASE_INSENSITIVE)
    );

    private static final Pattern TOTAL_PATTERN = Pattern.compile(
            "(?:TOTAL|GRAND TOTAL|NET AMOUNT|AMOUNT PAID|BAL DUE|PAYABLE|RS\\.?|₹)\\s*[:=]?\\s*(?:RS\\.?|₹)?\\s*([0-9,]+\\.\\d{2}|[0-9,]+)",
            Pattern.CASE_INSENSITIVE
    );

    private static final Pattern TAX_PATTERN = Pattern.compile(
            "(?:TAX|GST|CGST|SGST|IGST|VAT)\\s*[:=]?\\s*(?:RS\\.?|₹)?\\s*([0-9,]+\\.\\d{2}|[0-9,]+)",
            Pattern.CASE_INSENSITIVE
    );

    private static final Pattern INVOICE_NO_PATTERN = Pattern.compile(
            "(?:INVOICE NO|RECEIPT NO|BILL NO|TAX INVOICE|INV#|REF#)\\s*[:=]?\\s*([A-Za-z0-9/-]+)",
            Pattern.CASE_INSENSITIVE
    );

    public OcrResultDto parseText(String rawText) {
        OcrResultDto result = new OcrResultDto();
        result.setRawText(rawText);
        Map<String, BigDecimal> confidences = new HashMap<>();

        if (rawText == null || rawText.trim().isEmpty()) {
            result.setOverallConfidence(BigDecimal.ZERO);
            return result;
        }

        String[] lines = rawText.split("\r?\n");

        // 1. Extract Vendor Name (Usually in top 3 lines)
        String vendor = extractVendor(lines);
        result.setVendorName(vendor);
        confidences.put("vendor", vendor != null ? new BigDecimal("85.00") : BigDecimal.ZERO);

        // 2. Extract Date
        LocalDate date = extractDate(rawText);
        result.setReceiptDate(date);
        confidences.put("date", date != null ? new BigDecimal("90.00") : BigDecimal.ZERO);

        // 3. Extract Total Amount
        BigDecimal total = extractTotal(rawText);
        result.setTotalAmount(total);
        confidences.put("total", total != null ? new BigDecimal("92.00") : BigDecimal.ZERO);

        // 4. Extract Tax Amount
        BigDecimal tax = extractTax(rawText);
        result.setTaxAmount(tax);
        confidences.put("tax", tax != null ? new BigDecimal("80.00") : BigDecimal.ZERO);

        // 5. Extract Invoice Number
        String invNo = extractInvoiceNo(rawText);
        result.setReceiptNumber(invNo);
        confidences.put("invoiceNo", invNo != null ? new BigDecimal("88.00") : BigDecimal.ZERO);

        // 6. Extract Payment Mode (UPI, Card, Cash, etc.)
        String payMode = extractPaymentMode(rawText);
        result.setPaymentMode(payMode);
        confidences.put("paymentMode", payMode != null ? new BigDecimal("85.00") : BigDecimal.ZERO);

        result.setFieldConfidences(confidences);

        // Calculate Overall Confidence
        double totalConfidence = confidences.values().stream()
                .mapToDouble(BigDecimal::doubleValue).average().orElse(0.0);
        result.setOverallConfidence(BigDecimal.valueOf(totalConfidence).setScale(2, RoundingMode.HALF_UP));

        return result;
    }

    private String extractVendor(String[] lines) {
        for (int i = 0; i < Math.min(lines.length, 4); i++) {
            String line = lines[i].trim();
            if (line.length() > 2 && !line.matches(".*(?i)(TAX|INVOICE|RECEIPT|BILL|DATE|WELCOME).*")) {
                return line;
            }
        }
        return "Unknown Vendor";
    }

    private LocalDate extractDate(String text) {
        for (Pattern p : DATE_PATTERNS) {
            Matcher m = p.matcher(text);
            if (m.find()) {
                String dateStr = m.group(1).replace('/', '-').replace('.', '-');
                try {
                    String[] parts = dateStr.split("-");
                    if (parts.length == 3) {
                        if (parts[0].length() == 4) {
                            return LocalDate.of(Integer.parseInt(parts[0]), Integer.parseInt(parts[1]), Integer.parseInt(parts[2]));
                        } else {
                            return LocalDate.of(Integer.parseInt(parts[2]), Integer.parseInt(parts[1]), Integer.parseInt(parts[0]));
                        }
                    }
                } catch (Exception ignored) {}
            }
        }
        return LocalDate.now();
    }

    private BigDecimal extractTotal(String text) {
        if (text == null) return null;
        
        // Priority 1: Explicit Grand Total / Total Payable keywords
        Pattern strictTotalPattern = Pattern.compile(
                "(?:GRAND TOTAL|TOTAL PAYABLE|TOTAL AMOUNT|TOTAL DUE|NET AMOUNT|AMOUNT PAID|TOTAL PAYABLE)\\s*[:=]?\\s*(?:RS\\.?|₹)?\\s*([0-9,]+\\.\\d{2}|[0-9,]+)",
                Pattern.CASE_INSENSITIVE
        );
        Matcher m1 = strictTotalPattern.matcher(text);
        if (m1.find()) {
            try {
                return new BigDecimal(m1.group(1).replace(",", ""));
            } catch (Exception ignored) {}
        }

        // Priority 2: Generic TOTAL keyword line
        Pattern totalPattern = Pattern.compile(
                "(?:TOTAL)\\s*[:=]?\\s*(?:RS\\.?|₹)?\\s*([0-9,]+\\.\\d{2}|[0-9,]+)",
                Pattern.CASE_INSENSITIVE
        );
        Matcher m2 = totalPattern.matcher(text);
        if (m2.find()) {
            try {
                return new BigDecimal(m2.group(1).replace(",", ""));
            } catch (Exception ignored) {}
        }

        return null;
    }

    private BigDecimal extractTax(String text) {
        if (text == null) return null;

        // Sum CGST + SGST if present on separate lines
        Pattern cgstPattern = Pattern.compile("CGST\\s*.*?[:=]?\\s*(?:RS\\.?|₹)?\\s*([0-9,]+\\.\\d{2}|[0-9,]+)", Pattern.CASE_INSENSITIVE);
        Pattern sgstPattern = Pattern.compile("SGST\\s*.*?[:=]?\\s*(?:RS\\.?|₹)?\\s*([0-9,]+\\.\\d{2}|[0-9,]+)", Pattern.CASE_INSENSITIVE);
        Matcher cgstMatcher = cgstPattern.matcher(text);
        Matcher sgstMatcher = sgstPattern.matcher(text);

        if (cgstMatcher.find() && sgstMatcher.find()) {
            try {
                BigDecimal cgst = new BigDecimal(cgstMatcher.group(1).replace(",", ""));
                BigDecimal sgst = new BigDecimal(sgstMatcher.group(1).replace(",", ""));
                return cgst.add(sgst);
            } catch (Exception ignored) {}
        }

        Matcher m = TAX_PATTERN.matcher(text);
        if (m.find()) {
            try {
                String valStr = m.group(1).replace(",", "");
                return new BigDecimal(valStr);
            } catch (Exception ignored) {}
        }

        return null;
    }

    private String extractInvoiceNo(String text) {
        if (text == null) return null;
        Pattern invPattern = Pattern.compile(
                "(?:TAX INVOICE NO|INVOICE NO|RECEIPT NO|BILL NO|INV#|REF#|TAX INVOICE)\\s*[:=.]?\\s*([A-Za-z0-9/-]+)",
                Pattern.CASE_INSENSITIVE
        );
        Matcher m = invPattern.matcher(text);
        while (m.find()) {
            String candidate = m.group(1).trim();
            if (!candidate.equalsIgnoreCase("No") && !candidate.equalsIgnoreCase("Num") && candidate.length() >= 3) {
                return candidate;
            }
        }
        return null;
    }

    private String extractPaymentMode(String text) {
        if (text == null) return null;
        String lower = text.toLowerCase();
        if (lower.contains("upi") || lower.contains("gpay") || lower.contains("phonepe") || lower.contains("paytm")) {
            return "UPI";
        } else if (lower.contains("card") || lower.contains("visa") || lower.contains("mastercard")) {
            return "CARD";
        } else if (lower.contains("cash")) {
            return "CASH";
        } else if (lower.contains("netbanking") || lower.contains("neft") || lower.contains("rtgs")) {
            return "NET_BANKING";
        }
        return null;
    }
}
