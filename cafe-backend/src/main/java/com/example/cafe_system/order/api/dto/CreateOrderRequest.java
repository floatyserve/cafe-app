package com.example.cafe_system.order.api.dto;

import jakarta.validation.constraints.Min;

public record CreateOrderRequest(
        @Min(1)
        int cafeTableNumber
) {
}
