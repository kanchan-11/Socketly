package com.codinglearn.chat.backend.services;

import com.codinglearn.chat.backend.entitites.Message;
import com.codinglearn.chat.backend.payload.MessageRequest;

public interface ChatService {
    Message sendMessage(MessageRequest request,String roomId);
}
