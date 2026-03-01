package com.limiteMEI.limiteMEI.utils.validate;

import java.lang.reflect.Field;

@FunctionalInterface
public interface UniqueValidator {

    boolean exists(Object entity, Field field, Object value);
}