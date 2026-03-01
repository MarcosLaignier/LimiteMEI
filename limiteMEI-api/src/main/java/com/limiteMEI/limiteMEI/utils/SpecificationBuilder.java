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

    public SpecificationBuilder<T> equal(String field, Object value) {
        if (value != null) {
            specs.add((root, query, cb) -> cb.equal(root.get(field), value));
        }
        return this;
    }

    public SpecificationBuilder<T> likeIgnoreCase(String field, String value) {
        if (value != null && !value.isEmpty()) {
            specs.add((root, query, cb) ->
                    cb.like(cb.lower(root.get(field)), "%" + value.toLowerCase() + "%")
            );
        }
        return this;
    }

    public SpecificationBuilder<T> in(String field, List<?> values) {
        if (values != null && !values.isEmpty()) {
            specs.add((root, query, cb) -> root.get(field).in(values));
        }
        return this;
    }

// TODO: Data nao ta pegando no mesmo dia, verificar
    public <Y extends Comparable<? super Y>> SpecificationBuilder<T> between(String field, Y start, Y end) {
        if (start != null && end != null) {
            specs.add((root, query, cb) -> {
                Path<Y> path = root.get(field);
                return cb.between(path.as((Class<Y>) start.getClass()), start, end);
            });
        } else if (start != null) {
            specs.add((root, query, cb) -> {
                Path<Y> path = root.get(field);
                return cb.greaterThanOrEqualTo(path.as((Class<Y>) start.getClass()), start);
            });
        } else if (end != null) {
            specs.add((root, query, cb) -> {
                Path<Y> path = root.get(field);
                return cb.lessThanOrEqualTo(path.as((Class<Y>) end.getClass()), end);
            });
        }
        return this;
    }


    @Override
    public Predicate toPredicate(Root<T> root, CriteriaQuery<?> query, CriteriaBuilder cb) {
        List<Predicate> predicates = new ArrayList<>();
        for (Specification<T> spec : specs) {
            Predicate p = spec.toPredicate(root, query, cb);
            if (p != null) predicates.add(p);
        }
        return predicates.isEmpty() ? cb.conjunction() : cb.and(predicates.toArray(new Predicate[0]));
    }
}

