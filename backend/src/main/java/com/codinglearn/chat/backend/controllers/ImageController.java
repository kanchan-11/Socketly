package com.codinglearn.chat.backend.controllers;

import com.codinglearn.chat.backend.services.ImageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/images")
@CrossOrigin("http://localhost:5173")
public class ImageController {

    private final ImageService imageService;

    @Autowired
    public ImageController(ImageService imageService) {
        this.imageService = imageService;
    }

    @PostMapping("/upload/{roomId}")
    public ResponseEntity<Map<String, String>> uploadImage(
            @PathVariable String roomId,
            @RequestParam("file") MultipartFile file) {

        // Validate file type
        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Only image files are allowed"));
        }

        // Validate file size (max 5MB)
        if (file.getSize() > 5 * 1024 * 1024) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "File size must be less than 5MB"));
        }

        String imageUrl = imageService.uploadImage(file, roomId);
        return ResponseEntity.ok(Map.of("imageUrl", imageUrl));
    }

    @GetMapping("/{roomId}/{fileName}")
    public ResponseEntity<byte[]> getImage(
            @PathVariable String roomId,
            @PathVariable String fileName) {

        String filePath = roomId + "/" + fileName;
        byte[] imageData = imageService.getImage(filePath);

        MediaType mediaType = MediaType.IMAGE_PNG;
        if (fileName.toLowerCase().endsWith(".jpg") || fileName.toLowerCase().endsWith(".jpeg")) {
            mediaType = MediaType.IMAGE_JPEG;
        } else if (fileName.toLowerCase().endsWith(".gif")) {
            mediaType = MediaType.IMAGE_GIF;
        }

        return ResponseEntity.ok()
                .contentType(mediaType)
                .body(imageData);
    }
}

