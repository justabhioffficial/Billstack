package com.billstack.ocr;

import com.billstack.dto.OcrResultDto;
import java.io.InputStream;

public interface OCRService {
    OcrResultDto processReceipt(InputStream imageStream, String originalFilename);
}
