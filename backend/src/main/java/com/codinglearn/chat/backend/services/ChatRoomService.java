package com.codinglearn.chat.backend.services;

import com.codinglearn.chat.backend.entitites.Message;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface ChatRoomService {
     ResponseEntity<?> createRoom(String roomId);
     ResponseEntity<?> joinRoom(String roomId);
     ResponseEntity<List<Message>> getMessages(String roomId, int page, int size);
}
