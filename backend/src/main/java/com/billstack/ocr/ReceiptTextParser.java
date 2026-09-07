package com.billstack.ocr;

import com.billstack.dto.OcrResultDto;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Component
public class ReceiptTextParser {

    private static final Map<String, Integer> MONTH_MAP = new HashMap<>();
    static {
        MONTH_MAP.put("jan", 1); MONTH_MAP.put("january", 1);
        MONTH_MAP.put("feb", 2); MONTH_MAP.put("february", 2);
        MONTH_MAP.put("mar", 3); MONTH_MAP.put("march", 3);
        MONTH_MAP.put("apr", 4); MONTH_MAP.put("april", 4);
        MONTH_MAP.put("may", 5);
        MONTH_MAP.put("jun", 6); MONTH_MAP.put("june", 6);
        MONTH_MAP.put("jul", 7); MONTH_MAP.put("july", 7);
        MONTH_MAP.put("aug", 8); MONTH_MAP.put("august", 8);
        MONTH_MAP.put("sep", 9); MONTH_MAP.put("september", 9);
        MONTH_MAP.put("oct", 10); MONTH_MAP.put("october", 10);
        MONTH_MAP.put("nov", 11); MONTH_MAP.put("november", 11);
        MONTH_MAP.put("dec", 12); MONTH_MAP.put("december", 12);
    }

    private static final List<Pattern> DATE_PATTERNS = Arrays.asList(
            Pattern.compile("(?:Dt|Date|BILL DATE)?\\s*[:=.]?\\s*(\\d{1,2}[-/.]\\d{1,2}[-/.]\\d{4})", Pattern.CASE_INSENSITIVE),
            Pattern.compile("(\\d{1,2}[-/.]\\s*(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*[-/.]\\s*\\d{4})", Pattern.CASE_INSENSITIVE),
            Pattern.compile("(\\d{1,2}\\s+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\\s+\\d{4})", Pattern.CASE_INSENSITIVE),
            Pattern.compile("(\\d{4}[-/.]\\d{2}[-/.]\\d{2})")
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

        // 1. Extract Vendor Name
        String vendor = extractVendor(lines);
        result.setVendorName(vendor);
        confidences.put("vendor", vendor != null && !"Unknown Vendor".equals(vendor) ? new BigDecimal("90.00") : BigDecimal.ZERO);

        // 2. Extract Date
        LocalDate date = extractDate(rawText);
        result.setReceiptDate(date);
        confidences.put("date", date != null ? new BigDecimal("95.00") : BigDecimal.ZERO);

        // 3. Extract Total Amount
        BigDecimal total = extractTotal(rawText);
        result.setTotalAmount(total);
        confidences.put("total", total != null ? new BigDecimal("95.00") : BigDecimal.ZERO);

        // 4. Extract Tax Amount
        BigDecimal tax = extractTax(rawText);
        result.setTaxAmount(tax);
        confidences.put("tax", tax != null ? new BigDecimal("85.00") : BigDecimal.ZERO);

        // 5. Extract Invoice Number
        String invNo = extractInvoiceNo(rawText);
        result.setReceiptNumber(invNo);
        confidences.put("invoiceNo", invNo != null ? new BigDecimal("90.00") : BigDecimal.ZERO);

        // 6. Extract Payment Mode
        String payMode = extractPaymentMode(rawText);
        result.setPaymentMode(payMode);
        confidences.put("paymentMode", payMode != null ? new BigDecimal("85.00") : BigDecimal.ZERO);

        result.setFieldConfidences(confidences);

        double totalConfidence = confidences.values().stream()
                .mapToDouble(BigDecimal::doubleValue).average().orElse(0.0);
        result.setOverallConfidence(BigDecimal.valueOf(totalConfidence).setScale(2, RoundingMode.HALF_UP));

        return result;
    }

    private String extractVendor(String[] lines) {
        for (int i = 0; i < Math.min(lines.length, 8); i++) {
            String line = lines[i].trim();
            if (line.length() >= 2 && !line.matches(".*(?i)(TAX INVOICE|INVOICE|RECEIPT|BILL TO|PAYMENT|GSTIN|WELCOME|PAGE|DATE|ORIGINAL|SCREENSHOT).*")) {
                if (!line.matches(".*(?i)(street|road|avenue|sector|mohari|delhi|mumbai|bangalore|indore|pin|phone|tel|email|http|www|size|file).*")) {
                    return line;
                }
            }
        }
        return "Unknown Vendor";
    }

