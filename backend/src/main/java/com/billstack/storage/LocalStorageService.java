package com.billstack.storage;

import com.billstack.common.exception.BadRequestException;
import com.billstack.common.exception.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileInputStream;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
public class LocalStorageService implements StorageService {

    private final Path rootLocation;

    public LocalStorageService(@Value("${billstack.storage.local-dir:uploads}") String uploadDir) {
        this.rootLocation = Paths.get(uploadDir);
        try {
            Files.createDirectories(rootLocation);
        } catch (Exception ex) {
            throw new RuntimeException("Could not initialize local storage directory", ex);
        }
    }

    @Override
    public String store(MultipartFile file, String userId) {
        if (file.isEmpty()) {
            throw new BadRequestException("Failed to store empty file.");
        }

        String originalFilename = StringUtils.cleanPath(file.getOriginalFilename() != null ? file.getOriginalFilename() : "receipt");
        String extension = "";
        int i = originalFilename.lastIndexOf('.');
        if (i > 0) {
            extension = originalFilename.substring(i);
        }

        String safeFileName = userId + "/" + UUID.randomUUID() + extension;
        Path targetPath = this.rootLocation.resolve(safeFileName);

        try {
            Files.createDirectories(targetPath.getParent());
            Files.copy(file.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);
            return safeFileName;
        } catch (Exception ex) {
            throw new RuntimeException("Failed to store file " + originalFilename, ex);
        }
    }

    @Override
    public InputStream loadAsResource(String fileKey) {
        try {
            Path file = rootLocation.resolve(fileKey);
            if (Files.exists(file) && Files.isReadable(file)) {
                return new FileInputStream(file.toFile());
            } else {
                throw new ResourceNotFoundException("Could not read file: " + fileKey);
            }
        } catch (Exception ex) {
            throw new ResourceNotFoundException("Could not read file: " + fileKey);
        }
    }

    @Override
    public void delete(String fileKey) {
        try {
            Path file = rootLocation.resolve(fileKey);
            Files.deleteIfExists(file);
        } catch (Exception ex) {
            // Log warning if delete fails
        }
    }

    @Override
    public String getFileUrl(String fileKey) {
        return "/api/v1/receipts/files/" + fileKey;
    }
}
