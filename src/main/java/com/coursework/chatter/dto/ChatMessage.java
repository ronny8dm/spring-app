package com.coursework.chatter.dto;

import com.coursework.chatter.util.MessageType;
import lombok.*;
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString
public class ChatMessage {
    private MessageType type;
    private String content;
    private String sender;
    private String receiver;
}
