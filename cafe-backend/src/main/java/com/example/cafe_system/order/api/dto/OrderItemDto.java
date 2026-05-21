package com.example.cafe_system.order.api.dto;

import com.example.cafe_system.menu_item.domain.MenuItemCategory;
import com.example.cafe_system.order.domain.OrderItemStatus;

public record OrderItemDto(
        Long id,
        Long orderId,
        Long menuItemId,
        String menuItemName,
        MenuItemCategory menuItemCategory,
        int priceAtTimeOfOrderInCents,
        int quantity,
        String note,
        OrderItemStatus status
) {
}
