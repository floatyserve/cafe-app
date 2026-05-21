package com.example.cafe_system.order.api.dto;

import com.example.cafe_system.order.domain.OrderItemStatus;
import jakarta.validation.constraints.NotNull;

public record UpdateOrderItemStatusRequest(
        @NotNull OrderItemStatus status
) {
}
