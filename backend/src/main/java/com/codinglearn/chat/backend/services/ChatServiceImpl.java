package com.codinglearn.chat.backend.services;

import com.codinglearn.chat.backend.entitites.Message;
import com.codinglearn.chat.backend.payload.MessageRequest;
import com.codinglearn.chat.backend.repositories.ChatRoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class ChatServiceImpl implements ChatService {
    private final ChatRoomRepository chatRoomRepository;

    @Autowired
    public ChatServiceImpl(ChatRoomRepository chatRoomRepository) {
        this.chatRoomRepository = chatRoomRepository;
    }
    @Override
    public Message sendMessage(MessageRequest request, String roomId) {
        var chatRoom = chatRoomRepository.findByRoomId(request.getRoomId());

        Message message = new Message();
        message.setContent(request.getContent());
        message.setSender(request.getSender());
        message.setTimeStamp(LocalDateTime.now());
        if(chatRoom!=null){
            chatRoom.getMessages().add(message);
            chatRoomRepository.save(chatRoom);
        }
        else{
            throw new RuntimeException("Chat Room not found.");
        }
        return message;
    }
}