    private LocalDate extractDate(String text) {
        for (Pattern p : DATE_PATTERNS) {
            Matcher m = p.matcher(text);
            if (m.find()) {
                String dateStr = m.group(1).trim().replaceAll("[/.]", "-");
                try {
                    String[] parts = dateStr.split("[- ]+");
                    if (parts.length == 3) {
                        int day, month, year;
                        if (parts[0].length() == 4) { // YYYY-MM-DD
                            year = Integer.parseInt(parts[0]);
                            month = parseMonth(parts[1]);
                            day = Integer.parseInt(parts[2]);
                        } else { // DD-MM-YYYY or DD-Mon-YYYY
                            day = Integer.parseInt(parts[0]);
                            month = parseMonth(parts[1]);
                            year = Integer.parseInt(parts[2]);
                        }
                        return LocalDate.of(year, month, day);
                    }
                } catch (Exception ignored) {}
            }
        }
        return LocalDate.now();
    }

    private int parseMonth(String monthStr) {
        monthStr = monthStr.toLowerCase().trim();
        if (MONTH_MAP.containsKey(monthStr)) {
            return MONTH_MAP.get(monthStr);
        }
        try {
            return Integer.parseInt(monthStr);
        } catch (Exception e) {
            return 1;
        }
    }

    private BigDecimal extractTotal(String text) {
        if (text == null) return null;

        // Priority 1: Explicit Net Total / Grand Total / Total Payable lines
        Pattern strictTotalPattern = Pattern.compile(
                "(?:NET TOTAL|GRAND TOTAL|NET AMOUNT|AMOUNT PAID|TOTAL PAYABLE|TOTAL AMOUNT|TOTAL DUE|GROSS TOTAL|NET|TOTAL)\\s*[:=]?\\s*(?:RS\\.?|₹)?\\s*([0-9,]+\\.\\d{2}|[0-9,]+)",
                Pattern.CASE_INSENSITIVE
        );
        Matcher m1 = strictTotalPattern.matcher(text);
        if (m1.find()) {
            try {
                return new BigDecimal(m1.group(1).replace(",", ""));
            } catch (Exception ignored) {}
        }

        // Priority 2: Fallback - find largest numeric value matching currency format
        Pattern amountPattern = Pattern.compile("(?:RS\\.?|₹)?\\s*([0-9,]+\\.\\d{2})", Pattern.CASE_INSENSITIVE);
        Matcher m3 = amountPattern.matcher(text);
        BigDecimal maxVal = null;
        while (m3.find()) {
            try {
                BigDecimal val = new BigDecimal(m3.group(1).replace(",", ""));
                if (maxVal == null || val.compareTo(maxVal) > 0) {
                    maxVal = val;
                }
            } catch (Exception ignored) {}
        }
        return maxVal;
    }

    private BigDecimal extractTax(String text) {
        if (text == null) return null;

        // Sum CGST + SGST if present
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

        // IGST
        Pattern igstPattern = Pattern.compile("IGST\\s*.*?[:=]?\\s*(?:RS\\.?|₹)?\\s*([0-9,]+\\.\\d{2}|[0-9,]+)", Pattern.CASE_INSENSITIVE);
        Matcher igstMatcher = igstPattern.matcher(text);
        if (igstMatcher.find()) {
            try {
                return new BigDecimal(igstMatcher.group(1).replace(",", ""));
            } catch (Exception ignored) {}
        }

        Pattern taxPattern = Pattern.compile("(?:TAX|GST|VAT)\\s*.*?[:=]?\\s*(?:RS\\.?|₹)?\\s*([0-9,]+\\.\\d{2}|[0-9,]+)", Pattern.CASE_INSENSITIVE);
        Matcher m = taxPattern.matcher(text);
        if (m.find()) {
            try {
                return new BigDecimal(m.group(1).replace(",", ""));
            } catch (Exception ignored) {}
        }

        return null;
    }

    private String extractInvoiceNo(String text) {
        if (text == null) return null;
        Pattern invPattern = Pattern.compile(
                "(?:TAX INVOICE NO|INVOICE NO|INVOICE NUMBER|INVOICE#|INVOICEN|INVOICCH|RECEIPT NO|TOKEN#|TOKEN NO|TOKEN|BILL NO|INV NO|INV#|REF NO|REF#)\\s*[:=.#]?\\s*([A-Za-z0-9/_-]+)",
                Pattern.CASE_INSENSITIVE
        );
        Matcher m = invPattern.matcher(text);
        while (m.find()) {
            String candidate = m.group(1).trim();
            if (!candidate.equalsIgnoreCase("No") && !candidate.equalsIgnoreCase("Num") && candidate.length() >= 2) {
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
        } else if (lower.contains("bank transfer") || lower.contains("netbanking") || lower.contains("neft") || lower.contains("rtgs")) {
            return "NET_BANKING";
        } else if (lower.contains("card") || lower.contains("visa") || lower.contains("mastercard")) {
            return "CARD";
        } else if (lower.contains("cash")) {
            return "CASH";
        }
        return "CASH";
    }
}
