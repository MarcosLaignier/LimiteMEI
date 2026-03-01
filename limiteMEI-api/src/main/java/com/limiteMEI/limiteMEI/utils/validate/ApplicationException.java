package com.limiteMEI.limiteMEI.utils.validate;

import java.util.List;

public class ApplicationException extends RuntimeException {

    private final MessageException messageException;

    public ApplicationException(MessageException messageException) {
        super("Erro de validação");
        this.messageException = messageException;
    }

    public ApplicationException(String message) {
        this(new MessageException(message));
    }

    public ApplicationException(List<String> messages) {
        this(new MessageException(messages));
    }

    public MessageException getMessageException() {
        return messageException;
    }
}
