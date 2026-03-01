package com.limiteMEI.limiteMEI.utils.enumUtils;

public class EnumUtils {

    public static <E extends Enum<E> & EnumType> E fromValue(Class<E> enumClass, String value) {
        for (E e : enumClass.getEnumConstants()) {
            if (e.getNome().equalsIgnoreCase(value)) {
                return e;
            }
        }
        return null;
    }
}