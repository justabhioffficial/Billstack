package com.billstack;

import com.billstack.dto.*;
import com.billstack.entity.CategorizationRule;
import com.billstack.repository.CategorizationRuleRepository;
import com.billstack.repository.UserRepository;
import com.billstack.service.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.mock.web.MockMultipartFile;

import java.io.ByteArrayInputStream;
import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class GoldenPathIntegrationTest {

    @Autowired
    private AuthService authService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ReceiptService receiptService;

    @Autowired
    private CategorizationService categorizationService;

    @Autowired
    private CategorizationRuleRepository categorizationRuleRepository;

    @Autowired
    private ReportService reportService;

    @Autowired
    private ExportService exportService;

    private String testUserId;

    @BeforeEach
    void setUp() {
        userRepository.deleteAll();
        categorizationRuleRepository.deleteAll();

        RegisterRequest registerReq = new RegisterRequest();
        registerReq.setEmail("golden.user@example.com");
        registerReq.setPassword("Password@123");
        registerReq.setName("Golden Test User");

        AuthResponse auth = authService.register(registerReq);
        assertNotNull(auth);
        assertNotNull(auth.getUser());
        testUserId = auth.getUser().getId();
    }

    @Test
    @DisplayName("Golden Path: Full End-to-End Core Pipeline Test")
    void testGoldenPathPipeline() throws Exception {
        // 1. Prepare Valid Receipt File with PNG Magic Bytes (89 50 4E 47 0D 0A 1A 0A)
        byte[] pngBytes = new byte[] {
            (byte) 0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A,
            0x00, 0x00, 0x00, 0x0D, 0x49, 0x48, 0x44, 0x52
        };

        MockMultipartFile validFile = new MockMultipartFile(
            "file",
            "aws_receipt_jan.png",
            "image/png",
            pngBytes
        );

        // 2. Upload Receipt & Run OCR Engine
        ReceiptDto receipt = receiptService.uploadAndProcessReceipt(validFile, testUserId, "WEB");
        assertNotNull(receipt);
        assertNotNull(receipt.getId());
        assertEquals("aws_receipt_jan.png", receipt.getOriginalFilename());
        assertNotNull(receipt.getVendorName());
        assertNotNull(receipt.getTotalAmount());
        assertTrue(receipt.getTotalAmount().doubleValue() > 0);

        // 3. User Custom Categorization Priority
        CategorizationRule rule = new CategorizationRule();
        rule.setUserId(testUserId);
        rule.setVendorPattern("AWS");
        rule.setCategoryId("cat-sw-tools");
        categorizationRuleRepository.save(rule);

        String chosenCat = categorizationService.categorizeVendor(testUserId, "AWS Cloud Billing");
        assertEquals("cat-sw-tools", chosenCat);

        // 4. User Review & Manual Edit
        UpdateReceiptRequest updateReq = new UpdateReceiptRequest();
        updateReq.setVendorName("Amazon Web Services");
        updateReq.setTotalAmount(new BigDecimal("2891.00"));
        updateReq.setTaxAmount(new BigDecimal("441.00"));
        updateReq.setReceiptDate(LocalDate.of(2026, 9, 1));
        updateReq.setPaymentMode("CARD");
        updateReq.setCategoryId("cat-sw-tools");
        updateReq.setIsBusiness(true);

        ReceiptDto reviewedReceipt = receiptService.updateReceipt(receipt.getId(), testUserId, updateReq);
        assertEquals("COMPLETED", reviewedReceipt.getOcrStatus());
        assertEquals("Amazon Web Services", reviewedReceipt.getVendorName());
        assertEquals(new BigDecimal("2891.00"), reviewedReceipt.getTotalAmount());

        // 5. Dashboard Metrics Update Verification
        MonthlyReportDto report = reportService.getMonthlyReport(testUserId, "2026-09");
        assertNotNull(report);
        assertEquals(1, report.getTotalReceiptsCount());
        assertEquals(new BigDecimal("2891.00"), report.getTotalExpenses());

        // 6. CSV Export Data Integrity
        ByteArrayInputStream csvStream = exportService.exportToCsv(testUserId, null, null);
        String csvContent = new String(csvStream.readAllBytes(), StandardCharsets.UTF_8);
        assertTrue(csvContent.contains("Receipt ID,Date,Vendor,Category,Amount,Tax,Currency,Payment Mode,Type"));
        assertTrue(csvContent.contains("Amazon Web Services"));
        assertTrue(csvContent.contains("2891.00"));

        // 7. Excel (.xlsx) Export Verification
        ByteArrayInputStream excelStream = exportService.exportToExcel(testUserId, null, null);
        assertTrue(excelStream.available() > 0);
    }

    @Test
    @DisplayName("Upload Security: Reject Corrupted File / Invalid Magic Bytes")
    void testRejectCorruptedFileSignature() {
        byte[] fakeBytes = "malicious executable content".getBytes(StandardCharsets.UTF_8);
        MockMultipartFile fakeFile = new MockMultipartFile(
            "file",
            "malicious.jpg",
            "image/jpeg",
            fakeBytes
        );

        assertThrows(RuntimeException.class, () -> {
            receiptService.uploadAndProcessReceipt(fakeFile, testUserId, "WEB");
        });
    }
}
