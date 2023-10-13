package com.coursework.chatter.controller;

import com.coursework.chatter.dto.MessageService;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class MessageController {

    @MessageMapping("/chat.sendMessage")
    @SendTo("/topic/public")
    public MessageService sendMessage(
            @Payload MessageService chatMessage
    ) {
        return chatMessage;
    }

    @MessageMapping("/chat.addUser")
    @SendTo("/topic/public")
    public MessageService addUser(
            @Payload MessageService chatMessage,
            SimpMessageHeaderAccessor headerAccessor
    ) {

        headerAccessor.getSessionAttributes().put("username", chatMessage.getSender());
        return chatMessage;
    }

    @GetMapping("/")
    public String getChatPage() {
        return "chat";
    }
}
