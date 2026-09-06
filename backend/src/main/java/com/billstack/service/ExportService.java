package com.billstack.service;

import com.billstack.entity.Category;
import com.billstack.entity.Receipt;
import com.billstack.repository.CategoryRepository;
import com.billstack.repository.ReceiptRepository;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
public class ExportService {

    private final ReceiptRepository receiptRepository;
    private final CategoryRepository categoryRepository;

    public ExportService(ReceiptRepository receiptRepository, CategoryRepository categoryRepository) {
        this.receiptRepository = receiptRepository;
        this.categoryRepository = categoryRepository;
    }

    @Transactional(readOnly = true)
    public ByteArrayInputStream exportToCsv(String userId, LocalDate startDate, LocalDate endDate) {
        List<Receipt> receipts = receiptRepository.findForExport(userId, startDate, endDate);
        Map<String, Category> categoryMap = categoryRepository.findAllAvailableForUser(userId).stream()
                .collect(Collectors.toMap(Category::getId, Function.identity(), (a, b) -> a));

        StringBuilder sb = new StringBuilder();
        // CSV Header
        sb.append("Receipt ID,Date,Vendor,Category,Amount,Tax,Currency,Payment Mode,Type\n");

        for (Receipt r : receipts) {
            String catName = r.getCategoryId() != null && categoryMap.containsKey(r.getCategoryId())
                    ? categoryMap.get(r.getCategoryId()).getName() : "Other";

            sb.append(escapeCsv(r.getId())).append(",")
              .append(r.getReceiptDate() != null ? r.getReceiptDate().toString() : "").append(",")
              .append(escapeCsv(r.getVendorName())).append(",")
              .append(escapeCsv(catName)).append(",")
              .append(r.getTotalAmount() != null ? r.getTotalAmount().toString() : "0.00").append(",")
              .append(r.getTaxAmount() != null ? r.getTaxAmount().toString() : "0.00").append(",")
              .append(escapeCsv(r.getCurrency())).append(",")
              .append(escapeCsv(r.getPaymentMode())).append(",")
              .append(r.isBusiness() ? "Business" : "Personal").append("\n");
        }

        return new ByteArrayInputStream(sb.toString().getBytes(StandardCharsets.UTF_8));
    }

    @Transactional(readOnly = true)
    public ByteArrayInputStream exportToExcel(String userId, LocalDate startDate, LocalDate endDate) {
        List<Receipt> receipts = receiptRepository.findForExport(userId, startDate, endDate);
        Map<String, Category> categoryMap = categoryRepository.findAllAvailableForUser(userId).stream()
                .collect(Collectors.toMap(Category::getId, Function.identity(), (a, b) -> a));

        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Sheet sheet = workbook.createSheet("Expenses");

            // Header Style
            CellStyle headerStyle = workbook.createCellStyle();
            Font headerFont = workbook.createFont();
            headerFont.setBold(true);
            headerFont.setColor(IndexedColors.WHITE.getIndex());
            headerStyle.setFont(headerFont);
            headerStyle.setFillForegroundColor(IndexedColors.DARK_BLUE.getIndex());
            headerStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);

            String[] columns = {"Receipt ID", "Date", "Vendor", "Category", "Amount (INR)", "Tax", "Currency", "Payment Mode", "Type"};

            Row headerRow = sheet.createRow(0);
            for (int i = 0; i < columns.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(columns[i]);
                cell.setCellStyle(headerStyle);
            }

            int rowIdx = 1;
            for (Receipt r : receipts) {
                Row row = sheet.createRow(rowIdx++);
                String catName = r.getCategoryId() != null && categoryMap.containsKey(r.getCategoryId())
                        ? categoryMap.get(r.getCategoryId()).getName() : "Other";

                row.createCell(0).setCellValue(r.getId());
                row.createCell(1).setCellValue(r.getReceiptDate() != null ? r.getReceiptDate().toString() : "");
                row.createCell(2).setCellValue(r.getVendorName() != null ? r.getVendorName() : "");
                row.createCell(3).setCellValue(catName);
                row.createCell(4).setCellValue(r.getTotalAmount() != null ? r.getTotalAmount().doubleValue() : 0.0);
                row.createCell(5).setCellValue(r.getTaxAmount() != null ? r.getTaxAmount().doubleValue() : 0.0);
                row.createCell(6).setCellValue(r.getCurrency());
                row.createCell(7).setCellValue(r.getPaymentMode() != null ? r.getPaymentMode() : "");
                row.createCell(8).setCellValue(r.isBusiness() ? "Business" : "Personal");
            }

            for (int i = 0; i < columns.length; i++) {
                sheet.autoSizeColumn(i);
            }

            workbook.write(out);
            return new ByteArrayInputStream(out.toByteArray());
        } catch (IOException e) {
            throw new RuntimeException("Failed to generate Excel export", e);
        }
    }

    private String escapeCsv(String text) {
        if (text == null) return "";
        if (text.contains(",") || text.contains("\"") || text.contains("\n")) {
            return "\"" + text.replace("\"", "\"\"") + "\"";
        }
        return text;
    }
}
