package com.limiteMEI.limiteMEI.utils.validate;

/** Metodo criado para os informar os tipos de validacao e as msg padroes das validacoes automatica */
public enum ValidationType {

    NOT_NULL("O campo %s deve ser informado."),
    UNIQUE("Já existe um registro com %s informado."),
    SIZE("O campo %s deve conter entre %d e %d caracteres."),
    GREATER_THAN("O campo %s deve ser maior que %d."),
    GREATER_THAN_EQUAL("O campo %s deve ser maior ou igual a %d."),
    LESS_THAN("O campo %s deve ser menor que %d."),
    LESS_THAN_EQUAL("O campo %s deve ser menor ou igual a %d.");

    private final String template;

    ValidationType(String template) {
        this.template = template;
    }

    public String format(String fieldName, int min, int max) {
        return switch (this) {
            case SIZE -> String.format(template, fieldName, min, max);
            case GREATER_THAN, GREATER_THAN_EQUAL -> String.format(template, fieldName, min);
            case LESS_THAN, LESS_THAN_EQUAL -> String.format(template, fieldName, max);
            default -> String.format(template, fieldName);
        };
    }
}
