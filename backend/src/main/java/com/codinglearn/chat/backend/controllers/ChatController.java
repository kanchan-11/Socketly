package com.codinglearn.chat.backend.controllers;

import com.codinglearn.chat.backend.entitites.Message;
import com.codinglearn.chat.backend.payload.MessageRequest;
import com.codinglearn.chat.backend.services.ChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestBody;

@Controller
@CrossOrigin("http://localhost:5173 ")
public class ChatController {

    @Autowired
    private ChatService chatService;
    ChatController(ChatService chatService) {
        this.chatService = chatService;
    }
     @MessageMapping("/sendMessage/{roomId}")
     @SendTo("/topic/room/{roomId}")
     public Message sendMessage(@RequestBody MessageRequest request, @DestinationVariable String roomId) {
         return chatService.sendMessage(request,roomId);
     }
}
