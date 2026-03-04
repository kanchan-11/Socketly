package com.codinglearn.chat.backend.services;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
public class ImageServiceImpl implements ImageService {

    @Value("${app.upload.dir:uploads}")
    private String uploadDir;

    @Override
    public String uploadImage(MultipartFile file, String roomId) {
        try {
            // Create upload directory if it doesn't exist
            Path uploadPath = Paths.get(uploadDir, roomId);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            // Generate unique filename
            String originalFileName = file.getOriginalFilename();
            String extension = originalFileName != null && originalFileName.contains(".")
                    ? originalFileName.substring(originalFileName.lastIndexOf("."))
                    : ".png";
            String fileName = UUID.randomUUID() + extension;

            // Save the file
            Path filePath = uploadPath.resolve(fileName);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            // Return the relative path as URL
            return "/api/v1/images/" + roomId + "/" + fileName;
        } catch (IOException e) {
            throw new RuntimeException("Failed to upload image: " + e.getMessage(), e);
        }
    }

    @Override
    public byte[] getImage(String fileName) {
        try {
            Path filePath = Paths.get(uploadDir).resolve(fileName);
            if (Files.exists(filePath)) {
                return Files.readAllBytes(filePath);
            }
            throw new RuntimeException("Image not found: " + fileName);
        } catch (IOException e) {
            throw new RuntimeException("Failed to read image: " + e.getMessage(), e);
        }
    }
}

