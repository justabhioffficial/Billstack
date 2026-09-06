package com.billstack.ocr;

import com.billstack.dto.OcrResultDto;
import org.springframework.stereotype.Service;

import java.io.InputStream;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;

@Service
public class MockOCRService implements OCRService {

    private final ReceiptTextParser parser;

    public MockOCRService(ReceiptTextParser parser) {
        this.parser = parser;
    }

    @Override
    public OcrResultDto processReceipt(InputStream imageStream, String originalFilename) {
        String filenameLower = originalFilename != null ? originalFilename.toLowerCase() : "";

        String rawText;
        if (filenameLower.contains("uber")) {
            rawText = "Uber India Technology Pvt Ltd\nTax Invoice: UB-8947291\nDate: 04-09-2026\nGSTIN: 27AABCU9603R1ZM\nTrip Amount: ₹ 480.00\nCGST (9%): ₹ 21.60\nSGST (9%): ₹ 21.60\nTOTAL PAYABLE: ₹ 523.20\nPayment via UPI";
        } else if (filenameLower.contains("swiggy") || filenameLower.contains("food")) {
            rawText = "Swiggy Foods Pvt Ltd\nOrder ID: 1948271039\nDate: 02-09-2026\nItem Total: ₹ 650.00\nGST & Restaurant Charges: ₹ 78.00\nDelivery Fee: ₹ 35.00\nTOTAL AMOUNT: ₹ 763.00\nPaid via Credit Card";
        } else if (filenameLower.contains("aws") || filenameLower.contains("amazon")) {
            rawText = "Amazon Web Services India Pvt Ltd\nInvoice No: AWS-IN-2026-9481\nInvoice Date: 01-09-2026\nUsage Charges: ₹ 2450.00\nIGST (18%): ₹ 441.00\nTOTAL DUE: ₹ 2891.00\nPaid via Visa Ending 4092";
        } else if (filenameLower.contains("airtel") || filenameLower.contains("phone")) {
            rawText = "Bharti Airtel Limited\nAccount No: 10492817\nInvoice No: AIR-849201\nBill Date: 28-08-2026\nPlan Charges: ₹ 999.00\nGST (18%): ₹ 179.82\nTOTAL PAYABLE: ₹ 1178.82\nPaid via Net Banking";
        } else {
            rawText = "Reliance Digital / Office Supplies\nTax Invoice No: RD-2026-0491\nDate: " + LocalDate.now().toString() + "\nDesk Accessories & Paper: ₹ 1490.00\nCGST: ₹ 134.10\nSGST: ₹ 134.10\nGRAND TOTAL: ₹ 1758.20\nPaid via Cash";
        }

        return parser.parseText(rawText);
    }
}
