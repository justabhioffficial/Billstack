package com.billstack.controller;

import com.billstack.common.ApiResponse;
import com.billstack.common.PagedResponse;
import com.billstack.dto.ReceiptDto;
import com.billstack.dto.UpdateReceiptRequest;
import com.billstack.security.UserPrincipal;
import com.billstack.service.ReceiptService;
import com.billstack.storage.StorageService;
import org.springframework.core.io.InputStreamResource;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.time.LocalDate;

@RestController
@RequestMapping("/api/v1/receipts")
public class ReceiptController {

    private final ReceiptService receiptService;
    private final StorageService storageService;

    public ReceiptController(ReceiptService receiptService, StorageService storageService) {
        this.receiptService = receiptService;
        this.storageService = storageService;
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<ReceiptDto>> uploadReceipt(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "source", required = false, defaultValue = "WEB") String source,
            @AuthenticationPrincipal UserPrincipal currentUser
    ) {
        ReceiptDto receipt = receiptService.uploadAndProcessReceipt(file, currentUser.getId(), source);
        return ResponseEntity.ok(ApiResponse.success(receipt, "Receipt uploaded and processed successfully"));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<PagedResponse<ReceiptDto>>> getReceipts(
            @RequestParam(value = "categoryId", required = false) String categoryId,
            @RequestParam(value = "isBusiness", required = false) Boolean isBusiness,
            @RequestParam(value = "status", required = false) String status,
            @RequestParam(value = "startDate", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(value = "endDate", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(value = "search", required = false) String search,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "15") int size,
            @AuthenticationPrincipal UserPrincipal currentUser
    ) {
        PagedResponse<ReceiptDto> receipts = receiptService.getReceipts(
                currentUser.getId(), categoryId, isBusiness, status, startDate, endDate, search, page, size
        );
        return ResponseEntity.ok(ApiResponse.success(receipts));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ReceiptDto>> getReceiptById(
            @PathVariable String id,
            @AuthenticationPrincipal UserPrincipal currentUser
    ) {
        ReceiptDto receipt = receiptService.getReceiptById(id, currentUser.getId());
        return ResponseEntity.ok(ApiResponse.success(receipt));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ReceiptDto>> updateReceipt(
            @PathVariable String id,
            @RequestBody UpdateReceiptRequest request,
            @AuthenticationPrincipal UserPrincipal currentUser
    ) {
        ReceiptDto updated = receiptService.updateReceipt(id, currentUser.getId(), request);
        return ResponseEntity.ok(ApiResponse.success(updated, "Receipt updated successfully"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteReceipt(
            @PathVariable String id,
            @AuthenticationPrincipal UserPrincipal currentUser
    ) {
        receiptService.deleteReceipt(id, currentUser.getId());
        return ResponseEntity.ok(ApiResponse.success(null, "Receipt deleted successfully"));
    }

    @GetMapping("/files/{userId}/{filename}")
    public ResponseEntity<InputStreamResource> viewReceiptFile(
            @PathVariable String userId,
            @PathVariable String filename
    ) {
        String fileKey = userId + "/" + filename;
        InputStream is = storageService.loadAsResource(fileKey);
        
        String mimeType = "image/jpeg";
        if (filename.endsWith(".pdf")) mimeType = "application/pdf";
        else if (filename.endsWith(".png")) mimeType = "image/png";
        else if (filename.endsWith(".svg")) mimeType = "image/svg+xml";

        byte[] data;
        try {
            data = is.readAllBytes();
            String prefix = new String(data, 0, Math.min(data.length, 60), java.nio.charset.StandardCharsets.UTF_8);
            if (prefix.contains("<svg")) {
                mimeType = "image/svg+xml";
            }
        } catch (Exception e) {
            data = new byte[0];
        }

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + filename + "\"")
                .contentType(MediaType.parseMediaType(mimeType))
                .body(new InputStreamResource(new java.io.ByteArrayInputStream(data)));
    }
}
