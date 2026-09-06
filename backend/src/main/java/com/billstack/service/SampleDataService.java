package com.billstack.service;

import com.billstack.entity.Receipt;
import com.billstack.entity.ReceiptField;
import com.billstack.repository.ReceiptFieldRepository;
import com.billstack.repository.ReceiptRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class SampleDataService {

    private final ReceiptRepository receiptRepository;
    private final ReceiptFieldRepository receiptFieldRepository;

    public SampleDataService(ReceiptRepository receiptRepository, ReceiptFieldRepository receiptFieldRepository) {
        this.receiptRepository = receiptRepository;
        this.receiptFieldRepository = receiptFieldRepository;
    }

    @Transactional
    public void seedPastMonthsData(String userId) {
        List<SampleReceiptSpec> specs = createSampleSpecs();

        for (SampleReceiptSpec spec : specs) {
            // Avoid duplicate seeding if receipt number already exists for user
            if (receiptRepository.existsByUserIdAndReceiptNumber(userId, spec.receiptNumber)) {
                continue;
            }

            Receipt r = new Receipt();
            r.setUserId(userId);
            r.setVendorName(spec.vendorName);
            r.setReceiptDate(spec.date);
            r.setTotalAmount(spec.amount);
            r.setTaxAmount(spec.tax);
            r.setCurrency("INR");
            r.setReceiptNumber(spec.receiptNumber);
            r.setPaymentMode(spec.paymentMode);
            r.setCategoryId(spec.categoryId);
            r.setBusiness(spec.isBusiness);
            r.setFileKey("demo/" + UUID.randomUUID() + ".svg");
            r.setOriginalFilename(spec.vendorName.toLowerCase().replaceAll("[^a-z0-9]", "_") + "_receipt.svg");
            r.setMimeType("image/svg+xml");
            r.setFileSize(4096L);
            r.setSource("WEB");
            r.setOcrStatus("COMPLETED");
            r.setOcrRawText("RECEIPT FROM " + spec.vendorName.toUpperCase() + "\nDate: " + spec.date + "\nTotal: ₹" + spec.amount);
            r.setOverallConfidence(BigDecimal.valueOf(98.50));

            r = receiptRepository.save(r);

            // Add fields
            ReceiptField fVendor = new ReceiptField();
            fVendor.setReceiptId(r.getId());
            fVendor.setFieldName("vendor_name");
            fVendor.setFieldValue(spec.vendorName);
            fVendor.setConfidence(BigDecimal.valueOf(99.00));
            receiptFieldRepository.save(fVendor);

            ReceiptField fTotal = new ReceiptField();
            fTotal.setReceiptId(r.getId());
            fTotal.setFieldName("total_amount");
            fTotal.setFieldValue(spec.amount.toString());
            fTotal.setConfidence(BigDecimal.valueOf(99.50));
            receiptFieldRepository.save(fTotal);
        }
    }

    private List<SampleReceiptSpec> createSampleSpecs() {
        List<SampleReceiptSpec> list = new ArrayList<>();

        // --- April 2026 ---
        list.add(new SampleReceiptSpec("Amazon Web Services", LocalDate.of(2026, 4, 5), new BigDecimal("4250.00"), new BigDecimal("765.00"), "cat-sw-tools", true, "UPI", "INV-2026-0401"));
        list.add(new SampleReceiptSpec("Swiggy Corporate Lunch", LocalDate.of(2026, 4, 12), new BigDecimal("1840.00"), new BigDecimal("92.00"), "cat-food", true, "CREDIT_CARD", "SWG-2026-0412"));
        list.add(new SampleReceiptSpec("Jio Fiber Broadband", LocalDate.of(2026, 4, 18), new BigDecimal("1499.00"), new BigDecimal("269.82"), "cat-internet-phone", true, "NET_BANKING", "JIO-2026-0418"));
        list.add(new SampleReceiptSpec("Uber Business Travel", LocalDate.of(2026, 4, 25), new BigDecimal("850.00"), new BigDecimal("42.50"), "cat-travel", true, "UPI", "UBR-2026-0425"));

        // --- May 2026 ---
        list.add(new SampleReceiptSpec("Google Workspace", LocalDate.of(2026, 5, 3), new BigDecimal("3200.00"), new BigDecimal("576.00"), "cat-sw-tools", true, "CREDIT_CARD", "GGL-2026-0503"));
        list.add(new SampleReceiptSpec("Adobe Creative Cloud", LocalDate.of(2026, 5, 10), new BigDecimal("4800.00"), new BigDecimal("864.00"), "cat-sw-tools", true, "CREDIT_CARD", "ADB-2026-0510"));
        list.add(new SampleReceiptSpec("Zomato Team Snack", LocalDate.of(2026, 5, 15), new BigDecimal("1250.00"), new BigDecimal("62.50"), "cat-food", false, "UPI", "ZOM-2026-0515"));
        list.add(new SampleReceiptSpec("Staples Office Stationery", LocalDate.of(2026, 5, 22), new BigDecimal("2400.00"), new BigDecimal("432.00"), "cat-office-supplies", true, "DEBIT_CARD", "STP-2026-0522"));

        // --- June 2026 ---
        list.add(new SampleReceiptSpec("Figma Pro Subscription", LocalDate.of(2026, 6, 4), new BigDecimal("2900.00"), new BigDecimal("522.00"), "cat-sw-tools", true, "CREDIT_CARD", "FIG-2026-0604"));
        list.add(new SampleReceiptSpec("MakeMyTrip Flight to Mumbai", LocalDate.of(2026, 6, 11), new BigDecimal("8450.00"), new BigDecimal("422.50"), "cat-travel", true, "NET_BANKING", "MMT-2026-0611"));
        list.add(new SampleReceiptSpec("Jio Fiber Broadband", LocalDate.of(2026, 6, 18), new BigDecimal("1499.00"), new BigDecimal("269.82"), "cat-internet-phone", true, "UPI", "JIO-2026-0618"));
        list.add(new SampleReceiptSpec("LinkedIn Premium Marketing", LocalDate.of(2026, 6, 26), new BigDecimal("3999.00"), new BigDecimal("719.82"), "cat-marketing", true, "CREDIT_CARD", "LNK-2026-0626"));

        // --- July 2026 ---
        list.add(new SampleReceiptSpec("Amazon Web Services", LocalDate.of(2026, 7, 5), new BigDecimal("5600.00"), new BigDecimal("1008.00"), "cat-sw-tools", true, "UPI", "INV-2026-0705"));
        list.add(new SampleReceiptSpec("Dell Office Monitor", LocalDate.of(2026, 7, 14), new BigDecimal("16500.00"), new BigDecimal("2970.00"), "cat-equipment", true, "CREDIT_CARD", "DLL-2026-0714"));
        list.add(new SampleReceiptSpec("Swiggy Team Lunch", LocalDate.of(2026, 7, 20), new BigDecimal("2350.00"), new BigDecimal("117.50"), "cat-food", true, "UPI", "SWG-2026-0720"));
        list.add(new SampleReceiptSpec("Uber Client Visit", LocalDate.of(2026, 7, 28), new BigDecimal("1120.00"), new BigDecimal("56.00"), "cat-travel", true, "UPI", "UBR-2026-0728"));

        // --- August 2026 ---
        list.add(new SampleReceiptSpec("Google Cloud Platform", LocalDate.of(2026, 8, 2), new BigDecimal("6200.00"), new BigDecimal("1116.00"), "cat-sw-tools", true, "CREDIT_CARD", "GCP-2026-0802"));
        list.add(new SampleReceiptSpec("Jio Fiber Broadband", LocalDate.of(2026, 8, 18), new BigDecimal("1499.00"), new BigDecimal("269.82"), "cat-internet-phone", true, "NET_BANKING", "JIO-2026-0818"));
        list.add(new SampleReceiptSpec("Meta Ads Marketing", LocalDate.of(2026, 8, 22), new BigDecimal("7500.00"), new BigDecimal("1350.00"), "cat-marketing", true, "CREDIT_CARD", "MTA-2026-0822"));
        list.add(new SampleReceiptSpec("Coursera Tech Certification", LocalDate.of(2026, 8, 29), new BigDecimal("3500.00"), new BigDecimal("630.00"), "cat-education", true, "DEBIT_CARD", "CRS-2026-0829"));

        // --- September 2026 ---
        list.add(new SampleReceiptSpec("Amazon Web Services", LocalDate.of(2026, 9, 3), new BigDecimal("5890.00"), new BigDecimal("1060.20"), "cat-sw-tools", true, "UPI", "INV-2026-0903"));
        list.add(new SampleReceiptSpec("WeWork Desk Rental", LocalDate.of(2026, 9, 6), new BigDecimal("12000.00"), new BigDecimal("2160.00"), "cat-prof-services", true, "NET_BANKING", "WRK-2026-0906"));
        list.add(new SampleReceiptSpec("Zomato Dinner", LocalDate.of(2026, 9, 7), new BigDecimal("1758.20"), new BigDecimal("268.20"), "cat-food", false, "UPI", "RD-2026-0491"));

        return list;
    }

    private static class SampleReceiptSpec {
        String vendorName;
        LocalDate date;
        BigDecimal amount;
        BigDecimal tax;
        String categoryId;
        boolean isBusiness;
        String paymentMode;
        String receiptNumber;

        SampleReceiptSpec(String vendorName, LocalDate date, BigDecimal amount, BigDecimal tax, String categoryId, boolean isBusiness, String paymentMode, String receiptNumber) {
            this.vendorName = vendorName;
            this.date = date;
            this.amount = amount;
            this.tax = tax;
            this.categoryId = categoryId;
            this.isBusiness = isBusiness;
            this.paymentMode = paymentMode;
            this.receiptNumber = receiptNumber;
        }
    }
}
