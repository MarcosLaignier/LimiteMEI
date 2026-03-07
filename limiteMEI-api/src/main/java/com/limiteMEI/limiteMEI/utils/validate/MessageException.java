package com.limiteMEI.limiteMEI.utils.validate;

import lombok.Getter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
public class MessageException {

    private final LocalDateTime timestamp;
    private final List<String> messages;

    /**
     * Construtor para múltiplas mensagens
     */
    public MessageException(List<String> messages) {
        this.timestamp = LocalDateTime.now();
        this.messages = messages;
    }

    /**
     * Construtor para uma única mensagem
     */
    public MessageException(String message) {
        this.timestamp = LocalDateTime.now();
        this.messages = List.of(message);
    }

    /**
     * Construtor para múltiplas mensagens (varargs)
     */
    public MessageException(String... messages) {
        this.timestamp = LocalDateTime.now();
        this.messages = List.of(messages);
    }

}