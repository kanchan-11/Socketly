package com.codinglearn.chat.backend.repositories;

import com.codinglearn.chat.backend.entitites.ChatRoom;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface ChatRoomRepository extends MongoRepository<ChatRoom,String> {
    ChatRoom findByRoomId(String roomId);
}
