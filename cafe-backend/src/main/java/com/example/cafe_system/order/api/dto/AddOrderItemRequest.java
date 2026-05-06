package com.example.cafe_system.order.api.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record AddOrderItemRequest(
        @NotNull Long menuItemId,
        @Min(1) int quantity,
        String note
) {
}
