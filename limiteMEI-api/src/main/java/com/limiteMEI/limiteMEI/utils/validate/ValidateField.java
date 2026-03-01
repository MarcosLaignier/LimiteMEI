package com.limiteMEI.limiteMEI.utils.validate;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;


@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.FIELD)
public @interface ValidateField {

    ValidationType[] value();

    String fieldName();

    int min() default 0;

    int max() default Integer.MAX_VALUE;
}

