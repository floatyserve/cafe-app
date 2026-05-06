package com.example.cafe_system.table.api.dto;

public record CafeTableDto(
        Long id,
        int number,
        int capacity,
        boolean outOfOrder
) {
}
