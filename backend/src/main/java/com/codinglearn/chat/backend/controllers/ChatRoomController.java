package com.codinglearn.chat.backend.controllers;

import com.codinglearn.chat.backend.entitites.Message;
import com.codinglearn.chat.backend.services.ChatRoomService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin("http://localhost:5173")
@RequestMapping("/api/v1/chatrooms")
public class ChatRoomController {
    private final ChatRoomService chatRoomService;
    public ChatRoomController(ChatRoomService chatRoomService) {
        this.chatRoomService = chatRoomService;
    }
    //create room
    @PostMapping
    public ResponseEntity<?> createRoom(@RequestBody String roomId) {
        return chatRoomService.createRoom(roomId);
    }
    // get room
    @GetMapping("/{roomId}")
    public ResponseEntity<?> joinRoom(@PathVariable String roomId) {
        return chatRoomService.joinRoom(roomId);
    }
    @GetMapping("/{roomId}/messages")
    public ResponseEntity<List<Message>> getMessages(
            @PathVariable String roomId,
            @RequestParam(value = "page", defaultValue="0", required = false) int page,
            @RequestParam(value="size", defaultValue="20", required = false) int size){
        return chatRoomService.getMessages(roomId,page,size);
    }
}
