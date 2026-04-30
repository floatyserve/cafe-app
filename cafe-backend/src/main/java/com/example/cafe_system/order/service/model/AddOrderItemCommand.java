package com.example.cafe_system.order.service.model;

public record AddOrderItemCommand(
        Long menuItemId,
        int quantity,
        String note
) {
}
