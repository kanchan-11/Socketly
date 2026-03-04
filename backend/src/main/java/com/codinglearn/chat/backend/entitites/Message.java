package com.codinglearn.chat.backend.entitites;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Message {
    private String sender;
    private String content;
    private LocalDateTime timeStamp;
    private MessageType messageType = MessageType.TEXT;
    private String imageUrl;

    public Message(String sender, String content) {
        this.sender = sender;
        this.content = content;
        this.timeStamp = LocalDateTime.now();
        this.messageType = MessageType.TEXT;
    }

    public Message(String sender, String content, MessageType messageType, String imageUrl) {
        this.sender = sender;
        this.content = content;
        this.timeStamp = LocalDateTime.now();
        this.messageType = messageType;
        this.imageUrl = imageUrl;
    }
}
