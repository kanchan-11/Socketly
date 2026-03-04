package com.codinglearn.chat.backend.services;

import org.springframework.web.multipart.MultipartFile;

public interface ImageService {
    String uploadImage(MultipartFile file, String roomId);
    byte[] getImage(String fileName);
}

