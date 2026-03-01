package com.limiteMEI.limiteMEI.utils.validate;

import jakarta.persistence.EntityManager;
import jakarta.persistence.Id;
import jakarta.persistence.PersistenceContext;
import org.springframework.stereotype.Component;

import java.lang.reflect.Field;

@Component
public class GenericUniqueValidator implements UniqueValidator {

    @PersistenceContext
    private EntityManager em;

    @Override
    public boolean exists(Object entity, Field field, Object value) {

        if (entity == null || field == null || value == null) {
            return false;
        }

        Class<?> entityClass = entity.getClass();
        String entityName = entityClass.getSimpleName();
        String uniqueFieldName = field.getName();

        Object entityId = getEntityId(entity);
        String idFieldName = getIdFieldName(entityClass);

        String jpql = """
            select count(e)
            from %s e
            where e.%s = :value
              and (:id is null or e.%s <> :id)
        """.formatted(entityName, uniqueFieldName, idFieldName);

        Long count = em.createQuery(jpql, Long.class)
                .setParameter("value", value)
                .setParameter("id", entityId)
                .getSingleResult();

        return count > 0;
    }

    /**
     * Recupera o valor do @Id da entidade (com suporte para heranças tipo nosso pessoa/empresa).
     */
    private Object getEntityId(Object entity) {
        Class<?> clazz = entity.getClass();

        while (clazz != null) {
            for (Field field : clazz.getDeclaredFields()) {
                if (field.isAnnotationPresent(Id.class)) {
                    field.setAccessible(true);
                    try {
                        return field.get(entity);
                    } catch (IllegalAccessException e) {
                        throw new RuntimeException("Erro ao acessar o ID da entidade", e);
                    }
                }
            }
            clazz = clazz.getSuperclass();
        }
        return null;
    }

    /**
     * Recupera o nome do campo anotado com @Id.
     */
    private String getIdFieldName(Class<?> clazz) {
        Class<?> current = clazz;

        while (current != null) {
            for (Field field : current.getDeclaredFields()) {
                if (field.isAnnotationPresent(Id.class)) {
                    return field.getName();
                }
            }
            current = current.getSuperclass();
        }

        throw new IllegalStateException(
                "Entidade " + clazz.getSimpleName() + " não possui campo @Id");
    }
}
