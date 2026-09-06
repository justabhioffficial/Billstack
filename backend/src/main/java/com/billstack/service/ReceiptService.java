package com.billstack.service;

import com.billstack.common.PagedResponse;
import com.billstack.common.exception.BadRequestException;
import com.billstack.common.exception.ResourceNotFoundException;
import com.billstack.common.exception.UnauthorizedException;
import com.billstack.dto.OcrResultDto;
import com.billstack.dto.ReceiptDto;
import com.billstack.dto.UpdateReceiptRequest;
import com.billstack.entity.Category;
import com.billstack.entity.Receipt;
import com.billstack.entity.ReceiptField;
import com.billstack.ocr.OCRService;
import com.billstack.repository.CategoryRepository;
import com.billstack.repository.ReceiptFieldRepository;
import com.billstack.repository.ReceiptRepository;
import com.billstack.storage.StorageService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.*;

@Service
public class ReceiptService {

    private final ReceiptRepository receiptRepository;
    private final ReceiptFieldRepository receiptFieldRepository;
    private final CategoryRepository categoryRepository;
    private final StorageService storageService;
    private final OCRService ocrService;
    private final CategorizationService categorizationService;
    private final UsageLimitService usageLimitService;

    private static final Set<String> ALLOWED_MIME_TYPES = new HashSet<>(Arrays.asList(
            "image/jpeg", "image/png", "image/jpg", "application/pdf"
    ));

    public ReceiptService(
            ReceiptRepository receiptRepository,
            ReceiptFieldRepository receiptFieldRepository,
            CategoryRepository categoryRepository,
            StorageService storageService,
            OCRService ocrService,
            CategorizationService categorizationService,
            UsageLimitService usageLimitService
    ) {
        this.receiptRepository = receiptRepository;
        this.receiptFieldRepository = receiptFieldRepository;
        this.categoryRepository = categoryRepository;
        this.storageService = storageService;
        this.ocrService = ocrService;
        this.categorizationService = categorizationService;
        this.usageLimitService = usageLimitService;
    }

    @Transactional
    public ReceiptDto uploadAndProcessReceipt(MultipartFile file, String userId, String source) {
        // 1. Validate File
        if (file.isEmpty()) {
            throw new BadRequestException("Please select a valid receipt image or PDF file.");
        }

        String mimeType = file.getContentType();
        if (mimeType == null || !ALLOWED_MIME_TYPES.contains(mimeType.toLowerCase())) {
            throw new BadRequestException("Invalid file type. Only JPG, PNG, and PDF files are supported.");
        }

        if (file.getSize() > 10 * 1024 * 1024) {
            throw new BadRequestException("File size exceeds maximum limit of 10MB.");
        }

        // Validate File Signature / Magic Bytes
        validateMagicBytes(file);

        // 2. Check Monthly Usage Limit
        usageLimitService.checkAndIncrementUsage(userId);

        // 3. Store File securely
        String fileKey = storageService.store(file, userId);

        // 4. Create Initial Receipt Record
        Receipt receipt = new Receipt();
        receipt.setUserId(userId);
        receipt.setFileKey(fileKey);
        receipt.setOriginalFilename(file.getOriginalFilename() != null ? file.getOriginalFilename() : "receipt");
        receipt.setMimeType(mimeType);
        receipt.setFileSize(file.getSize());
        receipt.setSource(source != null ? source : "WEB");
        receipt.setOcrStatus("PROCESSING");
        receipt.setBusiness(true);
        receipt = receiptRepository.save(receipt);

        // 5. OCR Processing & Field Extraction
        try (InputStream stream = storageService.loadAsResource(fileKey)) {
            OcrResultDto ocrResult = ocrService.processReceipt(stream, receipt.getOriginalFilename());

            receipt.setVendorName(ocrResult.getVendorName());
            receipt.setReceiptDate(ocrResult.getReceiptDate());
            receipt.setTotalAmount(ocrResult.getTotalAmount());
            receipt.setTaxAmount(ocrResult.getTaxAmount());
            receipt.setCurrency(ocrResult.getCurrency());
            receipt.setReceiptNumber(ocrResult.getReceiptNumber());
            receipt.setPaymentMode(ocrResult.getPaymentMode());
            receipt.setOcrRawText(ocrResult.getRawText());
            receipt.setOverallConfidence(ocrResult.getOverallConfidence());

            // Categorization Engine
            String categoryId = categorizationService.categorizeVendor(userId, ocrResult.getVendorName());
            receipt.setCategoryId(categoryId);

            // Determine Processing Status
            if (ocrResult.getOverallConfidence() != null && ocrResult.getOverallConfidence().doubleValue() < 80.0
                || ocrResult.getTotalAmount() == null || ocrResult.getVendorName() == null) {
                receipt.setOcrStatus("NEEDS_REVIEW");
            } else {
                receipt.setOcrStatus("COMPLETED");
            }

            // Save Extracted Fields
            if (ocrResult.getFieldConfidences() != null) {
                for (Map.Entry<String, BigDecimal> entry : ocrResult.getFieldConfidences().entrySet()) {
                    ReceiptField field = new ReceiptField(
                            receipt.getId(),
                            entry.getKey(),
                            getFieldVal(receipt, entry.getKey()),
                            entry.getValue()
                    );
                    receiptFieldRepository.save(field);
                }
            }

        } catch (Exception ex) {
            receipt.setOcrStatus("FAILED");
        }

        receipt = receiptRepository.save(receipt);
        return mapToDto(receipt);
    }

