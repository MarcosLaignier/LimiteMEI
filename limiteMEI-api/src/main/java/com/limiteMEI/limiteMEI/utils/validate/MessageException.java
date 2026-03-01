package com.limiteMEI.limiteMEI.utils.validate;

import java.util.List;

public class MessageException {

    private List<String> messages;

    public MessageException(List<String> messages) {
        this.messages = messages;
    }

    public MessageException(String message) {
        this.messages = List.of(message);
    }

    public List<String> getMessages() {
        return messages;
    }
}
