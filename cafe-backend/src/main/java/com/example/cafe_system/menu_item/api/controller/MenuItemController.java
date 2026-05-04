package com.example.cafe_system.menu_item.api.controller;

import com.example.cafe_system.menu_item.api.dto.MenuItemDto;
import com.example.cafe_system.menu_item.domain.MenuItemCategory;
import com.example.cafe_system.menu_item.mapper.MenuItemMapper;
import com.example.cafe_system.menu_item.service.MenuItemService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/menu")
@RequiredArgsConstructor
public class MenuItemController {

    private final MenuItemService menuItemService;
    private final MenuItemMapper menuItemMapper;

    @GetMapping
    public List<MenuItemDto> getMenu(
            @RequestParam(required = false) MenuItemCategory category
    ) {
        var res = category == null
                ? menuItemService.getAllActiveMenuItems()
                : menuItemService.getAllActiveMenuItemsByCategory(category);

        return res
                .stream()
                .map(menuItemMapper::toDto)
                .toList();
    }
}
