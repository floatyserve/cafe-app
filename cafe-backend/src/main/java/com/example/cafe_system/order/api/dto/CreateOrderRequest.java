package com.example.cafe_system.order.api.dto;

import jakarta.validation.constraints.NotNull;

public record CreateOrderRequest(
        @NotNull Long cafeTableId
) {
}
