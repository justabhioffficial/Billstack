package com.billstack.storage;

import org.springframework.web.multipart.MultipartFile;
import java.io.InputStream;

public interface StorageService {
    String store(MultipartFile file, String userId);
    InputStream loadAsResource(String fileKey);
    void delete(String fileKey);
    String getFileUrl(String fileKey);
}