    @Transactional(readOnly = true)
    public PagedResponse<ReceiptDto> getReceipts(
            String userId,
            String categoryId,
            Boolean isBusiness,
            String status,
            LocalDate startDate,
            LocalDate endDate,
            String search,
            int page,
            int size
    ) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("receiptDate").descending().and(Sort.by("createdAt").descending()));
        Page<Receipt> pageResult = receiptRepository.findWithFilters(userId, categoryId, isBusiness, status, startDate, endDate, search, pageable);

        List<ReceiptDto> dtos = pageResult.getContent().stream().map(this::mapToDto).toList();

        return new PagedResponse<>(
                dtos,
                pageResult.getNumber(),
                pageResult.getSize(),
                pageResult.getTotalElements(),
                pageResult.getTotalPages(),
                pageResult.isLast()
        );
    }

    @Transactional(readOnly = true)
    public ReceiptDto getReceiptById(String id, String userId) {
        Receipt receipt = receiptRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Receipt not found with id: " + id));

        if (!receipt.getUserId().equals(userId)) {
            throw new UnauthorizedException("You do not have permission to access this receipt.");
        }

        return mapToDto(receipt);
    }

    @Transactional
    public ReceiptDto updateReceipt(String id, String userId, UpdateReceiptRequest request) {
        Receipt receipt = receiptRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Receipt not found with id: " + id));

        if (!receipt.getUserId().equals(userId)) {
            throw new UnauthorizedException("You do not have permission to modify this receipt.");
        }

        if (request.getVendorName() != null) receipt.setVendorName(request.getVendorName());
        if (request.getReceiptDate() != null) receipt.setReceiptDate(request.getReceiptDate());
        if (request.getTotalAmount() != null) receipt.setTotalAmount(request.getTotalAmount());
        if (request.getTaxAmount() != null) receipt.setTaxAmount(request.getTaxAmount());
        if (request.getCurrency() != null) receipt.setCurrency(request.getCurrency());
        if (request.getReceiptNumber() != null) receipt.setReceiptNumber(request.getReceiptNumber());
        if (request.getPaymentMode() != null) receipt.setPaymentMode(request.getPaymentMode());
        if (request.getCategoryId() != null) receipt.setCategoryId(request.getCategoryId());
        if (request.getIsBusiness() != null) receipt.setBusiness(request.getIsBusiness());

        // When user edits receipt, mark status as COMPLETED
        receipt.setOcrStatus("COMPLETED");

        receipt = receiptRepository.save(receipt);
        return mapToDto(receipt);
    }

    @Transactional
    public void deleteReceipt(String id, String userId) {
        Receipt receipt = receiptRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Receipt not found with id: " + id));

        if (!receipt.getUserId().equals(userId)) {
            throw new UnauthorizedException("You do not have permission to delete this receipt.");
        }

        storageService.delete(receipt.getFileKey());
        receiptFieldRepository.deleteByReceiptId(id);
        receiptRepository.delete(receipt);
    }

    private ReceiptDto mapToDto(Receipt receipt) {
        String categoryName = "Other";
        String categoryColor = "#64748B";

        if (receipt.getCategoryId() != null) {
            Optional<Category> catOpt = categoryRepository.findById(receipt.getCategoryId());
            if (catOpt.isPresent()) {
                categoryName = catOpt.get().getName();
                categoryColor = catOpt.get().getColor();
            }
        }

        String fileUrl = storageService.getFileUrl(receipt.getFileKey());
        return ReceiptDto.fromEntity(receipt, categoryName, categoryColor, fileUrl);
    }

    private String getFieldVal(Receipt receipt, String fieldName) {
        return switch (fieldName) {
            case "vendor" -> receipt.getVendorName();
            case "date" -> receipt.getReceiptDate() != null ? receipt.getReceiptDate().toString() : null;
            case "total" -> receipt.getTotalAmount() != null ? receipt.getTotalAmount().toString() : null;
            case "tax" -> receipt.getTaxAmount() != null ? receipt.getTaxAmount().toString() : null;
            case "invoiceNo" -> receipt.getReceiptNumber();
            case "paymentMode" -> receipt.getPaymentMode();
            default -> null;
        };
    }

    private void validateMagicBytes(MultipartFile file) {
        try (InputStream is = file.getInputStream()) {
            byte[] header = new byte[8];
            int read = is.read(header, 0, header.length);
            if (read < 4) {
                throw new BadRequestException("Uploaded file is empty or corrupted.");
            }
            // Check PNG (89 50 4E 47)
            boolean isPng = (header[0] & 0xFF) == 0x89 && (header[1] & 0xFF) == 0x50 &&
                            (header[2] & 0xFF) == 0x4E && (header[3] & 0xFF) == 0x47;
            // Check JPG (FF D8 FF)
            boolean isJpg = (header[0] & 0xFF) == 0xFF && (header[1] & 0xFF) == 0xD8 &&
                            (header[2] & 0xFF) == 0xFF;
            // Check PDF (%PDF -> 25 50 44 46)
            boolean isPdf = (header[0] & 0xFF) == 0x25 && (header[1] & 0xFF) == 0x50 &&
                            (header[2] & 0xFF) == 0x44 && (header[3] & 0xFF) == 0x46;

            if (!isPng && !isJpg && !isPdf) {
                throw new BadRequestException("Invalid file signature. File header magic bytes do not match JPG, PNG, or PDF format.");
            }
        } catch (IOException e) {
            throw new BadRequestException("Failed to read file signature for validation.");
        }
    }
}
