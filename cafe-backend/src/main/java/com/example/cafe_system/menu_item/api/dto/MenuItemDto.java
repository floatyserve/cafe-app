package com.example.cafe_system.menu_item.api.dto;

import com.example.cafe_system.menu_item.domain.MenuItemCategory;

public record MenuItemDto(
        Long id,
        String name,
        double priceInEuros,
        MenuItemCategory category,
        boolean active
) {
}