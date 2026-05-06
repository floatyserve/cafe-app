package com.example.cafe_system.order.api.dto;

import com.example.cafe_system.order.domain.OrderState;

import java.time.Instant;

public record OrderDto(
        Long id,
        int cafeTableNumber,
        OrderState state,
        Instant orderedAt,
        Instant paidAt
) {
}
