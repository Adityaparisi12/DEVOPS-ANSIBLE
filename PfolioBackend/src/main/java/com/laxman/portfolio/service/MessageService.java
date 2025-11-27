package com.laxman.portfolio.service;

import com.laxman.portfolio.model.Message;

public interface MessageService {
    String sendReplyMessage(Message message);
    String saveMessage(Message message);
    java.util.List<Message> getAllMessages();
}