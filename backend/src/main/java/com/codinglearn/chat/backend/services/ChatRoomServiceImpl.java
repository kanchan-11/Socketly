package com.codinglearn.chat.backend.services;

import com.codinglearn.chat.backend.entitites.ChatRoom;
import com.codinglearn.chat.backend.entitites.Message;
import com.codinglearn.chat.backend.repositories.ChatRoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class ChatRoomServiceImpl implements ChatRoomService {
    private final ChatRoomRepository chatRoomRepository;
    @Autowired
    public ChatRoomServiceImpl(ChatRoomRepository chatRoomRepository) {
        this.chatRoomRepository = chatRoomRepository;
    }
    //create room
    @Override
    public ResponseEntity<?> createRoom(String roomId) {
        // check if room exists
        // if not create new room and save to db
        // return created room'
        if(chatRoomRepository.findByRoomId(roomId)!=null){
            return ResponseEntity.badRequest().body("A chat room already exists.");
        }
        ChatRoom chatRoom = new ChatRoom();
        chatRoom.setRoomId(roomId);
        ChatRoom savedChatRoom = chatRoomRepository.save(chatRoom);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedChatRoom);
    }
    // get room
    @Override
    public ResponseEntity<?> joinRoom(String roomId) {
        // find room by roomId
        // if not found return not found
        // else return room
        ChatRoom chatRoom = chatRoomRepository.findByRoomId(roomId);
        if(chatRoom==null){
            return ResponseEntity.badRequest().body("Chat Room not found.");
        }
        return ResponseEntity.ok(chatRoom);
    }
    // get messages of room
    @Override
    public ResponseEntity<List<Message>> getMessages(String roomId, int page, int size){
        ChatRoom chatRoom = chatRoomRepository.findByRoomId(roomId);
        if(chatRoom==null){
            return ResponseEntity.badRequest().build();
        }
        List<Message> messages = chatRoom.getMessages();
        int start = Math.max(0,messages.size()-(page+1)*size);
        int end = Math.min(messages.size(), messages.size() - page*size);
        if(start>=end){
            return ResponseEntity.ok(new ArrayList<>());
        }
        List<Message> paginatedMessages = messages.subList(start,end);
        return ResponseEntity.ok(paginatedMessages);
    }
}
