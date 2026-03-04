package com.codinglearn.chat.backend.payload;

import com.codinglearn.chat.backend.entitites.MessageType;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class MessageRequest {
    private String roomId;
    private String sender;
    private String content;
    private MessageType messageType = MessageType.TEXT;
    private String imageUrl;
}
