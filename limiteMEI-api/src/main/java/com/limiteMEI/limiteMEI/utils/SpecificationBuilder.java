package com.limiteMEI.limiteMEI.utils;

import jakarta.persistence.criteria.*;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

public class SpecificationBuilder<T> implements Specification<T> {

    private final List<Specification<T>> specs = new ArrayList<>();

    public static <T> SpecificationBuilder<T> of(Class<T> clazz) {
        return new SpecificationBuilder<>();
    }

    private void addSpec(Specification<T> spec) {
        specs.add(spec);
    }

    private Path<?> resolvePath(Root<T> root, String field) {
        String[] parts = field.split("\\.");
        Path<?> path = root.get(parts[0]);

        for (int i = 1; i < parts.length; i++) {
            path = path.get(parts[i]);
        }

        return path;
    }

    public SpecificationBuilder<T> equal(String field, Object value) {
        if (value != null) {
            addSpec((root, query, cb) ->
                    cb.equal(resolvePath(root, field), value));
        }
        return this;
    }

    public SpecificationBuilder<T> likeIgnoreCase(String field, String value) {
        if (value != null && !value.isEmpty()) {
            addSpec((root, query, cb) ->
                    cb.like(
                            cb.lower(resolvePath(root, field).as(String.class)),
                            "%" + value.toLowerCase() + "%"
                    ));
        }
        return this;
    }

    public SpecificationBuilder<T> in(String field, List<?> values) {
        if (values != null && !values.isEmpty()) {
            addSpec((root, query, cb) ->
                    resolvePath(root, field).in(values));
        }
        return this;
    }

    @Override
    public Predicate toPredicate(Root<T> root, CriteriaQuery<?> query, CriteriaBuilder cb) {

        List<Predicate> predicates = specs.stream()
                .map(spec -> spec.toPredicate(root, query, cb))
                .filter(p -> p != null)
                .toList();

        return predicates.isEmpty()
                ? cb.conjunction()
                : cb.and(predicates.toArray(new Predicate[0]));
    }
}