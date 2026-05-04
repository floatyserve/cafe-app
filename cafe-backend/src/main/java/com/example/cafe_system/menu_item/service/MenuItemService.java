package com.example.cafe_system.menu_item.service;

import com.example.cafe_system.menu_item.domain.MenuItem;
import com.example.cafe_system.menu_item.domain.MenuItemCategory;

import java.util.List;

public interface MenuItemService {
    MenuItem getActiveMenuItemById(Long id);
    List<MenuItem> getAllActiveMenuItems();
    List<MenuItem> getAllActiveMenuItemsByCategory(MenuItemCategory category);
}
