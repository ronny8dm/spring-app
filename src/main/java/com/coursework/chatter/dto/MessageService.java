package com.coursework.chatter.dto;

import com.coursework.chatter.util.MessageType;
import lombok.*;
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class MessageService {
    private MessageType type;
    private String content;
    private String sender;
}
