package com.example.cafe_system.order.api.dto;

import com.example.cafe_system.order.domain.OrderItemStatus;

public record OrderItemDto(
        Long id,
        Long orderId,
        Long menuItemId,
        String menuItemName,
        int priceAtTimeOfOrderInCents,
        int quantity,
        String note,
        OrderItemStatus status
) {
}
