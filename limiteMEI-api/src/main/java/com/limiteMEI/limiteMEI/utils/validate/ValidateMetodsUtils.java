package com.limiteMEI.limiteMEI.utils.validate;


import com.limiteMEI.limiteMEI.utils.CollectionMetodsUtils;

import java.lang.reflect.Field;
import java.util.ArrayList;
import java.util.List;

public class ValidateMetodsUtils {

    private ValidateMetodsUtils() {
    }

    /**
     * Valida os campos anotados com @ValidateField
     */
    public static <T> void validate(T entity, UniqueValidator uniqueValidator) {

        Field[] fields = entity.getClass().getDeclaredFields();
        List<String> errors = new ArrayList<>();

        for (Field field : fields) {

            if (!field.isAnnotationPresent(ValidateField.class)) {
                continue;
            }

            ValidateField annotation = field.getAnnotation(ValidateField.class);
            field.setAccessible(true);

            Object value;
            try {
                value = field.get(entity);
            } catch (IllegalAccessException e) {
                throw new RuntimeException("Erro ao acessar campo: " + field.getName(), e);
            }

            for (ValidationType type : annotation.value()) {
                switch (type) {

                    case NOT_NULL -> validateNotNull(field, value, annotation, errors);
                    case SIZE -> validateSize(field, value, annotation, errors);
                    case UNIQUE -> validateUnique(entity, field, value, annotation, uniqueValidator, errors);
                    case GREATER_THAN -> validateGreaterThan(field, value, annotation, errors);
                    case GREATER_THAN_EQUAL -> validateGreaterThanEqual(field, value, annotation, errors);
                    case LESS_THAN -> validateLessThan(field, value, annotation, errors);
                    case LESS_THAN_EQUAL -> validateLessThanEqual(field, value, annotation, errors);
                }
            }
        }

        if (!CollectionMetodsUtils.isEmpty(errors)) {
            throw new ApplicationException(errors);
        }
    }

    /* ===================== VALIDACOES ===================== */

    private static void validateNotNull(Field field, Object value, ValidateField valField, List<String> errors) {

        if (value == null) {
            errors.add(ValidationType.NOT_NULL.format(valField.fieldName(), 0, 0));
            return;
        }

        if (value instanceof String str && CollectionMetodsUtils.isStringEmpty(str)) {
            errors.add(ValidationType.NOT_NULL.format(valField.fieldName(), 0, 0));
        }
    }

    private static void validateSize(Field field, Object value, ValidateField valField, List<String> errors) {

        if (!(value instanceof String str)) {
            return;
        }

        int length = str.length();
        if (length < valField.min() || length > valField.max()) {
            errors.add(ValidationType.SIZE.format(valField.fieldName(), valField.min(), valField.max()));
        }
    }


    private static void validateUnique(Object entity, Field field, Object value, ValidateField valField, UniqueValidator uniqueValidator, List<String> errors) {

        if (value == null || uniqueValidator == null) {
            return;
        }

        boolean exists = uniqueValidator.exists(entity, field, value);
        if (exists) {
            errors.add(ValidationType.UNIQUE.format(valField.fieldName(), 0, 0)
            );
        }
    }

    private static void validateGreaterThan(Field field, Object value, ValidateField valField, List<String> errors) {
        if (value instanceof Integer integer) {
            if (integer < valField.min()) {
                errors.add(ValidationType.GREATER_THAN.format(valField.fieldName(), valField.min(), valField.max()));
            }
        }
    }

    private static void validateGreaterThanEqual(Field field, Object value, ValidateField valField, List<String> errors) {
        if (value instanceof Integer integer) {
            if (integer <= valField.min()) {
                errors.add(ValidationType.GREATER_THAN_EQUAL.format(valField.fieldName(), valField.min(), valField.max()));
            }
        }
    }

    private static void validateLessThan(Field field, Object value, ValidateField valField, List<String> errors) {
        if (value instanceof Integer integer) {
            if (integer > valField.max()) {
                errors.add(ValidationType.LESS_THAN.format(valField.fieldName(), valField.max(), valField.min()));
            }
        }
    }

    private static void validateLessThanEqual(Field field, Object value, ValidateField valField, List<String> errors) {
        if (value instanceof Integer integer) {
            if (integer >= valField.max()) {
                errors.add(ValidationType.LESS_THAN_EQUAL.format(valField.fieldName(), valField.max(), valField.min()));
            }
        }
    }
}
